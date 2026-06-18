import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock, ArrowRight } from "lucide-react";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

interface Stats {
  mentor_name:          string;
  total_interns:        number;
  completed_onboarding: number;
}

interface Intern {
  id: number;
  name: string;
  email: string;
  department: string | null;
  course: string | null;
  onboarding_step: number;
  onboarding_complete: boolean;
}

const MentorDashboard: React.FC = () => {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);

  const user     = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [statsRes, internsRes] = await Promise.all([
          api.get<{ success: boolean; data: Stats }>("/api/mentor/stats"),
          api.get<{ success: boolean; data: Intern[] }>("/api/mentor/interns"),
        ]);
        setStats(statsRes.data.data);
        setInterns(internsRes.data.data.slice(0, 5));
      } catch {
        // silently fail — empty state shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pending = interns.filter((i) => !i.onboarding_complete).length;

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Mentor Portal</p>
        <h1 className="mt-2 font-semibold text-3xl">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-[#F5F0E8]/70 text-sm">Here's an overview of your assigned interns.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="gap-4 grid sm:grid-cols-3">
            {[
              { label: "Assigned Interns",  value: stats?.total_interns        ?? 0, icon: Users         },
              { label: "Onboarding Done",   value: stats?.completed_onboarding ?? 0, icon: CheckCircle   },
              { label: "Pending Onboarding", value: pending,                         icon: Clock          },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl flex items-center gap-4">
                  <div className="bg-[#4B1E91]/20 p-3 rounded-2xl">
                    <Icon size={20} className="text-[#D8B9FF]" />
                  </div>
                  <div>
                    <p className="text-[#F5F0E8]/70 text-xs uppercase tracking-wider">{s.label}</p>
                    <p className="mt-1 font-semibold text-2xl">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent interns */}
          <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-3xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#4B1E91]/40">
              <h2 className="font-semibold text-lg">My Interns</h2>
              <button
                onClick={() => navigate("/mentor/interns")}
                className="flex items-center gap-1 text-[#D8B9FF] text-sm hover:text-white transition"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>

            {interns.length === 0 ? (
              <div className="px-6 py-10 text-center text-[#F5F0E8]/50 text-sm">
                No interns assigned yet. The admin will assign interns from the applications panel.
              </div>
            ) : (
              <div className="divide-y divide-[#4B1E91]/30">
                {interns.map((intern) => (
                  <div key={intern.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-10 h-10 font-bold text-sm shrink-0">
                      {intern.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{intern.name}</p>
                      <p className="text-[#F5F0E8]/50 text-xs truncate">{intern.department ?? "No dept"} · {intern.course ?? "No course"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      intern.onboarding_complete
                        ? "bg-green-500/15 text-green-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}>
                      {intern.onboarding_complete ? "Active" : `Step ${intern.onboarding_step}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MentorDashboard;
