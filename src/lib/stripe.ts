import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const stripe = { get instance() { return getStripe(); } };

export async function createCheckoutSession(
  companyId: string,
  phone: string
): Promise<string> {
  const s = getStripe();
  const session = await s.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      company_id: companyId,
      phone,
    },
    subscription_data: {
      metadata: {
        company_id: companyId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sprout/hire?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sprout/hire`,
  });

  return session.url!;
}

export async function getSubscriptionStatus(
  companyId: string
): Promise<"free" | "active" | "cancelled"> {
  const { supabaseAdmin } = await import("@/lib/supabase-admin");

  const { data } = await supabaseAdmin
    .from("company_profiles")
    .select("subscription_status")
    .eq("id", companyId)
    .single();

  return (data?.subscription_status as "free" | "active" | "cancelled") ?? "free";
}
