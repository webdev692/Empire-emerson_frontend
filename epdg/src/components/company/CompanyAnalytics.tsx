import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Department {
  id: number;
  name: string;
  internCount: number;
  avgCompletion: number;
  avgOnTime: number;
}

interface WeekData {
  week: string;
  tasks: number;
}

interface InternPerformance {
  rank: number;
  name: string;
  initials: string;
  department: string;
  tasksDone: number;
  onTimePercent: number;
  points: number;
  trend: "up" | "down";
  atRisk: boolean;
  riskReason: string;
}

// ─── Mock Data — Step 1 ───────────────────────────────────────────────────────

// 3 departments
const mockDepartments: Department[] = [
  {
    id: 1,
    name: "Frontend",
    internCount: 3,
    avgCompletion: 87,
    avgOnTime: 82,
  },
  {
    id: 2,
    name: "Backend",
    internCount: 3,
    avgCompletion: 79,
    avgOnTime: 75,
  },
  {
    id: 3,
    name: "UX/UI",
    internCount: 2,
    avgCompletion: 91,
    avgOnTime: 88,
  },
];

// 4 weeks of task counts
const mockWeeklyTasks: WeekData[] = [
  { week: "Week 1", tasks: 14 },
  { week: "Week 2", tasks: 21 },
  { week: "Week 3", tasks: 18 },
  { week: "Week 4", tasks: 9 },
];

