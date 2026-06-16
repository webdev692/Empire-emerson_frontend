import { BarChart3 } from "lucide-react";

const metricLabels = [
  { label: "Completion rate",    icon: "bg-[#4B1E91]"  },
  { label: "Mentor satisfaction",icon: "bg-green-500"  },
  { label: "Cohorts active",     icon: "bg-[#F59E0B]"  },
  { label: "Placement success",  icon: "bg-[#22C55E]"  },
];

const CohortAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Cohort analytics</p>
          <h1 className="mt-2 text-3xl font-semibold">Learner performance overview</h1>
          <p className="mt-2 max-w-2xl text-[#F5F0E8]">Monitor cohort health, outcomes and mentor engagement across active groups.</p>
        </div>
      </div>

      {/* Metric cards — awaiting backend */}
      <section className="grid gap-4 lg:grid-cols-2">
        {metricLabels.map((m) => (
          <div key={m.label} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">{m.label}</p>
                <p className="mt-4 text-3xl font-semibold text-[#4B1E91]">—</p>
              </div>
              <div className={`${m.icon} rounded-3xl p-3`}>
                <BarChart3 size={20} />
              </div>
            </div>
            <p className="mt-4 text-sm text-[#F5F0E8]/50">No data yet</p>
          </div>
        ))}
      </section>

      {/* Cohort progress — awaiting backend */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Cohort progress</p>
        <h2 className="mt-2 text-xl font-semibold">Active group tracking</h2>
        <div className="mt-6 rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8 text-center">
          <p className="text-[#F5F0E8]">No cohort data available.</p>
          <p className="mt-1 text-xs text-[#F5F0E8]/50">Cohort analytics will appear here once the backend endpoint is connected.</p>
        </div>
      </div>

      {/* Engagement + adoption — awaiting backend */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8 text-center">
          <p className="text-sm text-[#F5F0E8]">Engagement summary</p>
          <p className="mt-2 text-xs text-[#F5F0E8]/50">No data yet</p>
        </div>
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-8 text-center">
          <p className="text-sm text-[#F5F0E8]">Course adoption</p>
          <p className="mt-2 text-xs text-[#F5F0E8]/50">No data yet</p>
        </div>
      </div>
    </div>
  );
};

export default CohortAnalytics;
