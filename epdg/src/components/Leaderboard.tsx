import React, { useState } from "react";

interface InternItem {
  name: string;
  dept: string;
  points: number;
  rank: number;
  isYou: boolean;
  initials: string;
}

const MOCK_INTERNS_DATA: InternItem[] = [
  {
    name: "Sarah Kimani",
    dept: "Frontend",
    points: 480,
    rank: 1,
    isYou: false,
    initials: "SK",
  },
  {
    name: "Kevin Njoro",
    dept: "Backend",
    points: 420,
    rank: 2,
    isYou: false,
    initials: "KN",
  },
  {
    name: "Amara Osei",
    dept: "UI/UX Design",
    points: 390,
    rank: 3,
    isYou: false,
    initials: "AO",
  },
  {
    name: "Brian Mwangi",
    dept: "Frontend",
    points: 340,
    rank: 4,
    isYou: true,
    initials: "HJ",
  },
  {
    name: "David Ndlovu",
    dept: "Marketing",
    points: 310,
    rank: 5,
    isYou: false,
    initials: "DN",
  },
  {
    name: "Amina Yusuf",
    dept: "Backend",
    points: 290,
    rank: 6,
    isYou: false,
    initials: "AY",
  },
  {
    name: "Tunde Bakare",
    dept: "UI/UX Design",
    points: 260,
    rank: 7,
    isYou: false,
    initials: "TB",
  },
  {
    name: "Chipo Moyo",
    dept: "Frontend",
    points: 240,
    rank: 8,
    isYou: false,
    initials: "CM",
  },
  {
    name: "Kwame Mensah",
    dept: "Marketing",
    points: 210,
    rank: 9,
    isYou: false,
    initials: "KM",
  },
  {
    name: "Zuri Awazi",
    dept: "Backend",
    points: 180,
    rank: 10,
    isYou: false,
    initials: "ZA",
  },
];

const MOCK_BADGES_DATA = [
  {
    name: "First Push",
    emoji: "🚀",
    description: "Committed code to a main remote repository lane branch.",
    earned: true,
  },
  {
    name: "On Fire",
    emoji: "🔥",
    description:
      "Maintained an active operational assignment streak for 5 days.",
    earned: true,
  },
  {
    name: "Bug Hunter",
    emoji: "🐛",
    description:
      "Resolved structural responsive layout compilation bottlenecks.",
    earned: true,
  },
  {
    name: "Architect Pass",
    emoji: "👑",
    description:
      "Achieved a perfect score review confirmation from internal architects.",
    earned: false,
  },
];

const MOCK_POINTS_BREAKDOWN = [
  { label: "Tasks", points: 200, color: "bg-[#4B1E91]" },
  { label: "Streak", points: 80, color: "bg-[#F59E0B]" },
  { label: "Syncs", points: 60, color: "bg-[#22C55E]" },
];

