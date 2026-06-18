import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

type SlotStatus = "draft" | "open" | "closed" | "filled";

interface Slot {
  id: number;
  title: string;
  department: string | null;
  description: string | null;
  requirements: string | null;
  skills_required: string[] | null;
  slots_available: number;
  slots_filled: number;
  duration_weeks: number | null;
  stipend: number | null;
  is_remote: boolean;
  county: string | null;
  deadline: string | null;
  status: SlotStatus;
  created_at: string;
  company_name: string | null;
  created_by_name: string | null;
}

const DEPARTMENTS = ["Frontend", "Backend", "UX/UI", "Sales", "Marketing", "Social Media", "Data & Analytics", "HR & Admin"];
const STATUSES: SlotStatus[] = ["draft", "open", "closed", "filled"];

const STATUS_STYLE: Record<SlotStatus, string> = {
  draft:  "bg-gray-500/15 text-gray-300 border-gray-500/30",
  open:   "bg-green-500/15 text-green-300 border-green-500/30",
  closed: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  filled: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

const BLANK_FORM = {
  title:           "",
  department:      "",
  description:     "",
  requirements:    "",
  skills_input:    "",
  slots_available: 1,
  duration_weeks:  "" as number | "",
  stipend:         "" as number | "",
  is_remote:       false,
  county:          "",
  deadline:        "",
  status:          "draft" as SlotStatus,
};

const inputCls = "w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white text-sm outline-none placeholder-white/25 focus:border-[#8B5CF6] transition";
const labelCls = "block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]/60";

const SlotManagement: React.FC = () => {
  const [slots,   setSlots]   = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [filterStatus, setFilterStatus]     = useState<SlotStatus | "all">("all");
  const [filterDept,   setFilterDept]       = useState("");

  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState({ ...BLANK_FORM });

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Slot[] }>("/api/admin/slots");
      setSlots(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to load slots.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...BLANK_FORM });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(slot: Slot) {
    setForm({
      title:           slot.title,
      department:      slot.department   ?? "",
      description:     slot.description  ?? "",
      requirements:    slot.requirements ?? "",
      skills_input:    (slot.skills_required ?? []).join(", "),
      slots_available: slot.slots_available,
      duration_weeks:  slot.duration_weeks ?? "",
      stipend:         slot.stipend        ?? "",
      is_remote:       slot.is_remote,
      county:          slot.county   ?? "",
      deadline:        slot.deadline ? slot.deadline.slice(0, 10) : "",
      status:          slot.status,
    });
    setEditingId(slot.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function set(field: keyof typeof BLANK_FORM, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload() {
    const skills = form.skills_input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      title:           form.title.trim(),
      department:      form.department   || undefined,
      description:     form.description  || undefined,
      requirements:    form.requirements || undefined,
      skills_required: skills.length ? skills : undefined,
      slots_available: Number(form.slots_available),
      duration_weeks:  form.duration_weeks !== "" ? Number(form.duration_weeks) : undefined,
      stipend:         form.stipend        !== "" ? Number(form.stipend)        : undefined,
      is_remote:       form.is_remote,
      county:          form.county   || undefined,
      deadline:        form.deadline || undefined,
      status:          form.status,
    };
  }

  async function handleSave() {
    if (!form.title.trim()) { setMessage("Title is required."); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { data } = await api.patch<{ success: boolean; data: Slot }>(`/api/admin/slots/${editingId}`, buildPayload());
        setSlots((prev) => prev.map((s) => s.id === editingId ? data.data : s));
        setMessage("✅ Slot updated.");
      } else {
        const { data } = await api.post<{ success: boolean; data: Slot }>("/api/admin/slots", buildPayload());
        setSlots((prev) => [data.data, ...prev]);
        setMessage("✅ Slot created.");
      }
      closeForm();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this slot?")) return;
    try {
      await api.delete(`/api/admin/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      setMessage("Slot deleted.");
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Delete failed.");
    }
  }

  async function quickStatus(id: number, status: SlotStatus) {
    try {
      const { data } = await api.patch<{ success: boolean; data: Slot }>(`/api/admin/slots/${id}`, { status });
      setSlots((prev) => prev.map((s) => s.id === id ? data.data : s));
    } catch {
      setMessage("Status update failed.");
    }
  }

  const visible = slots.filter((s) => {
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (filterDept   && s.department !== filterDept)         return false;
    return true;
  });

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8]/60">Internship Slots</p>
            <h1 className="mt-1 text-2xl font-semibold">Manage Opportunities</h1>
            <p className="mt-1 text-sm text-[#F5F0E8]/60">
              Create and publish internship openings that interns can discover and apply to.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3d1778] transition shrink-0"
          >
            <Plus size={16} /> Add New Slot
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-sm text-[#F5F0E8]">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-4">
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                filterStatus === s ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]/70 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-3 py-2 text-sm text-white outline-none"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button
          onClick={fetchSlots}
          className="rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-2 text-xs text-[#F5F0E8] hover:text-white transition"
        >
          Refresh
        </button>
        <span className="ml-auto self-center text-xs text-[#F5F0E8]/50">{visible.length} slot(s)</span>
      </div>

      {/* Slot list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-[#4B1E91] border-t-transparent animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-12 text-center text-[#F5F0E8]/50">
          No slots found. Create one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((slot) => (
            <div key={slot.id} className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[slot.status]}`}>
                      {slot.status}
                    </span>
                    {slot.department && (
                      <span className="rounded-full bg-[#4B1E91]/20 px-3 py-0.5 text-xs text-[#D8B9FF]">
                        {slot.department}
                      </span>
                    )}
                    {slot.is_remote && (
                      <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-0.5 text-xs text-teal-300">
                        Remote
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white">{slot.title}</h3>

                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-[#F5F0E8]/50">
                    {slot.company_name && <span>🏢 {slot.company_name}</span>}
                    {slot.created_by_name && <span>👤 {slot.created_by_name}</span>}
                    <span>{slot.slots_filled}/{slot.slots_available} filled</span>
                    {slot.duration_weeks && <span>⏱ {slot.duration_weeks}w</span>}
                    {slot.stipend && <span>💰 ${Number(slot.stipend).toLocaleString()}</span>}
                    {slot.deadline && <span>📅 {new Date(slot.deadline).toLocaleDateString()}</span>}
                    {slot.county && <span>📍 {slot.county}</span>}
                  </div>

                  {slot.description && (
                    <p className="mt-2 text-sm text-[#F5F0E8]/60 line-clamp-2">{slot.description}</p>
                  )}

                  {slot.skills_required && slot.skills_required.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.skills_required.slice(0, 8).map((sk) => (
                        <span key={sk} className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-[#F5F0E8]/60">
                          {sk}
                        </span>
                      ))}
                      {slot.skills_required.length > 8 && (
                        <span className="text-[10px] text-[#F5F0E8]/40">+{slot.skills_required.length - 8} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right — actions */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {/* Quick status change */}
                  <div className="relative">
                    <select
                      value={slot.status}
                      onChange={(e) => quickStatus(slot.id, e.target.value as SlotStatus)}
                      className="appearance-none rounded-2xl border border-[#4B1E91] bg-[#0D0118] pl-3 pr-7 py-2 text-xs text-white outline-none cursor-pointer"
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#F5F0E8]/40" />
                  </div>
                  <button
                    onClick={() => openEdit(slot)}
                    className="rounded-2xl border border-[#4B1E91] bg-[#4B1E91]/20 p-2 text-[#D8B9FF] hover:bg-[#4B1E91]/40 transition"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20 transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 pt-8">
          <div className="w-full max-w-2xl rounded-3xl border border-[#4B1E91] bg-[#12022A] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit Slot" : "Add New Internship Slot"}
              </h2>
              <button onClick={closeForm} className="text-[#F5F0E8]/50 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Frontend Developer Intern" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Department</label>
                  <select value={form.department} onChange={(e) => set("department", e.target.value)}
                    className={inputCls}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value as SlotStatus)}
                    className={inputCls}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                  rows={3} placeholder="What will the intern work on?" className={inputCls + " resize-none"} />
              </div>

              <div>
                <label className={labelCls}>Requirements</label>
                <textarea value={form.requirements} onChange={(e) => set("requirements", e.target.value)}
                  rows={3} placeholder="What qualifications are needed?" className={inputCls + " resize-none"} />
              </div>

              <div>
                <label className={labelCls}>Required Skills <span className="normal-case font-normal">(comma-separated)</span></label>
                <input value={form.skills_input} onChange={(e) => set("skills_input", e.target.value)}
                  placeholder="React, TypeScript, Tailwind CSS" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className={labelCls}>Slots</label>
                  <input type="number" min={1} value={form.slots_available}
                    onChange={(e) => set("slots_available", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Duration (weeks)</label>
                  <input type="number" min={1} value={form.duration_weeks}
                    onChange={(e) => set("duration_weeks", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="12" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Stipend ($)</label>
                  <input type="number" min={0} value={form.stipend}
                    onChange={(e) => set("stipend", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="500" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Deadline</label>
                  <input type="date" value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Location / County</label>
                  <input value={form.county} onChange={(e) => set("county", e.target.value)}
                    placeholder="e.g. Nairobi" className={inputCls} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="remote" checked={form.is_remote}
                    onChange={(e) => set("is_remote", e.target.checked)}
                    className="h-4 w-4 rounded border-[#4B1E91] bg-[#0D0118] text-[#4B1E91]" />
                  <label htmlFor="remote" className="text-sm text-[#F5F0E8]/70 cursor-pointer">Remote position</label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button onClick={closeForm}
                className="rounded-2xl border border-[#4B1E91] px-5 py-2.5 text-sm text-[#F5F0E8] hover:text-white transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="rounded-2xl bg-[#4B1E91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3d1778] disabled:opacity-50 disabled:cursor-not-allowed transition">
                {saving ? "Saving…" : editingId ? "Update Slot" : "Create Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;
