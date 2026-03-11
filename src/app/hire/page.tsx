"use client";

import { useState } from "react";
import Link from "next/link";

const TOP_INDUSTRIES = [
  "SaaS / Software",
  "Fintech",
  "Healthcare / Health Tech",
  "E-commerce / Retail",
  "AI / ML",
  "Real Estate / PropTech",
  "Media / AdTech",
  "Manufacturing / Industrial",
  "Consumer Goods / CPG",
  "Defense / Government",
];

const HOURS_OPTIONS = Array.from({ length: 19 }, (_, i) => 4 + i * 2);

export default function HirePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [industriesExpanded, setIndustriesExpanded] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [roleNeeded, setRoleNeeded] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetUnit, setBudgetUnit] = useState<"/hr" | "/mo">("/hr");

  function toggleIndustry(industry: string) {
    if (industry === "Other") {
      setSelectedIndustries((prev) =>
        prev.includes("Other") ? prev.filter((i) => i !== "Other") : [...prev, "Other"]
      );
      return;
    }
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  }

  const visibleIndustries = industriesExpanded ? TOP_INDUSTRIES : TOP_INDUSTRIES.slice(0, 5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const budgetHourly = budgetUnit === "/hr" ? budgetAmount : "";
    const budgetMonthly = budgetUnit === "/mo" ? budgetAmount : "";
    const finalRole = roleNeeded === "Other" ? otherRole : roleNeeded;

    const data = {
      company_name: (form.elements.namedItem("company_name") as HTMLInputElement).value,
      contact_name: (form.elements.namedItem("contact_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      role_needed: finalRole,
      hours_per_week: (form.elements.namedItem("hours_per_week") as HTMLSelectElement).value,
      budget_hourly: budgetHourly,
      budget_monthly: budgetMonthly,
      budget_range: `$${budgetAmount}${budgetUnit}`,
      industry: [
        ...selectedIndustries.filter((i) => i !== "Other"),
        ...(selectedIndustries.includes("Other") && otherIndustry.trim() ? [otherIndustry.trim()] : []),
      ].join(", "),
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Scout is on it.</h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8">
            We&apos;ll be in touch within 24 hours with matched fractional talent for your team.
          </p>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors text-base"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-24">
        <Link href="/" className="text-emerald-500 hover:text-emerald-400 text-sm mb-8 inline-block">
          &larr; Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hire fractional talent</h1>
          <p className="text-slate-300 text-lg">
            Tell us what you need. Scout will match you with the right executive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-4 sm:p-8 space-y-6">
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Role + Hours + Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="role_needed" className="block text-sm font-medium text-slate-300 mb-2">
                Role needed
              </label>
              <select
                id="role_needed"
                name="role_needed"
                required
                value={roleNeeded}
                onChange={(e) => setRoleNeeded(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select role</option>
                <option value="CFO">CFO</option>
                <option value="CMO">CMO</option>
                <option value="COO">COO</option>
                <option value="CTO">CTO</option>
                <option value="Other">Other</option>
              </select>
              {roleNeeded === "Other" && (
                <input
                  type="text"
                  placeholder="Specify role..."
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  required
                  className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              )}
            </div>
            <div>
              <label htmlFor="hours_per_week" className="block text-sm font-medium text-slate-300 mb-2">
                Hours / week
              </label>
              <select
                id="hours_per_week"
                name="hours_per_week"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {HOURS_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h} hrs/wk</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder={budgetUnit === "/hr" ? "200" : "8000"}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={budgetUnit}
                  onChange={(e) => setBudgetUnit(e.target.value as "/hr" | "/mo")}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[72px]"
                >
                  <option value="/hr">/hr</option>
                  <option value="/mo">/mo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Industry pills */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Industry
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleIndustries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors min-h-[44px] flex items-center ${
                    selectedIndustries.includes(industry)
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {industry}
                </button>
              ))}
              <button
                type="button"
                onClick={() => toggleIndustry("Other")}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors min-h-[44px] flex items-center ${
                  selectedIndustries.includes("Other")
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-400"
                }`}
              >
                Other
              </button>
              {!industriesExpanded && (
                <button
                  type="button"
                  onClick={() => setIndustriesExpanded(true)}
                  className="px-4 py-2.5 rounded-full text-sm font-medium border border-dashed border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300 transition-colors min-h-[44px] flex items-center"
                >
                  + More
                </button>
              )}
            </div>
            {selectedIndustries.includes("Other") && (
              <input
                type="text"
                placeholder="e.g. Climate Tech, Legal Tech..."
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
                className="mt-3 w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            )}
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
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
