import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/twilio";
import { triggerScoutCall } from "@/lib/vapi";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type, formData } = body as {
      phone: string;
      type: "company" | "talent";
      formData: Record<string, string>;
    };

    if (!phone || !type || !formData) {
      return NextResponse.json(
        { error: "Missing required fields: phone, type, formData" },
        { status: 400 }
      );
    }

    // Normalize to E.164 format
    let cleanPhone = phone.replace(/[^\d+]/g, "");
    if (!cleanPhone.startsWith("+")) {
      // Strip leading 1 if 11 digits, then add +1
      if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
        cleanPhone = "+" + cleanPhone;
      } else if (cleanPhone.length === 10) {
        cleanPhone = "+1" + cleanPhone;
      }
    }
    if (cleanPhone.length < 12) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Upsert profile into appropriate table before triggering call
    if (type === "company") {
      const { error: upsertError } = await supabaseAdmin
        .from("company_profiles")
        .upsert(
          {
            company_name: formData.company_name || "Unknown",
            contact_name: formData.contact_name || null,
            email: formData.email || null,
            phone: cleanPhone,
            role_needed: formData.role_needed || null,
            hours_per_week: formData.hours_per_week
              ? parseInt(formData.hours_per_week)
              : null,
            budget_range: formData.budget_range || null,
            industry: formData.industry || null,
            description: formData.description || null,
          },
          { onConflict: "phone" }
        );

      if (upsertError) {
        console.error("Failed to upsert company_profile:", upsertError);
        // Continue — we don't want to block the call over a DB issue
      }
    } else {
      const { error: upsertError } = await supabaseAdmin
        .from("talent_profiles")
        .upsert(
          {
            full_name: formData.full_name || "Unknown",
            email: formData.email || null,
            phone: cleanPhone,
            primary_role: formData.primary_role || null,
            industries_served: formData.industries_served || null,
            availability_hours: formData.availability_hours
              ? parseInt(formData.availability_hours)
              : null,
            rate_expectations: formData.rate_expectations || null,
          },
          { onConflict: "phone" }
        );

      if (upsertError) {
        console.error("Failed to upsert talent_profile:", upsertError);
      }
    }

    const name =
      type === "company" ? formData.contact_name : formData.full_name;
    const context =
      type === "company"
        ? "what you're looking for in a fractional exec"
        : "your experience and what kind of work excites you";

    // Send pre-call SMS
    try {
      await sendSMS(
        cleanPhone,
        `Hi ${name}, this is Scout from Sprout. I'll be calling you shortly to learn more about ${context}. Get somewhere quiet if you can!`
      );
    } catch (smsError) {
      console.error("Failed to send pre-call SMS:", smsError);
      // Continue even if SMS fails — the call is more important
    }

    // Trigger Vapi call
    const callResult = await triggerScoutCall({ phone: cleanPhone, type, formData });
    console.log(`Scout call triggered for ${type}: ${cleanPhone} — call id: ${callResult.id}`);

    // Record the call in scout_calls
    const { error: callInsertError } = await supabaseAdmin
      .from("scout_calls")
      .insert({
        vapi_call_id: callResult.id,
        phone: cleanPhone,
        type,
        status: "queued",
      });

    if (callInsertError) {
      console.error("Failed to insert scout_call record:", callInsertError);
    }

    return NextResponse.json({ success: true, message: "Scout call triggered", callId: callResult.id });
  } catch (error) {
    console.error("Scout trigger error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
