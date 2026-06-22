import React, { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";

interface TaskItem {
  id: number;
  title: string;
  priority: "urgent" | "normal" | "low";
  status: "pending" | "in_progress" | "review" | "done";
  due_date: string;
  points: number;
  completed_at: string | null;
}

function dueDateLabel(dateStr: string, status: string): string {
  if (status === "done") return "Completed";
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `In ${diff} days`;
}

function weekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const mon = new Date(d);
  mon.setDate(d.getDate() - d.getDay() + 1);
  return `${mon.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
}

const TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "chart">("kanban");
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: TaskItem[] }>("/api/intern/tasks")
      .then(r => setTasks(r.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const kanban = useMemo(() => ({
    todo:       tasks.filter(t => t.status === "pending"),
    inProgress: tasks.filter(t => t.status === "in_progress"),
    review:     tasks.filter(t => t.status === "review"),
    done:       tasks.filter(t => t.status === "done"),
  }), [tasks]);

  // Weekly chart: group completed tasks by week
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.filter(t => t.completed_at).forEach(t => {
      const wk = weekLabel(t.completed_at!);
      map[wk] = (map[wk] ?? 0) + 1;
    });
    const entries = Object.entries(map).slice(-4);
    if (entries.length === 0) return [{ week: "No data", count: 0 }];
    return entries.map(([week, count]) => ({ week, count }));
  }, [tasks]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const overdue = tasks.filter(t => t.status !== "done" && new Date(t.due_date) < new Date()).length;
  const thisWeekDone  = kanban.done.filter(t => t.completed_at && new Date(t.completed_at) >= new Date(Date.now() - 7*86400000)).length;
  const lastWeekDone  = kanban.done.filter(t => {
    if (!t.completed_at) return false;
    const d = new Date(t.completed_at).getTime();
    return d >= Date.now() - 14*86400000 && d < Date.now() - 7*86400000;
  }).length;

  const KanbanCard = ({ task }: { task: TaskItem }) => (
    <div onClick={() => setSelectedCardId(task.id)}
      className={`bg-[#0D0118] border rounded-xl p-3 cursor-pointer transition-all ${
        selectedCardId === task.id ? "border-[#4B1E91] ring-1 ring-[#4B1E91]" : "border-[#4B1E91] hover:border-neutral-400"
      }`}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-blue-900/30 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded">
          {task.priority}
        </span>
        <span className="text-[9px] font-mono text-[#F5F0E8]">+{task.points} pts</span>
      </div>
      <h4 className="text-xs font-bold text-white mb-2 line-clamp-2 leading-snug">{task.title}</h4>
      <p className="text-[10px] font-mono text-[#F5F0E8]">⏰ {dueDateLabel(task.due_date, task.status)}</p>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      {overdue > 0 && (
        <div className="bg-red-900/30 border border-red-500 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-xs text-white leading-relaxed">
            You have {overdue} overdue task{overdue !== 1 ? "s" : ""}. Please submit immediately.
          </p>
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assignment Matrix</h1>
          <p className="text-xs text-[#F5F0E8] mt-1">Track task distribution lanes or overall completion volumes</p>
        </div>
        <div className="flex bg-[#1E0A4A] border border-[#4B1E91] p-1 rounded-xl self-start sm:self-auto">
          {(["kanban", "chart"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 font-mono text-xs rounded-lg transition-colors duration-150 ${
                view === v ? "bg-[#4B1E91] text-white" : "text-[#F5F0E8] hover:text-white"
              }`}>
              {v === "kanban" ? "Kanban View" : "Chart View"}
            </button>
          ))}
        </div>
      </header>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {([
            { label: "To Do Lane",   color: "text-neutral-400",  badge: "bg-neutral-800 text-neutral-400",       tasks: kanban.todo },
            { label: "In Progress",  color: "text-[#F59E0B]",    badge: "bg-[#F59E0B]/10 text-[#F59E0B]",        tasks: kanban.inProgress },
            { label: "Under Review", color: "text-[#4B1E91]",    badge: "bg-[#4B1E91]/20 text-[#F5F0E8]",        tasks: kanban.review },
            { label: "Completed",    color: "text-[#22C55E]",    badge: "bg-[#22C55E]/10 text-[#22C55E]",        tasks: kanban.done },
          ] as const).map(col => (
            <div key={col.label} className="min-w-62 flex-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4B1E91]">
                <h3 className={`text-sm font-bold ${col.color}`}>{col.label}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${col.badge}`}>{col.tasks.length}</span>
              </div>
              <div className="space-y-2">
                {col.tasks.map(t => (
                  <div key={t.id} onClick={() => setSelectedCardId(t.id)}
                    className={`bg-[#0D0118] border rounded-xl p-3 cursor-pointer transition-all ${col.label === "Completed" ? "opacity-60" : ""} ${
                      selectedCardId === t.id ? "border-[#4B1E91] ring-1 ring-[#4B1E91]" : "border-[#4B1E91] hover:border-neutral-400"
                    }`}>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-blue-900/30 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded">
                        {t.priority}
                      </span>
                      <span className="text-[9px] font-mono text-[#F5F0E8]">+{t.points} pts</span>
                    </div>
                    <h4 className={`text-xs font-bold mb-2 line-clamp-2 leading-snug ${col.label === "Completed" ? "text-neutral-400 line-through" : "text-white"}`}>
                      {t.title}
                    </h4>
                    <p className={`text-[10px] font-mono ${col.label === "Completed" ? "text-[#22C55E]" : "text-[#F5F0E8]"}`}>
                      {col.label === "Completed" ? "✓" : "⏰"} {dueDateLabel(t.due_date, t.status)}
                    </p>
                  </div>
                ))}
                {col.tasks.length === 0 && (
                  <p className="text-[10px] font-mono text-[#F5F0E8]/40 text-center py-4">Empty</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] mb-6">
              Weekly Task Completion Volumes
            </h3>
            <div className="flex items-end gap-4 h-40 bg-[#0D0118] border border-[#4B1E91] p-4 rounded-xl">
              {chartData.map((bar, i) => {
                const barHeightPct = (bar.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div style={{ height: `${barHeightPct}%` }}
                      className="w-full rounded-t-lg transition-all duration-300 bg-[#4B1E91]">
                      <div className="text-center text-[10px] font-mono font-bold -mt-5 text-white">{bar.count}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#F5F0E8] mt-2 whitespace-nowrap">{bar.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">Current Active Window</p>
              <h4 className="text-xl font-bold text-white">This Week: {thisWeekDone} task{thisWeekDone !== 1 ? "s" : ""}</h4>
            </div>
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1">Historical Comparison</p>
              <h4 className="text-xl font-bold text-neutral-400">Last Week: {lastWeekDone} task{lastWeekDone !== 1 ? "s" : ""}</h4>
            </div>
          </div>
          {thisWeekDone > lastWeekDone && (
            <div className="bg-[#1E0A4A]/40 border border-dashed border-[#4B1E91] rounded-xl p-4 text-center">
              <p className="text-xs font-mono text-[#22C55E]">
                📊 Summary: You completed {thisWeekDone - lastWeekDone} more task{thisWeekDone - lastWeekDone !== 1 ? "s" : ""} than last week. Keep up the high operational momentum!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
