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

const HOURS_OPTIONS = Array.from({ length: 19 }, (_, i) => 4 + i * 2); // 4, 6, 8 ... 40

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [industriesExpanded, setIndustriesExpanded] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [rateAmount, setRateAmount] = useState("");
  const [rateUnit, setRateUnit] = useState<"/hr" | "/mo">("/hr");

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

    const industriesList = [
      ...selectedIndustries.filter((i) => i !== "Other"),
      ...(selectedIndustries.includes("Other") && otherIndustry.trim() ? [otherIndustry.trim()] : []),
    ].join(", ");

    const rateHourly = rateUnit === "/hr" ? rateAmount : "";
    const rateMonthly = rateUnit === "/mo" ? rateAmount : "";

    const data = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      linkedin_url: (form.elements.namedItem("linkedin_url") as HTMLInputElement).value,
      primary_role: (form.elements.namedItem("primary_role") as HTMLSelectElement).value,
      years_experience: (form.elements.namedItem("years_experience") as HTMLInputElement).value,
      industries_served: industriesList,
      availability_hours: (form.elements.namedItem("availability_hours") as HTMLSelectElement).value,
      rate_hourly: rateHourly,
      rate_monthly: rateMonthly,
      rate_expectations: `${rateAmount}${rateUnit}`,
      bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
    };

    console.log("Exec application submitted:", data);

    // Trigger Scout call if phone provided
    if (data.phone) {
      try {
        await fetch(`/api/scout/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: data.phone, type: "talent", formData: data }),
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
          <h1 className="text-3xl font-bold mb-4">Application received.</h1>
          <p className="text-slate-300 text-lg mb-8">
            Scout will review your profile and reach out within 48 hours.
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Join the Sprout network</h1>
          <p className="text-slate-300 text-lg">
            Apply to join our curated network of fractional executives.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
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
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-slate-300 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primary_role" className="block text-sm font-medium text-slate-300 mb-2">
                Primary role
              </label>
              <select
                id="primary_role"
                name="primary_role"
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
              <label htmlFor="years_experience" className="block text-sm font-medium text-slate-300 mb-2">
                Years of experience
              </label>
              <input
                type="number"
                id="years_experience"
                name="years_experience"
                min="1"
                max="50"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="15"
              />
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Industries served
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleIndustries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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
                  className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300 transition-colors"
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
                className="mt-3 w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hours per week */}
            <div>
              <label htmlFor="availability_hours" className="block text-sm font-medium text-slate-300 mb-2">
                Availability (hrs/week)
              </label>
              <select
                id="availability_hours"
                name="availability_hours"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select hours</option>
                {HOURS_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h} hrs/week</option>
                ))}
              </select>
            </div>

            {/* Rate expectations */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rate expectations
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={rateAmount}
                    onChange={(e) => setRateAmount(e.target.value)}
                    placeholder={rateUnit === "/hr" ? "200" : "8000"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={rateUnit}
                  onChange={(e) => setRateUnit(e.target.value as "/hr" | "/mo")}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="/hr">/hr</option>
                  <option value="/mo">/mo</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
              Brief bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Share your experience, what you're passionate about, and what kind of companies you work best with..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 rounded-full transition-colors text-lg"
          >
            {loading ? "Submitting..." : "Apply to Sprout"}
          </button>
        </form>
      </div>
    </div>
  );
}
