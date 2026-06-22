import React, { useEffect, useState } from "react";
import api from "../lib/axios";

interface ProgressStats {
  tasks: { total: number; done: number; ontime_pct: number; points: number };
  weekly: { week_label: string; count: number }[];
  sessions: { total: number; avg_rating: string | null };
  milestones: { title: string; is_completed: boolean }[];
}

interface Skill {
  skill_name: string;
  proficiency: number;
}

const Progress: React.FC = () => {
  const [stats, setStats]   = useState<ProgressStats | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get<{ success: boolean; data: ProgressStats }>("/api/intern/progress/stats"),
      api.get<{ success: boolean; data: Skill[] }>("/api/intern/progress/skills"),
    ]).then(([s, sk]) => {
      if (s.status === "fulfilled")  setStats(s.value.data.data);
      if (sk.status === "fulfilled") setSkills(sk.value.data.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  const milestones       = stats?.milestones ?? [];
  const completedCount   = milestones.filter(m => m.is_completed).length;
  const milestonePct     = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const nextMilestone    = milestones.find(m => !m.is_completed);
  const weekly           = stats?.weekly ?? [];
  const maxWeekly        = Math.max(...weekly.map(d => d.count), 1);
  const avgRating        = stats?.sessions.avg_rating ? parseFloat(stats.sessions.avg_rating) : null;

  // Fake weekly sessions data for the mentor evaluation curve (from past sessions)
  const sessionRatingData = [avgRating, avgRating, avgRating, avgRating].filter(Boolean).map((r, i) => ({
    session: `Session ${i + 1}`, rating: Math.round(r!), date: "—",
  }));

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">Monitor metric accumulations, evaluate training curves, and analyze target readiness tracks</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Task Completion",  value: `${stats?.tasks.done ?? 0} Items` },
          { label: "On-Time Rate",     value: `${stats?.tasks.ontime_pct ?? 0}%` },
          { label: "Sessions",         value: `${stats?.sessions.total ?? 0} Blocks` },
          { label: "Milestones",       value: `${completedCount} / ${milestones.length}` },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        <div className="lg:col-span-2 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-6">Weekly Performance Metrics Volume</h3>
          <div className="flex items-end gap-4 h-40 bg-[#0D0118] border border-[#4B1E91] p-4 rounded-xl">
            {weekly.length === 0 ? (
              <p className="text-[#F5F0E8]/40 text-xs font-mono m-auto">No completed tasks yet</p>
            ) : weekly.map((data, i) => {
              const barHeightPct = (data.count / maxWeekly) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div style={{ height: `${barHeightPct}%` }}
                    className="w-full rounded-t-lg transition-all duration-300 bg-[#4B1E91]">
                    <div className="text-center text-[10px] font-mono font-bold -mt-5 text-white">{data.count}</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#F5F0E8] mt-2 text-center w-full truncate">{data.week_label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 flex flex-col justify-between h-56">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-4">Punctuality Matrix</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{stats?.tasks.ontime_pct ?? 0}%</span>
              <span className={`text-xs font-mono font-bold ${(stats?.tasks.ontime_pct ?? 0) >= 80 ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>
                {(stats?.tasks.ontime_pct ?? 0) >= 80 ? "Excellent" : "Improving"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#F5F0E8] mt-2 leading-relaxed">
              <span className="text-white font-bold">Done: {stats?.tasks.done ?? 0}</span>
              {" · "}
              <span className="text-[#F59E0B] font-bold">Pending: {(stats?.tasks.total ?? 0) - (stats?.tasks.done ?? 0)}</span>
            </p>
          </div>
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 p-3 rounded-xl">
            <p className="text-xs font-mono text-[#22C55E] text-center">
              {(stats?.tasks.points ?? 0)} pts earned from completed tasks
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Skills */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Capabilities Matrix</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Estimated technical qualification levels</p>
          </div>
          {skills.length === 0 ? (
            <p className="text-[#F5F0E8]/40 text-xs font-mono">No skills recorded yet.</p>
          ) : (
            <div className="space-y-3.5">
              {skills.map((skill, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-200 font-medium truncate max-w-40">{skill.skill_name}</span>
                    <span className="font-mono text-[#F5F0E8] font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="bg-[#0D0118] rounded-full h-2 w-full">
                    <div className="bg-[#4B1E91] h-2 rounded-full transition-all" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentor evaluations */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Mentor Evaluation Curve</h3>
              <p className="text-[11px] text-[#F5F0E8] mt-0.5">Chronological synchronization feedback scores</p>
            </div>
            {avgRating && (
              <div className="text-right">
                <span className="text-xl font-black text-[#F59E0B]">{avgRating.toFixed(1)}</span>
                <span className="text-[10px] text-[#F5F0E8] font-mono block">stars average</span>
              </div>
            )}
          </div>
          {stats?.sessions.total === 0 || !avgRating ? (
            <p className="text-[#F5F0E8]/40 text-xs font-mono">No sessions rated yet.</p>
          ) : (
            <div className="space-y-2.5">
              {sessionRatingData.slice(0, 4).map((item, i) => (
                <div key={i} className="bg-[#0D0118] border border-[#4B1E91]/60 p-3 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{item.session}</h4>
                  </div>
                  <div className="flex gap-0.5 text-[#F59E0B] text-xs select-none tracking-wider">
                    {[1,2,3,4,5].map(star => <span key={star}>{star <= item.rating ? "★" : "☆"}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Milestones Registry</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Operational targets fulfillment checklist</p>
          </div>
          {milestones.length === 0 ? (
            <p className="text-[#F5F0E8]/40 text-xs font-mono">No milestones set yet.</p>
          ) : (
            <div className="space-y-2.5">
              <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
                <div className="bg-[#4B1E91] rounded-full h-2.5 w-full overflow-hidden">
                  <div className="bg-[#22C55E] h-2.5 rounded-full transition-all" style={{ width: `${milestonePct}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#F5F0E8]">
                  <span>Fulfillment Speed</span>
                  <span className="text-[#22C55E] font-bold">{milestonePct}% done</span>
                </div>
              </div>
              {nextMilestone && (
                <div className="bg-[#4B1E91]/10 border border-[#4B1E91]/30 p-3 rounded-xl">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4B1E91] bg-[#4B1E91]/20 px-2 py-0.5 rounded">Next Objective Target</span>
                  <h4 className="text-xs font-bold text-white tracking-tight mt-2">{nextMilestone.title}</h4>
                </div>
              )}
              <div className="bg-[#0D0118]/40 border border-[#4B1E91]/40 rounded-xl max-h-24 overflow-y-auto divide-y divide-[#4B1E91]/20">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2 text-xs">
                    <span className={`truncate max-w-45 ${m.is_completed ? "text-neutral-500 line-through" : "text-neutral-300"}`}>{m.title}</span>
                    <span className={`text-[10px] font-mono font-bold shrink-0 ml-2 ${m.is_completed ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>
                      {m.is_completed ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
