import React, { useState } from "react";

interface WeekItem {
  id: number;
  title: string;
  description: string;
  skills: string[];
  status: "done" | "current" | "upcoming";
  dates: string;
}

const MOCK_WEEKS_DATA: WeekItem[] = [
  {
    id: 1,
    title: "Onboarding & Environment Alignment",
    description:
      "Initialize native workspace dependencies, configure Tailwind design variables, and establish baseline development routes.",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    status: "done",
    dates: "Week 1",
  },
  {
    id: 2,
    title: "Responsive Layout Architecture",
    description:
      "Build tiered access matrix layout structures optimized fluidly for 360px mobile viewports up to 1280px desktop screens.",
    skills: ["CSS Flexbox", "Grid Layout", "Media Queries"],
    status: "done",
    dates: "Week 2",
  },
  {
    id: 3,
    title: "State-Driven Component Pipelines",
    description:
      "Implement strict data filtering loops and context-driven status toggles using conditional rendering workflows.",
    skills: ["React Hooks", "State Isolation", "Data Operations"],
    status: "done",
    dates: "Week 3",
  },
  {
    id: 4,
    title: "Core Features Deployment Hub",
    description:
      "Assemble the central dashboard layout components including submission portals, target checklist lanes, and chat nodes.",
    skills: ["Modular Architecture", "Lucide Icons", "UX Optimization"],
    status: "current",
    dates: "Week 4 (Current)",
  },
  {
    id: 5,
    title: "Compliance Audit Integration",
    description:
      "Inject strict legal disclaimer containers into layout layers to fully isolate internal operational results data.",
    skills: ["Data Compliance", "Security Protocols", "Refactoring"],
    status: "upcoming",
    dates: "Week 5",
  },
  {
    id: 6,
    title: "Mock-API Endpoint Connection",
    description:
      "Transition hardcoded schema constants into dynamic local server asynchronous data request frameworks.",
    skills: ["Asynchronous JS", "Fetch API", "JSON Layouts"],
    status: "upcoming",
    dates: "Week 6",
  },
  {
    id: 7,
    title: "State Persistence Implementations",
    description:
      "Integrate persistent browser state layers to maintain authentication session keys across active reloads.",
    skills: ["LocalStorage", "Session Handling", "Data Caching"],
    status: "upcoming",
    dates: "Week 7",
  },
  {
    id: 8,
    title: "Advanced Chart Rendering Matrix",
    description:
      "Construct fully custom native presentation blocks without relying on external dashboard charting widgets.",
    skills: ["Native SVG", "Data Visualization", "CSS Rendering"],
    status: "upcoming",
    dates: "Week 8",
  },
  {
    id: 9,
    title: "Cross-Device Testing Operations",
    description:
      "Execute programmatic responsive design audits to verify fluid node alignment under high system stress.",
    skills: ["Browser DevTools", "Emulation Auditing", "Optimization"],
    status: "upcoming",
    dates: "Week 9",
  },
  {
    id: 10,
    title: "Internal Refactoring & Clean Code",
    description:
      "Purge code bases of non-compliant annotations, unused declarations, and type bypass definitions.",
    skills: ["Code Standards", "Performance Tuning", "TS Strict Validation"],
    status: "upcoming",
    dates: "Week 10",
  },
  {
    id: 11,
    title: "Peer Code Review Validations",
    description:
      "Initialize integration branches and trigger pull requests for collaborative review checkpoint passes.",
    skills: ["Git Workflows", "Pull Requests", "System Collaboration"],
    status: "upcoming",
    dates: "Week 11",
  },
  {
    id: 12,
    title: "Final Program Showcase Launch",
    description:
      "Deploy full responsive client components into secure production domains to claim completion credentials.",
    skills: ["Vite Production Build", "Deployment Lanes", "Final Verification"],
    status: "upcoming",
    dates: "Week 12",
  },
];

