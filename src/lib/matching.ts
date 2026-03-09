import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendSMS } from "@/lib/twilio";
import { createCheckoutSession } from "@/lib/stripe";

export async function sendProfilesForCompany(companyId: string): Promise<void> {
  const { data: company } = await supabaseAdmin
    .from("company_profiles")
    .select("*")
    .eq("id", companyId)
    .single();

  if (!company || !company.phone) {
    console.error(`Company ${companyId} not found or has no phone`);
    return;
  }

  // Get top 3 matched talent profiles that haven't been sent yet
  const { data: matches } = await supabaseAdmin
    .from("matches")
    .select("*, talent:talent_profiles(*)")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("score", { ascending: false })
    .limit(3);

  if (!matches || matches.length === 0) {
    await sendSMS(
      company.phone,
      "Scout here — still searching for the right match for you. I'll text you as soon as I find someone great."
    );
    return;
  }

  const profileLines = matches.map((match, i) => {
    const t = match.talent as Record<string, string | string[] | number | null>;
    const functions = Array.isArray(t.functions) ? t.functions.join(", ") : t.functions;
    return `${i + 1}. ${t.name} — ${functions}\n   ${t.bio ? String(t.bio).slice(0, 100) + "..." : "Experienced executive"}`;
  });

  const message = `Scout found ${matches.length} matches for ${company.company_name}:\n\n${profileLines.join("\n\n")}\n\nReply with the number(s) you're interested in (e.g. "1,3") and I'll make an intro.`;

  await sendSMS(company.phone, message);

  // Update profiles_sent count
  const newCount = (company.profiles_sent ?? 0) + matches.length;
  await supabaseAdmin
    .from("company_profiles")
    .update({ profiles_sent: newCount })
    .eq("id", companyId);

  // Check if we've hit the paywall threshold
  if (newCount >= 3) {
    await checkPaywallAndNotify(companyId);
  }
}

export async function checkPaywallAndNotify(companyId: string): Promise<void> {
  const { data: company } = await supabaseAdmin
    .from("company_profiles")
    .select("subscription_status, phone, profiles_sent")
    .eq("id", companyId)
    .single();

  if (!company || !company.phone) return;

  if (company.subscription_status === "active") return;

  if ((company.profiles_sent ?? 0) < 3) return;

  try {
    const checkoutUrl = await createCheckoutSession(companyId, company.phone);

    await sendSMS(
      company.phone,
      `You've used your 3 free Scout profiles. To keep finding great execs, join Sprout for $200/month (founding member rate - goes to $499 at launch): ${checkoutUrl}\n\nReply STOP to unsubscribe.`
    );
  } catch (error) {
    console.error("Failed to create checkout session or send paywall SMS:", error);
  }
}
