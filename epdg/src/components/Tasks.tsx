import React, { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";

interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: "urgent" | "normal" | "low";
  status: "pending" | "in_progress" | "review" | "done";
  due_date: string;
  points: number;
}

function dueDateLabel(dateStr: string, status: string): { label: string; overdue: boolean } {
  if (status === "done") return { label: "Completed", overdue: false };
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return { label: `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} ago`, overdue: true };
  if (diff === 0) return { label: "Due today", overdue: false };
  if (diff === 1) return { label: "Due tomorrow", overdue: false };
  return { label: `In ${diff} days`, overdue: false };
}

const Tasks: React.FC = () => {
  const [tasks, setTasks]               = useState<TaskItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    api.get<{ success: boolean; data: TaskItem[] }>("/api/intern/tasks")
      .then(r => setTasks(r.data.data ?? []))
      .catch(() => setError("Failed to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusTransition = async (id: number, current: string) => {
    const next = current === "pending" ? "in_progress" : current === "in_progress" ? "review" : null;
    if (!next) return;
    try {
      const r = await api.patch<{ success: boolean; data: TaskItem }>(`/api/intern/tasks/${id}`, { status: next });
      setTasks(prev => prev.map(t => t.id === id ? r.data.data : t));
    } catch {
      setError("Failed to update task.");
    }
  };

  const filtered = useMemo(() =>
    tasks.filter(t => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      return true;
    }),
  [tasks, statusFilter, priorityFilter]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Internship Assignments</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Showing {filtered.length} out of {tasks.length} total distributed tasks
        </p>
      </header>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-300 text-sm">
          {error}
        </div>
      )}

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
            ].map(btn => (
              <button key={btn.id} onClick={() => setStatusFilter(btn.id)}
                className={`px-3 py-1.5 border font-mono text-xs transition-colors duration-150 rounded-lg ${
                  statusFilter === btn.id
                    ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                    : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91] hover:border-[#4B1E91]"
                }`}>
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
            ].map(btn => (
              <button key={btn.id} onClick={() => setPriorityFilter(btn.id)}
                className={`px-3 py-1.5 border font-mono text-xs transition-colors duration-150 rounded-lg ${
                  priorityFilter === btn.id
                    ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                    : "bg-[#0D0118] text-[#F5F0E8] border-[#4B1E91] hover:border-[#4B1E91]"
                }`}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {filtered.map(task => {
            const { label: dueLabel, overdue } = dueDateLabel(task.due_date, task.status);
            let priorityBadge = "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30";
            if (task.priority === "normal") priorityBadge = "bg-[#2563EB]/20 text-[#3B82F6] border-[#2563EB]/30";
            if (task.priority === "low")    priorityBadge = "bg-neutral-800 text-neutral-400 border-neutral-700";
            let statusBadge = "bg-neutral-800 text-neutral-400";
            if (task.status === "in_progress") statusBadge = "bg-[#F59E0B]/20 text-[#F59E0B]";
            if (task.status === "review")      statusBadge = "bg-[#4B1E91]/20 text-[#F5F0E8]";
            if (task.status === "done")        statusBadge = "bg-[#22C55E]/20 text-[#22C55E]";

            return (
              <div key={task.id}
                className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between transition-all duration-150">
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
                  <h3 className="text-base font-bold text-white tracking-tight mb-1.5">{task.title}</h3>
                  <p className="text-xs text-[#F5F0E8] leading-relaxed mb-4 h-8 overflow-hidden text-justify">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91] mt-auto">
                  <span className={`text-[11px] font-mono ${overdue ? "text-[#EF4444] font-bold" : "text-[#F5F0E8]"}`}>
                    ⏰ {dueLabel}
                  </span>
                  {task.status === "pending" && (
                    <button onClick={() => handleStatusTransition(task.id, task.status)}
                      className="bg-[#4B1E91] text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#683cb0] transition-colors">
                      Start Task
                    </button>
                  )}
                  {task.status === "in_progress" && (
                    <button onClick={() => handleStatusTransition(task.id, task.status)}
                      className="bg-[#F59E0B] text-black text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#d98207] transition-colors">
                      Submit Work
                    </button>
                  )}
                  {task.status === "review" && (
                    <button disabled
                      className="bg-neutral-800 text-neutral-500 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-not-allowed border border-neutral-700">
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
            {tasks.length === 0 ? "No tasks assigned yet." : "No tasks match your current filters."}
          </p>
          {tasks.length > 0 && (
            <button onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); }}
              className="mt-3 font-mono text-xs text-white bg-[#4B1E91] px-3 py-1.5 rounded-lg hover:bg-[#683cb0] uppercase tracking-wider transition-colors">
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
