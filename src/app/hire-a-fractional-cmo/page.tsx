import RolePage from "@/components/RolePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire a Fractional CMO | Sprout",
  description: "Get senior marketing leadership without the full-time cost. Sprout matches growing companies with fractional CMOs in 48 hours.",
};

export default function HireFractionalCMO() {
  return (
    <RolePage
      role="CMO"
      headline="Marketing leadership that actually drives pipeline."
      subheadline="A fractional CMO sets the strategy, owns the brand, and builds the team — without the $250K salary before you've found product-market fit. Right for companies that are done experimenting and ready to scale."
      whatTheyDo="A fractional CMO owns marketing at a strategic level. That means defining positioning, owning the go-to-market strategy, building and managing the marketing team or agency stack, setting the metrics that matter (CAC, LTV, pipeline attribution), and holding the brand accountable to the business goals. They're the executive who sits in the leadership meeting, pushes back on the sales team, and makes the hard calls on where to spend. Part-time in hours, full commitment in ownership."
      whenYouNeedOne={[
        "You have marketing activity but no clear strategy tying it to revenue.",
        "You're scaling sales and need marketing to generate qualified pipeline instead of just content.",
        "Your brand positioning is muddled — different people describe the company differently.",
        "You've hired a marketing coordinator but have no one senior enough to direct them.",
        "You're entering a new market or launching a new product and need a go-to-market plan.",
        "You're pre-Series A and not ready to commit to a full-time CMO salary.",
      ]}
      whatYouGet={[
        {
          title: "Scout-matched in 48 hours",
          description: "Tell Scout your stage, industry, and what's broken. You'll get matched with CMOs who've solved this specific problem before — not generalists.",
        },
        {
          title: "Strategy + execution",
          description: "The best fractional CMOs don't just advise — they build. Look for someone who'll own channels, ship campaigns, and manage the team directly.",
        },
        {
          title: "Flexible scope",
          description: "Start with a positioning and GTM sprint, then extend to ongoing leadership. Structured to fit your budget and where you are in the journey.",
        },
        {
          title: "B2B and B2C expertise",
          description: "Demand gen for a SaaS company is nothing like DTC brand-building. We match on go-to-market motion, not just the title on their resume.",
        },
      ]}
      faqs={[
        {
          question: "How is a fractional CMO different from a marketing agency?",
          answer: "An agency executes tactics. A CMO owns the strategy and the business outcome. A good fractional CMO will tell you which tactics to stop, restructure your agency relationships, and hold everything accountable to pipeline — not impressions.",
        },
        {
          question: "What does it cost?",
          answer: "Most fractional CMOs on Sprout run $150-300/hr or $5-12k/month. At 10-15 hours a week, that's senior leadership for less than you'd pay a mid-level marketing manager full-time.",
        },
        {
          question: "When is it too early for a fractional CMO?",
          answer: "If you haven't found product-market fit, a CMO probably can't fix that. Marketing amplifies what's working — it doesn't create it. If your close rate is under 20%, fix the product before scaling the funnel.",
        },
        {
          question: "Can a fractional CMO manage our existing marketing team?",
          answer: "Yes — and that's often where they add the most value. Many companies have marketers who need direction, not more headcount. A fractional CMO can lead the team, without the full-time cost.",
        },
      ]}
    />
  );
}
