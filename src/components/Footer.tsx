import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-white font-bold text-xl">🌱 Sprout</span>
            <p className="text-sm mt-2 leading-relaxed">Fractional exec matching, powered by Scout AI.</p>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Company</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/hire" className="hover:text-white transition-colors">Hire talent</Link>
              <Link href="/join" className="hover:text-white transition-colors">Join as an exec</Link>
              <Link href="/jobs" className="hover:text-white transition-colors">Browse jobs</Link>
              <Link href="/what-is-fractional-work" className="hover:text-white transition-colors">What is fractional work?</Link>
            </div>
          </div>

          {/* Hire by role */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Hire by role</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/hire-a-fractional-cfo" className="hover:text-white transition-colors">Fractional CFO</Link>
              <Link href="/hire-a-fractional-cmo" className="hover:text-white transition-colors">Fractional CMO</Link>
              <Link href="/hire-a-fractional-coo" className="hover:text-white transition-colors">Fractional COO</Link>
              <Link href="/hire-a-fractional-cto" className="hover:text-white transition-colors">Fractional CTO</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Legal</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Sprout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
