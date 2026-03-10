import { NextResponse } from "next/server";
import { scrapeAllJobs, Job } from "@/lib/scraper";

let cachedJobs: Job[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedJobs && now - cachedAt < CACHE_TTL) {
      return NextResponse.json(cachedJobs);
    }

    const jobs = await scrapeAllJobs();
    cachedJobs = jobs;
    cachedAt = now;

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json([]);
  }
}
