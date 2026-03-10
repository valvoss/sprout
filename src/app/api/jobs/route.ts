import { NextResponse } from "next/server";
import { getJobsFromDB } from "@/lib/scraper";

export async function GET() {
  try {
    const jobs = await getJobsFromDB();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json([]);
  }
}
