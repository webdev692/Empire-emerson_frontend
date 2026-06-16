import React, { useState } from "react";

interface KanbanTask {
  id: number;
  title: string;
  priority: "urgent" | "normal" | "low";
  dueDate: string;
  points: number;
}

interface KanbanData {
  todo: KanbanTask[];
  inProgress: KanbanTask[];
  review: KanbanTask[];
  done: KanbanTask[];
}

const MOCK_KANBAN_DATA: KanbanData = {
  todo: [
    {
      id: 1,
      title: "Coordinate Tech Infrastructure",
      priority: "normal",
      dueDate: "Due tomorrow",
      points: 10,
    },
    {
      id: 2,
      title: "Review Ethical Sales Deck",
      priority: "low",
      dueDate: "In 3 days",
      points: 10,
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "Draft Individual Income Forms",
      priority: "urgent",
      dueDate: "Due today",
      points: 10,
    },
  ],
  review: [
    {
      id: 4,
      title: "Figma Typography Verification",
      priority: "low",
      dueDate: "2 days ago",
      points: 10,
    },
  ],
  done: [
    {
      id: 5,
      title: "Initial Workspace Architecture",
      priority: "normal",
      dueDate: "Completed",
      points: 10,
    },
    {
      id: 6,
      title: "TypeScript Interface Testing",
      priority: "urgent",
      dueDate: "Completed",
      points: 10,
    },
  ],
};

const MOCK_CHART_DATA = [
  { week: "Week 1", count: 2 },
  { week: "Week 2", count: 4 },
  { week: "Week 3", count: 3 },
  { week: "Week 4", count: 5 },
];