const Leaderboard: React.FC = () => {
  const [view, setView] = useState<"week" | "alltime">("week");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const totalBreakdownPoints = MOCK_POINTS_BREAKDOWN.reduce(
    (acc, curr) => acc + curr.points,
    0,
  );

  const filteredInterns = MOCK_INTERNS_DATA.filter((intern) => {
    if (deptFilter === "all") return true;
    return intern.dept === deptFilter;
  });

  const podium1 = MOCK_INTERNS_DATA.find((i) => i.rank === 1);
  const podium2 = MOCK_INTERNS_DATA.find((i) => i.rank === 2);
  const podium3 = MOCK_INTERNS_DATA.find((i) => i.rank === 3);

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Cohort Leaderboard
          </h1>
          <p className="text-xs text-[#F5F0E8] mt-1">
            Review performance distributions, track active point metrics, and
            evaluate ranking positions
          </p>
        </div>

        <div className="flex bg-[#1E0A4A] border border-[#4B1E91] p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors ${
              view === "week"
                ? "bg-[#4B1E91] text-white"
                : "text-[#F5F0E8] hover:text-white"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setView("alltime")}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors ${
              view === "alltime"
                ? "bg-[#4B1E91] text-white"
                : "text-[#F5F0E8] hover:text-white"
            }`}
          >
            All Time
          </button>
        </div>
      </header>

      <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="bg-[#4B1E91]/10 border border-[#4B1E91]/30 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] font-mono text-[#F5F0E8] uppercase tracking-wider block">
              Your Rank
            </span>
            <span className="text-2xl font-black text-[#4B1E91]">#4</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Brian Mwangi
            </h2>
            <p className="text-xs text-[#22C55E] font-mono font-bold mt-0.5">
              ▲ +2 positions improved
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="bg-[#4B1E91] rounded-full h-2 w-full overflow-hidden">
            <div
              className="bg-[#4B1E91] h-2 rounded-full"
              style={{ width: "85%" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#F5F0E8]">
            <span>340 pts total accumulative</span>
            <span className="text-white font-bold">
              +60 pts to reach #3 Amara
            </span>
          </div>
        </div>

        <div className="bg-[#0D0118] border border-[#4B1E91]/60 p-3 rounded-xl space-y-2">
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-neutral-800">
            {MOCK_POINTS_BREAKDOWN.map((segment, idx) => {
              const widthPct = (segment.points / totalBreakdownPoints) * 100;
              return (
                <div
                  key={idx}
                  className={`${segment.color} h-full transition-all`}
                  style={{ width: `${widthPct}%` }}
                  title={`${segment.label}: ${segment.points} pts`}
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center gap-2 text-[9px] font-mono text-[#F5F0E8]">
            {MOCK_POINTS_BREAKDOWN.map((segment, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${segment.color}`} />
                <span>
                  {segment.label} ({segment.points})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-8 bg-[#1E0A4A]/30 border border-dashed border-[#4B1E91] p-6 rounded-2xl">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] text-center mb-8">
          Cohort Top Performers Matrix
        </h3>

        <div className="flex items-end justify-center gap-3 max-w-md mx-auto h-48 select-none">
          {podium2 && (
            <div className="flex-1 flex flex-col items-center group cursor-default">
              <div className="w-12 h-12 rounded-full bg-[#1E0A4A] border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-sm mb-2 shadow-md relative">
                {podium2.initials}
                <span className="absolute -top-2 -right-1 text-xs">🥈</span>
              </div>
              <p className="text-xs font-bold text-white truncate max-w-20">
                {podium2.name}
              </p>
              <p className="text-[10px] font-mono text-[#F5F0E8] mb-2">
                {podium2.points} pts
              </p>
              <div className="w-full bg-[#1E0A4A] border border-[#4B1E91] border-b-0 rounded-t-xl h-20 flex items-center justify-center font-mono font-black text-xl text-[#F5F0E8]">
                #2
              </div>
            </div>
          )}

          {podium1 && (
            <div className="flex-1 flex flex-col items-center group cursor-default">
              <div className="w-14 h-14 rounded-full bg-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-base mb-2 shadow-lg shadow-[#4B1E91]/10 relative scale-110 border border-[#4B1E91]">
                {podium1.initials}
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">
                  👑
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate max-w-22.5 mt-1">
                {podium1.name}
              </p>
              <p className="text-[10px] font-mono text-[#F59E0B] font-bold mb-2">
                {podium1.points} pts
              </p>
              <div className="w-full bg-[#4B1E91]/20 border border-[#4B1E91] border-b-0 rounded-t-xl h-28 flex items-center justify-center font-mono font-black text-2xl text-[#F59E0B]">
                #1
              </div>
            </div>
          )}

          {podium3 && (
            <div className="flex-1 flex flex-col items-center group cursor-default">
              <div className="w-12 h-12 rounded-full bg-[#1E0A4A] border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-sm mb-2 shadow-md relative">
                {podium3.initials}
                <span className="absolute -top-2 -right-1 text-xs">🥉</span>
              </div>
              <p className="text-xs font-bold text-white truncate max-w-20">
                {podium3.name}
              </p>
              <p className="text-[10px] font-mono text-[#F5F0E8] mb-2">
                {podium3.points} pts
              </p>
              <div className="w-full bg-[#1E0A4A] border border-[#4B1E91] border-b-0 rounded-t-xl h-14 flex items-center justify-center font-mono font-black text-lg text-amber-700">
                #3
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E0A4A] border border-[#4B1E91] p-3 rounded-2xl">
            <span className="text-xs font-bold px-1">Roster Standings</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All Sectors" },
                { id: "Frontend", label: "Frontend" },
                { id: "Backend", label: "Backend" },
                { id: "UI/UX Design", label: "UI/UX" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDeptFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                    deptFilter === filter.id
                      ? "bg-[#4B1E91] text-white"
                      : "bg-[#0D0118] text-[#F5F0E8] border border-[#4B1E91] hover:border-[#4B1E91]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#4B1E91] bg-[#1E0A4A] rounded-2xl overflow-hidden">
            <div className="flex flex-col divide-y divide-[#4B1E91]/40">
              {filteredInterns.map((intern) => {
                let rankColor = "text-[#F5F0E8]";
                if (intern.rank === 1) rankColor = "text-[#F59E0B] font-bold";
                if (intern.rank === 2) rankColor = "text-neutral-300 font-bold";
                if (intern.rank === 3) rankColor = "text-amber-700 font-bold";

                return (
                  <div
                    key={intern.rank}
                    className={`flex items-center justify-between p-3.5 transition-colors ${
                      intern.isYou
                        ? "bg-[#4B1E91]/20 border-y border-[#4B1E91]/40"
                        : "hover:bg-[#0D0118]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-6 text-center font-mono text-sm ${rankColor}`}
                      >
                        {intern.rank}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-[#0D0118] border border-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {intern.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white tracking-tight truncate">
                            {intern.name}
                          </p>
                          {intern.isYou && (
                            <span className="bg-[#4B1E91] text-white text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#F5F0E8] tracking-wide uppercase font-mono mt-0.5">
                          {intern.dept}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-white font-bold whitespace-nowrap bg-[#0D0118] border border-[#4B1E91] px-2.5 py-1 rounded-lg">
                      {intern.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Earned Achievements
            </h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">
              Chronological credential milestones checklist
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_BADGES_DATA.map((badge, idx) => (
              <div
                key={idx}
                className={`border bg-[#0D0118] p-3 rounded-xl flex gap-3 items-start transition-all ${
                  badge.earned
                    ? "border-[#4B1E91]"
                    : "border-neutral-800 opacity-40 select-none"
                }`}
              >
                <div className="text-xl bg-[#1E0A4A] p-2 border border-[#4B1E91]/60 rounded-xl shrink-0">
                  {badge.emoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      {badge.name}
                    </h4>
                    {!badge.earned && (
                      <span className="text-[8px] font-mono text-neutral-400 bg-neutral-800 px-1 rounded uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#F5F0E8] leading-relaxed text-justify mt-0.5">
                    {badge.description}
                  </p>
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
