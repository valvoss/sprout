export interface Job {
  title: string;
  company: string;
  roleType: "CFO" | "CMO" | "COO" | "CTO" | "Other";
  location: string;
  posted_at: string;
  source: string;
  url: string;
}

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

function parseJobSlug(url: string): { title: string; company: string } | null {
  // URL format: https://www.fractionaljobs.io/jobs/job-title-at-company-name
  const match = url.match(/\/jobs\/(.+)$/);
  if (!match) return null;
  const slug = match[1];
  const atIdx = slug.lastIndexOf("-at-");
  if (atIdx === -1) return null;
  const titleSlug = slug.slice(0, atIdx);
  const companySlug = slug.slice(atIdx + 4);
  return {
    title: slugToTitleCase(titleSlug),
    company: slugToTitleCase(companySlug),
  };
}

// Keywords that indicate a true exec-level fractional role
const EXEC_KEYWORDS = [
  "fractional-cfo", "fractional-cmo", "fractional-coo", "fractional-cto",
  "chief-financial-officer", "chief-finance-officer", "chief-marketing-officer",
  "chief-operating-officer", "chief-technology-officer", "chief-technical-officer",
  "-cfo-", "-cmo-", "-coo-", "-cto-",
  "cfo-", "cmo-", "coo-", "cto-",
  "-cfo", "-cmo", "-coo", "-cto",
  "vp-finance", "vp-of-finance", "vp-marketing", "vp-of-marketing",
  "vp-operations", "vp-of-operations", "vp-engineering", "vp-of-engineering",
];

async function scrapeFractionalJobsSitemap(): Promise<Job[]> {
  try {
    const res = await fetch("https://www.fractionaljobs.io/sitemap.xml", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Extract all job URLs
    const locRegex = /<loc>(https:\/\/www\.fractionaljobs\.io\/jobs\/[^<]+)<\/loc>/g;
    const jobs: Job[] = [];
    let regexMatch: RegExpExecArray | null;

    while ((regexMatch = locRegex.exec(xml)) !== null) {
      const url = regexMatch[1];
      const slug = url.toLowerCase();

      // Only include exec-level roles
      if (!EXEC_KEYWORDS.some((kw) => slug.includes(kw))) continue;

      const parsed = parseJobSlug(url);
      if (!parsed) continue;

      const roleType = classifyRole(parsed.title);
      if (roleType === "Other") continue; // Skip anything we can't classify

      jobs.push({
        title: parsed.title,
        company: parsed.company,
        roleType,
        location: "Remote",
        posted_at: new Date().toISOString(),
        source: "FractionalJobs.io",
        url,
      });
    }

    return jobs;
  } catch (e) {
    console.error("FractionalJobs.io sitemap error:", e);
    return [];
  }
}

export async function scrapeAllJobs(): Promise<Job[]> {
  const jobs = await scrapeFractionalJobsSitemap();

  // Sort by roleType grouping: CFO first (most relevant for Beck's audience), then CMO, COO, CTO
  const order: Record<Job["roleType"], number> = { CFO: 0, CMO: 1, COO: 2, CTO: 3, Other: 4 };
  jobs.sort((a, b) => order[a.roleType] - order[b.roleType]);

  return jobs;
}
