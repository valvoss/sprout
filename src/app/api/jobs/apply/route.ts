import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { job_id, full_name, email, phone } = await request.json();

    if (!job_id || !phone) {
      return NextResponse.json(
        { error: "job_id and phone are required" },
        { status: 400 }
      );
    }

    // Upsert applicant by phone
    const { error: upsertError } = await serviceSupabase
      .from("applicants")
      .upsert(
        { phone, email, full_name },
        { onConflict: "phone" }
      );

    if (upsertError) {
      console.error("Applicant upsert error:", upsertError);
      return NextResponse.json({ error: "Failed to save applicant" }, { status: 500 });
    }

    // Get applicant back
    const { data: applicant, error: fetchError } = await serviceSupabase
      .from("applicants")
      .select("*")
      .eq("phone", phone)
      .single();

    if (fetchError || !applicant) {
      return NextResponse.json({ error: "Failed to fetch applicant" }, { status: 500 });
    }

    // Upsert job_application (on conflict do nothing)
    const { error: appError } = await serviceSupabase
      .from("job_applications")
      .upsert(
        { job_id, applicant_id: applicant.id, status: "applied" },
        { onConflict: "job_id,applicant_id", ignoreDuplicates: true }
      );

    if (appError) {
      console.error("Application upsert error:", appError);
      return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
    }

    if (applicant.phone_screen_completed) {
      // Update status to interested
      await serviceSupabase
        .from("job_applications")
        .update({ status: "interested" })
        .eq("job_id", job_id)
        .eq("applicant_id", applicant.id);

      return NextResponse.json({ action: "interested" });
    }

    // Update status and trigger phone screen
    await serviceSupabase
      .from("job_applications")
      .update({ status: "phone_screen_scheduled" })
      .eq("job_id", job_id)
      .eq("applicant_id", applicant.id);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      await fetch(`${baseUrl}/api/scout/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          type: "talent",
          formData: { full_name, email, phone },
        }),
      });
    } catch (e) {
      console.error("Scout trigger error:", e);
    }

    return NextResponse.json({ action: "phone_screen_scheduled" });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
