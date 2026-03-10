import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";
import { getJobsFromDB } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  noStore();
  try {
    const jobs = await getJobsFromDB();
    return NextResponse.json(jobs, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json([]);
  }
}
