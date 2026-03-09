import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-emerald-100 text-sm font-medium">Powered by Scout AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Grow with the right{" "}
          <span className="text-emerald-500">people.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12">
          Sprout connects growing companies with elite fractional executives — CFOs, CMOs, COOs, CTOs —
          through Scout, our AI-powered matching engine.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/hire"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-lg"
          >
            I&apos;m hiring fractional talent
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-colors text-lg"
          >
            I&apos;m a fractional exec
          </Link>
        </div>
      </div>
    </section>
  );
}
