import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendSMS } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string)?.trim();

    if (!from || !body) {
      return twimlResponse("Sorry, I didn't catch that.");
    }

    const upperBody = body.toUpperCase();

    if (upperBody === "STOP") {
      return twimlResponse("");
    }

    // Check if sender is a company (replying to profile matches)
    const { data: company } = await supabaseAdmin
      .from("company_profiles")
      .select("id, company_name")
      .eq("phone", from)
      .single();

    if (company) {
      await handleCompanyReply(company.id, company.company_name, from, body);
      return twimlResponse("");
    }

    // Check if sender is talent (replying to opportunity texts)
    const { data: talent } = await supabaseAdmin
      .from("talent_profiles")
      .select("id, name")
      .eq("phone", from)
      .single();

    if (talent) {
      await handleTalentReply(talent.id, talent.name, from, body);
      return twimlResponse("");
    }

    return twimlResponse(
      "Hey! I don't recognize this number. Visit sprout.app to get started."
    );
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return twimlResponse("");
  }
}

async function handleCompanyReply(
  companyId: string,
  companyName: string,
  phone: string,
  body: string
) {
  // Parse selection numbers (e.g. "1,3" or "1 3" or "1")
  const selections = body
    .split(/[,\s]+/)
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 3);

  if (selections.length === 0) {
    await sendSMS(
      phone,
      "Reply with the number(s) of the profiles you're interested in (e.g. \"1,3\")."
    );
    return;
  }

  // Get the pending matches for this company, ordered by score (same order as sent)
  const { data: matches } = await supabaseAdmin
    .from("matches")
    .select("id, talent:talent_profiles(name)")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("score", { ascending: false })
    .limit(3);

  if (!matches || matches.length === 0) {
    await sendSMS(phone, "No pending matches found. I'll text you when new ones are ready.");
    return;
  }

  const acceptedNames: string[] = [];
  for (const sel of selections) {
    const match = matches[sel - 1];
    if (match) {
      await supabaseAdmin
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", match.id);

      const talent = match.talent as unknown as { name: string } | null;
      if (talent?.name) {
        acceptedNames.push(talent.name);
      }
    }
  }

  if (acceptedNames.length > 0) {
    await sendSMS(
      phone,
      `Great choices! I'll set up intros with ${acceptedNames.join(" and ")} for ${companyName}. Expect an email within 24 hours.`
    );
  }
}

async function handleTalentReply(
  talentId: string,
  talentName: string,
  phone: string,
  body: string
) {
  const selections = body
    .split(/[,\s]+/)
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 3);

  if (selections.length === 0) {
    await sendSMS(
      phone,
      "Reply with the number(s) of the opportunities you're interested in (e.g. \"1,2\")."
    );
    return;
  }

  const { data: matches } = await supabaseAdmin
    .from("matches")
    .select("id, company:company_profiles(company_name)")
    .eq("talent_id", talentId)
    .eq("status", "pending")
    .order("score", { ascending: false })
    .limit(3);

  if (!matches || matches.length === 0) {
    await sendSMS(phone, "No pending opportunities right now. I'll text you when new ones come in.");
    return;
  }

  const acceptedNames: string[] = [];
  for (const sel of selections) {
    const match = matches[sel - 1];
    if (match) {
      await supabaseAdmin
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", match.id);

      const company = match.company as unknown as { company_name: string } | null;
      if (company?.company_name) {
        acceptedNames.push(company.company_name);
      }
    }
  }

  if (acceptedNames.length > 0) {
    await sendSMS(
      phone,
      `Awesome, ${talentName}! I'll intro you to ${acceptedNames.join(" and ")}. Check your email within 24 hours.`
    );
  }
}

function twimlResponse(message: string) {
  const xml = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}
