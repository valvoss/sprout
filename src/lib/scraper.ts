import * as cheerio from "cheerio";

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
  if (t.includes("CFO") || t.includes("CHIEF FINANCIAL") || t.includes("FINANCE"))
    return "CFO";
  if (t.includes("CMO") || t.includes("CHIEF MARKETING") || t.includes("MARKETING"))
    return "CMO";
  if (t.includes("COO") || t.includes("CHIEF OPERATING") || t.includes("OPERATIONS"))
    return "COO";
  if (t.includes("CTO") || t.includes("CHIEF TECHNOLOGY") || t.includes("TECHNOLOGY") || t.includes("ENGINEERING"))
    return "CTO";
  return "Other";
}

async function scrapeGoFractional(): Promise<Job[]> {
  try {
    const res = await fetch("https://www.gofractional.com/roles", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    // GoFractional lists roles in card-like elements
    $("a[href*='/roles/']").each((_, el) => {
      const $el = $(el);
      const href = $el.attr("href") || "";
      if (!href || href === "/roles/") return;

      const text = $el.text().trim();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const title = lines[0];
      const company = lines[1] || "Confidential";
      const location = lines.find((l) => /remote|hybrid|on-site|city|state/i.test(l)) || "Remote";

      const url = href.startsWith("http") ? href : `https://www.gofractional.com${href}`;

      // Avoid duplicates
      if (jobs.some((j) => j.url === url)) return;

      jobs.push({
        title,
        company,
        roleType: classifyRole(title),
        location,
        posted_at: new Date().toISOString(),
        source: "GoFractional",
        url,
      });
    });

    return jobs;
  } catch (e) {
    console.error("GoFractional scrape error:", e);
    return [];
  }
}

async function scrapeFractionalJobs(): Promise<Job[]> {
  try {
    const res = await fetch("https://www.fractionaljobs.io", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    // FractionalJobs.io lists jobs in cards/list items with links
    $("a[href*='job'], a[href*='position'], a[href*='role'], .job-card, .job-listing, [class*='job']").each((_, el) => {
      const $el = $(el);
      const href = $el.attr("href") || "";
      const text = $el.text().trim();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const title = lines[0];
      const company = lines[1] || "Confidential";
      const location = lines.find((l) => /remote|hybrid|on-site/i.test(l)) || "Remote";
      const url = href.startsWith("http") ? href : `https://www.fractionaljobs.io${href}`;

      if (jobs.some((j) => j.url === url)) return;

      jobs.push({
        title,
        company,
        roleType: classifyRole(title),
        location,
        posted_at: new Date().toISOString(),
        source: "FractionalJobs.io",
        url,
      });
    });

    return jobs;
  } catch (e) {
    console.error("FractionalJobs.io scrape error:", e);
    return [];
  }
}

async function scrapePeoplePath(): Promise<Job[]> {
  try {
    const res = await fetch("https://www.thepeoplepath.com/fractional-jobs", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SproutBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: Job[] = [];

    $("a[href*='job'], .job-listing, .job-card, [class*='job'], [class*='listing']").each((_, el) => {
      const $el = $(el);
      const href = $el.attr("href") || "";
      const text = $el.text().trim();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const title = lines[0];
      const company = lines[1] || "Confidential";
      const location = lines.find((l) => /remote|hybrid|on-site/i.test(l)) || "Remote";
      const url = href.startsWith("http") ? href : `https://www.thepeoplepath.com${href}`;

      if (jobs.some((j) => j.url === url)) return;

      jobs.push({
        title,
        company,
        roleType: classifyRole(title),
        location,
        posted_at: new Date().toISOString(),
        source: "The People Path",
        url,
      });
    });

    return jobs;
  } catch (e) {
    console.error("PeoplePath scrape error:", e);
    return [];
  }
}

export async function scrapeAllJobs(): Promise<Job[]> {
  const results = await Promise.allSettled([
    scrapeGoFractional(),
    scrapeFractionalJobs(),
    scrapePeoplePath(),
  ]);

  const jobs: Job[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
    }
  }

  // Sort by posted_at desc
  jobs.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());

  return jobs;
}
