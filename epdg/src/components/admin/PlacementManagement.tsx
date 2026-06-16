import { useMemo, useState } from "react";
import { Download, X } from "lucide-react";

type PlacementStatus = "active" | "ending_soon" | "completed" | "terminated";

interface Placement {
  id: number;
  internName: string;
  internInitials: string;
  internEmail: string;
  company: string;
  department: string;
  mentor: string;
  startDate: string;
  endDate: string;
  status: PlacementStatus;
  progressPercent: number;
  notes: string;
}

const INIT: Placement[] = [];

const STATUS_META: Record<PlacementStatus, { label: string; cls: string }> = {
  active:      { label: "Active",       cls: "bg-green-500/15 text-green-300"  },
  ending_soon: { label: "Ending Soon",  cls: "bg-amber-500/15 text-amber-200"  },
  completed:   { label: "Completed",    cls: "bg-[#4B1E91]/15 text-[#D8B9FF]"  },
  terminated:  { label: "Terminated",  cls: "bg-red-500/15 text-red-300"       },
};

const ALL_DEPTS     = ["All"];
const ALL_COMPANIES = ["All"];
const STATUS_TABS   = ["all", "active", "ending_soon", "completed", "terminated"] as const;

const PlacementManagement: React.FC = () => {
  const [placements, setPlacements]     = useState<Placement[]>(INIT);
  const [deptFilter, setDept]           = useState("All");
  const [compFilter, setComp]           = useState("All");
  const [statusTab, setStatusTab]       = useState<typeof STATUS_TABS[number]>("all");
  const [selected, setSelected]         = useState<Placement | null>(null);
  const [showEnd, setShowEnd]           = useState<Placement | null>(null);
  const [endReason, setEndReason]       = useState("");
  const [toast, setToast]               = useState("");

  function showMsg(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function confirmEnd() {
    if (!showEnd || !endReason.trim()) return;
    setPlacements((prev) =>
      prev.map((p) => p.id === showEnd.id
        ? { ...p, status: "terminated", notes: endReason.trim() }
        : p)
    );
    showMsg(`❌ ${showEnd.internName}'s placement ended early.`);
    setShowEnd(null);
    setEndReason("");
    setSelected(null);
  }

  const stats = useMemo(() => ({
    active:      placements.filter((p) => p.status === "active").length,
    endingThis:  placements.filter((p) => p.status === "ending_soon").length,
    completedN:  placements.filter((p) => p.status === "completed").length,
    terminated:  placements.filter((p) => p.status === "terminated").length,
  }), [placements]);

  const filtered = useMemo(() => placements.filter((p) => {
    if (deptFilter !== "All" && p.department !== deptFilter) return false;
    if (compFilter !== "All" && p.company !== compFilter)    return false;
    if (statusTab  !== "all" && p.status !== statusTab)      return false;
    return true;
  }).sort((a, b) => {
    const order: PlacementStatus[] = ["ending_soon", "active", "completed", "terminated"];
    return order.indexOf(a.status) - order.indexOf(b.status);
  }), [placements, deptFilter, compFilter, statusTab]);

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Placement Management</p>
            <h1 className="mt-2 font-semibold text-3xl">Placement Lifecycle</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Track start dates, end dates, and status across all active placements.</p>
          </div>
          <button onClick={() => showMsg("📥 Export feature coming soon.")}
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-sm transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{toast}</span><button onClick={() => setToast("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Placements",   value: stats.active },
          { label: "Ending Soon",         value: stats.endingThis },
          { label: "Completed",           value: stats.completedN },
          { label: "Early Terminations",  value: stats.terminated },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl">
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">{s.label}</p>
            <p className="mt-3 font-semibold text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((t) => (
            <button key={t} onClick={() => setStatusTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition capitalize ${statusTab === t ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"}`}>
              {t === "ending_soon" ? "Ending Soon" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select value={deptFilter} onChange={(e) => setDept(e.target.value)}
          className="bg-[#0D0118] px-3 py-2 border border-[#4B1E91] rounded-2xl outline-none text-[#F5F0E8] text-sm">
          {ALL_DEPTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={compFilter} onChange={(e) => setComp(e.target.value)}
          className="bg-[#0D0118] px-3 py-2 border border-[#4B1E91] rounded-2xl outline-none text-[#F5F0E8] text-sm">
          {ALL_COMPANIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="ml-auto text-[#F5F0E8] text-xs">{filtered.length} placement(s)</span>
      </div>

      {/* Table */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[#F5F0E8] text-xs uppercase tracking-[0.3em]">
              <th className="px-4 py-2 text-left">Intern</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Dept</th>
              <th className="px-4 py-2 text-left">Mentor</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-[#F5F0E8] text-center">No placements match.</td></tr>
            ) : filtered.map((p) => {
              const remaining = 100 - p.progressPercent;
              const barColor  = remaining < 20 ? "bg-amber-400" : "bg-green-500";
              return (
                <tr key={p.id} className="bg-[#0D0118] rounded-3xl">
                  <td className="px-4 py-4 rounded-l-3xl">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-9 h-9 font-bold text-xs">
                        {p.internInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{p.internName}</p>
                        <p className="text-[#F5F0E8] text-xs">{p.internEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#F5F0E8]">{p.company}</td>
                  <td className="px-4 py-4 text-[#F5F0E8]">{p.department}</td>
                  <td className="px-4 py-4 text-[#F5F0E8]">{p.mentor}</td>
                  <td className="px-4 py-4 min-w-30">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#1E0A4A] rounded-full h-2">
                        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${p.progressPercent}%` }} />
                      </div>
                      <span className="text-[#F5F0E8] text-xs">{p.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[p.status].cls}`}>
                      {STATUS_META[p.status].label}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-4 rounded-r-3xl">
                    <button onClick={() => setSelected(p)}
                      className="px-3 py-1.5 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-xs transition">
                      View
                    </button>
                    {(p.status === "active" || p.status === "ending_soon") && (
                      <button onClick={() => { setShowEnd(p); setEndReason(""); }}
                        className="bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-2xl text-red-300 text-xs transition">
                        End Early
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-3 mb-6">
              <div>
                <h2 className="font-semibold text-xl">{selected.internName}</h2>
                <p className="text-[#F5F0E8] text-sm">{selected.company} · {selected.department}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>

            <div className="gap-3 grid grid-cols-2 mb-4">
              {[
                { label: "Start Date", value: new Date(selected.startDate).toLocaleDateString() },
                { label: "End Date",   value: new Date(selected.endDate).toLocaleDateString()   },
                { label: "Mentor",     value: selected.mentor },
                { label: "Status",     value: STATUS_META[selected.status].label },
              ].map((f) => (
                <div key={f.label} className="bg-[#0D0118] p-3 border border-[#4B1E91] rounded-2xl">
                  <p className="text-[#F5F0E8] text-xs">{f.label}</p>
                  <p className="mt-1 font-medium text-sm">{f.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0D0118] mb-4 p-4 border border-[#4B1E91] rounded-2xl">
              <p className="mb-2 text-[#F5F0E8] text-xs">Progress</p>
              <div className="bg-[#1E0A4A] rounded-full h-3">
                <div className="bg-green-500 rounded-full h-3" style={{ width: `${selected.progressPercent}%` }} />
              </div>
              <p className="mt-1 text-[#F5F0E8] text-xs">{selected.progressPercent}% complete</p>
            </div>

            {selected.notes && (
              <div className="bg-[#0D0118] p-4 border border-[#4B1E91] rounded-2xl">
                <p className="mb-1 text-[#F5F0E8] text-xs">Notes</p>
                <p className="text-sm">{selected.notes}</p>
              </div>
            )}

            {(selected.status === "active" || selected.status === "ending_soon") && (
              <button onClick={() => { setShowEnd(selected); setSelected(null); setEndReason(""); }}
                className="bg-red-500/10 hover:bg-red-500/20 mt-4 py-3 rounded-2xl w-full text-red-300 text-sm transition">
                End Placement Early
              </button>
            )}
          </div>
        </div>
      )}

      {/* End early modal */}
      {showEnd && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h2 className="font-semibold text-xl">End Placement Early</h2>
              <button onClick={() => setShowEnd(null)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <p className="mb-4 text-[#F5F0E8] text-sm">
              You are ending <span className="font-medium text-white">{showEnd.internName}</span>'s placement at{" "}
              <span className="font-medium text-white">{showEnd.company}</span> early. This action cannot be undone.
            </p>
            <textarea value={endReason} onChange={(e) => setEndReason(e.target.value)}
              placeholder="Reason for early termination (required)"
              rows={3}
              className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white" />
            <div className="flex gap-3 mt-4">
              <button onClick={confirmEnd} disabled={!endReason.trim()}
                className="flex-1 bg-red-500 disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm">
                Confirm End Placement
              </button>
              <button onClick={() => setShowEnd(null)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementManagement;
