import RolePage from "@/components/RolePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire a Fractional COO | Sprout",
  description: "Get senior operations leadership without the full-time cost. Sprout matches growing companies with fractional COOs in 48 hours.",
};

export default function HireFractionalCOO() {
  return (
    <RolePage
      role="COO"
      headline="The operator your company needs. Without the full-time overhead."
      subheadline="A fractional COO builds the systems, processes, and team structure that let a founder step back from running everything. Right for companies where growth has outpaced the org."
      whatTheyDo="A fractional COO makes the business run without the founder in every room. That means designing the operating model, owning cross-functional execution, building hiring processes and team structure, running the management cadence (OKRs, standups, QBRs), and making sure what the CEO promises is actually deliverable. They're the person who sees the whole machine and fixes what's grinding. Part-time in hours — fully accountable for how the business operates."
      whenYouNeedOne={[
        "The CEO is in every meeting and every decision because nothing runs without them.",
        "You've grown fast and the org is chaotic — unclear ownership, dropped balls, no operating rhythm.",
        "You're scaling headcount and don't have the hiring infrastructure to support it.",
        "Customer delivery is inconsistent and the team is constantly firefighting.",
        "You're planning a big operational change — new market, new product line, new delivery model — and need someone to own the execution.",
        "Your leadership team is strong but siloed — nobody is coordinating across functions.",
      ]}
      whatYouGet={[
        {
          title: "Scout-matched in 48 hours",
          description: "Tell Scout what's broken operationally. You'll get matched with operators who've scaled companies at your stage and in your industry.",
        },
        {
          title: "Operators, not consultants",
          description: "Fractional COOs on Sprout have run operations, not just advised on them. They'll own outcomes, not write frameworks for someone else to execute.",
        },
        {
          title: "Founder leverage",
          description: "The right COO buys the founder time and clarity. They absorb the operational load so leadership energy goes toward growth, not management.",
        },
        {
          title: "Scalable engagement",
          description: "Start with an operational audit and 90-day plan, then extend to ongoing fractional leadership as needed.",
        },
      ]}
      faqs={[
        {
          question: "How is a fractional COO different from a project manager or chief of staff?",
          answer: "A project manager executes a defined scope. A chief of staff supports the CEO. A COO owns how the whole company operates — cross-functional execution, team design, and the management system. They're making calls and driving accountability, not coordinating tasks.",
        },
        {
          question: "What does it cost?",
          answer: "Most fractional COOs on Sprout work for $150-300/hr or $6-15k/month. The ROI is usually obvious within the first 30 days — once you can measure the operational drag they're removing.",
        },
        {
          question: "Is a fractional COO right for early-stage companies?",
          answer: "Usually not pre-Series A. If you're under 15 people, the CEO and leadership team can stay close to operations. Fractional COOs are most valuable at 20-150 employees, when you've scaled past founder-led execution but aren't ready for a $300K full-time COO.",
        },
        {
          question: "What's the typical engagement length?",
          answer: "Most engagements run 6-18 months. Some companies use a fractional COO to build the operating infrastructure, then hire a full-time operator once the systems exist. Others keep the fractional model indefinitely.",
        },
      ]}
    />
  );
}