// 8 intern performance rows — 2 marked at-risk
const mockPerformance: InternPerformance[] = [
  {
    rank: 1,
    name: "Amara Osei",
    initials: "AO",
    department: "Frontend",
    tasksDone: 18,
    onTimePercent: 94,
    points: 920,
    trend: "up",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 2,
    name: "Cynthia Achieng",
    initials: "CA",
    department: "UX/UI",
    tasksDone: 16,
    onTimePercent: 88,
    points: 860,
    trend: "up",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 3,
    name: "Brian Mwangi",
    initials: "BM",
    department: "Backend",
    tasksDone: 15,
    onTimePercent: 80,
    points: 800,
    trend: "up",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 4,
    name: "Faith Njeri",
    initials: "FN",
    department: "UX/UI",
    tasksDone: 14,
    onTimePercent: 79,
    points: 740,
    trend: "down",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 5,
    name: "Kevin Odhiambo",
    initials: "KO",
    department: "Frontend",
    tasksDone: 12,
    onTimePercent: 72,
    points: 680,
    trend: "up",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 6,
    name: "Grace Wambua",
    initials: "GW",
    department: "Backend",
    tasksDone: 10,
    onTimePercent: 65,
    points: 580,
    trend: "down",
    atRisk: false,
    riskReason: "",
  },
  {
    rank: 7,
    name: "Daniel Kipchoge",
    initials: "DK",
    department: "Backend",
    tasksDone: 7,
    onTimePercent: 48,
    points: 380,
    trend: "down",
    atRisk: true,
    riskReason: "Low task completion (48% on-time). No sessions in 2 weeks.",
  },
  {
    rank: 8,
    name: "Lilian Akinyi",
    initials: "LA",
    department: "Frontend",
    tasksDone: 5,
    onTimePercent: 40,
    points: 260,
    trend: "down",
    atRisk: true,
    riskReason:
      "Missed 3 consecutive deadlines. No mentor feedback submitted.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarColor = (initials: string): string => {
  const colors = [
    "bg-[#7C4FC4]",
    "bg-[#22C55E]/80",
    "bg-[#F59E0B]/80",
    "bg-[#EF4444]/80",
  ];
  return colors[initials.charCodeAt(0) % colors.length];
};

const deptTag = (dept: string): string => {
  switch (dept) {
    case "Frontend":
      return "bg-[#7C4FC4]/20 text-[#7C4FC4] border border-[#7C4FC4]/30";
    case "Backend":
      return "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30";
    case "UX/UI":
      return "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30";
    default:
      return "bg-[#3A1D73] text-[#A78BCC]";
  }
};

const rowBg = (intern: InternPerformance): string => {
  if (intern.rank === 1) return "bg-[#F59E0B]/10";
  if (intern.atRisk) return "bg-[#EF4444]/10";
  return "";
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompanyAnalytics() {
  // State for Send Reminder tracking
  const [sentReminders, setSentReminders] = useState<number[]>([]);

  const handleSendReminder = (rank: number) => {
    setSentReminders((prev) => [...prev, rank]);
  };

  // Derived values for bar chart
  const maxTasks = Math.max(...mockWeeklyTasks.map((w) => w.tasks));
  const atRiskInterns = mockPerformance.filter((i) => i.atRisk);

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress & Analytics</h1>
        <p className="text-[#A78BCC] text-sm mt-1">
          Cohort performance overview across all departments
        </p>
      </div>

      {/* ── Step 2: Department Overview Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {mockDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">{dept.name}</h2>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${deptTag(dept.name)}`}
              >
                {dept.internCount} interns
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {/* Avg Completion */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A78BCC]">Avg Completion</span>
                  <span className="text-white font-medium">
                    {dept.avgCompletion}%
                  </span>
                </div>
                <div className="w-full bg-[#0D0618] rounded-full h-1.5">
                  <div
                    className="bg-[#7C4FC4] h-1.5 rounded-full"
                    style={{ width: `${dept.avgCompletion}%` }}
                  />
                </div>
              </div>
              {/* Avg On-Time */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A78BCC]">Avg On-Time</span>
                  <span className="text-white font-medium">
                    {dept.avgOnTime}%
                  </span>
                </div>
                <div className="w-full bg-[#0D0618] rounded-full h-1.5">
                  <div
                    className="bg-[#22C55E] h-1.5 rounded-full"
                    style={{ width: `${dept.avgOnTime}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Step 2: CSS Bar Chart — cohort tasks per week (no library) ─── */}
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <div className="mb-4">
          <h2 className="text-white font-bold text-base">
            Cohort Tasks Per Week
          </h2>
          <p className="text-[#A78BCC] text-xs mt-0.5">
            Week 4 is in progress
          </p>
        </div>
        {/* Bar chart: flex items-end, bars with height from data */}
        <div className="flex items-end gap-4 h-40">
          {mockWeeklyTasks.map((weekData, idx) => {
            const heightPct = Math.round((weekData.tasks / maxTasks) * 100);
            const isCurrentWeek = idx === mockWeeklyTasks.length - 1;
            return (
              <div
                key={weekData.week}
                className="flex flex-col items-center flex-1 h-full justify-end"
              >
                {/* Task count above bar */}
                <span className="text-white text-xs font-medium mb-1">
                  {weekData.tasks}
                </span>
                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg bg-[#7C4FC4] transition-all ${
                    isCurrentWeek ? "opacity-60" : ""
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                {/* Label below */}
                <span className="text-[#A78BCC] text-xs mt-2">
                  {weekData.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step 2: Intern Performance Table ───────────────────────────── */}
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl mb-6 overflow-hidden">
        <div className="p-5 border-b border-[#3A1D73]">
          <h2 className="text-white font-bold text-base">
            Intern Performance
          </h2>
          <p className="text-[#A78BCC] text-xs mt-0.5">
            ↑ trend up this week &nbsp;·&nbsp; ↓ trend down this week
          </p>
        </div>
        {/* Horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#3A1D73]">
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Rank
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Name
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Dept
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Tasks Done
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  On-Time %
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Points
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPerformance.map((intern) => (
                <tr
                  key={intern.rank}
                  className={`border-b border-[#3A1D73] last:border-b-0 ${rowBg(intern)}`}
                >
                  {/* Rank */}
                  <td className="px-5 py-3">
                    <span className="text-[#A78BCC] text-sm font-medium">
                      {intern.rank === 1 ? "🥇" : `#${intern.rank}`}
                    </span>
                  </td>
                  {/* Name + avatar */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(intern.initials)}`}
                      >
                        {intern.initials}
                      </div>
                      <span className="text-white text-sm font-medium whitespace-nowrap">
                        {intern.name}
                      </span>
                    </div>
                  </td>
                  {/* Dept tag */}
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptTag(intern.department)}`}
                    >
                      {intern.department}
                    </span>
                  </td>
                  {/* Tasks done */}
                  <td className="px-5 py-3">
                    <span className="text-white text-sm">{intern.tasksDone}</span>
                  </td>
                  {/* On-time % */}
                  <td className="px-5 py-3">
                    <span
                      className={`text-sm font-medium ${
                        intern.onTimePercent >= 70
                          ? "text-[#22C55E]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {intern.onTimePercent}%
                    </span>
                  </td>
                  {/* Points */}
                  <td className="px-5 py-3">
                    <span className="text-white text-sm">{intern.points}</span>
                  </td>
                  {/* Trend arrow */}
                  <td className="px-5 py-3">
                    <span
                      className={`text-base font-bold ${
                        intern.trend === "up"
                          ? "text-[#22C55E]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {intern.trend === "up" ? "↑" : "↓"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Step 2: At-Risk Interns Section ────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          ⚠️ At-Risk Interns
        </h2>
        <div className="bg-[#1A0D35] border border-[#EF4444]/50 rounded-2xl overflow-hidden">
          {atRiskInterns.map((intern, idx) => (
            <div
              key={intern.rank}
              className={`p-5 ${
                idx < atRiskInterns.length - 1
                  ? "border-b border-[#EF4444]/20"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: avatar + name + issue */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(intern.initials)}`}
                  >
                    {intern.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-semibold text-sm">
                        {intern.name}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptTag(intern.department)}`}
                      >
                        {intern.department}
                      </span>
                    </div>
                    <p className="text-[#EF4444] text-xs">{intern.riskReason}</p>
                  </div>
                </div>
                {/* Send Reminder button */}
                {sentReminders.includes(intern.rank) ? (
                  <span className="self-start sm:self-auto text-xs text-[#22C55E] font-medium px-4 py-2 rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 whitespace-nowrap">
                    Reminder Sent ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendReminder(intern.rank)}
                    className="self-start sm:self-auto text-xs font-medium px-4 py-2 rounded-xl border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors whitespace-nowrap"
                  >
                    Send Reminder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
