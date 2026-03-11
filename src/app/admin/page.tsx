"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: "talent" | "company";
  status: string;
  primary_role: string | null;
  created_at: string;
}

interface MatchRow {
  id: string;
  score: number;
  status: string;
  scout_reasoning: string | null;
  created_at: string;
  talent: { id: string; full_name?: string; name?: string; email?: string; phone?: string } | null;
  company: { id: string; company_name?: string; email?: string; phone?: string } | null;
}

interface IntroRow {
  id: string;
  match_id: string;
  status: string;
  intro_sent_at: string | null;
  meeting_booked_at: string | null;
  outcome: string | null;
  created_at: string;
  match: MatchRow | null;
}

type Tab = "leads" | "scout" | "matches" | "intros";

// ── Helpers ────────────────────────────────────────────
function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
    blue: "bg-blue-900/50 text-blue-300 border-blue-700",
    yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    red: "bg-red-900/50 text-red-300 border-red-700",
    gray: "bg-gray-800 text-gray-300 border-gray-700",
    purple: "bg-purple-900/50 text-purple-300 border-purple-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 border border-gray-700 rounded text-xs px-2 py-1 focus:outline-none focus:border-emerald-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Main Page ──────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [intros, setIntros] = useState<IntroRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [scoutLoading, setScoutLoading] = useState<string | null>(null);

  const fetchData = useCallback(async (t: Tab) => {
    setLoading(true);
    try {
      if (t === "leads" || t === "scout") {
        const res = await fetch("/api/admin/leads");
        if (res.ok) setLeads(await res.json());
      } else if (t === "matches") {
        const res = await fetch("/api/admin/matches");
        if (res.ok) setMatches(await res.json());
      } else if (t === "intros") {
        const res = await fetch("/api/admin/intros");
        if (res.ok) setIntros(await res.json());
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(tab);
  }, [tab, fetchData]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function updateLeadStatus(id: string, type: string, status: string) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, status }),
    });
    fetchData("leads");
  }

  async function updateMatchStatus(id: string, status: string) {
    await fetch("/api/admin/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData("matches");
  }

  async function updateIntroStatus(id: string, status: string) {
    await fetch("/api/admin/intros", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData("intros");
  }

  async function triggerScout(lead: Lead) {
    if (!lead.phone) return alert("No phone number for this lead");
    setScoutLoading(lead.id);
    try {
      const formData =
        lead.type === "company"
          ? { company_name: lead.name, contact_name: lead.name, email: lead.email || "" }
          : { full_name: lead.name, email: lead.email || "" };

      const res = await fetch("/api/scout/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: lead.phone, type: lead.type, formData }),
      });

      if (res.ok) {
        alert(`Scout call triggered for ${lead.name}`);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to trigger call"}`);
      }
    } catch {
      alert("Failed to trigger Scout call");
    } finally {
      setScoutLoading(null);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "leads", label: "Leads" },
    { key: "scout", label: "Scout" },
    { key: "matches", label: "Matches" },
    { key: "intros", label: "Intros" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">🌱 Sprout Admin</h1>
          <nav className="flex gap-1 ml-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  tab === t.key
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : (
          <>
            {tab === "leads" && <LeadsSection leads={leads} onStatusChange={updateLeadStatus} />}
            {tab === "scout" && (
              <ScoutSection leads={leads} onTrigger={triggerScout} loadingId={scoutLoading} />
            )}
            {tab === "matches" && (
              <MatchesSection matches={matches} onStatusChange={updateMatchStatus} />
            )}
            {tab === "intros" && (
              <IntrosSection intros={intros} onStatusChange={updateIntroStatus} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── Leads Section ──────────────────────────────────────
function LeadsSection({
  leads,
  onStatusChange,
}: {
  leads: Lead[];
  onStatusChange: (id: string, type: string, status: string) => void;
}) {
  if (leads.length === 0)
    return <p className="text-gray-500 text-sm">No leads yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Email</th>
            <th className="pb-3 pr-4 font-medium">Phone</th>
            <th className="pb-3 pr-4 font-medium">Type</th>
            <th className="pb-3 pr-4 font-medium">Role</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
              <td className="py-3 pr-4 font-medium">{lead.name}</td>
              <td className="py-3 pr-4 text-gray-400">{lead.email || "—"}</td>
              <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{lead.phone || "—"}</td>
              <td className="py-3 pr-4">
                <Badge color={lead.type === "talent" ? "blue" : "purple"}>
                  {lead.type}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-gray-400">{lead.primary_role || "—"}</td>
              <td className="py-3 pr-4">
                <StatusSelect
                  value={lead.status}
                  options={["new", "contacted", "qualified", "active", "inactive", "closed"]}
                  onChange={(s) => onStatusChange(lead.id, lead.type, s)}
                />
              </td>
              <td className="py-3 text-gray-500 text-xs">{formatDate(lead.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Scout Section ──────────────────────────────────────
function ScoutSection({
  leads,
  onTrigger,
  loadingId,
}: {
  leads: Lead[];
  onTrigger: (lead: Lead) => void;
  loadingId: string | null;
}) {
  if (leads.length === 0)
    return <p className="text-gray-500 text-sm">No leads to scout.</p>;

  return (
    <div>
      <p className="text-gray-400 text-sm mb-4">
        Trigger a Scout (Vapi) call for any lead. The lead must have a phone number.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Phone</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3 pr-4 font-medium">{lead.name}</td>
                <td className="py-3 pr-4">
                  <Badge color={lead.type === "talent" ? "blue" : "purple"}>
                    {lead.type}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                  {lead.phone || "—"}
                </td>
                <td className="py-3 pr-4 text-gray-400">{lead.primary_role || "—"}</td>
                <td className="py-3">
                  <button
                    onClick={() => onTrigger(lead)}
                    disabled={!lead.phone || loadingId === lead.id}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-medium transition-colors"
                  >
                    {loadingId === lead.id ? "Calling..." : "Call Scout"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Matches Section ────────────────────────────────────
function MatchesSection({
  matches,
  onStatusChange,
}: {
  matches: MatchRow[];
  onStatusChange: (id: string, status: string) => void;
}) {
  if (matches.length === 0)
    return <p className="text-gray-500 text-sm">No matches yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-3 pr-4 font-medium">Talent</th>
            <th className="pb-3 pr-4 font-medium">Company</th>
            <th className="pb-3 pr-4 font-medium">Score</th>
            <th className="pb-3 pr-4 font-medium">Reasoning</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
              <td className="py-3 pr-4">
                <div className="font-medium">
                  {m.talent?.full_name || m.talent?.name || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">{m.talent?.email || m.talent?.phone || ""}</div>
              </td>
              <td className="py-3 pr-4">
                <div className="font-medium">{m.company?.company_name || "Unknown"}</div>
                <div className="text-xs text-gray-500">{m.company?.email || m.company?.phone || ""}</div>
              </td>
              <td className="py-3 pr-4">
                <Badge color={m.score >= 80 ? "emerald" : m.score >= 60 ? "yellow" : "gray"}>
                  {m.score}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-gray-400 text-xs max-w-xs truncate">
                {m.scout_reasoning || "—"}
              </td>
              <td className="py-3 pr-4">
                <StatusSelect
                  value={m.status}
                  options={["pending", "accepted", "declined", "expired"]}
                  onChange={(s) => onStatusChange(m.id, s)}
                />
              </td>
              <td className="py-3 text-gray-500 text-xs">{formatDate(m.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Intros Section ─────────────────────────────────────
function IntrosSection({
  intros,
  onStatusChange,
}: {
  intros: IntroRow[];
  onStatusChange: (id: string, status: string) => void;
}) {
  if (intros.length === 0)
    return <p className="text-gray-500 text-sm">No introductions yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-3 pr-4 font-medium">Talent</th>
            <th className="pb-3 pr-4 font-medium">Company</th>
            <th className="pb-3 pr-4 font-medium">Match Score</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Intro Sent</th>
            <th className="pb-3 pr-4 font-medium">Meeting</th>
            <th className="pb-3 pr-4 font-medium">Outcome</th>
            <th className="pb-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {intros.map((intro) => {
            const m = intro.match;
            return (
              <tr key={intro.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3 pr-4 font-medium">
                  {m?.talent?.full_name || m?.talent?.name || "Unknown"}
                </td>
                <td className="py-3 pr-4 font-medium">
                  {m?.company?.company_name || "Unknown"}
                </td>
                <td className="py-3 pr-4">
                  <Badge color="gray">{m?.score ?? "—"}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <StatusSelect
                    value={intro.status}
                    options={["pending", "sent", "accepted", "rejected", "completed"]}
                    onChange={(s) => onStatusChange(intro.id, s)}
                  />
                </td>
                <td className="py-3 pr-4 text-gray-500 text-xs">
                  {intro.intro_sent_at ? formatDate(intro.intro_sent_at) : "—"}
                </td>
                <td className="py-3 pr-4 text-gray-500 text-xs">
                  {intro.meeting_booked_at ? formatDate(intro.meeting_booked_at) : "—"}
                </td>
                <td className="py-3 pr-4 text-gray-400 text-xs">{intro.outcome || "—"}</td>
                <td className="py-3 text-gray-500 text-xs">{formatDate(intro.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
