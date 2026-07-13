import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Rocket,
  Map,
  CheckSquare,
  Handshake,
  MessageCircle,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  X,
  Award,
  ListTodo,
  Trophy,
  BarChart2,
  Star,
  Upload,
  Compass,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const menuItems = [
  { name: "Dashboard",      path: "/dashboard",               icon: LayoutDashboard },
  { name: "Discovery",      path: "/dashboard/discovery",        icon: Compass         },
  { name: "Onboarding",     path: "/dashboard/onboarding",       icon: Rocket          },
  { name: "Roadmap",        path: "/dashboard/roadmap",          icon: Map             },
  { name: "Tasks",          path: "/dashboard/tasks",            icon: CheckSquare     },
  { name: "Task Tracker",   path: "/dashboard/task-tracker",     icon: ListTodo        },
  { name: "Mentors",        path: "/dashboard/mentors",          icon: Handshake       },
  { name: "Community",      path: "/dashboard/community",        icon: MessageCircle   },
  { name: "Portfolio",      path: "/dashboard/portfolio",        icon: Target          },
  { name: "Career",         path: "/dashboard/career",           icon: TrendingUp      },
  { name: "Leaderboard",    path: "/dashboard/leaderboard",      icon: Trophy          },
  { name: "Progress",       path: "/dashboard/progress",         icon: BarChart2       },
  { name: "Feedback",       path: "/dashboard/feedback",         icon: Star            },
  { name: "Submission Hub", path: "/dashboard/submission-hub",   icon: Upload          },
  { name: "Certificates",   path: "/dashboard/certificates",     icon: Award           },
];

interface NotificationItem {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

const f: React.CSSProperties = { fontFamily: "Inter" };

const Navbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // The backend does not expose a notification feed yet. Keep production empty
  // instead of presenting fixture activity as real account data.
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user      = useAuthStore((s) => s.user);
  const navigate  = useNavigate();

