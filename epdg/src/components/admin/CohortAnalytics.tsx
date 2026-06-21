import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface Analytics {
  completionRate:     number;
  mentorSatisfaction: number | null;
  cohortsActive:      number;
  placementSuccess:   number;
}

const CohortAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: Analytics }>('/api/admin/cohort-analytics')
      .then(({ data }) => setAnalytics(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pct  = (v?: number | null) => loading ? '…' : v == null ? '—' : `${v}%`;
  const num  = (v?: number | null) => loading ? '…' : v == null ? '—' : String(v);
  const rate = (v?: number | null) => loading ? '…' : v == null ? '—' : `${v}/5`;

  const metricCards = [
    { label: "Completion rate",    icon: "bg-[#4B1E91]",  value: pct(analytics?.completionRate)      },
    { label: "Mentor satisfaction",icon: "bg-green-500",  value: rate(analytics?.mentorSatisfaction)  },
    { label: "Cohorts active",     icon: "bg-[#F59E0B]",  value: num(analytics?.cohortsActive)        },
    { label: "Placement success",  icon: "bg-[#22C55E]",  value: pct(analytics?.placementSuccess)     },
  ];

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Cohort analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">Learner performance overview</h1>
        <p className="mt-2 max-w-2xl text-[#F5F0E8]">Monitor cohort health, outcomes and mentor engagement across active groups.</p>
      </div>

      {/* Metric cards */}
      <section className="grid gap-4 lg:grid-cols-2">
        {metricCards.map((m) => (
          <div key={m.label} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">{m.label}</p>
                <p className={`mt-4 text-3xl font-semibold ${loading ? "text-[#4B1E91] animate-pulse" : "text-white"}`}>
                  {m.value}
                </p>
              </div>
              <div className={`${m.icon} rounded-3xl p-3`}>
                <BarChart3 size={20} />
              </div>
            </div>
            {!loading && m.value === '—' && (
              <p className="mt-4 text-sm text-[#F5F0E8]/50">No data yet</p>
            )}
          </div>
        ))}
      </section>

      {/* Cohort progress */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Cohort progress</p>
        <h2 className="mt-2 text-xl font-semibold">Active group tracking</h2>
        {loading ? (
          <div className="mt-6 rounded-3xl border border-[#4B1E91] bg-[#0D0118] h-24 animate-pulse" />
        ) : analytics && analytics.cohortsActive > 0 ? (
          <div className="mt-6 rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <p className="text-[#F5F0E8] text-sm">
              <span className="font-semibold text-white">{analytics.cohortsActive}</span> active placement{analytics.cohortsActive !== 1 ? 's' : ''} in progress.
              Overall completion rate: <span className="font-semibold text-white">{analytics.completionRate}%</span>.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8 text-center">
            <p className="text-[#F5F0E8]">No cohort data available.</p>
            <p className="mt-1 text-xs text-[#F5F0E8]/50">Active placements will be tracked here once they begin.</p>
          </div>
        )}
      </div>

      {/* Engagement + adoption */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8">
          <p className="text-sm text-[#F5F0E8]">Engagement summary</p>
          {!loading && analytics ? (
            <p className="mt-3 text-2xl font-semibold">
              {analytics.placementSuccess}<span className="text-sm font-normal text-[#F5F0E8] ml-1">% success rate</span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-[#F5F0E8]/50">No data yet</p>
          )}
        </div>
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8">
          <p className="text-sm text-[#F5F0E8]">Mentor satisfaction</p>
          {!loading && analytics?.mentorSatisfaction != null ? (
            <p className="mt-3 text-2xl font-semibold">
              {analytics.mentorSatisfaction}<span className="text-sm font-normal text-[#F5F0E8] ml-1">/ 5 avg rating</span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-[#F5F0E8]/50">No feedback data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortAnalytics;
