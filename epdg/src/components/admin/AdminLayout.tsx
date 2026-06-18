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

const menuItems = [
  { name: "Dashboard",     path: "/admin/dashboard",     icon: LayoutDashboard },
  { name: "Users",         path: "/admin/users",          icon: Users           },
  { name: "Applications",  path: "/admin/applications",   icon: ClipboardList   },
  { name: "Companies",     path: "/admin/companies",      icon: Building2       },
  { name: "Institutions",  path: "/admin/schools",        icon: School2         },
  { name: "Mentors",       path: "/admin/mentors",        icon: UserCheck       },
  { name: "Slots",         path: "/admin/slots",          icon: Briefcase       },
  { name: "Placements",    path: "/admin/placements",     icon: Briefcase       },
  { name: "Analytics",     path: "/admin/analytics",      icon: BarChart3       },
  { name: "Gamification",  path: "/admin/gamification",   icon: Trophy          },
  { name: "Certificates",  path: "/admin/certificates",   icon: Award           },
  { name: "Resources",     path: "/admin/resources",      icon: BookOpen        },
  { name: "Portfolio",     path: "/admin/portfolio",      icon: FolderOpen      },
  { name: "Notifications", path: "/admin/notifications",  icon: Bell            },
  { name: "Feedback",      path: "/admin/feedback",       icon: MessageSquare   },
  { name: "Settings",      path: "/admin/settings",       icon: Settings2       },
];

const f: React.CSSProperties = { fontFamily: "Inter" };

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate  = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  // Close sidebar after navigation on mobile
  function closeMobile() {
    if (window.innerWidth < 1024) setOpen(false);
  }

  return (
    <div className="flex bg-[#0D0118] h-screen overflow-hidden text-white">

      {/* Mobile backdrop — tapping it closes the sidebar */}
      {open && (
        <div
          className="lg:hidden z-30 fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ──
          Mobile (<lg) : fixed overlay — slides over content, never pushes it
          Desktop (lg+): static flex child — pushes content, collapses to icon rail */}
      <aside
        className={`
          flex flex-col shrink-0 bg-[#12022A] border-r border-[#4B1E91]/40
          transition-all duration-300
          fixed inset-y-0 left-0 z-40 w-64
          lg:static lg:inset-auto
          ${open
            ? "translate-x-0 lg:w-64"
            : "-translate-x-full lg:translate-x-0 lg:w-16"
          }
        `}
      >
        {/* Chevron toggle — desktop only */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="hidden top-8 -right-3 z-20 absolute lg:flex justify-center items-center bg-[#4B1E91] shadow-lg border border-[#12022A] rounded-full w-6 h-6 text-white"
        >
          {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Brand area */}
        <div className={`flex items-center border-b border-[#4B1E91]/30 py-5 px-4 gap-3 ${!open ? "lg:px-0 lg:justify-center" : ""}`}>
          <div className="bg-[#4B1E91] p-2.5 rounded-xl shrink-0">
            <LayoutDashboard size={18} />
          </div>
          <div className={`min-w-0 ${!open ? "lg:hidden" : ""}`}>
            <p className="font-semibold text-sm truncate" style={f}>Emerson Admin</p>
            <p className="text-[#F5F0E8]/50 text-xs truncate" style={f}>Admin Panel</p>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 space-y-0.5 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#4B1E91]/30">
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
                   ${isActive
                    ? "bg-[#4B1E91] text-white"
                    : "text-[#F5F0E8]/80 hover:bg-[#4B1E91]/20 hover:text-white"
                  }`
                }
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
        <div className="py-3 border-[#4B1E91]/30 border-t">
          <button
            onClick={handleLogout}
            title={!open ? "Log Out" : undefined}
            className={`flex items-center py-2.5 mx-2 rounded-xl text-[#F5F0E8]/70
              hover:bg-[#4B1E91]/20 hover:text-white transition-all duration-200
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
        <div className="flex items-center gap-3 bg-[#0D0118]/80 shadow-sm shadow-white backdrop-blur-md px-4 lg:px-6 py-0 border-[#4B1E91]/60 border-b shrink-0">
          {/* Mobile hamburger — opens the sidebar overlay */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden flex justify-center items-center bg-[#4B1E91]/20 hover:bg-[#4B1E91]/40 shadow-md shadow-white rounded-b-2xl w-8 h-8 text-white transition"
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
