import { useMemo, useState, useEffect } from "react";
import { CheckCircle2,  } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

interface School {
  id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  school_type: string;
  city: string;
  country: string;
  contact_person: string;
  phone: string;
  website: string;
  rejection_reason: string;
}

const statusFilters = ["all", "pending", "approved", "rejected"] as const;

const typeBadge = (type: string) => {
  switch (type) {
    case "University":   return "bg-blue-600 text-white";
    case "College":      return "bg-purple-600 text-white";
    case "Polytechnic":  return "bg-teal-600 text-white";
    default:             return "bg-orange-600 text-white";
  }
};

const statusBadge = (status: School["status"]) => {
  switch (status) {
    case "approved": return "bg-green-500/15 text-green-200";
    case "pending":  return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "rejected": return "bg-red-500/15 text-red-200";
    default:         return "bg-white/10 text-white";
  }
};

const SchoolApprovals: React.FC = () => {
  const [schoolList, setSchoolList]   = useState<School[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<(typeof statusFilters)[number]>("pending");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [saving, setSaving]           = useState<number | null>(null);
  const [message, setMessage]         = useState("");

  useEffect(() => { fetchSchools(); }, []);

  async function fetchSchools() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: School[] }>("/api/admin/users", { params: { role: "school" } });
      setSchoolList(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to load institutions.");
    } finally {
      setLoading(false);
    }
  }

  async function updateSchool(id: number, payload: Record<string, unknown>) {
    setSaving(id);
    try {
      const { data } = await api.patch<{ success: boolean; data: School }>(`/api/admin/users/${id}`, payload);
      setSchoolList((prev) => prev.map((s) => s.id === id ? { ...s, ...data.data } : s));
      return data.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Action failed.");
    } finally {
      setSaving(null);
    }
  }

  async function approveSchool(id: number) {
    const updated = await updateSchool(id, { status: "approved" });
    if (updated) setMessage(`✅ ${updated.name} approved.`);
  }

  async function rejectSchool(id: number) {
    if (!rejectionReason.trim()) return;
    const updated = await updateSchool(id, { status: "rejected", rejection_reason: rejectionReason });
    if (updated) {
      setMessage(`❌ ${updated.name} rejected.`);
      setRejectingId(null);
      setRejectionReason("");
    }
  }

  const pending  = useMemo(() => schoolList.filter((s) => s.status === "pending").length, [schoolList]);
  const filtered = useMemo(() => schoolList.filter((s) => filter === "all" || s.status === filter), [schoolList, filter]);

  return (
    <div className="space-y-6 text-white">
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Institution Approvals</p>
            <h1 className="mt-2 font-semibold text-3xl">Institution Onboarding</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">
              Review institution registrations before activating their accounts.
              {pending > 0 && <span className="bg-amber-500/20 ml-2 px-2 py-0.5 rounded-full text-amber-300 text-xs">{pending} pending</span>}
            </p>
          </div>
          <button onClick={fetchSchools} className="px-4 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-sm transition">
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#1E0A4A] p-4 border border-[#4B1E91] rounded-3xl">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === s ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <span className="self-center ml-auto text-[#F5F0E8] text-sm">
            {loading ? "Loading…" : `${filtered.length} institution(s)`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1E0A4A] p-12 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-center">
          No institutions match this filter.
        </div>
      ) : (
        <div className="gap-4 grid xl:grid-cols-2">
          {filtered.map((school) => (
            <div key={school.id} className="bg-[#0D0118] p-6 border border-[#4B1E91] rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-3xl w-14 h-14 font-bold text-white text-lg shrink-0">
                  {school.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-lg truncate">{school.name}</h2>
                    {school.school_type && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeBadge(school.school_type)}`}>
                        {school.school_type}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge(school.status)}`}>
                      {school.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[#F5F0E8] text-sm">
                    {school.email} · {school.city}, {school.country}
                  </p>
                  {school.contact_person && (
                    <p className="text-[#F5F0E8] text-sm">Contact: {school.contact_person} {school.phone ? `· ${school.phone}` : ""}</p>
                  )}
                  {school.website && (
                    <a href={school.website} target="_blank" rel="noreferrer" className="text-[#4B1E91] text-sm hover:underline">{school.website}</a>
                  )}
                  <p className="mt-1 text-[#F5F0E8] text-xs">Registered {new Date(school.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {school.status === "pending" && (
                <div className="gap-3 grid grid-cols-2 mt-4">
                  <button onClick={() => approveSchool(school.id)} disabled={saving === school.id}
                    className="bg-green-500/15 hover:bg-green-500/25 disabled:opacity-50 px-4 py-3 rounded-3xl text-green-200 text-sm transition">
                    <div className="flex justify-center items-center gap-2">
                      <CheckCircle2 size={16} /> {saving === school.id ? "Approving…" : "Approve"}
                    </div>
                  </button>
                  <button onClick={() => { setRejectingId(school.id); setRejectionReason(""); }}
                    className="bg-red-500/15 hover:bg-red-500/25 px-4 py-3 rounded-3xl text-red-200 text-sm transition">
                    Reject
                  </button>
                </div>
              )}

              {rejectingId === school.id && (
                <div className="bg-[#12022A] mt-4 p-4 border border-[#4B1E91] rounded-3xl">
                  <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (required)"
                    className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white" rows={3} />
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => rejectSchool(school.id)} disabled={!rejectionReason.trim() || saving === school.id}
                      className="bg-red-500 disabled:opacity-50 px-4 py-3 rounded-3xl text-white text-sm">
                      {saving === school.id ? "Rejecting…" : "Confirm Reject"}
                    </button>
                    <button onClick={() => setRejectingId(null)} className="px-4 py-3 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolApprovals;
