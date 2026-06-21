import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/epd_logo.png";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Building2,
  School2,
  BarChart3,
  Award,
  BookOpen,
  Settings2,
  MessageSquare,
  FolderOpen,
  UserCheck,
  Briefcase,
  Bell,
  Trophy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore, MOODS } from "../../store/themeStore";

const ALL_MENU = [
  { name: "Dashboard",     path: "/admin/dashboard",     icon: LayoutDashboard, superOnly: false },
  { name: "Users",         path: "/admin/users",          icon: Users,           superOnly: false },
  { name: "Applications",  path: "/admin/applications",   icon: ClipboardList,   superOnly: false },
  { name: "Companies",     path: "/admin/companies",      icon: Building2,       superOnly: false },
  { name: "Institutions",  path: "/admin/schools",        icon: School2,         superOnly: false },
  { name: "Mentors",       path: "/admin/mentors",        icon: UserCheck,       superOnly: false },
  { name: "Slots",         path: "/admin/slots",          icon: Briefcase,       superOnly: false },
  { name: "Placements",    path: "/admin/placements",     icon: Briefcase,       superOnly: false },
  { name: "Analytics",     path: "/admin/analytics",      icon: BarChart3,       superOnly: false },
  { name: "Gamification",  path: "/admin/gamification",   icon: Trophy,          superOnly: true  },
  { name: "Certificates",  path: "/admin/certificates",   icon: Award,           superOnly: false },
  { name: "Resources",     path: "/admin/resources",      icon: BookOpen,        superOnly: false },
  { name: "Portfolio",     path: "/admin/portfolio",      icon: FolderOpen,      superOnly: false },
  { name: "Notifications", path: "/admin/notifications",  icon: Bell,            superOnly: false },
  { name: "Feedback",      path: "/admin/feedback",       icon: MessageSquare,   superOnly: false },
  { name: "Settings",      path: "/admin/settings",       icon: Settings2,       superOnly: false },
];

const f: React.CSSProperties = { fontFamily: "Inter" };

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const clearAuth    = useAuthStore((s) => s.clearAuth);
  const adminRole    = useAuthStore((s) => s.user?.admin_role);
  const isSuperAdmin = adminRole === 'super_admin';
  const menuItems    = ALL_MENU.filter((item) => !item.superOnly || isSuperAdmin);
  const navigate     = useNavigate();
  const mood         = useThemeStore((s) => s.mood);
  const moodDef      = MOODS.find((m) => m.id === mood) ?? MOODS[0];
  const theme = {
    deep:   moodDef.deep,
    mid:    moodDef.mid,
    card:   moodDef.card,
    border: moodDef.border,
    accent: moodDef.accent,
    gold:   moodDef.gold,
  };

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  // Close sidebar after navigation on mobile
  function closeMobile() {
    if (window.innerWidth < 1024) setOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden text-white" style={{ backgroundColor: theme.deep }}>

      {/* Mobile backdrop */}
      {open && (
        <div className="lg:hidden z-30 fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{ backgroundColor: theme.mid, borderColor: `${theme.border}66` }}
        className={`
          flex flex-col shrink-0 border-r
          transition-all duration-300
          fixed inset-y-0 left-0 z-40 w-64
          lg:static lg:inset-auto
          ${open ? "translate-x-0 lg:w-64" : "-translate-x-full lg:translate-x-0 lg:w-16"}
        `}
      >
        {/* Chevron toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ backgroundColor: theme.accent, borderColor: theme.mid }}
          className="hidden top-8 -right-3 z-20 absolute lg:flex justify-center items-center shadow-lg border rounded-full w-6 h-6 text-white"
        >
          {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Brand area */}
        <div
          style={{ borderColor: `${theme.gold}4D` }}
          className={`flex items-center border-b py-5 px-4 gap-3 ${!open ? "lg:px-0 lg:justify-center" : ""}`}
        >
          <div style={{ backgroundColor: theme.accent }} className="p-2.5 rounded-xl shrink-0">
            <LayoutDashboard size={18} style={{ color: theme.gold }} />
          </div>
          <div className={`min-w-0 ${!open ? "lg:hidden" : ""}`}>
            <p className="font-semibold text-sm truncate" style={{ ...f, color: theme.gold }}>Emerson Admin</p>
            <p className="text-[#F5F0E8]/50 text-xs truncate" style={f}>Admin Panel</p>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 space-y-0.5 py-3 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={!open ? item.name : undefined}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center py-2.5 mx-2 rounded-xl transition-all duration-200
                   px-3 gap-3 ${!open ? "lg:justify-center lg:px-0" : ""}
                   ${isActive ? "active-nav" : "text-[#F5F0E8]/80 hover:text-white"}`
                }
                style={({ isActive }) => isActive
                  ? { backgroundColor: theme.accent, color: theme.gold }
                  : {}}
              >
                <Icon size={18} className="shrink-0" />
                <span className={`text-sm truncate ${!open ? "lg:hidden" : ""}`} style={f}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ borderColor: `${theme.border}4D` }} className="py-3 border-t">
          <button
            onClick={handleLogout}
            title={!open ? "Log Out" : undefined}
            className={`flex items-center py-2.5 mx-2 rounded-xl text-[#F5F0E8]/70
              hover:text-white transition-all duration-200
              px-3 gap-3 w-[calc(100%-1rem)]
              ${!open ? "lg:justify-center lg:px-0 lg:w-12" : ""}`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`text-sm ${!open ? "lg:hidden" : ""}`} style={f}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <div
          style={{ backgroundColor: `${theme.deep}CC`, borderColor: `${theme.border}99` }}
          className="flex items-center gap-3 shadow-sm shadow-white backdrop-blur-md px-4 lg:px-6 py-0 border-b shrink-0"
        >
          <button
            onClick={() => setOpen(true)}
            style={{ backgroundColor: `${theme.accent}33` }}
            className="lg:hidden flex justify-center items-center shadow-md shadow-white rounded-b-2xl w-8 h-8 text-white transition hover:opacity-80"
          >
            <Menu size={18} />
          </button>
          <img src={logo} alt="Emerson Professional" className="w-auto h-28 object-contain" />
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
