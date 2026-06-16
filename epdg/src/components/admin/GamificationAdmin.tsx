import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";

type Trend = "up" | "down" | "stable";

interface LeaderboardIntern {
  id: number;
  name: string;
  initials: string;
  company: string;
  department: string;
  totalPoints: number;
  monthPoints: number;
  rank: number;
  badges: string[];
  trend: Trend;
}

interface AuditEvent {
  id: number;
  internName: string;
  action: string;
  points: number;
  date: string;
  awardedBy: string;
}

interface BadgeType {
  id: number;
  name: string;
  emoji: string;
  description: string;
  timesAwarded: number;
}

const INIT_LEADERBOARD: LeaderboardIntern[] = [];
const INIT_AUDIT: AuditEvent[] = [];
const BADGES: BadgeType[] = [];

const RULES = [
  { action: "Task completed",          points: 30 },
  { action: "Portfolio submitted",     points: 80 },
  { action: "Mentor session attended", points: 30 },
  { action: "Peer review done",        points: 25 },
  { action: "30-day streak bonus",     points: 100 },
  { action: "Late submission",         points: -15 },
  { action: "Missed check-in",         points: -20 },
];

const PODIUM_STYLE = ["border-amber-400/60", "border-slate-400/60", "border-orange-400/60"];

const TrendIcon = ({ t }: { t: Trend }) => {
  if (t === "up")   return <TrendingUp   size={14} className="text-green-400" />;
  if (t === "down") return <TrendingDown size={14} className="text-red-400"   />;
  return <Minus size={14} className="text-[#F5F0E8]" />;
};

