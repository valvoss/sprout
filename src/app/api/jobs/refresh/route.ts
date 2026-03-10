import { NextRequest, NextResponse } from "next/server";
import { scrapeAndStoreJobs } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  const secret = process.env.REFRESH_SECRET;
  if (secret) {
    const provided = request.headers.get("x-refresh-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const count = await scrapeAndStoreJobs();
    return NextResponse.json({ count, message: `Stored ${count} active jobs` });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh jobs" },
      { status: 500 }
    );
  }
}
