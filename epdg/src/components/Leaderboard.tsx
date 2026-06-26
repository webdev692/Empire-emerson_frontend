import React, { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

interface InternItem {
  id: number;
  name: string;
  department: string;
  total_points: number;
  rank: number;
}

interface MyRank {
  rank: number;
  total_points: number;
  breakdown: { category: string; points: number }[];
}

interface Badge {
  id: number;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  awarded_at: string | null;
}

const Leaderboard: React.FC = () => {
  const me = useAuthStore(s => s.user);
  const [interns, setInterns]   = useState<InternItem[]>([]);
  const [myRank, setMyRank]     = useState<MyRank | null>(null);
  const [badges, setBadges]     = useState<Badge[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<"week" | "alltime">("alltime");
  const [deptFilter, setDeptFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      api.get<{ success: boolean; data: InternItem[] }>(`/api/intern/leaderboard?period=${view}`),
      api.get<{ success: boolean; data: MyRank }>(`/api/intern/leaderboard/me?period=${view}`),
      api.get<{ success: boolean; data: Badge[] }>("/api/intern/badges"),
    ]).then(([lb, mr, bg]) => {
      if (lb.status === "fulfilled") setInterns(lb.value.data.data ?? []);
      if (mr.status === "fulfilled") setMyRank(mr.value.data.data ?? null);
      if (bg.status === "fulfilled") setBadges(bg.value.data.data ?? []);
    }).finally(() => setLoading(false));
  }, [view]);

  const departments = useMemo(() => ["all", ...new Set(interns.map(i => i.department))], [interns]);
  const filtered    = useMemo(() =>
    deptFilter === "all" ? interns : interns.filter(i => i.department === deptFilter),
  [interns, deptFilter]);

  const podium1 = interns.find(i => i.rank === 1);
  const podium2 = interns.find(i => i.rank === 2);
  const podium3 = interns.find(i => i.rank === 3);

  const totalBreakdown = myRank?.breakdown.reduce((a, b) => a + b.points, 0) ?? 1;
  const colourFor = (cat: string) =>
    cat === "Tasks" ? "bg-[#4B1E91]" : cat === "Streak" ? "bg-[#F59E0B]" : "bg-[#22C55E]";

  const initials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const nextRankIntern = interns.find(i => i.rank === (myRank?.rank ?? 0) - 1);
  const ptsToNext = nextRankIntern ? nextRankIntern.total_points - (myRank?.total_points ?? 0) : 0;

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cohort Leaderboard</h1>
          <p className="text-xs text-[#F5F0E8] mt-1">Review performance distributions and ranking positions</p>
        </div>
        <div className="flex bg-[#1E0A4A] border border-[#4B1E91] p-1 rounded-xl self-start sm:self-auto">
          {(["week", "alltime"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors ${
                view === v ? "bg-[#4B1E91] text-white" : "text-[#F5F0E8] hover:text-white"
              }`}>
              {v === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>
      </header>

      {/* My stats */}
      {myRank && (
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#4B1E91]/10 border border-[#4B1E91]/30 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#F5F0E8] uppercase tracking-wider block">Your Rank</span>
              <span className="text-2xl font-black text-[#4B1E91]">#{myRank.rank}</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{me?.name}</h2>
              <p className="text-xs text-[#22C55E] font-mono font-bold mt-0.5">{myRank.total_points} pts</p>
            </div>
          </div>

          {ptsToNext > 0 && (
            <div className="space-y-1.5">
              <div className="bg-[#0D0118] rounded-full h-2 w-full overflow-hidden">
                <div className="bg-[#4B1E91] h-2 rounded-full" style={{ width: `${Math.min(100, 100 - (ptsToNext / (nextRankIntern?.total_points ?? 1)) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#F5F0E8]">
                <span>{myRank.total_points} pts total</span>
                <span className="text-white font-bold">+{ptsToNext} pts to #{myRank.rank - 1}</span>
              </div>
            </div>
          )}

          {myRank.breakdown.length > 0 && (
            <div className="bg-[#0D0118] border border-[#4B1E91]/60 p-3 rounded-xl space-y-2">
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-neutral-800">
                {myRank.breakdown.map((seg, i) => (
                  <div key={i} className={`${colourFor(seg.category)} h-full transition-all`}
                    style={{ width: `${(seg.points / totalBreakdown) * 100}%` }} />
                ))}
              </div>
              <div className="flex justify-between items-center gap-2 text-[9px] font-mono text-[#F5F0E8]">
                {myRank.breakdown.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${colourFor(seg.category)}`} />
                    <span>{seg.category} ({seg.points})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Podium */}
      {(podium1 || podium2 || podium3) && (
        <section className="mb-8 bg-[#1E0A4A]/30 border border-dashed border-[#4B1E91] p-6 rounded-2xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] text-center mb-8">Cohort Top Performers Matrix</h3>
          <div className="flex items-end justify-center gap-3 max-w-md mx-auto h-48 select-none">
            {podium2 && (
              <div className="flex-1 flex flex-col items-center cursor-default">
                <div className="w-12 h-12 rounded-full bg-[#1E0A4A] border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-sm mb-2 shadow-md relative">
                  {initials(podium2.name)}<span className="absolute -top-2 -right-1 text-xs">🥈</span>
                </div>
                <p className="text-xs font-bold text-white truncate max-w-20">{podium2.name}</p>
                <p className="text-[10px] font-mono text-[#F5F0E8] mb-2">{podium2.total_points} pts</p>
                <div className="w-full bg-[#1E0A4A] border border-[#4B1E91] border-b-0 rounded-t-xl h-20 flex items-center justify-center font-mono font-black text-xl text-[#F5F0E8]">#2</div>
              </div>
            )}
            {podium1 && (
              <div className="flex-1 flex flex-col items-center cursor-default">
                <div className="w-14 h-14 rounded-full bg-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-base mb-2 shadow-lg relative scale-110 border border-[#4B1E91]">
                  {initials(podium1.name)}<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">👑</span>
                </div>
                <p className="text-sm font-bold text-white truncate max-w-24 mt-1">{podium1.name}</p>
                <p className="text-[10px] font-mono text-[#F59E0B] font-bold mb-2">{podium1.total_points} pts</p>
                <div className="w-full bg-[#4B1E91]/20 border border-[#4B1E91] border-b-0 rounded-t-xl h-28 flex items-center justify-center font-mono font-black text-2xl text-[#F59E0B]">#1</div>
              </div>
            )}
            {podium3 && (
              <div className="flex-1 flex flex-col items-center cursor-default">
                <div className="w-12 h-12 rounded-full bg-[#1E0A4A] border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-sm mb-2 shadow-md relative">
                  {initials(podium3.name)}<span className="absolute -top-2 -right-1 text-xs">🥉</span>
                </div>
                <p className="text-xs font-bold text-white truncate max-w-20">{podium3.name}</p>
                <p className="text-[10px] font-mono text-[#F5F0E8] mb-2">{podium3.total_points} pts</p>
                <div className="w-full bg-[#1E0A4A] border border-[#4B1E91] border-b-0 rounded-t-xl h-14 flex items-center justify-center font-mono font-black text-lg text-amber-700">#3</div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Rankings table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E0A4A] border border-[#4B1E91] p-3 rounded-2xl">
            <span className="text-xs font-bold px-1">Roster Standings</span>
            <div className="flex flex-wrap gap-1">
              {departments.slice(0, 5).map(dept => (
                <button key={dept} onClick={() => setDeptFilter(dept)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                    deptFilter === dept ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8] border border-[#4B1E91] hover:border-[#4B1E91]"
                  }`}>
                  {dept === "all" ? "All Sectors" : dept}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-[#4B1E91] bg-[#1E0A4A] rounded-2xl overflow-hidden">
            <div className="flex flex-col divide-y divide-[#4B1E91]/40">
              {filtered.length === 0 ? (
                <p className="text-center text-[#F5F0E8] text-xs py-8">No interns found.</p>
              ) : filtered.map(intern => {
                const isMe = intern.id === me?.id;
                let rankColor = "text-[#F5F0E8]";
                if (intern.rank === 1) rankColor = "text-[#F59E0B] font-bold";
                if (intern.rank === 2) rankColor = "text-neutral-300 font-bold";
                if (intern.rank === 3) rankColor = "text-amber-700 font-bold";
                return (
                  <div key={intern.id} className={`flex items-center justify-between p-3.5 transition-colors ${
                    isMe ? "bg-[#4B1E91]/20 border-y border-[#4B1E91]/40" : "hover:bg-[#0D0118]/30"
                  }`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`w-6 text-center font-mono text-sm ${rankColor}`}>{intern.rank}</span>
                      <div className="w-8 h-8 rounded-xl bg-[#0D0118] border border-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {initials(intern.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white tracking-tight truncate">{intern.name}</p>
                          {isMe && <span className="bg-[#4B1E91] text-white text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">YOU</span>}
                        </div>
                        <p className="text-[10px] text-[#F5F0E8] tracking-wide uppercase font-mono mt-0.5">{intern.department}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white font-bold whitespace-nowrap bg-[#0D0118] border border-[#4B1E91] px-2.5 py-1 rounded-lg">
                      {intern.total_points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Earned Achievements</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Chronological credential milestones checklist</p>
          </div>
          <div className="space-y-3">
            {badges.map(badge => (
              <div key={badge.id} className={`border bg-[#0D0118] p-3 rounded-xl flex gap-3 items-start transition-all ${
                badge.earned ? "border-[#4B1E91]" : "border-neutral-800 opacity-40 select-none"
              }`}>
                <div className="text-xl bg-[#1E0A4A] p-2 border border-[#4B1E91]/60 rounded-xl shrink-0">{badge.emoji}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white tracking-tight">{badge.name}</h4>
                    {!badge.earned && (
                      <span className="text-[8px] font-mono text-neutral-400 bg-neutral-800 px-1 rounded uppercase tracking-wider">Locked</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#F5F0E8] leading-relaxed mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