const Roadmap: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const visibleWeeks = collapsed
    ? MOCK_WEEKS_DATA.slice(0, 5)
    : MOCK_WEEKS_DATA;
  const collapsedWeeksCount = MOCK_WEEKS_DATA.length - 5;

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Internship Roadmap
        </h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          12-week programme <span className="mx-1.5">·</span> Week 4 of 12
          active milestones
        </p>

        <div className="mt-6 bg-[#1E0A4A] border border-[#4B1E91] p-4 rounded-2xl space-y-2">
          <div className="bg-[#4B1E91] rounded-full h-3 w-full overflow-hidden">
            <div
              className="bg-[#4B1E91] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: "33%" }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-[#F5F0E8]">
            <span>Overall Program Completion</span>
            <span>33% Completed</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl space-y-1 relative">
        {visibleWeeks.map((week, index) => {
          const isDone = week.status === "done";
          const isCurrent = week.status === "current";

          let circleStyle = "bg-[#4B1E91] text-[#F5F0E8] border-[#4B1E91]";
          let cardStyle = "border-[#4B1E91] opacity-50";

          if (isDone) {
            circleStyle = "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]";
            cardStyle = "border-[#4B1E91]/40 opacity-70";
          } else if (isCurrent) {
            circleStyle =
              "bg-[#4B1E91] text-white border-[#4B1E91] shadow-md shadow-[#4B1E91]/30 animate-pulse";
            cardStyle = "border-[#4B1E91] bg-[#1E0A4A]";
          }

          return (
            <div key={week.id} className="flex flex-col items-start">
              <div className="flex items-start gap-4 w-full">
                <div className="flex flex-col items-center shrink-0 mt-1">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${circleStyle}`}
                  >
                    {isDone ? "✓" : week.id}
                  </div>
                </div>

                <div
                  className={`flex-1 bg-[#1E0A4A] border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all ${cardStyle}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#F5F0E8] tracking-wider">
                        {week.dates}
                      </span>
                      {isCurrent && (
                        <span className="bg-[#4B1E91]/20 text-[#F5F0E8] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#4B1E91]/30">
                          Active Phase
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {week.title}
                    </h3>
                    <p className="text-xs text-[#F5F0E8] leading-relaxed text-justify">
                      {week.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#4B1E91]/40 mt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {week.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${
                            isDone
                              ? "bg-[#22C55E]/5 text-[#22C55E] border-[#22C55E]/10"
                              : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91]"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {isCurrent && (
                      <button className="bg-[#4B1E91] text-white font-mono text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg hover:bg-[#683cb0] transition-colors whitespace-nowrap self-end">
                        View Tasks for This Week →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {index < visibleWeeks.length - 1 && (
                <div className="w-0.5 h-8 bg-[#4B1E91] ml-4.75 my-1" />
              )}
            </div>
          );
        })}
      </div>

      {collapsed && (
        <div className="max-w-3xl ml-14 mt-4 bg-[#1E0A4A]/40 border border-dashed border-[#4B1E91] p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-tight">
              Weeks 6 - 12 Program Lanes
            </h4>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5 truncate">
              {collapsedWeeksCount} upcoming milestone blocks are currently
              hidden inside the view container summaries
            </p>
          </div>
          <button
            onClick={() => setCollapsed(false)}
            className="bg-[#1E0A4A] border border-[#4B1E91] text-white font-mono text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl hover:border-[#4B1E91] transition-all whitespace-nowrap"
          >
            Show All Weeks
          </button>
        </div>
      )}

      <section className="max-w-3xl mt-8 bg-[#1E0A4A] border border-[#4B1E91] p-5 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Skills You Will Gain
          </h2>
          <p className="text-[11px] text-[#F5F0E8] mt-0.5">
            Categorized structural matrix overview of the total technical
            curriculum
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded">
              Already Gained
            </span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              <span>• React &amp; Vite Systematics</span>
              <span>• TS Strict Typings</span>
              <span>• Fluid Tailwind Layouts</span>
            </div>
          </div>

          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#4B1E91] bg-[#4B1E91]/20 px-2 py-0.5 rounded">
              In Progress
            </span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              <span>• Modular Asset Managers</span>
              <span>• Controlled Form Injections</span>
              <span>• Custom Bar Charts</span>
            </div>
          </div>

          <div className="bg-[#0D0118] border border-[#4B1E91] p-3 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
              Upcoming Lanes
            </span>
            <div className="flex flex-col gap-1 text-xs text-[#F5F0E8] pl-1 pt-1">
              <span>• Asynchronous API Feeds</span>
              <span>• LocalStorage Sockets</span>
              <span>• Production Deployments</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
