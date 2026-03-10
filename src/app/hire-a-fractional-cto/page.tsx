import RolePage from "@/components/RolePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire a Fractional CTO | Sprout",
  description: "Get senior technical leadership without the full-time cost. Sprout matches growing companies with fractional CTOs in 48 hours.",
};

export default function HireFractionalCTO() {
  return (
    <RolePage
      role="CTO"
      headline="Technical leadership that ships. Without the $400K salary."
      subheadline="A fractional CTO owns your technical direction, manages your engineering team, and makes the architectural decisions that will define the next 3 years of your product. Built for companies where the tech is real but the leadership isn't yet."
      whatTheyDo="A fractional CTO owns the technical vision and the team that executes it. That means setting the architecture, making build vs. buy decisions, managing engineers and tech leads, owning the security and infrastructure posture, translating technical reality to the board, and — critically — knowing when to slow down and pay down debt versus when to ship fast. They're the person who can sit with your investors and explain why the tech is a moat, and then go back to the team and make it true."
      whenYouNeedOne={[
        "You have engineers but no technical leader setting direction and holding standards.",
        "The founders are non-technical and need someone who can manage the engineering team and translate for the business.",
        "Your tech debt has accumulated to the point where velocity is suffering.",
        "You're making a critical architectural decision — switching infrastructure, building an AI layer, choosing a new stack — and need senior judgment.",
        "Investors are asking technical due diligence questions you can't confidently answer.",
        "You're scaling the engineering team and need someone to build the hiring process and culture.",
      ]}
      whatYouGet={[
        {
          title: "Scout-matched in 48 hours",
          description: "Tell Scout your stack, your stage, and what's holding engineering back. You'll get matched with CTOs who've built at your scale — not overqualified enterprise architects.",
        },
        {
          title: "Technical credibility",
          description: "Every CTO in the Sprout network has shipped product at the executive level. They can code, review PRs, and earn the respect of your engineering team.",
        },
        {
          title: "Flexible from day one",
          description: "Need 5 hours a week to own the architecture review and be on call for key decisions? Or 20 hours to actively manage the team through a critical build? We scope to fit.",
        },
        {
          title: "AI and modern stack expertise",
          description: "If you're building AI products, you need someone who understands the layer — not just someone who's read the whitepapers. We match on specific technical domain.",
        },
      ]}
      faqs={[
        {
          question: "How is a fractional CTO different from a tech lead or senior engineer?",
          answer: "A senior engineer or tech lead executes within a defined scope. A CTO owns the entire technical direction — team structure, make-or-buy decisions, the architectural choices that define what's possible in two years. They sit in leadership meetings as a peer, not as a report.",
        },
        {
          question: "What does it cost?",
          answer: "Most fractional CTOs on Sprout work for $175-400/hr or $8-20k/month depending on scope and seniority. For a company that needs a real technical co-pilot, it's typically the highest-ROI hire you can make.",
        },
        {
          question: "Can a fractional CTO manage our full-time engineering team?",
          answer: "Yes — and it works well. The key is clear authority. If the engineering team knows the fractional CTO makes the technical calls, the model works. Where it breaks is when the CTO is advisory-only and engineers route around them.",
        },
        {
          question: "When should we hire a full-time CTO instead?",
          answer: "When the technical work is complex enough to require daily presence, or when engineering is 20+ people and needs full-time leadership bandwidth. Many companies use a fractional CTO to bridge the gap — building the technical foundation until they're ready to recruit a permanent hire.",
        },
      ]}
    />
  );
}
