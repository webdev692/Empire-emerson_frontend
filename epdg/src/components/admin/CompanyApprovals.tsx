import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, Shield, ShieldCheck, UserPlus, X } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

interface Company {
  id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  industry: string;
  number_of_employees: number | null;
  website: string;
  contact_person: string;
  country: string;
  county: string;
  rejection_reason: string;
}

const statusFilters = ["all", "pending", "approved", "rejected"] as const;

const statusBadge = (status: Company["status"]) => {
  switch (status) {
    case "approved": return "bg-green-500/15 text-green-200";
    case "pending":  return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "rejected": return "bg-red-500/15 text-red-200";
    default:         return "bg-white/10 text-white";
  }
};

const emptyForm = {
  name: "", contact: "", domain: "", size: "50-100", focus: "",
  identityValidated: false, applicationReviewed: false, teamReviewPending: false,
};

const CompanyApprovals: React.FC = () => {
  const [companyList, setCompanyList]   = useState<Company[]>([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("pending");
  const [showAddModal, setShowAddModal] = useState(false);
  const [_formValues, _setFormValues]     = useState(emptyForm);
  const [rejectingId, setRejectingId]   = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [saving, setSaving]             = useState<number | null>(null);
  const [message, setMessage]           = useState("");

  useEffect(() => { fetchCompanies(); }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Company[] }>("/api/admin/users", { params: { role: "company" } });
      setCompanyList(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to load companies.");
    } finally {
      setLoading(false);
    }
  }

  async function updateCompany(id: number, payload: Record<string, unknown>) {
    setSaving(id);
    try {
      const { data } = await api.patch<{ success: boolean; data: Company }>(`/api/admin/users/${id}`, payload);
      setCompanyList((prev) => prev.map((c) => c.id === id ? { ...c, ...data.data } : c));
      return data.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Action failed.");
    } finally {
      setSaving(null);
    }
  }

  async function approveCompany(id: number) {
    const updated = await updateCompany(id, { status: "approved" });
    if (updated) setMessage(`✅ ${updated.name} approved.`);
  }

  async function rejectCompany(id: number) {
    if (!rejectionReason.trim()) return;
    const updated = await updateCompany(id, { status: "rejected", rejection_reason: rejectionReason });
    if (updated) {
      setMessage(`❌ ${updated.name} rejected.`);
      setRejectingId(null);
      setRejectionReason("");
    }
  }

  const filteredCompanies = useMemo(
    () => companyList.filter((c) => statusFilter === "all" || c.status === statusFilter),
    [companyList, statusFilter]
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Company Approval</p>
            <h1 className="mt-2 font-semibold text-white text-3xl">Partner Company Onboarding</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Review company registrations and approve trusted partners.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchCompanies} className="px-4 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-sm transition">
              Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-[#4B1E91] px-5 py-3 rounded-2xl font-semibold text-white text-sm">
              <UserPlus size={16} /> Add Partner
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === s ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"}`}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
            {loading ? "Loading…" : `${filteredCompanies.length} companies`}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="gap-4 grid xl:grid-cols-2">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-[#0D0118] p-6 border border-[#4B1E91] rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-3xl w-16 h-16 font-semibold text-white text-2xl">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-white text-xl">{company.name}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(company.status)}`}>
                      {company.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[#F5F0E8] text-sm">
                    {company.industry} · {company.country}{company.county ? `, ${company.county}` : ""}
                  </p>
                  <p className="text-[#F5F0E8] text-sm">
                    {company.email} · Registered {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-[#12022A] mt-4 p-4 border border-[#4B1E91] rounded-3xl">
                <div className="gap-2 grid grid-cols-2 text-[#F5F0E8] text-sm">
                  {company.contact_person && <span>Contact: <span className="text-white">{company.contact_person}</span></span>}
                  {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="text-[#4B1E91] hover:underline truncate">{company.website}</a>}
                  {company.number_of_employees && <span>Size: <span className="text-white">{company.number_of_employees} employees</span></span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-green-500/15 px-3 py-1 rounded-full text-green-200 text-xs">
                    <ShieldCheck size={12} /> Identity validated
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/15 px-3 py-1 rounded-full text-amber-200 text-xs">
                    <Shield size={12} /> Awaiting team review
                  </span>
                </div>
              </div>

              {company.status === "pending" && (
                <div className="gap-3 grid grid-cols-2 mt-4">
                  <button onClick={() => approveCompany(company.id)} disabled={saving === company.id}
                    className="bg-green-500/15 hover:bg-green-500/25 disabled:opacity-50 px-4 py-3 rounded-3xl text-green-200 text-sm transition">
                    <div className="flex justify-center items-center gap-2">
                      <CheckCircle2 size={16} /> {saving === company.id ? "Approving…" : "Approve"}
                    </div>
                  </button>
                  <button onClick={() => { setRejectingId(company.id); setRejectionReason(""); }}
                    className="bg-red-500/15 hover:bg-red-500/25 px-4 py-3 rounded-3xl text-red-200 text-sm transition">
                    Reject
                  </button>
                </div>
              )}

              {rejectingId === company.id && (
                <div className="bg-[#12022A] mt-4 p-4 border border-[#4B1E91] rounded-3xl">
                  <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (required)"
                    className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white" rows={3} />
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => rejectCompany(company.id)} disabled={!rejectionReason.trim() || saving === company.id}
                      className="bg-red-500 disabled:opacity-50 px-4 py-3 rounded-3xl text-white text-sm">
                      {saving === company.id ? "Rejecting…" : "Confirm Reject"}
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

      {/* Add partner modal — kept for manual partner creation */}
      {showAddModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center gap-4 mb-4">
              <h2 className="font-semibold text-white text-xl">Add Partner Company</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#F5F0E8] hover:text-white"><X size={24} /></button>
            </div>
            <p className="mb-4 text-[#F5F0E8] text-sm">Direct admin-added partners are created via the backend. Contact your backend team to create a company account manually.</p>
            <button onClick={() => setShowAddModal(false)} className="bg-[#4B1E91] px-4 py-3 rounded-2xl w-full font-semibold text-white text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApprovals;
