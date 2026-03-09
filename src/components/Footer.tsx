import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-white font-bold text-xl">🌱 Sprout</span>
            <p className="text-sm mt-1">Grow with the right people.</p>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/hire" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/join" className="hover:text-white transition-colors">For Execs</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Sprout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
