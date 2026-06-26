import React, { useState, useEffect } from "react";
import api from "../lib/axios";

interface RoadmapWeek {
  id: number;
  week_number: number;
  title: string;
  description: string;
  skills: string[];
  status: "completed" | "current" | "locked";
  completed_at: string | null;
}

interface RoadmapData {
  weeks: RoadmapWeek[];
  completion_pct: number;
  current_week: number;
  total_weeks: number;
}

const Roadmap: React.FC = () => {
  const [data, setData]         = useState<RoadmapData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: RoadmapData }>("/api/intern/roadmap")
      .then(r => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="p-8 text-[#F5F0E8] text-center">
      <p>Could not load roadmap. Please try again.</p>
    </div>
  );

  const visibleWeeks = collapsed ? data.weeks.slice(0, 5) : data.weeks;
  const hiddenCount  = data.weeks.length - 5;

  // Skills summary buckets
  const gainedSkills    = data.weeks.filter(w => w.status === "completed").flatMap(w => w.skills).slice(0, 3);
  const progressSkills  = data.weeks.filter(w => w.status === "current").flatMap(w => w.skills).slice(0, 3);
  const upcomingSkills  = data.weeks.filter(w => w.status === "locked").flatMap(w => w.skills).slice(0, 3);

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Internship Roadmap</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          {data.total_weeks}-week programme <span className="mx-1.5">·</span> Week {data.current_week} of {data.total_weeks} active milestones
        </p>
        <div className="mt-6 bg-[#1E0A4A] border border-[#4B1E91] p-4 rounded-2xl space-y-2">
          <div className="bg-[#0D0118] rounded-full h-3 w-full overflow-hidden">
            <div className="bg-[#4B1E91] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${data.completion_pct}%` }} />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-[#F5F0E8]">
            <span>Overall Program Completion</span>
            <span>{data.completion_pct}% Completed</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl space-y-1 relative">
        {visibleWeeks.map((week, index) => {
          const isDone    = week.status === "completed";
          const isCurrent = week.status === "current";

          let circleStyle = "bg-[#4B1E91] text-[#F5F0E8] border-[#4B1E91]";
          let cardStyle   = "border-[#4B1E91] opacity-50";
          if (isDone)    { circleStyle = "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]"; cardStyle = "border-[#4B1E91]/40 opacity-70"; }
          if (isCurrent) { circleStyle = "bg-[#4B1E91] text-white border-[#4B1E91] shadow-md shadow-[#4B1E91]/30 animate-pulse"; cardStyle = "border-[#4B1E91] bg-[#1E0A4A]"; }

          return (
            <div key={week.id} className="flex flex-col items-start">
              <div className="flex items-start gap-4 w-full">
                <div className="flex flex-col items-center shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${circleStyle}`}>
                    {isDone ? "✓" : week.week_number}
                  </div>
                </div>
                <div className={`flex-1 bg-[#1E0A4A] border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all ${cardStyle}`}>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#F5F0E8] tracking-wider">
                        Week {week.week_number}
                      </span>
                      {isCurrent && (
                        <span className="bg-[#4B1E91]/20 text-[#F5F0E8] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#4B1E91]/30">
                          Active Phase
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{week.title}</h3>
                    <p className="text-xs text-[#F5F0E8] leading-relaxed text-justify">{week.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#4B1E91]/40 mt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {week.skills.map((skill, sIdx) => (
                        <span key={sIdx} className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${
                          isDone ? "bg-[#22C55E]/5 text-[#22C55E] border-[#22C55E]/10" : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91]"
                        }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {index < visibleWeeks.length - 1 && (
                <div className="w-0.5 h-8 bg-[#4B1E91] ml-[1.1875rem] my-1" />
              )}
            </div>
          );
        })}
      </div>

      {collapsed && hiddenCount > 0 && (
        <div className="max-w-3xl ml-14 mt-4 bg-[#1E0A4A]/40 border border-dashed border-[#4B1E91] p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-tight">Weeks 6 – {data.total_weeks} Program Lanes</h4>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5 truncate">{hiddenCount} upcoming milestone blocks are currently hidden</p>
          </div>
          <button onClick={() => setCollapsed(false)}
            className="bg-[#1E0A4A] border border-[#4B1E91] text-white font-mono text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl hover:border-[#4B1E91] transition-all whitespace-nowrap">
            Show All Weeks
          </button>
        </div>
      )}

      <section className="max-w-3xl mt-8 bg-[#1E0A4A] border border-[#4B1E91] p-5 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Skills You Will Gain</h2>
          <p className="text-[11px] text-[#F5F0E8] mt-0.5">Categorized structural matrix overview of the total technical curriculum</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">Already Gained</span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              {gainedSkills.length > 0 ? gainedSkills.map((s, i) => <span key={i}>• {s}</span>) : <span className="text-[#F5F0E8]/40">None yet</span>}
            </div>
          </div>
          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4B1E91] bg-[#4B1E91]/20 px-2 py-0.5 rounded">In Progress</span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              {progressSkills.length > 0 ? progressSkills.map((s, i) => <span key={i}>• {s}</span>) : <span className="text-[#F5F0E8]/40">None active</span>}
            </div>
          </div>
          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">Upcoming Lanes</span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              {upcomingSkills.length > 0 ? upcomingSkills.map((s, i) => <span key={i}>• {s}</span>) : <span className="text-[#F5F0E8]/40">—</span>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
