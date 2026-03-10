import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

export interface Job {
  id?: string;
  slug: string;
  title: string;
  company: string;
  roleType: "CFO" | "CMO" | "COO" | "CTO" | "Other";
  location: string;
  weekly_hours: string;
  comp_range: string;
  company_stage: string;
  industry: string;
  description: string;
  is_active: boolean;
  source_url: string;
}

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function classifyRole(text: string): Job["roleType"] {
  const t = text.toUpperCase();
  if (t.includes("CFO") || t.includes("CHIEF FINANCIAL") || t.includes("CHIEF FINANCE") || t.includes("VP FINANCE") || t.includes("VP OF FINANCE"))
    return "CFO";
  if (t.includes("CMO") || t.includes("CHIEF MARKETING") || t.includes("VP MARKETING") || t.includes("VP OF MARKETING"))
    return "CMO";
  if (t.includes("COO") || t.includes("CHIEF OPERATING") || t.includes("VP OPERATIONS") || t.includes("VP OF OPERATIONS"))
    return "COO";
  if (t.includes("CTO") || t.includes("CHIEF TECHNOLOGY") || t.includes("CHIEF TECHNICAL") || t.includes("VP ENGINEERING") || t.includes("VP OF ENGINEERING"))
    return "CTO";
  return "Other";
}

// Words that should stay uppercase
const UPPERCASE_WORDS = new Set([
  "cfo", "cmo", "coo", "cto", "ceo", "cpo", "chro", "ciso",
  "vp", "svp", "evp", "gm",
  "ai", "ml", "it", "hr",
  "b2b", "b2c", "saas", "erp", "crm",
  "us", "uk", "eu",
]);

// Words that should stay lowercase (articles, prepositions)
const LOWERCASE_WORDS = new Set(["a", "an", "the", "and", "or", "of", "in", "at", "for", "to", "with"]);

function slugToTitleCase(slug: string): string {
  const words = slug.split("-");
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (UPPERCASE_WORDS.has(lower)) return w.toUpperCase();
      if (i > 0 && LOWERCASE_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

const EXEC_KEYWORDS = [
  "cfo", "cmo", "coo", "cto",
  "chief-financial", "chief-marketing", "chief-operating", "chief-technology",
  "fractional-cfo", "fractional-cmo", "fractional-coo", "fractional-cto",
  "vp-finance", "vp-marketing", "vp-operations", "vp-engineering",
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractLabeledField($: cheerio.CheerioAPI, label: string): string {
  let value = "";
  $("*").each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0 && $el.text().trim() === label) {
      // Try next sibling
      const next = $el.next();
      if (next.length) {
        value = next.text().trim();
      }
      // Try parent's next sibling
      if (!value) {
        const parentNext = $el.parent().next();
        if (parentNext.length) {
          value = parentNext.text().trim();
        }
      }
      // Try parent's text excluding the label
      if (!value) {
        const parentText = $el.parent().text().trim();
        if (parentText.startsWith(label)) {
          value = parentText.slice(label.length).trim();
        }
      }
      if (value) return false; // break
    }
  });
  return value;
}

function extractDescription($: cheerio.CheerioAPI): string {
  const sections: string[] = [];
  const headings = ["About Us", "About the Work", "About You"];

  headings.forEach((heading) => {
    $("h1, h2, h3, h4, h5, h6, p, div, span").each((_, el) => {
      const $el = $(el);
      if ($el.text().trim() === heading) {
        const sectionParts: string[] = [heading + "\n"];
        let sibling = $el.next();
        while (sibling.length) {
          const text = sibling.text().trim();
          // Stop at the next heading
          if (headings.includes(text)) break;
          if (text) sectionParts.push(text);
          sibling = sibling.next();
        }
        if (sectionParts.length > 1) {
          sections.push(sectionParts.join("\n"));
        }
        return false;
      }
    });
  });

  return sections.join("\n\n");
}

