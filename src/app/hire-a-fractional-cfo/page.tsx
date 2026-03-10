import RolePage from "@/components/RolePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire a Fractional CFO | Sprout",
  description: "Get senior financial leadership without the full-time cost. Sprout matches growing companies with fractional CFOs in 48 hours.",
};

export default function HireFractionalCFO() {
  return (
    <RolePage
      role="CFO"
      headline="Senior financial leadership. No full-time commitment."
      subheadline="A fractional CFO gives you board-ready financials, fundraising strategy, and financial rigor — at 10-20 hours a week. Built for companies that aren't ready for a $300K full-time hire but need more than a bookkeeper."
      whatTheyDo="A fractional CFO owns your finance function at a strategic level. That means building the financial model your board and investors actually trust, owning the fundraising process (deck, data room, investor narrative), managing cash flow and runway, hiring and managing your accounting team, and sitting in board meetings as a peer — not a note-taker. The fractional part just means they split their time across a handful of companies instead of one. You get a seasoned executive, not a junior analyst figuring it out."
      whenYouNeedOne={[
        "You're 6-18 months from a fundraise and your financials aren't board-ready.",
        "You have a bookkeeper or controller but no one who can translate numbers into strategy.",
        "Investors are asking for a CFO hire and you're not sure you can justify the full-time cost yet.",
        "Your cash position is tightening and you need a real read on runway and burn.",
        "You're planning an acquisition, a sale, or a complex financing round.",
        "Your finance function is a black box — the CEO is too close to it and the board doesn't trust it.",
      ]}
      whatYouGet={[
        {
          title: "Scout-matched in 48 hours",
          description: "You fill out a short brief. Scout calls you, learns what you actually need, and matches you with 2-3 executives who've done this exact thing before.",
        },
        {
          title: "Executives, not consultants",
          description: "Every CFO in the Sprout network has held the seat — VP Finance, CFO, or equivalent — at a venture-backed or growth-stage company.",
        },
        {
          title: "Right-sized engagement",
          description: "Start at 10 hours a week and scale up during a raise or audit. No retainer lock-ins you'll regret in month three.",
        },
        {
          title: "Industry-relevant experience",
          description: "SaaS, healthcare, fintech, defense — we match on industry, not just title. A B2B SaaS CFO and a CPG CFO are doing very different jobs.",
        },
      ]}
      faqs={[
        {
          question: "How is a fractional CFO different from an accountant or controller?",
          answer: "An accountant or controller keeps your books accurate and closes your books on time. A CFO uses those numbers to run the business — building models, managing investor relationships, driving strategic decisions. If you need someone to tell you what the numbers mean, not just record them, you need a CFO.",
        },
        {
          question: "What does it cost?",
          answer: "Most fractional CFOs on Sprout work for $150-350/hr or $5-15k/month depending on scope. At 10-15 hours a week, that's typically $6-12k/month — a fraction of a full-time hire with benefits, equity, and recruiting costs.",
        },
        {
          question: "How quickly can someone start?",
          answer: "Most engagements kick off within 2 weeks of a match. If you're in crunch mode on a raise or close, let Scout know — we can expedite.",
        },
        {
          question: "What if it's not the right fit?",
          answer: "Sprout matches on specifics, not just vibes. But if the first match isn't right, we'll find another. No long-term contracts to get stuck in.",
        },
      ]}
    />
  );
}
