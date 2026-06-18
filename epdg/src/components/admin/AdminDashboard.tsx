import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Bell, ArrowRight, Briefcase, Building2, Users, ChartBar, ShieldCheck, Flag } from "lucide-react";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

interface Stats {
  companies:         number;
  schools:           number;
  interns:           number;
  active_placements: number;
  pending_approvals: number;
  pending_companies: { name: string; created_at: string }[];
  pending_schools:   { name: string; created_at: string }[];
  pending_interns:   number;
}


const AdminDashboard: React.FC = () => {
  const adminName = useAuthStore((s) => s.user?.name ?? "Admin");
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: Stats }>('/api/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => {/* silent — show skeleton */})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n?: number) => loading ? '…' : String(n ?? 0);

  const statCards = [
    { label: "Companies",         value: fmt(stats?.companies),         icon: Building2,  accent: "bg-blue-500/20 text-blue-300",   border: "border-blue-500/30"   },
    { label: "Institutions",      value: fmt(stats?.schools),           icon: Users,      accent: "bg-teal-500/20 text-teal-300",   border: "border-teal-500/30"   },
    { label: "Interns",           value: fmt(stats?.interns),           icon: Briefcase,  accent: "bg-[#4B1E91]/30 text-[#D8B9FF]",border: "border-[#4B1E91]/40"  },
    { label: "Active Placements", value: fmt(stats?.active_placements), icon: ChartBar,   accent: "bg-green-500/20 text-green-300", border: "border-green-500/30"  },
    { label: "Certificates",      value: "—",                           icon: ShieldCheck,accent: "bg-[#C9A84C]/20 text-[#C9A84C]", border: "border-[#C9A84C]/30" },
    { label: "Pending Approvals", value: fmt(stats?.pending_approvals), icon: Bell,       accent: "bg-red-500/20 text-red-300",     border: "border-red-500/30"    },
  ];

  return (
    <div className="space-y-6 text-white">
      <header className="flex md:flex-row flex-col md:justify-between md:items-end gap-3">
        <div>
          <p className="text-[#FFD700] text-sm uppercase tracking-[0.25em]">Admin dashboard home</p>
          <h1 className="mt-2 font-semibold text-3xl">Welcome back, {adminName}</h1>
          <p className="mt-2 max-w-2xl text-[#F5F0E8]">
            Monitor approvals, placements, activity and the team at a glance.
          </p>
        </div>
        <div className="bg-[#1E0A4A] p-4 border border-[#C9A84C]/40 rounded-3xl">
          <p className="text-[#C9A84C] text-sm uppercase tracking-[0.2em]">Pending approvals</p>
          <p className={`mt-2 text-3xl font-semibold ${loading ? "animate-pulse text-[#C9A84C]/50" : "text-white"}`}>
            {fmt(stats?.pending_approvals)}
          </p>
          <p className="mt-1 text-[#F5F0E8]/60 text-sm">Accounts awaiting review</p>
        </div>
      </header>

      {/* Stats grid */}
      <section className="gap-4 grid lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-[#1E0A4A] p-5 border ${stat.border} rounded-3xl`}>
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">{stat.label}</p>
                  <p className={`mt-3 text-3xl font-semibold ${loading ? "text-[#4B1E91] animate-pulse" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.accent} p-3 rounded-2xl`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Pending approvals + quick actions */}
      <section className="gap-4 grid xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3">
            <div>
              <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.3em]">Pending approvals</p>
              <h2 className="mt-2 font-semibold text-xl">Requires Your Attention</h2>
            </div>
            <Link to="/admin/companies"
              className="inline-flex items-center gap-2 bg-[#4B1E91] px-4 py-2 rounded-2xl font-medium text-white text-sm">
              View All Pending <ArrowRight size={16} />
            </Link>
          </div>

          <div className="gap-4 grid sm:grid-cols-2">
            <div className="bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl">
              <p className="text-[#F5F0E8] text-sm">Pending companies</p>
              <div className="space-y-3 mt-4">
                {loading ? (
                  <div className="bg-[#1E0A4A] rounded-3xl h-16 animate-pulse" />
                ) : stats?.pending_companies.length === 0 ? (
                  <p className="text-[#F5F0E8] text-xs italic">None pending</p>
                ) : (
                  stats?.pending_companies.map((c) => (
                    <div key={c.name} className="bg-[#1E0A4A] p-4 border border-[#4B1E91] rounded-3xl">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-[#F5F0E8] text-xs">
                            Registered {new Date(c.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Link to="/admin/companies" className="text-[#4B1E91] text-sm">Review →</Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl">
              <p className="text-[#F5F0E8] text-sm">Pending institutions</p>
              <div className="space-y-3 mt-4">
                {loading ? (
                  <div className="bg-[#1E0A4A] rounded-3xl h-16 animate-pulse" />
                ) : stats?.pending_schools.length === 0 ? (
                  <p className="text-[#F5F0E8] text-xs italic">None pending</p>
                ) : (
                  stats?.pending_schools.map((s) => (
                    <div key={s.name} className="bg-[#1E0A4A] p-4 border border-[#4B1E91] rounded-3xl">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-[#F5F0E8] text-xs">
                            Registered {new Date(s.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Link to="/admin/schools" className="text-[#4B1E91] text-sm">Review →</Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Quick actions</p>
            <p className="mt-2 font-semibold text-xl">Fast access</p>
          </div>
          <div className="gap-3 grid sm:grid-cols-2">
            {[
              { label: "Review applications", to: "/admin/applications" },
              { label: "Approve companies",   to: "/admin/companies"    },
              { label: "Approve institutions", to: "/admin/schools"      },
              { label: "Manage users",        to: "/admin/users"        },
            ].map(({ label, to }) => (
              <Link key={to} to={to}
                className="bg-[#0D0118] hover:bg-[#1E0A4A] px-4 py-4 border border-[#4B1E91] rounded-3xl text-[#E6E6FA] text-sm text-left transition">
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Applications + placements */}
      <section className="gap-4 grid xl:grid-cols-[0.95fr_0.85fr]">
        <div className="space-y-4 bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
            <div>
              <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Pending intern applications</p>
              <h2 className={`mt-2 text-2xl font-semibold ${loading ? "text-[#4B1E91] animate-pulse" : ""}`}>
                {loading ? "…" : `${stats?.pending_interns ?? 0} applications`}
              </h2>
            </div>
            <Link to="/admin/applications"
              className="inline-flex items-center gap-2 bg-[#4B1E91] px-4 py-2 rounded-2xl font-medium text-white text-sm">
              Review Applications →
            </Link>
          </div>
          <div className="gap-3 grid sm:grid-cols-3">
            {["Pending review", "Institution-referred", "Self-applied"].map((label) => (
              <div key={label} className="bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl">
                <p className="text-[#F5F0E8] text-xs">{label}</p>
                <p className={`mt-3 text-xl font-semibold ${loading ? "text-[#4B1E91] animate-pulse" : ""}`}>
                  {loading ? "…" : label === "Pending review" ? (stats?.pending_interns ?? 0) : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Active placements</p>
          <p className={`mt-2 text-2xl font-semibold ${loading ? "text-[#4B1E91] animate-pulse" : ""}`}>
            {loading ? "…" : `${stats?.active_placements ?? 0} active`}
          </p>
          <p className="mt-4 text-[#F5F0E8] text-sm">
            {loading ? "" : stats?.active_placements === 0
              ? "No active placements yet."
              : "Placement breakdown available once department data is tracked."}
          </p>
        </div>
      </section>

      {/* Activity + alerts */}
      <section className="gap-4 grid xl:grid-cols-[0.9fr_0.7fr]">
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Activity feed</p>
              <p className="mt-2 font-semibold text-xl">Recent events</p>
            </div>
            <div className="bg-[#0D0118] px-4 py-2 rounded-2xl text-[#F5F0E8] text-sm">Live</div>
          </div>
          <div className="bg-[#0D0118] mt-5 p-6 border border-[#4B1E91] rounded-3xl text-center">
            <p className="text-[#F5F0E8] text-sm">Activity feed coming soon.</p>
            <p className="mt-1 text-[#F5F0E8]/60 text-xs">Events will appear here once the activity log is connected.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
            <div className="flex items-center gap-3 text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">
              <Flag size={16} /><span>Alerts</span>
            </div>
            <div className="space-y-3 mt-5">
              {stats?.pending_approvals ? (
                <div className="flex justify-between items-center gap-3 bg-[#0D0118] p-4 border border-[#EF4444] rounded-3xl">
                  <p className="text-white text-sm">
                    {stats.pending_approvals} account{stats.pending_approvals > 1 ? 's' : ''} awaiting approval.
                  </p>
                  <Link to="/admin/applications" className="text-[#4B1E91] text-sm whitespace-nowrap">Review →</Link>
                </div>
              ) : null}
              {!loading && !stats?.pending_approvals && (
                <p className="py-4 text-[#F5F0E8] text-sm text-center">No active alerts.</p>
              )}
            </div>
          </div>

          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
            <div className="flex items-center gap-3 text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">
              <Sparkles size={16} /><span>Quick actions</span>
            </div>
            <div className="gap-3 grid mt-5">
              {[
                { label: "Review applications", to: "/admin/applications" },
                { label: "Approve companies",   to: "/admin/companies"    },
                { label: "Approve institutions", to: "/admin/schools"      },
                { label: "Manage users",        to: "/admin/users"        },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  className="bg-[#0D0118] hover:bg-[#1E0A4A] px-4 py-3 rounded-3xl text-[#E6E6FA] text-sm text-left transition">
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
