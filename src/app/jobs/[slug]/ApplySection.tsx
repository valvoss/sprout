"use client";

import { useState } from "react";

export default function ApplySection({ jobId }: { jobId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          full_name: name,
          email,
          phone,
        }),
      });
      const data = await res.json();
      if (data.action === "phone_screen_scheduled") {
        setResult("Scout will call you shortly!");
      } else if (data.action === "interested") {
        setResult("You're marked as interested - we'll be in touch.");
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch {
      setResult("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
        <p className="text-emerald-400 font-medium text-lg">{result}</p>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full transition-colors text-lg"
      >
        Apply for this role
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-white font-semibold text-lg mb-2">Apply for this role</h3>
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-full transition-colors"
      >
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