  const initials = (name?: string | null) =>
    (name ?? "I").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  const dismiss = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-[#1E0A4A] border border-[#4B1E91] p-2.5 rounded-xl text-white shadow-lg transition-colors hover:border-[#4B1E91]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`bg-[#12022A] text-white border-r border-[#4B1E91] h-screen flex flex-col fixed lg:sticky top-0 left-0 z-40 overflow-hidden shrink-0 transition-all duration-300 ${
          mobileOpen
            ? "w-64 p-5 translate-x-0"
            : "p-5 -translate-x-full lg:translate-x-0 lg:p-4 " + (isExpanded ? "w-64" : "w-20 items-center")
        }`}
      >
        <div className={`flex items-center mt-14 lg:mt-2 shrink-0 px-2 lg:px-0 ${isExpanded ? "gap-3" : "justify-center"}`}>
          <div className="bg-[#4B1E91] p-2.5 rounded-2xl shrink-0 flex items-center justify-center shadow-md">
            <GraduationCap size={22} className="text-white" />
          </div>
          {isExpanded && (
            <div className="min-w-0 animate-in fade-in duration-300">
              <p className="text-[12px] text-white leading-tight font-bold tracking-wide truncate" style={f}>
                Emerson Professional
              </p>
              <p className="text-[11px] text-[#F5F0E8] leading-tight font-medium truncate" style={f}>
                Development Group
              </p>
              <p className="mt-0.5 text-[#F5F0E8]/60 text-[10px] font-light tracking-wider" style={f}>
                2026 Cohort
              </p>
            </div>
          )}
        </div>

        <div className="my-4 border-[#4B1E91] border-b w-full" />

        <div className="flex flex-col flex-1 gap-1 overflow-y-auto w-full px-1 lg:px-0 scrollbar-thin scrollbar-thumb-[#4B1E91]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-xl transition-all duration-150 text-left ${
                    isExpanded ? "px-4 py-2.5 gap-3 w-full" : "p-3 justify-center animate-in fade-in duration-150"
                  } ${
                    isActive
                      ? "bg-[#4B1E91] text-white font-bold shadow-md shadow-[#4B1E91]/20"
                      : "text-[#F5F0E8] hover:bg-[#1E0A4A] hover:text-white border border-transparent hover:border-[#4B1E91]"
                  }`
                }
                title={!isExpanded ? item.name : ""}
              >
                <Icon size={16} className="shrink-0" />
                {isExpanded && (
                  <span className="animate-in fade-in duration-200" style={{ ...f, fontWeight: 500, fontSize: "13px" }}>
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-4 shrink-0 w-full px-1 lg:px-0">
          <div className="mb-4 border-[#4B1E91] border-b w-full" />

          <button
            onClick={() => {
              setShowNotifs((v) => !v);
              if (window.innerWidth < 1024) setMobileOpen(false);
            }}
            className={`relative flex items-center rounded-xl border transition-all duration-150 text-left ${
              isExpanded ? "px-4 py-2.5 gap-3 w-full" : "p-3 justify-center"
            } ${
              showNotifs
                ? "bg-[#1E0A4A] text-white border-[#4B1E91]"
                : "text-[#F5F0E8] bg-transparent border-transparent hover:bg-[#1E0A4A] hover:text-white"
            }`}
            title={!isExpanded ? "Notifications" : ""}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className={`absolute flex justify-center items-center bg-[#EF4444] px-1 rounded-full font-bold text-[8px] text-white leading-none border border-[#12022A] ${
                  isExpanded ? "-top-1.5 -right-2 min-w-3.5 h-3.5" : "-top-1.5 -right-1.5 min-w-3 h-3"
                }`}>
                  {unreadCount}
                </span>
              )}
            </div>
            {isExpanded && (
              <span className="flex-1 animate-in fade-in duration-200" style={{ ...f, fontWeight: 500, fontSize: "13px" }}>
                Notifications
              </span>
            )}
          </button>

          {/* Profile icon / card */}
          <div className="relative mt-1">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className={`flex items-center rounded-xl border transition-all duration-150 text-left ${
                isExpanded ? "px-3 py-2.5 gap-3 w-full" : "p-3 justify-center"
              } ${
                showProfile
                  ? "bg-[#4B1E91]/30 border-[#4B1E91] text-white"
                  : "border-[#4B1E91]/40 text-[#F5F0E8] hover:bg-[#1E0A4A] hover:text-white"
              }`}
              title={!isExpanded ? user?.name ?? "Profile" : ""}
            >
              <div className="w-7 h-7 rounded-xl bg-[#4B1E91] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {initials(user?.name)}
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                  <p className="text-white font-semibold truncate" style={{ ...f, fontSize: "12px" }}>{user?.name ?? "Intern"}</p>
                  <p className="text-[#F5F0E8]/60 truncate capitalize" style={{ ...f, fontSize: "10px" }}>{user?.role ?? "intern"}</p>
                </div>
              )}
            </button>

            {showProfile && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="bg-[#4B1E91] px-4 py-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {initials(user?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                    <p className="text-white/60 text-xs truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#F5F0E8]/50 uppercase tracking-wider font-mono">Role</span>
                    <span className="text-white font-medium capitalize">{user?.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#F5F0E8]/50 uppercase tracking-wider font-mono">Status</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      user?.status === 'approved' ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {user?.status ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#F5F0E8]/50 uppercase tracking-wider font-mono">Email</span>
                    <span className="text-white font-medium max-w-36 truncate text-right">{user?.email}</span>
                  </div>
                </div>
                <div className="border-t border-[#4B1E91]/40 px-4 py-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-medium transition w-full"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center rounded-xl border border-transparent text-[#F5F0E8] hover:text-white hover:bg-[#4B1E91]/20 transition-all text-left mt-1 ${
              isExpanded ? "px-4 py-2.5 gap-3 w-full" : "p-3 justify-center"
            }`}
            title={!isExpanded ? "Log Out" : ""}
          >
            <LogOut size={16} className="shrink-0" />
            {isExpanded && (
              <span className="animate-in fade-in duration-200" style={{ ...f, fontWeight: 500, fontSize: "13px" }}>
                Log Out
              </span>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`hidden lg:flex items-center text-[#F5F0E8]/50 hover:text-white transition-all text-left mt-1 ${
              isExpanded ? "px-4 py-2 gap-3 w-full" : "p-3 justify-center"
            }`}
          >
            {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            {isExpanded && (
              <span className="animate-in fade-in duration-200" style={{ ...f, fontWeight: 500, fontSize: "12px" }}>
                Collapse Drawer
              </span>
            )}
          </button>
        </div>
      </aside>

      {showNotifs && (
        <div className="z-50 fixed top-0 right-0 flex flex-col bg-[#1E0A4A] shadow-2xl border-l border-[#4B1E91] w-80 h-screen shrink-0 animate-in slide-in-from-right duration-200">
          <div className="flex justify-between items-center px-5 py-4 border-[#4B1E91] border-b shrink-0 bg-[#12022A]/40">
            <div>
              <p className="font-semibold text-white text-sm" style={f}>
                Notifications
              </p>
              <p className="mt-0.5 text-[#F5F0E8] text-xs" style={f}>
                {unreadCount} system updates pending
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[#4B1E91] hover:text-[#F5F0E8] text-xs font-mono transition-colors border border-[#4B1E91]/30 px-2 py-0.5 rounded bg-[#4B1E91]/10"
                  style={f}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowNotifs(false)}
                className="text-[#F5F0E8] hover:text-white transition-colors border border-[#4B1E91] p-1 rounded-lg bg-[#0D0118]"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#1E0A4A]">
            {notifs.length === 0 ? (
              <div className="flex flex-col justify-center items-center px-6 h-full text-center">
                <div className="bg-[#0D0118] border border-[#4B1E91] p-4 rounded-full mb-3 text-[#F5F0E8]/40">
                  <Bell size={24} />
                </div>
                <p className="text-[#F5F0E8] text-xs font-mono uppercase tracking-wider" style={f}>
                  Notifications are not connected yet
                </p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-3.5 border-b border-[#4B1E91]/30 transition-all ${
                    n.unread ? "bg-[#4B1E91]/10 border-l-2 border-l-[#4B1E91]" : "bg-transparent"
                  }`}
                >
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      n.unread ? "bg-[#4B1E91]" : "bg-[#4B1E91]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-200 text-xs leading-relaxed text-justify" style={f}>
                      {n.text}
                    </p>
                    <p className="mt-1 text-[#F5F0E8]/60 font-mono text-[10px]" style={f}>
                      ⏱ {n.time}
                    </p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-[#F5F0E8]/30 hover:text-[#EF4444] transition-colors shrink-0 mt-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
