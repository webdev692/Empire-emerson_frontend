import React, { useState } from "react";

interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: "urgent" | "normal" | "low";
  status: "pending" | "in_progress" | "review" | "done";
  dueDate: string;
  points: number;
  overdue: boolean;
}

const MOCK_TASKS_DATA: TaskItem[] = [
  {
    id: 1,
    title: "Draft Initial Sales Script",
    description: "Create an outline for the ethical outreach beginner session covering non-pressure communication frameworks.",
    priority: "urgent",
    status: "pending",
    dueDate: "Due today",
    points: 10,
    overdue: false,
  },
  {
    id: 2,
    title: "Review CRM Spreadsheet Structure",
    description: "Audit the lead tracking columns for small teams to ensure contact status updates are mapped correctly.",
    priority: "normal",
    status: "in_progress",
    dueDate: "Due tomorrow",
    points: 10,
    overdue: false,
  },
  {
    id: 3,
    title: "Tax Readiness Checklist Compilation",
    description: "Compile a master list of common individual income documents required for the corporate posting directory assets.",
    priority: "urgent",
    status: "review",
    dueDate: "2 days ago",
    points: 10,
    overdue: true,
  },
  {
    id: 4,
    title: "Design System Typography Audit",
    description: "Verify that DM Sans is systematically configured across all responsive cards and text headers.",
    priority: "low",
    status: "done",
    dueDate: "Completed",
    points: 10,
    overdue: false,
  },
  {
    id: 5,
    title: "Figma Navigation Architecture",
    description: "Map out the prototype wireframe links connecting the user dashboard main timeline matrix views.",
    priority: "normal",
    status: "pending",
    dueDate: "In 3 days",
    points: 10,
    overdue: false,
  },
  {
    id: 6,
    title: "Onboarding Sequence Checklist Validation",
    description: "Review step progress completion indicators to ensure locked markers inherit correct muted styling variables.",
    priority: "low",
    status: "in_progress",
    dueDate: "In 4 days",
    points: 10,
    overdue: false,
  }
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS_DATA);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const handleStatusTransition = (id: number, currentStatus: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (currentStatus === "pending") return { ...t, status: "in_progress" };
          if (currentStatus === "in_progress") return { ...t, status: "review" };
        }
        return t;
      })
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Internship Assignments</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Showing {filteredTasks.length} out of {tasks.length} total distributed tasks
        </p>
      </header>

      <div className="mb-8 space-y-4 bg-[#1E0A4A] border border-[#4B1E91] p-4 rounded-2xl">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-2">
            Filter Assignment Status
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Statuses" },
              { id: "pending", label: "Pending" },
              { id: "in_progress", label: "In Progress" },
              { id: "review", label: "Under Review" },
              { id: "done", label: "Completed" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`px-3 py-1.5 border font-mono text-xs transition-colors duration-150 rounded-lg ${
                  statusFilter === btn.id
                    ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                    : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91] hover:border-[#4B1E91]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-2">
            Filter Priority Level
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Priorities" },
              { id: "urgent", label: "Urgent" },
              { id: "normal", label: "Normal" },
              { id: "low", label: "Low" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setPriorityFilter(btn.id)}
                className={`px-3 py-1.5 border font-mono text-xs transition-colors duration-150 rounded-lg ${
                  priorityFilter === btn.id
                    ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                    : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91] hover:border-[#4B1E91]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            let priorityBadge = "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30";
            if (task.priority === "normal") priorityBadge = "bg-[#2563EB]/20 text-[#3B82F6] border-[#2563EB]/30";
            if (task.priority === "low") priorityBadge = "bg-neutral-800 text-neutral-400 border-neutral-700";

            let statusBadge = "bg-neutral-800 text-neutral-400";
            if (task.status === "in_progress") statusBadge = "bg-[#F59E0B]/20 text-[#F59E0B]";
            if (task.status === "review") statusBadge = "bg-[#4B1E91]/20 text-[#F5F0E8]";
            if (task.status === "done") statusBadge = "bg-[#22C55E]/20 text-[#22C55E]";

            return (
              <div
                key={task.id}
                className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 hover:border-[#4B1E91]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded ${priorityBadge}`}>
                        {task.priority}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${statusBadge}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="bg-[#4B1E91]/10 text-[#F5F0E8] text-[10px] font-mono px-2 py-0.5 rounded border border-[#4B1E91]/20">
                      +{task.points} pts
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#F5F0E8] leading-relaxed mb-4 h-8 overflow-hidden text-justify">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91] mt-auto">
                  <span className={`text-[11px] font-mono ${task.overdue ? "text-[#EF4444] font-bold" : "text-[#F5F0E8]"}`}>
                    ⏰ {task.dueDate}
                  </span>

                  {task.status === "pending" && (
                    <button
                      onClick={() => handleStatusTransition(task.id, task.status)}
                      className="bg-[#4B1E91] text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#683cb0] transition-colors"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === "in_progress" && (
                    <button
                      onClick={() => handleStatusTransition(task.id, task.status)}
                      className="bg-[#F59E0B] text-black text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#d98207] transition-colors"
                    >
                      Submit Work
                    </button>
                  )}
                  {task.status === "review" && (
                    <button
                      disabled
                      className="bg-neutral-800 text-neutral-500 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-not-allowed border border-neutral-700"
                    >
                      Under Review
                    </button>
                  )}
                  {task.status === "done" && (
                    <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1.5 rounded-lg border border-[#22C55E]/20">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center border border-dashed border-[#4B1E91] rounded-2xl py-12 bg-[#1E0A4A]">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-mono text-sm text-[#F5F0E8]">
            No tracked assignments match your current filtration metrics.
          </p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
            className="mt-3 font-mono text-xs text-white bg-[#4B1E91] px-3 py-1.5 rounded-lg hover:bg-[#683cb0] uppercase tracking-wider transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;