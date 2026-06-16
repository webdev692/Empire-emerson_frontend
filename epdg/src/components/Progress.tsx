import React from "react";

const MOCK_WEEKLY_DATA = [
  { week: "Week 1", count: 2 },
  { week: "Week 2", count: 4 },
  { week: "Week 3", count: 3 },
  { week: "Week 4", count: 5 },
];

const MOCK_SKILLS_DATA = [
  { name: "React Systematics", percent: 90 },
  { name: "TypeScript Typings", percent: 85 },
  { name: "Tailwind Fluid UI", percent: 95 },
  { name: "State Optimizations", percent: 70 },
  { name: "Modular Architecture", percent: 75 },
  { name: "Data Operations", percent: 60 },
];

const MOCK_RATINGS_DATA = [
  { session: "Session 1", rating: 5, date: "May 15" },
  { session: "Session 2", rating: 4, date: "May 22" },
  { session: "Session 3", rating: 5, date: "May 28" },
  { session: "Session 4", rating: 4, date: "June 02" },
];

const MOCK_MILESTONES = [
  { title: "Workspace Environment Setup", completed: true },
  { title: "Security Protocols Integration", completed: true },
  { title: "Directory Structures Alignment", completed: true },
  { title: "Responsive Layout Architecture", completed: false },
  { title: "Compliance Audit Implementation", completed: false },
  { title: "State Persistence Deployment", completed: false },
  { title: "Mock-API Core Connection", completed: false },
  { title: "Advanced SVG Chart Framework", completed: false },
  { title: "Cross-Device Stress Audits", completed: false },
  { title: "Clean Code Refactoring Phase", completed: false },
  { title: "Peer Pull Request Validation", completed: false },
  { title: "Final Production Domain Launch", completed: false },
];

const Progress: React.FC = () => {
  const maxWeeklyCount = Math.max(...MOCK_WEEKLY_DATA.map((d) => d.count));
  const completedMilestones = MOCK_MILESTONES.filter((m) => m.completed).length;
  const milestonesPercentage = Math.round(
    (completedMilestones / MOCK_MILESTONES.length) * 100,
  );
  const nextMilestone = MOCK_MILESTONES.find((m) => !m.completed);

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Monitor metric accumulations, evaluate training curves, and analyze
          target readiness tracks
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Task Completion", value: "14 Items" },
          { label: "On-Time Rate", value: "87%" },
          { label: "Sessions", value: "4 Blocks" },
          {
            label: "Milestones",
            value: `${completedMilestones} / ${MOCK_MILESTONES.length}`,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        <div className="lg:col-span-2 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-6">
            Weekly Performance Metrics Volume
          </h3>
          <div className="flex items-end gap-4 h-40 bg-[#0D0118] border border-[#4B1E91] p-4 rounded-xl">
            {MOCK_WEEKLY_DATA.map((data) => {
              const barHeightPct = (data.count / maxWeeklyCount) * 100;
              return (
                <div
                  key={data.week}
                  className="flex-1 flex flex-col items-center h-full justify-end"
                >
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      data.week === "Week 4"
                        ? "bg-[#4B1E91]/60"
                        : "bg-[#4B1E91]"
                    }`}
                  >
                    <div className="text-center text-[10px] font-mono font-bold -mt-5 text-white">
                      {data.count}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#F5F0E8] mt-2 text-center w-full">
                    {data.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 flex flex-col justify-between h-56">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-4">
              Punctuality Matrix
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">87%</span>
              <span className="text-xs font-mono text-[#22C55E] font-bold">
                Excellent
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#F5F0E8] mt-2 leading-relaxed">
              Distribution breakdown:{" "}
              <span className="text-white font-bold">On time: 7</span> |{" "}
              <span className="text-[#EF4444] font-bold">Late: 1</span> |{" "}
              <span className="text-[#F59E0B] font-bold">Pending: 4</span>
            </p>
          </div>
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 p-3 rounded-xl">
            <p className="text-xs font-mono text-[#22C55E] text-center">
              📈 Better than 60% of your cohort
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Capabilities Matrix
            </h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">
              Estimated technical qualification levels
            </p>
          </div>

          <div className="space-y-3.5">
            {MOCK_SKILLS_DATA.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-200 font-medium truncate max-w-40">
                    {skill.name}
                  </span>
                  <span className="font-mono text-[#F5F0E8] font-bold">
                    {skill.percent}%
                  </span>
                </div>
                <div className="bg-[#4B1E91] rounded-full h-2 w-full relative">
                  <div
                    className="bg-[#4B1E91] h-2 rounded-full transition-all"
                    style={{ width: `${skill.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Mentor Evaluation Curve
              </h3>
              <p className="text-[11px] text-[#F5F0E8] mt-0.5">
                Chronological synchronization feedback scores
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-[#F59E0B]">4.5</span>
              <span className="text-[10px] text-[#F5F0E8] font-mono block">
                stars average
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {MOCK_RATINGS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0D0118] border border-[#4B1E91]/60 p-3 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {item.session}
                  </h4>
                  <p className="text-[10px] font-mono text-[#F5F0E8] mt-0.5">
                    Aligned: {item.date}
                  </p>
                </div>
                <div className="flex gap-0.5 text-[#F59E0B] text-xs select-none tracking-wider">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= item.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Milestones Registry
            </h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">
              Operational targets fulfillment checklist
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
              <div className="bg-[#4B1E91] rounded-full h-2.5 w-full overflow-hidden">
                <div
                  className="bg-[#22C55E] h-2.5 rounded-full transition-all"
                  style={{ width: `${milestonesPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-[#F5F0E8]">
                <span>Fulfillment Speed</span>
                <span className="text-[#22C55E] font-bold">
                  {milestonesPercentage}% done
                </span>
              </div>
            </div>

            {nextMilestone && (
              <div className="bg-[#4B1E91]/10 border border-[#4B1E91]/30 p-3 rounded-xl">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4B1E91] bg-[#4B1E91]/20 px-2 py-0.5 rounded">
                  Next Objective Target
                </span>
                <h4 className="text-xs font-bold text-white tracking-tight mt-2">
                  {nextMilestone.title}
                </h4>
              </div>
            )}

            <div className="bg-[#0D0118]/40 border border-[#4B1E91]/40 rounded-xl max-h-24 overflow-y-auto divide-y divide-[#4B1E91]/20 scrollbar-thin scrollbar-thumb-[#4B1E91]">
              {MOCK_MILESTONES.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 text-xs"
                >
                  <span
                    className={`truncate max-w-45 ${milestone.completed ? "text-neutral-500 line-through" : "text-neutral-300"}`}
                  >
                    {milestone.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold shrink-0 ml-2 ${milestone.completed ? "text-[#22C55E]" : "text-[#F59E0B]"}`}
                  >
                    {milestone.completed ? "✓" : "○"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
