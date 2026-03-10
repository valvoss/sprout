"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-lg flex items-center gap-2">
          🌱 Sprout
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/jobs" className="text-slate-300 hover:text-white transition-colors">
            Browse Jobs
          </Link>
          <Link href="/hire" className="text-slate-300 hover:text-white transition-colors">
            For Companies
          </Link>
          <Link href="/join" className="text-slate-300 hover:text-white transition-colors">
            For Execs
          </Link>
          <Link
            href="/hire"
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/jobs" className="text-slate-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
            Browse Jobs
          </Link>
          <Link href="/hire" className="text-slate-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
            For Companies
          </Link>
          <Link href="/join" className="text-slate-300 hover:text-white transition-colors" onClick={() => setOpen(false)}>
            For Execs
          </Link>
          <Link
            href="/hire"
            className="inline-flex justify-center px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors w-full text-center"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}
