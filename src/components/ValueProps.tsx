const companyBenefits = [
  {
    title: "Skip the search",
    description: "Scout analyzes your needs and surfaces pre-vetted fractional execs in minutes, not months.",
    icon: "🎯",
  },
  {
    title: "Flexible commitment",
    description: "Hire elite talent for 10–30 hours a week. Scale up or down as your business evolves.",
    icon: "⚡",
  },
  {
    title: "Fraction of the cost",
    description: "Get C-suite expertise at a fraction of full-time cost. No recruiter fees, no long-term contracts.",
    icon: "💰",
  },
];

const execBenefits = [
  {
    title: "Work that fits your life",
    description: "Choose your hours, pick your clients, and build a portfolio career on your terms.",
    icon: "🌱",
  },
  {
    title: "High-quality matches",
    description: "Scout matches you with companies that align with your expertise, industry, and working style.",
    icon: "🤝",
  },
  {
    title: "Zero hustle",
    description: "No more chasing leads. Companies come to you through Sprout, with warm introductions from Scout.",
    icon: "✨",
  },
];

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function ValueProps() {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built for both sides of the table
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Whether you&apos;re scaling a company or building a fractional career, Sprout has you covered.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-6 text-center">
            For Companies
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {companyBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-6 text-center">
            For Fractional Execs
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {execBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
