const steps = [
  {
    number: "01",
    title: "Describe your need",
    description:
      "Tell us what role you need, your budget, timeline, and industry. Takes under 5 minutes.",
  },
  {
    number: "02",
    title: "Meet Scout",
    description:
      "Our AI matching engine analyzes your requirements against our vetted talent pool and finds your ideal match.",
  },
  {
    number: "03",
    title: "Get matched",
    description:
      "Review Scout's top recommendations with match scores and reasoning, then book an intro call.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How Scout works
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            From need to hire in days, not months. Scout does the heavy lifting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
