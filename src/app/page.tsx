import Link from "next/link";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <section className="bg-slate-900 text-center pb-16">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Browse open roles &rarr;
        </Link>
      </section>
      <ValueProps />
      <HowItWorks />
    </main>
  );
}
