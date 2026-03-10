import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await serviceSupabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    slug: data.slug,
    title: data.title,
    company: data.company,
    roleType: data.role_type,
    location: data.location || "",
    weekly_hours: data.weekly_hours || "",
    comp_range: data.comp_range || "",
    company_stage: data.company_stage || "",
    industry: data.industry || "",
    description: data.description || "",
    is_active: data.is_active,
    source_url: data.source_url || "",
  });
}
