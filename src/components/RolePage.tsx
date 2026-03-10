import Link from "next/link";

export interface RolePageProps {
  role: string; // "CFO" | "CMO" | "COO" | "CTO"
  headline: string;
  subheadline: string;
  whatTheyDo: string;
  whenYouNeedOne: string[];
  whatYouGet: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  ctaText?: string;
}

export default function RolePage({
  role,
  headline,
  subheadline,
  whatTheyDo,
  whenYouNeedOne,
  whatYouGet,
  faqs,
  ctaText = "Find your fractional " + role,
}: RolePageProps) {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-emerald-100 text-sm font-medium">Fractional {role}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          {headline}
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/hire"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-lg"
          >
            {ctaText}
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-colors text-lg"
          >
            Browse open roles
          </Link>
        </div>
      </section>

      {/* What they do */}
      <section className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-4">What does a fractional {role} actually do?</h2>
          <p className="text-slate-300 text-lg leading-relaxed">{whatTheyDo}</p>
        </div>
      </section>

      {/* When you need one */}
      <section className="border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Signs you need a fractional {role}</h2>
          <ul className="space-y-4">
            {whenYouNeedOne.map((sign, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300">{sign}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">What you get with Sprout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatYouGet.map((item, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">Common questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find your fractional {role}?
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Tell Scout what you need. Most companies have a matched intro within 48 hours.
          </p>
          <Link
            href="/hire"
            className="inline-flex items-center justify-center px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-lg"
          >
            Get matched now
          </Link>
        </div>
      </section>
    </div>
  );
}
