import { useMemo, useState } from "react";
import { Plus, X, Users, Star } from "lucide-react";

interface Mentor {
  id: number;
  name: string;
  initials: string;
  email: string;
  department: string;
  assignedInterns: string[];
  maxCapacity: number;
  rating: number;
  status: "active" | "inactive";
  joinedDate: string;
}

const DEPTS = ["Frontend", "Backend", "UX/UI", "Sales", "Marketing", "Social Media"];

const INIT_MENTORS: Mentor[] = [];

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-1">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[#4B1E91]"} />
    ))}
    <span className="ml-1 text-[#F5F0E8] text-xs">{rating.toFixed(1)}</span>
  </span>
);

const EMPTY_FORM = { name: "", email: "", department: "Frontend", maxCapacity: 3 };

const MentorManagement: React.FC = () => {
  const [mentors, setMentors]             = useState<Mentor[]>(INIT_MENTORS);
  const [showAdd, setShowAdd]             = useState(false);
  const [selectedMentor, setSelected]     = useState<Mentor | null>(null);
  const [deactivateTarget, setDeactivate] = useState<Mentor | null>(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [toast, setToast]                 = useState("");

  const stats = useMemo(() => ({
    total:     mentors.length,
    active:    mentors.filter((m) => m.status === "active").length,
    available: mentors.filter((m) => m.status === "active" && m.assignedInterns.length < m.maxCapacity).length,
    avgRating: (mentors.reduce((a, m) => a + m.rating, 0) / mentors.length).toFixed(1),
  }), [mentors]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    const newMentor: Mentor = {
      id:              Date.now(),
      name:            form.name.trim(),
      initials:        form.name.trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
      email:           form.email.trim(),
      department:      form.department,
      assignedInterns: [],
      maxCapacity:     Number(form.maxCapacity),
      rating:          0,
      status:          "active",
      joinedDate:      new Date().toISOString().slice(0, 10),
    };
    setMentors((prev) => [newMentor, ...prev]);
    setForm(EMPTY_FORM);
    setShowAdd(false);
    showToast(`✅ ${newMentor.name} added as mentor.`);
  }

  function handleDeactivate() {
    if (!deactivateTarget) return;
    setMentors((prev) =>
      prev.map((m) => m.id === deactivateTarget.id ? { ...m, status: "inactive", assignedInterns: [] } : m)
    );
    showToast(`⚠️ ${deactivateTarget.name} deactivated. ${deactivateTarget.assignedInterns.length} intern(s) unassigned.`);
    setDeactivate(null);
    if (selectedMentor?.id === deactivateTarget.id) setSelected(null);
  }

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Mentor Management</p>
            <h1 className="mt-2 font-semibold text-3xl">Platform Mentors</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Manage mentor accounts, capacity, and intern assignments.</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-[#4B1E91] px-5 py-3 rounded-2xl font-semibold text-white text-sm">
            <Plus size={16} /> Add Mentor
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{toast}</span>
          <button onClick={() => setToast("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Mentors",  value: stats.total },
          { label: "Active",         value: stats.active },
          { label: "Available",      value: stats.available },
          { label: "Avg Rating",     value: stats.avgRating },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl">
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">{s.label}</p>
            <p className="mt-3 font-semibold text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mentor cards */}
      <div className="gap-4 grid md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3">
        {mentors.map((m) => {
          const fill    = m.assignedInterns.length / m.maxCapacity;
          const barColor = fill >= 0.8 ? "bg-amber-400" : "bg-[#4B1E91]";
          return (
            <div key={m.id} className={`rounded-3xl border bg-[#1E0A4A] p-5 flex flex-col gap-4 ${m.status === "inactive" ? "border-[#4B1E91] opacity-60" : "border-[#4B1E91]"}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-12 h-12 font-bold text-white text-sm">
                    {m.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <span className="inline-block bg-[#4B1E91]/20 mt-1 px-2 py-0.5 rounded-full text-[#D8B9FF] text-xs">
                      {m.department}
                    </span>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${m.status === "active" ? "bg-green-500/15 text-green-300" : "bg-white/10 text-[#F5F0E8]"}`}>
                  {m.status}
                </span>
              </div>

              <Stars rating={m.rating} />

              {/* Capacity bar */}
              <div>
                <div className="flex justify-between mb-1.5 text-[#F5F0E8] text-xs">
                  <span className="flex items-center gap-1"><Users size={11} /> {m.assignedInterns.length} / {m.maxCapacity} interns</span>
                  <span>{Math.round(fill * 100)}%</span>
                </div>
                <div className="bg-[#0D0118] rounded-full h-2">
                  <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${fill * 100}%` }} />
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button onClick={() => setSelected(m)}
                  className="flex-1 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-xs transition">
                  View Profile
                </button>
                {m.status === "active" && (
                  <button onClick={() => setDeactivate(m)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-2xl text-red-300 text-xs transition">
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selectedMentor && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-3 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-14 h-14 font-bold text-lg">
                  {selectedMentor.initials}
                </div>
                <div>
                  <h2 className="font-semibold text-xl">{selectedMentor.name}</h2>
                  <p className="text-[#F5F0E8] text-sm">{selectedMentor.department}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="gap-3 grid grid-cols-2">
                {[
                  { label: "Email",   value: selectedMentor.email },
                  { label: "Status",  value: selectedMentor.status },
                  { label: "Joined",  value: new Date(selectedMentor.joinedDate).toLocaleDateString() },
                  { label: "Rating",  value: `${selectedMentor.rating}/5` },
                ].map((f) => (
                  <div key={f.label} className="bg-[#0D0118] p-3 border border-[#4B1E91] rounded-2xl">
                    <p className="text-[#F5F0E8] text-xs">{f.label}</p>
                    <p className="mt-1 font-medium text-sm">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0D0118] p-4 border border-[#4B1E91] rounded-2xl">
                <p className="mb-3 text-[#F5F0E8] text-xs uppercase tracking-wider">
                  Assigned Interns ({selectedMentor.assignedInterns.length}/{selectedMentor.maxCapacity})
                </p>
                {selectedMentor.assignedInterns.length === 0 ? (
                  <p className="text-[#F5F0E8] text-xs italic">No interns assigned.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedMentor.assignedInterns.map((name) => (
                      <div key={name} className="flex items-center gap-3 bg-[#12022A] px-3 py-2 border border-[#4B1E91] rounded-2xl">
                        <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-full w-7 h-7 font-bold text-xs">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm">{name}</span>
                        <span className="bg-green-500/15 ml-auto px-2 py-0.5 rounded-full text-green-300 text-xs">Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add mentor modal */}
      {showAdd && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center gap-3 mb-6">
              <h2 className="font-semibold text-xl">Add Mentor</h2>
              <button onClick={() => setShowAdd(false)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name",  type: "text",  ph: "Jane Doe" },
                { label: "Email",     key: "email", type: "email", ph: "jane@example.com" },
              ].map(({ label, key, type, ph }) => (
                <label key={key} className="block text-[#F5F0E8] text-sm">
                  {label}
                  <input type={type} placeholder={ph}
                   value={String((form as Record<string, string | number>)[key] ?? '')}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white" />
                </label>
              ))}
              <label className="block text-[#F5F0E8] text-sm">
                Department
                <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white">
                  {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="block text-[#F5F0E8] text-sm">
                Max Capacity
                <input type="number" min={1} max={10} value={form.maxCapacity}
                  onChange={(e) => setForm((p) => ({ ...p, maxCapacity: Number(e.target.value) }))}
                  className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white" />
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={!form.name.trim() || !form.email.trim()}
                className="flex-1 bg-[#4B1E91] disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm">
                Add Mentor
              </button>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate modal */}
      {deactivateTarget && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <h2 className="font-semibold text-white text-xl">Deactivate mentor?</h2>
            <p className="mt-3 text-[#F5F0E8] text-sm">
              Deactivating <span className="font-medium text-white">{deactivateTarget.name}</span> will
              unassign <span className="font-medium text-white">{deactivateTarget.assignedInterns.length}</span> intern(s).
              Are you sure?
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={handleDeactivate}
                className="flex-1 bg-red-500 py-3 rounded-2xl font-semibold text-white text-sm">
                Confirm Deactivate
              </button>
              <button onClick={() => setDeactivate(null)}
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

export default MentorManagement;
