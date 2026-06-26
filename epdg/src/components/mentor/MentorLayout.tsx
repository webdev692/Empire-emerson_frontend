import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/epd_logo.png";
import { LayoutDashboard, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const menuItems = [
  { name: "Dashboard", path: "/mentor",         icon: LayoutDashboard },
  { name: "My Interns", path: "/mentor/interns", icon: Users           },
  { name: "Settings",   path: "/mentor/settings", icon: Settings        },
];

const MentorLayout: React.FC = () => {
  const [open,     setOpen]  = useState(false);
  const clearAuth  = useAuthStore((s) => s.clearAuth);
  const user       = useAuthStore((s) => s.user);
  const navigate   = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="flex bg-[#0D0118] h-screen overflow-hidden text-white">
      {/* Mobile backdrop */}
      {open && (
        <div className="lg:hidden z-30 fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 bg-[#12022A] border-r border-[#4B1E91]/40 transition-all duration-300
        fixed inset-y-0 left-0 z-40 w-64 lg:static lg:inset-auto
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-64"}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-[#4B1E91]/30 py-5 px-4">
          <div className="bg-[#4B1E91] p-2.5 rounded-xl shrink-0">
            <Users size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">Mentor Portal</p>
            <p className="text-[#F5F0E8]/50 text-xs truncate">{user?.name ?? "Mentor"}</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden ml-auto text-[#F5F0E8]">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 space-y-0.5 py-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/mentor"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 mx-2 px-3 rounded-xl transition-all duration-200 text-sm
                   ${isActive ? "bg-[#4B1E91] text-white" : "text-[#F5F0E8]/80 hover:bg-[#4B1E91]/20 hover:text-white"}`
                }
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="py-3 border-t border-[#4B1E91]/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2.5 mx-2 px-3 rounded-xl w-[calc(100%-1rem)]
              text-[#F5F0E8]/70 hover:bg-[#4B1E91]/20 hover:text-white transition-all duration-200 text-sm"
          >
            <LogOut size={18} className="shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center gap-3 bg-[#0D0118]/80 shadow-sm shadow-white backdrop-blur-md px-4 lg:px-6 py-0 border-b border-[#4B1E91]/60 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden flex justify-center items-center bg-[#4B1E91]/20 hover:bg-[#4B1E91]/40 rounded-b-2xl w-8 h-8 text-white transition"
          >
            <Menu size={18} />
          </button>
          <img src={logo} alt="Emerson Professional" className="w-auto h-28 object-contain" />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MentorLayout;
