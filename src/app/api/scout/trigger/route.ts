import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/twilio";
import { triggerScoutCall } from "@/lib/vapi";

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

    // Normalize phone number (basic validation)
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
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
        `Hi ${name}, this is Scout from Sprout. I'll be calling you in ~5 minutes to learn more about ${context}. Get somewhere quiet if you can!`
      );
    } catch (smsError) {
      console.error("Failed to send pre-call SMS:", smsError);
      // Continue even if SMS fails — the call is more important
    }

    // Schedule Vapi call (5 minute delay via setTimeout — in production use a job queue)
    setTimeout(async () => {
      try {
        await triggerScoutCall({ phone: cleanPhone, type, formData });
        console.log(`Scout call triggered for ${type}: ${cleanPhone}`);
      } catch (callError) {
        console.error("Failed to trigger Scout call:", callError);
      }
    }, 5 * 60 * 1000);

    return NextResponse.json({ success: true, message: "Scout call scheduled" });
  } catch (error) {
    console.error("Scout trigger error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