const GamificationAdmin: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardIntern[]>(INIT_LEADERBOARD);
  const [auditLog, setAuditLog]       = useState<AuditEvent[]>(INIT_AUDIT);
  const [view, setView]               = useState<"month" | "all">("month");
  const [auditSearch, setAuditSearch] = useState("");

  const [adjustSearch, setAdjSearch]  = useState("");
  const [adjustTarget, setAdjTarget]  = useState<LeaderboardIntern | null>(null);
  const [adjustAmount, setAdjAmount]  = useState("");
  const [adjustReason, setAdjReason]  = useState("");
  const [showDropdown, setDropdown]   = useState(false);
  const [toast, setToast]             = useState("");

  const [badgeTarget, setBadgeTarget] = useState<BadgeType | null>(null);
  const [badgeSearch, setBadgeSearch] = useState("");
  const [badgeIntern, setBadgeIntern] = useState<LeaderboardIntern | null>(null);

  function showMsg(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const adjustDropdown = useMemo(() =>
    adjustSearch.trim()
      ? leaderboard.filter((i) => i.name.toLowerCase().includes(adjustSearch.toLowerCase()))
      : [],
  [leaderboard, adjustSearch]);

  function applyAdjustment() {
    if (!adjustTarget || !adjustAmount || !adjustReason.trim()) return;
    const delta = Number(adjustAmount);
    if (isNaN(delta)) return;

    setLeaderboard((prev) => prev.map((i) =>
      i.id === adjustTarget.id
        ? { ...i, totalPoints: i.totalPoints + delta, monthPoints: i.monthPoints + delta }
        : i
    ).sort((a, b) => b.totalPoints - a.totalPoints).map((i, idx) => ({ ...i, rank: idx + 1 })));

    setAuditLog((prev) => [{
      id:          Date.now(),
      internName:  adjustTarget.name,
      action:      adjustReason.trim(),
      points:      delta,
      date:        new Date().toISOString().slice(0, 10),
      awardedBy:   "Admin",
    }, ...prev]);

    showMsg(`✅ ${delta > 0 ? "+" : ""}${delta} points applied to ${adjustTarget.name}.`);
    setAdjTarget(null); setAdjSearch(""); setAdjAmount(""); setAdjReason(""); setDropdown(false);
  }

  function awardBadge() {
    if (!badgeTarget || !badgeIntern) return;
    showMsg(`🏅 ${badgeTarget.name} awarded to ${badgeIntern.name}.`);
    setBadgeTarget(null); setBadgeIntern(null); setBadgeSearch("");
  }

  const filteredAudit = useMemo(() =>
    auditSearch.trim()
      ? auditLog.filter((e) => e.internName.toLowerCase().includes(auditSearch.toLowerCase()))
      : auditLog,
  [auditLog, auditSearch]);

  const sorted = useMemo(() =>
    [...leaderboard].sort((a, b) =>
      view === "month" ? b.monthPoints - a.monthPoints : b.totalPoints - a.totalPoints
    ),
  [leaderboard, view]);

  const top3    = sorted.slice(0, 3);
  const rest    = sorted.slice(3);

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Gamification Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Points & Gamification</h1>
        <p className="mt-2 max-w-2xl text-[#F5F0E8]">Leaderboard, audit log, manual adjustments, and badge management.</p>
      </div>

      {toast && (
        <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4 text-sm text-[#F5F0E8]">
          <span>{toast}</span><button onClick={() => setToast("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]">Leaderboard</p>
            <h2 className="mt-1 text-xl font-semibold">Top Interns</h2>
          </div>
          <div className="flex gap-1 rounded-2xl border border-[#4B1E91] bg-[#0D0118] p-1">
            {(["month", "all"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition ${view === v ? "bg-[#4B1E91] text-white" : "text-[#F5F0E8]"}`}>
                {v === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Podium */}
        <div className="grid gap-4 mb-6 sm:grid-cols-3">
          {top3.map((intern, i) => (
            <div key={intern.id} className={`rounded-3xl border-2 ${PODIUM_STYLE[i]} bg-[#0D0118] p-5 text-center`}>
              <div className="text-2xl font-black text-[#F5F0E8] mb-2">#{i + 1}</div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4B1E91]/20 text-lg font-bold mx-auto mb-3">
                {intern.initials}
              </div>
              <p className="text-sm font-semibold">{intern.name}</p>
              <p className="text-xs text-[#F5F0E8] mt-0.5">{intern.department}</p>
              <p className="mt-3 text-2xl font-black">
                {view === "month" ? intern.monthPoints : intern.totalPoints}
              </p>
              <p className="text-xs text-[#F5F0E8]">pts</p>
              {intern.badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {intern.badges.map((b) => (
                    <span key={b} className="rounded-full bg-[#4B1E91]/20 px-2 py-0.5 text-xs text-[#D8B9FF]">{b}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rank 4-10 table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-[#F5F0E8]">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Intern</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-right">Month Pts</th>
                <th className="px-4 py-2 text-right">Total Pts</th>
                <th className="px-4 py-2 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((intern, i) => (
                <tr key={intern.id} className="bg-[#0D0118]">
                  <td className="px-4 py-3 rounded-l-2xl text-[#F5F0E8] font-bold">#{i + 4}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4B1E91]/20 text-xs font-bold">
                        {intern.initials}
                      </div>
                      <span className="font-medium">{intern.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#F5F0E8]">{intern.department}</td>
                  <td className="px-4 py-3 font-semibold text-right">{intern.monthPoints}</td>
                  <td className="px-4 py-3 text-right text-[#F5F0E8]">{intern.totalPoints}</td>
                  <td className="flex justify-center px-4 py-3 text-center rounded-r-2xl"><TrendIcon t={intern.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit log + manual adjustment */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Audit log */}
        <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]">History</p>
            <h2 className="mt-1 mb-4 text-xl font-semibold">Points Audit Log</h2>
          </div>
          <input type="text" placeholder="Filter by intern name…" value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
            className="w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-2.5 text-sm text-white outline-none focus:border-[#4B1E91] mb-4" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-xs uppercase tracking-[0.3em] text-[#F5F0E8]">
                  <th className="px-4 py-2 text-left">Intern</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-right">Pts</th>
                  <th className="px-4 py-2 text-left">By</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudit.map((ev) => (
                  <tr key={ev.id} className="bg-[#0D0118]">
                    <td className="px-4 py-3 font-medium rounded-l-2xl whitespace-nowrap">{ev.internName}</td>
                    <td className="px-4 py-3 text-[#F5F0E8] max-w-50 truncate">{ev.action}</td>
                    <td className={`px-4 py-3 text-right font-bold ${ev.points > 0 ? "text-green-400" : "text-red-400"}`}>
                      {ev.points > 0 ? `+${ev.points}` : ev.points}
                    </td>
                    <td className="px-4 py-3 rounded-r-2xl text-xs text-[#F5F0E8]">{ev.awardedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual adjustment */}
        <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]">Manual</p>
            <h2 className="mt-1 text-xl font-semibold">Adjust Points</h2>
          </div>

          {/* Intern search */}
          <div className="relative">
            <label className="text-sm text-[#F5F0E8]">
              Search Intern
              <input type="text" placeholder="Type intern name…"
                value={adjustTarget ? adjustTarget.name : adjustSearch}
                onFocus={() => { if (adjustTarget) { setAdjTarget(null); setAdjSearch(""); } setDropdown(true); }}
                onChange={(e) => { setAdjSearch(e.target.value); setAdjTarget(null); setDropdown(true); }}
                className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none focus:border-[#4B1E91]" />
            </label>
            {showDropdown && adjustDropdown.length > 0 && !adjustTarget && (
              <div className="absolute z-10 mt-1 w-full rounded-2xl border border-[#4B1E91] bg-[#12022A] shadow-lg">
                {adjustDropdown.map((i) => (
                  <button key={i.id} onClick={() => { setAdjTarget(i); setAdjSearch(i.name); setDropdown(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#1E0A4A] transition flex items-center justify-between">
                    <span>{i.name}</span>
                    <span className="text-xs text-[#F5F0E8]">{i.totalPoints} pts</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="block text-sm text-[#F5F0E8]">
            Points (use negative for deduction)
            <input type="number" placeholder="e.g. 50 or -20"
              value={adjustAmount} onChange={(e) => setAdjAmount(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none focus:border-[#4B1E91]" />
          </label>

          <label className="block text-sm text-[#F5F0E8]">
            Reason (required for audit trail)
            <textarea rows={3} placeholder="e.g. Exceptional mentor feedback"
              value={adjustReason} onChange={(e) => setAdjReason(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none focus:border-[#4B1E91] resize-none" />
          </label>

          <button onClick={applyAdjustment}
            disabled={!adjustTarget || !adjustAmount || !adjustReason.trim()}
            className="w-full rounded-2xl bg-[#4B1E91] py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3d1778] transition">
            Apply Adjustment
          </button>
        </div>
      </div>

      {/* Points rules summary */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]">Rules</p>
            <h2 className="mt-1 text-xl font-semibold">Points Rules Summary</h2>
          </div>
          <Link to="/admin/settings" className="text-sm text-[#4B1E91] hover:text-[#F5F0E8] transition">
            Edit Rules →
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {RULES.map((r) => (
            <div key={r.action} className="rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[#F5F0E8]">{r.action}</span>
              <span className={`font-bold text-sm ${r.points > 0 ? "text-green-400" : "text-red-400"}`}>
                {r.points > 0 ? `+${r.points}` : r.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]">Badges</p>
          <h2 className="mt-1 mb-5 text-xl font-semibold">Badge Management</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => (
            <div key={b.id} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4 space-y-2">
              <div className="text-3xl">{b.emoji}</div>
              <p className="text-sm font-semibold">{b.name}</p>
              <p className="text-xs text-[#F5F0E8] leading-relaxed">{b.description}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="rounded-full bg-[#4B1E91]/15 px-2 py-0.5 text-xs text-[#D8B9FF]">{b.timesAwarded} awarded</span>
                <button onClick={() => { setBadgeTarget(b); setBadgeSearch(""); setBadgeIntern(null); }}
                  className="rounded-xl bg-[#4B1E91]/20 px-3 py-1 text-xs text-[#D8B9FF] hover:bg-[#4B1E91]/40 transition">
                  Award
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Award badge modal */}
      {badgeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold">Award {badgeTarget.emoji} {badgeTarget.name}</h2>
              <button onClick={() => setBadgeTarget(null)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <label className="block text-sm text-[#F5F0E8]">
              Search Intern
              <input type="text" placeholder="Type intern name…" value={badgeSearch}
                onChange={(e) => { setBadgeSearch(e.target.value); setBadgeIntern(null); }}
                className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none focus:border-[#4B1E91]" />
            </label>
            {badgeSearch.trim() && !badgeIntern && (
              <div className="mt-2 rounded-2xl border border-[#4B1E91] bg-[#12022A]">
                {leaderboard.filter((i) => i.name.toLowerCase().includes(badgeSearch.toLowerCase())).map((i) => (
                  <button key={i.id} onClick={() => { setBadgeIntern(i); setBadgeSearch(i.name); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#1E0A4A] transition">
                    {i.name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={awardBadge} disabled={!badgeIntern}
                className="flex-1 rounded-2xl bg-[#4B1E91] py-3 text-sm font-semibold text-white disabled:opacity-50">
                Award Badge
              </button>
              <button onClick={() => setBadgeTarget(null)}
                className="flex-1 rounded-2xl border border-[#4B1E91] py-3 text-sm text-[#F5F0E8]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationAdmin;
