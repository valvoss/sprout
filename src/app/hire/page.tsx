"use client";

import { useState } from "react";
import Link from "next/link";

export default function HirePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      company_name: (form.elements.namedItem("company_name") as HTMLInputElement).value,
      contact_name: (form.elements.namedItem("contact_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      role_needed: (form.elements.namedItem("role_needed") as HTMLSelectElement).value,
      hours_per_week: (form.elements.namedItem("hours_per_week") as HTMLSelectElement).value,
      budget_range: (form.elements.namedItem("budget_range") as HTMLSelectElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      industry: (form.elements.namedItem("industry") as HTMLInputElement).value,
    };

    console.log("Hire request submitted:", data);

    // Trigger Scout call if phone provided
    if (data.phone) {
      try {
        await fetch(`/api/scout/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: data.phone, type: "company", formData: data }),
        });
      } catch (err) {
        console.error("Failed to trigger Scout call:", err);
      }
    }

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Scout is on it.</h1>
          <p className="text-slate-300 text-lg mb-8">
            We&apos;ll be in touch within 24 hours with matched fractional talent for your team.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="text-emerald-500 hover:text-emerald-400 text-sm mb-8 inline-block">
          &larr; Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hire fractional talent</h1>
          <p className="text-slate-300 text-lg">
            Tell us what you need. Scout will match you with the right executive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-slate-300 mb-2">
                Company name
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-slate-300 mb-2">
                Your name
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Jane Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="jane@acme.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="role_needed" className="block text-sm font-medium text-slate-300 mb-2">
                Role needed
              </label>
              <select
                id="role_needed"
                name="role_needed"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select role</option>
                <option value="CFO">CFO</option>
                <option value="CMO">CMO</option>
                <option value="COO">COO</option>
                <option value="CTO">CTO</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="hours_per_week" className="block text-sm font-medium text-slate-300 mb-2">
                Hours / week
              </label>
              <select
                id="hours_per_week"
                name="hours_per_week"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="10">10 hrs/wk</option>
                <option value="20">20 hrs/wk</option>
                <option value="30">30 hrs/wk</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget_range" className="block text-sm font-medium text-slate-300 mb-2">
                Budget range
              </label>
              <select
                id="budget_range"
                name="budget_range"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="3-5k">$3–5k/mo</option>
                <option value="5-8k">$5–8k/mo</option>
                <option value="8k+">$8k+/mo</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="SaaS, Healthcare, Fintech..."
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Brief description of need
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="We're looking for a fractional CFO to help with fundraising prep and financial modeling..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 rounded-full transition-colors text-lg"
          >
            {loading ? "Submitting..." : "Get matched by Scout"}
          </button>
        </form>
      </div>
    </div>
  );
}
