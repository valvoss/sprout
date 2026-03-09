"use client";

import { useState } from "react";
import Link from "next/link";

const basePath = process.env.NODE_ENV === "production" ? "/sprout" : "";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      linkedin_url: (form.elements.namedItem("linkedin_url") as HTMLInputElement).value,
      primary_role: (form.elements.namedItem("primary_role") as HTMLSelectElement).value,
      years_experience: (form.elements.namedItem("years_experience") as HTMLInputElement).value,
      industries_served: (form.elements.namedItem("industries_served") as HTMLInputElement).value,
      availability_hours: (form.elements.namedItem("availability_hours") as HTMLInputElement).value,
      rate_expectations: (form.elements.namedItem("rate_expectations") as HTMLInputElement).value,
      bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
    };

    console.log("Exec application submitted:", data);

    // Trigger Scout call if phone provided
    if (data.phone) {
      try {
        await fetch(`${basePath}/api/scout/trigger`, {
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
            href={`${basePath}/`}
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
        <Link href={`${basePath}/`} className="text-emerald-500 hover:text-emerald-400 text-sm mb-8 inline-block">
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

          <div>
            <label htmlFor="industries_served" className="block text-sm font-medium text-slate-300 mb-2">
              Industries served
            </label>
            <input
              type="text"
              id="industries_served"
              name="industries_served"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="SaaS, Fintech, Healthcare..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="availability_hours" className="block text-sm font-medium text-slate-300 mb-2">
                Availability (hrs/week)
              </label>
              <input
                type="number"
                id="availability_hours"
                name="availability_hours"
                min="5"
                max="40"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="20"
              />
            </div>
            <div>
              <label htmlFor="rate_expectations" className="block text-sm font-medium text-slate-300 mb-2">
                Rate expectations
              </label>
              <input
                type="text"
                id="rate_expectations"
                name="rate_expectations"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="$150-200/hr or $5-8k/mo"
              />
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
