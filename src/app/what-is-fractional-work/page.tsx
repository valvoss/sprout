import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is Fractional Work? | Sprout",
  description: "Fractional executives are senior leaders who work part-time across multiple companies. Here's how it works, when it makes sense, and what to expect.",
};

const roles = [
  { title: "Fractional CFO", href: "/hire-a-fractional-cfo", desc: "Fundraising, financial strategy, board-ready reporting." },
  { title: "Fractional CMO", href: "/hire-a-fractional-cmo", desc: "Go-to-market strategy, positioning, pipeline growth." },
  { title: "Fractional COO", href: "/hire-a-fractional-coo", desc: "Operating model, team structure, execution rhythm." },
  { title: "Fractional CTO", href: "/hire-a-fractional-cto", desc: "Technical direction, engineering leadership, architecture." },
];

export default function WhatIsFractionalWork() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-emerald-100 text-sm font-medium">The basics</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          What is fractional work?
        </h1>
        <p className="text-xl text-slate-300 leading-relaxed">
          Fractional executives are senior leaders - CFOs, CMOs, COOs, CTOs - who work part-time across
          multiple companies instead of full-time at one. You get the same person, the same expertise, the same
          accountability. Just not five days a week.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">How it works</h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "You hire for scope, not headcount",
                body: "Instead of hiring a full-time CFO, you hire a CFO for 10-15 hours a week. They own the function — they're just not in every meeting. You define the scope together: fundraising prep, financial modeling, board reporting, whatever's most critical.",
              },
              {
                step: "2",
                title: "They work across a few companies simultaneously",
                body: "A fractional executive typically works with 2-4 companies at a time. This means you're getting someone with active perspective — they know what's working at other companies right now, not just what worked at their last full-time job.",
              },
              {
                step: "3",
                title: "You pay for what you use",
                body: "Most fractional engagements are structured as a monthly retainer based on hours committed. You scale up during a raise or a critical sprint, and back down during steadier periods. No equity, no full-time benefits, no long notice periods.",
              },
              {
                step: "4",
                title: "They're accountable for outcomes, not activity",
                body: "The best fractional executives set clear deliverables: a financial model that closes a Series A, a GTM motion that doubles pipeline, an operating system that lets the founder step out of the weeds. If you're not getting that, the engagement shouldn't continue.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-4">Who it's for</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Fractional executives work best for companies in a specific window: past early chaos, not yet at
            enterprise scale. Usually $2M-$30M in revenue, or Series A-B stage. You've proven the model and
            you need serious leadership to build the next layer — but a $300K full-time executive hire feels
            premature.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Post-seed, pre-Series B companies",
              "Bootstrapped companies scaling past $5M",
              "PE-backed portfolio companies needing interim leadership",
              "Companies in between full-time executive hires",
              "Founders who need a functional owner, not a consultant",
              "Companies with a junior team that needs senior direction",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800 rounded-xl p-4">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span className="text-slate-300 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fractional vs full-time */}
      <section className="border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Fractional vs. full-time</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 pr-6 text-slate-400 font-medium"></th>
                  <th className="text-left py-3 pr-6 text-emerald-400 font-semibold">Fractional</th>
                  <th className="text-left py-3 text-slate-400 font-medium">Full-time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  ["Cost", "$5-15k/mo", "$200-350k/yr + equity"],
                  ["Time to start", "1-2 weeks", "3-6 months to hire"],
                  ["Commitment", "Month-to-month", "Long-term"],
                  ["Scope", "Defined function", "Broad ownership"],
                  ["Best for", "Growing companies", "Scale-up / enterprise"],
                ].map(([label, frac, full]) => (
                  <tr key={label}>
                    <td className="py-3 pr-6 text-slate-400 font-medium">{label}</td>
                    <td className="py-3 pr-6 text-white">{frac}</td>
                    <td className="py-3 text-slate-400">{full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Explore by role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role) => (
              <Link
                key={role.href}
                href={role.href}
                className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors group"
              >
                <h3 className="text-white font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                  {role.title}
                </h3>
                <p className="text-slate-400 text-sm">{role.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your fractional executive?</h2>
          <p className="text-slate-300 mb-10">
            Tell Scout what you need. Most companies have a matched intro within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hire"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors"
            >
              I'm hiring fractional talent
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-colors"
            >
              I'm a fractional exec
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
