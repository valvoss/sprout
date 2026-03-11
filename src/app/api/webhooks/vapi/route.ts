import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase-admin";

const anthropic = new Anthropic();

interface VapiWebhookPayload {
  message: {
    type: string;
    call?: {
      id: string;
      customer?: { number?: string; name?: string };
      assistantId?: string;
    };
    transcript?: string;
    recordingUrl?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as VapiWebhookPayload;
    const { message } = payload;

    // Only process end-of-call reports
    if (message.type !== "end-of-call-report") {
      return NextResponse.json({ received: true });
    }

    const transcript = message.transcript;
    const phone = message.call?.customer?.number;
    const assistantId = message.call?.assistantId;

    if (!transcript || !phone) {
      console.error("Vapi webhook missing transcript or phone");
      return NextResponse.json({ received: true });
    }

    const isCompanyCall =
      assistantId === process.env.VAPI_COMPANY_ASSISTANT_ID;
    const type = isCompanyCall ? "company" : "talent";

    // Use Claude to extract structured data from transcript
    const extraction = await extractFromTranscript(transcript, type);

    if (isCompanyCall) {
      await updateCompanyProfile(phone, transcript, extraction);
    } else {
      await updateTalentProfile(phone, transcript, extraction);
    }

    // Update scout_calls record with completed status, transcript, and extraction
    if (message.call?.id) {
      const { error: callUpdateError } = await supabaseAdmin
        .from("scout_calls")
        .update({
          status: "completed",
          transcript,
          extraction,
          completed_at: new Date().toISOString(),
        })
        .eq("vapi_call_id", message.call.id);

      if (callUpdateError) {
        console.error("Failed to update scout_call record:", callUpdateError);
      }
    }

    return NextResponse.json({ received: true, type });
  } catch (error) {
    console.error("Vapi webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

interface CompanyExtraction {
  bio_summary: string;
  stage: string | null;
  challenge_summary: string | null;
  hours_per_week: number | null;
  budget_range: string | null;
  timeline: string | null;
}

interface TalentExtraction {
  bio_summary: string;
  primary_function: string | null;
  industries: string[];
  availability_hours: number | null;
  rate_range: string | null;
  ideal_companies: string | null;
}

async function extractFromTranscript(
  transcript: string,
  type: "company" | "talent"
): Promise<CompanyExtraction | TalentExtraction> {
  const prompt =
    type === "company"
      ? `Extract the following from this Scout call transcript with a company looking for fractional talent. Return valid JSON only.

{
  "bio_summary": "2-3 sentence summary of what they need",
  "stage": "company stage (seed, Series A, growth, etc) or null",
  "challenge_summary": "the core challenge they need help with",
  "hours_per_week": number or null,
  "budget_range": "their stated budget range or null",
  "timeline": "how urgent this is or null"
}

Transcript:
${transcript}`
      : `Extract the following from this Scout call transcript with a fractional executive. Return valid JSON only.

{
  "bio_summary": "2-3 sentence professional summary",
  "primary_function": "CFO, CMO, COO, CTO, or other",
  "industries": ["array of industries they mentioned"],
  "availability_hours": number or null,
  "rate_range": "their stated rate range or null",
  "ideal_companies": "what kind of companies/challenges excite them"
}

Transcript:
${transcript}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Claude response");
  }
  return JSON.parse(jsonMatch[0]);
}

async function updateCompanyProfile(
  phone: string,
  transcript: string,
  extraction: CompanyExtraction | TalentExtraction
) {
  const data = extraction as CompanyExtraction;

  // Find company by phone
  const { data: company } = await supabaseAdmin
    .from("company_profiles")
    .select("id")
    .eq("phone", phone)
    .single();

  if (!company) {
    console.error(`No company profile found for phone: ${phone}`);
    return;
  }

  await supabaseAdmin
    .from("company_profiles")
    .update({
      transcript,
      challenge_summary: data.challenge_summary,
      stage: data.stage,
      description: data.bio_summary,
    })
    .eq("id", company.id);

  // TODO: Trigger embedding generation for semantic matching
  console.log(`Updated company profile ${company.id} with call transcript`);
}

async function updateTalentProfile(
  phone: string,
  transcript: string,
  extraction: CompanyExtraction | TalentExtraction
) {
  const data = extraction as TalentExtraction;

  const { data: talent } = await supabaseAdmin
    .from("talent_profiles")
    .select("id")
    .eq("phone", phone)
    .single();

  if (!talent) {
    console.error(`No talent profile found for phone: ${phone}`);
    return;
  }

  await supabaseAdmin
    .from("talent_profiles")
    .update({
      transcript,
      bio: data.bio_summary,
      functions: data.primary_function ? [data.primary_function] : undefined,
      industries: data.industries.length > 0 ? data.industries : undefined,
      hours_per_week: data.availability_hours,
    })
    .eq("id", talent.id);

  // TODO: Trigger embedding generation for semantic matching
  console.log(`Updated talent profile ${talent.id} with call transcript`);
}