export async function scrapeAndStoreJobs(): Promise<number> {
  // 1. Fetch sitemap
  const sitemapRes = await fetch("https://www.fractionaljobs.io/sitemap.xml", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!sitemapRes.ok) throw new Error(`Sitemap fetch failed: ${sitemapRes.status}`);
  const xml = await sitemapRes.text();

  // 2. Extract all /jobs/ URLs
  const locRegex = /<loc>(https:\/\/www\.fractionaljobs\.io\/jobs\/[^<]+)<\/loc>/g;
  const urls: string[] = [];
  let regexMatch: RegExpExecArray | null;
  while ((regexMatch = locRegex.exec(xml)) !== null) {
    urls.push(regexMatch[1]);
  }

  // 3. Filter to exec-level only
  const execUrls = urls.filter((url) => {
    const slug = url.toLowerCase();
    return EXEC_KEYWORDS.some((kw) => slug.includes(kw));
  });

  // Limit to 120
  const toScrape = execUrls.slice(0, 120);
  const jobs: Job[] = [];

  // 4. Scrape each page
  for (let i = 0; i < toScrape.length; i++) {
    const url = toScrape[i];
    if (i > 0) await delay(400);

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      // Check if closed
      const pageText = $("body").text();
      if (pageText.includes("This Role is Closed")) continue;

      // Extract slug from URL
      const slugMatch = url.match(/\/jobs\/(.+)$/);
      if (!slugMatch) continue;
      const slug = slugMatch[1];

      // Parse title from h1
      let title = $("h1").first().text().trim();
      title = title.replace(/^New Job\s*\|\s*/i, "").trim();
      if (!title) {
        // Fallback: parse from slug
        const atIdx = slug.lastIndexOf("-at-");
        title = atIdx !== -1 ? slugToTitleCase(slug.slice(0, atIdx)) : slugToTitleCase(slug);
      }

      // Parse company - look for "is hiring" pattern
      let company = "";
      $("*").each((_, el) => {
        const text = $(el).text().trim();
        const hiringMatch = text.match(/^(.+?)\s+is hiring/i);
        if (hiringMatch && hiringMatch[1].length < 100) {
          company = hiringMatch[1].trim();
          return false;
        }
      });
      if (!company) {
        // Fallback: parse from slug
        const atIdx = slug.lastIndexOf("-at-");
        company = atIdx !== -1 ? slugToTitleCase(slug.slice(atIdx + 4)) : "";
      }

      // Extract labeled fields
      const weekly_hours = extractLabeledField($, "Weekly Commitment");
      const comp_range = extractLabeledField($, "Compensation Range");
      const company_stage = extractLabeledField($, "Company Stage");
      const industry = extractLabeledField($, "Industry");
      const location = extractLabeledField($, "Location") || "Remote";

      // Extract description
      const description = extractDescription($);

      // Classify roleType
      const roleType = classifyRole(title);

      jobs.push({
        slug,
        title,
        company,
        roleType,
        location,
        weekly_hours,
        comp_range,
        company_stage,
        industry,
        description,
        is_active: true,
        source_url: url,
      });
    } catch (e) {
      console.error(`Error scraping ${url}:`, e);
    }
  }

  // 5. Upsert into Supabase
  if (jobs.length > 0) {
    const rows = jobs.map((j) => ({
      slug: j.slug,
      title: j.title,
      company: j.company,
      role_type: j.roleType,
      location: j.location,
      weekly_hours: j.weekly_hours,
      comp_range: j.comp_range,
      company_stage: j.company_stage,
      industry: j.industry,
      description: j.description,
      is_active: true,
      source_url: j.source_url,
      last_checked_at: new Date().toISOString(),
    }));

    const { error } = await serviceSupabase
      .from("jobs")
      .upsert(rows, { onConflict: "slug" });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }
  }

  return jobs.length;
}

export async function getJobsFromDB(): Promise<Job[]> {
  const { data, error } = await serviceSupabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    roleType: row.role_type as Job["roleType"],
    location: row.location || "",
    weekly_hours: row.weekly_hours || "",
    comp_range: row.comp_range || "",
    company_stage: row.company_stage || "",
    industry: row.industry || "",
    description: row.description || "",
    is_active: row.is_active,
    source_url: row.source_url || "",
  }));
}
