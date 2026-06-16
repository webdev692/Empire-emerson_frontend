import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

interface Task {
  id: number;
  title: string;
  status: "pending" | "in_progress" | "review" | "done";
  due_date: string | null;
  points: number;
  priority: "low" | "normal" | "urgent";
}

interface Announcement {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

interface DashboardProfile {
  name: string;
  department: string;
  mentor: string;
  track: string;
  cohort_year: number;
  onboarding_complete: boolean;
  is_approved: boolean;
  placement_status: string | null;
}

interface DashboardData {
  profile:        DashboardProfile;
  stats:          { done: number; total: number; points: number; ontime_pct: number };
  days_remaining: number;
  tasks:          Task[];
  announcements:  Announcement[];
}

const STATUS_LABEL: Record<Task["status"], string> = {
  pending:    "To Do",
  in_progress:"In Progress",
  review:     "In Review",
  done:       "Done",
};

const STATUS_COLOR: Record<Task["status"], string> = {
  pending:    "bg-slate-500/20 text-slate-300",
  in_progress:"bg-[#4B1E91]/20 text-[#D8B9FF]",
  review:     "bg-amber-500/20 text-amber-300",
  done:       "bg-green-500/20 text-green-300",
};

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  low:    "bg-slate-500/10 text-slate-400",
  normal: "bg-blue-500/10 text-blue-300",
  urgent: "bg-red-500/15 text-red-300",
};

function timeAgo(dt: string) {
  const diff = Date.now() - new Date(dt).getTime();
  const h    = Math.floor(diff / 3600000);
  if (h < 1)  return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DailyOverview() {
  const user          = useAuthStore((s) => s.user);
  const navigate      = useNavigate();
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonIntern, setNonIntern] = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: DashboardData }>("/api/intern/dashboard")
      .then(({ data: r }) => setData(r.data))
      .catch((err) => {
        if (err.response?.status === 403) setNonIntern(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-[#4B1E91] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (nonIntern) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4">👋</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-400 text-sm">Use the sidebar to navigate your dashboard.</p>
      </div>
    );
  }

  const profile = data?.profile;
  const stats   = data?.stats   ?? { done: 0, total: 0, points: 0, ontime_pct: 0 };
  const tasks   = data?.tasks   ?? [];
  const anns    = data?.announcements ?? [];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[#F5F0E8] uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-black text-white mt-1">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},
            {" "}{profile?.name?.split(" ")[0] ?? user?.name?.split(" ")[0] ?? "Intern"} 👋
          </h1>
          <p className="text-[#F5F0E8] text-[14px] mt-1">
            {[profile?.department, profile?.track, `Cohort ${profile?.cohort_year ?? new Date().getFullYear()}`]
              .filter((x) => x && x !== "Not assigned" && x !== "Not selected")
              .join(" · ")}
          </p>
        </div>
        {!profile?.onboarding_complete && (
          <button onClick={() => navigate("/dashboard/onboarding")}
            className="inline-flex items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] text-white px-5 py-3 rounded-2xl font-semibold text-[13px] transition whitespace-nowrap">
            Continue Onboarding →
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tasks Done",   value: `${stats.done}/${stats.total}`, sub: "completed"   },
          { label: "On-Time Rate", value: `${stats.ontime_pct}%`,         sub: "submissions" },
          { label: "Points",       value: stats.points,                   sub: "earned"      },
          { label: "Days Left",    value: data?.days_remaining ?? "—",    sub: "in program"  },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-4">
            <p className="text-[11px] uppercase tracking-widest text-[#F5F0E8]">{s.label}</p>
            <p className="text-2xl font-black text-white mt-2">{String(s.value)}</p>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">

        {/* Tasks */}
        <div className="rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-[15px]">My Tasks</h2>
            <button onClick={() => navigate("/dashboard/tasks")} className="text-[12px] text-[#4B1E91] hover:underline">View all →</button>
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-[#5D4A7D]">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-[13px]">No tasks assigned yet.</p>
              {!profile?.onboarding_complete && <p className="text-[12px] mt-1">Complete onboarding to unlock tasks.</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[#0D0118] border border-[#4B1E91]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[task.status]}`}>
                        {STATUS_LABEL[task.status]}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-[10px] text-[#F5F0E8]">Due {new Date(task.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#4B1E91] font-bold shrink-0">{task.points}pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Mentor */}
          <div className="rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-5">
            <p className="text-[11px] uppercase tracking-widest text-[#F5F0E8] mb-3">Your Mentor</p>
            {profile?.mentor && profile.mentor !== "Not assigned" ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4B1E91]/20 flex items-center justify-center text-sm font-bold text-[#4B1E91]">
                  {profile.mentor.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-[14px]">{profile.mentor}</p>
                  <p className="text-[#F5F0E8] text-[12px]">{profile.department}</p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#5D4A7D] italic">Mentor not yet assigned</p>
            )}
          </div>

          {/* Announcements */}
          <div className="rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-5">
            <p className="text-[11px] uppercase tracking-widest text-[#F5F0E8] mb-3">Announcements</p>
            {anns.length === 0 ? (
              <p className="text-[13px] text-[#5D4A7D] italic">No announcements yet.</p>
            ) : (
              <div className="space-y-3">
                {anns.map((a) => (
                  <div key={a.id} className="border-l-2 border-[#4B1E91] pl-3">
                    <p className="text-[13px] text-white font-medium">{a.title}</p>
                    <p className="text-[12px] text-[#F5F0E8] mt-0.5 line-clamp-2">{a.body}</p>
                    <p className="text-[10px] text-[#5D4A7D] mt-1">{timeAgo(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-5">
            <p className="text-[11px] uppercase tracking-widest text-[#F5F0E8] mb-3">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Portfolio",  path: "/dashboard/portfolio" },
                { label: "Roadmap",    path: "/dashboard/roadmap"   },
                { label: "Progress",   path: "/dashboard/progress"  },
                { label: "My Profile", path: "/dashboard/profile"   },
              ].map((l) => (
                <button key={l.label} onClick={() => navigate(l.path)}
                  className="rounded-xl bg-[#0D0118] border border-[#4B1E91] px-3 py-2.5 text-[12px] text-[#ffffff] hover:border-[#4B1E91] transition text-left">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