const TaskTracker: React.FC = () => {
  const [view, setView] = useState<"kanban" | "chart">("kanban");
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const maxCount = Math.max(...MOCK_CHART_DATA.map((d) => d.count));

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <div className="bg-red-900/30 border border-red-500 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-xs text-white leading-relaxed">
          You have 1 overdue task. Please submit immediately.
        </p>
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Assignment Matrix
          </h1>
          <p className="text-xs text-[#F5F0E8] mt-1">
            Track task distribution lanes or overall completion volumes
          </p>
        </div>

        <div className="flex bg-[#1E0A4A] border border-[#4B1E91] p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-1.5 font-mono text-xs rounded-lg transition-colors duration-150 ${
              view === "kanban"
                ? "bg-[#4B1E91] text-white"
                : "text-[#F5F0E8] hover:text-white"
            }`}
          >
            Kanban View
          </button>
          <button
            onClick={() => setView("chart")}
            className={`px-4 py-1.5 font-mono text-xs rounded-lg transition-colors duration-150 ${
              view === "chart"
                ? "bg-[#4B1E91] text-white"
                : "text-[#F5F0E8] hover:text-white"
            }`}
          >
            Chart View
          </button>
        </div>
      </header>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#4B1E91]">
          <div className="min-w-62.5 flex-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4B1E91]">
              <h3 className="text-sm font-bold text-neutral-400">To Do Lane</h3>
              <span className="bg-neutral-800 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
                {MOCK_KANBAN_DATA.todo.length}
              </span>
            </div>
            <div className="space-y-2">
              {MOCK_KANBAN_DATA.todo.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedCardId(task.id)}
                  className={`bg-[#0D0118] border rounded-xl p-3 cursor-pointer transition-all ${
                    selectedCardId === task.id
                      ? "border-[#4B1E91] ring-1 ring-[#4B1E91]"
                      : "border-[#4B1E91] hover:border-neutral-400"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-blue-900/30 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-mono text-[#F5F0E8]">
                      +{task.points} pts
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[#F5F0E8]">
                    ⏰ {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-62.5 flex-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4B1E91]">
              <h3 className="text-sm font-bold text-[#F59E0B]">In Progress</h3>
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-mono px-2 py-0.5 rounded-full">
                {MOCK_KANBAN_DATA.inProgress.length}
              </span>
            </div>
            <div className="space-y-2">
              {MOCK_KANBAN_DATA.inProgress.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedCardId(task.id)}
                  className={`bg-[#0D0118] border rounded-xl p-3 cursor-pointer transition-all ${
                    selectedCardId === task.id
                      ? "border-[#4B1E91] ring-1 ring-[#4B1E91]"
                      : "border-[#4B1E91] hover:border-neutral-400"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-[#EF4444]/20 text-[#EF4444] px-1.5 py-0.5 border border-[#EF4444]/30 rounded">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-mono text-[#F5F0E8]">
                      +{task.points} pts
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[#F59E0B]">
                    ⏰ {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-62.5 flex-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4B1E91]">
              <h3 className="text-sm font-bold text-[#4B1E91]">Under Review</h3>
              <span className="bg-[#4B1E91]/20 text-[#F5F0E8] text-[10px] font-mono px-2 py-0.5 rounded-full">
                {MOCK_KANBAN_DATA.review.length}
              </span>
            </div>
            <div className="space-y-2">
              {MOCK_KANBAN_DATA.review.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedCardId(task.id)}
                  className={`bg-[#0D0118] border rounded-xl p-3 cursor-pointer transition-all ${
                    selectedCardId === task.id
                      ? "border-[#4B1E91] ring-1 ring-[#4B1E91]"
                      : "border-[#4B1E91] hover:border-neutral-400"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 text-neutral-400 px-1.5 py-0.5 border border-neutral-700 rounded">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-mono text-[#F5F0E8]">
                      +{task.points} pts
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[#EF4444] font-bold">
                    ⏰ {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-62.5 flex-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4B1E91]">
              <h3 className="text-sm font-bold text-[#22C55E]">Completed</h3>
              <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-mono px-2 py-0.5 rounded-full">
                {MOCK_KANBAN_DATA.done.length}
              </span>
            </div>
            <div className="space-y-2">
              {MOCK_KANBAN_DATA.done.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedCardId(task.id)}
                  className={`bg-[#0D0118] border opacity-60 rounded-xl p-3 cursor-pointer transition-all ${
                    selectedCardId === task.id
                      ? "border-[#4B1E91] ring-1 ring-[#4B1E91]"
                      : "border-[#4B1E91] hover:border-neutral-400"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 text-neutral-500 px-1.5 py-0.5 border border-neutral-700 rounded">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500">
                      +{task.points} pts
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-400 mb-2 line-clamp-2 line-through leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[#22C55E]">
                    ✓ {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-6">
              Weekly Task Completion Volumes
            </h3>

            <div className="flex items-end gap-4 h-40 bg-[#0D0118] border border-[#4B1E91] p-4 rounded-xl">
              {MOCK_CHART_DATA.map((bar) => {
                const barHeightPct = (bar.count / maxCount) * 100;
                return (
                  <div
                    key={bar.week}
                    className="flex-1 flex flex-col items-center h-full justify-end"
                  >
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        bar.week === "Week 4"
                          ? "bg-[#4B1E91]/60"
                          : "bg-[#4B1E91]"
                      }`}
                    >
                      <div className="text-center text-[10px] font-mono font-bold -mt-5 text-white">
                        {bar.count}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#F5F0E8] mt-2 whitespace-nowrap">
                      {bar.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">
                Current Active Window
              </p>
              <h4 className="text-xl font-bold text-white">
                This Week: 5 tasks
              </h4>
            </div>
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">
                Historical Comparison
              </p>
              <h4 className="text-xl font-bold text-neutral-400">
                Last Week: 3 tasks
              </h4>
            </div>
          </div>

          <div className="bg-[#1E0A4A]/40 border border-dashed border-[#4B1E91] rounded-xl p-4 text-center">
            <p className="text-xs font-mono text-[#22C55E]">
              📊 Summary: You completed 2 more tasks than last week. Keep up the
              high operational momentum!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
