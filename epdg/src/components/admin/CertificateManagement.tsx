import { useState, useEffect, useMemo } from "react";
import { Award, Download, ShieldOff, Plus, Search } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

// ── Types ──────────────────────────────────────────────────────────────────
interface Certificate {
  id: string;
  certificate_number: string;
  intern_name_snapshot: string;
  department_snapshot: string | null;
  program_name: string;
  issue_date: string;
  issued_by_name: string;
  status: "active" | "revoked";
  pdf_url: string | null;
  created_at: string;
}

interface Template {
  id: number;
  name: string;
  department: string | null;
}

interface Intern {
  id: number;
  name: string;
  email: string;
}

// ── helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const today = new Date().toISOString().split("T")[0];

// ── Component ──────────────────────────────────────────────────────────────
const CertificateManagement: React.FC = () => {
  const [certs, setCerts]         = useState<Certificate[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [interns, setInterns]     = useState<Intern[]>([]);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState("");

  // filters
  const [deptFilter, setDeptFilter]     = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "revoked">("");

  // issue modal
  const [showModal, setShowModal]       = useState(false);
  const [internSearch, setInternSearch] = useState("");
  const [form, setForm] = useState({
    intern_id:    "",
    program_name: "",
    issue_date:   today,
    template_id:  "",
  });
  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued]   = useState<Certificate | null>(null);

  // revoke
  const [revoking, setRevoking] = useState<string | null>(null);

  // ── load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.allSettled([
      api.get<{ success: boolean; data: Certificate[] }>("/api/admin/certificates"),
      api.get<{ success: boolean; data: Template[] }>("/api/admin/certificate-templates"),
      api.get<{ success: boolean; data: Intern[] }>("/api/admin/users", { params: { role: "intern" } }),
    ]).then(([c, t, i]) => {
      if (c.status === "fulfilled") setCerts(c.value.data.data ?? []);
      if (t.status === "fulfilled") setTemplates(t.value.data.data ?? []);
      if (i.status === "fulfilled") setInterns(i.value.data.data ?? []);
      const firstErr = [c, t, i].find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      if (firstErr) {
        const e = firstErr.reason as AxiosError<{ message: string }>;
        setMessage(e.response?.data?.message ?? "Some data failed to load.");
      }
    }).finally(() => setLoading(false));
  }, []);

  // ── derived ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    certs.filter((c) => {
      if (deptFilter   && c.department_snapshot !== deptFilter) return false;
      if (statusFilter && c.status !== statusFilter)            return false;
      return true;
    }),
  [certs, deptFilter, statusFilter]);

  const filteredInterns = useMemo(() =>
    interns.filter((i) =>
      internSearch.trim() === "" ||
      i.name.toLowerCase().includes(internSearch.toLowerCase()) ||
      i.email.toLowerCase().includes(internSearch.toLowerCase())
    ),
  [interns, internSearch]);

  const departments = useMemo(() =>
    [...new Set(certs.map((c) => c.department_snapshot).filter(Boolean))] as string[],
  [certs]);

  // ── issue ─────────────────────────────────────────────────────────────────
  async function handleIssue() {
    if (!form.intern_id) return;
    setIssuing(true);
    try {
      const { data } = await api.post<{ success: boolean; data: Certificate }>(
        "/api/admin/certificates",
        {
          intern_id:    Number(form.intern_id),
          program_name: form.program_name || undefined,
          issue_date:   form.issue_date   || undefined,
          template_id:  form.template_id  ? Number(form.template_id) : undefined,
        },
      );
      setCerts((prev) => [data.data, ...prev]);
      setIssued(data.data);
      setShowModal(false);
      setForm({ intern_id: "", program_name: "", issue_date: today, template_id: "" });
      setInternSearch("");
    } catch (e: any) {
      setMessage(e.response?.data?.message ?? "Failed to issue certificate.");
    } finally {
      setIssuing(false);
    }
  }

  // ── revoke ────────────────────────────────────────────────────────────────
  async function handleRevoke(id: string) {
    setRevoking(id);
    try {
      await api.patch(`/api/admin/certificates/${id}/revoke`);
      setCerts((prev) => prev.map((c) => c.id === id ? { ...c, status: "revoked" as const } : c));
      if (issued?.id === id) setIssued((prev) => prev ? { ...prev, status: "revoked" as const } : null);
    } catch (e: any) {
      setMessage(e.response?.data?.message ?? "Revoke failed.");
    } finally {
      setRevoking(null);
    }
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Certificate management</p>
            <h1 className="mt-2 font-semibold text-3xl">Issue &amp; Manage Certificates</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">
              Issue verifiable completion certificates to interns. Each certificate gets a unique number and QR code.
            </p>
          </div>
          <button
            onClick={() => { setShowModal(true); setIssued(null); }}
            className="inline-flex items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] px-5 py-3 rounded-2xl font-semibold text-white text-sm transition shrink-0"
          >
            <Plus size={16} /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Success banner */}
      {issued && (
        <div className="bg-green-500/10 p-5 border border-green-500/30 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <p className="font-semibold text-green-300">Certificate issued!</p>
              <p className="text-[#F5F0E8] text-sm mt-1">
                {issued.certificate_number} — {issued.intern_name_snapshot}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {issued.pdf_url && (
                <a href={issued.pdf_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#4B1E91] px-4 py-2 rounded-2xl text-white text-sm">
                  <Download size={14} /> Download PDF
                </a>
              )}
              {issued.status === "active" && (
                <button onClick={() => handleRevoke(issued.id)} disabled={revoking === issued.id}
                  className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-2xl text-red-300 text-sm disabled:opacity-50">
                  <ShieldOff size={14} /> Revoke
                </button>
              )}
              <button onClick={() => setIssued(null)} className="text-[#F5F0E8]/50 hover:text-white text-sm px-2">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#1E0A4A] p-4 border border-[#4B1E91] rounded-3xl">
        <div className="flex flex-wrap gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "revoked")}
            className="bg-[#0D0118] px-4 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm outline-none">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-[#0D0118] px-4 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm outline-none">
            <option value="">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <span className="self-center ml-auto text-[#F5F0E8] text-sm">
            {loading ? "Loading…" : `${filtered.length} certificate(s)`}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1E0A4A] p-12 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-center">
          No certificates issued yet.
        </div>
      ) : (
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em] border-b border-[#4B1E91]">
                  {["Certificate #", "Intern", "Department", "Programme", "Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert.id} className="border-b border-[#4B1E91]/30 hover:bg-[#0D0118]/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-[#C9A84C] shrink-0" />
                        <span className="font-mono text-xs text-[#D8B9FF]">{cert.certificate_number}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{cert.intern_name_snapshot}</td>
                    <td className="px-5 py-4 text-[#F5F0E8]">{cert.department_snapshot ?? "—"}</td>
                    <td className="px-5 py-4 text-[#F5F0E8] max-w-40 truncate" title={cert.program_name}>{cert.program_name}</td>
                    <td className="px-5 py-4 text-[#F5F0E8] whitespace-nowrap">{fmtDate(cert.issue_date)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cert.status === "active" ? "bg-green-500/15 text-green-200" : "bg-red-500/15 text-red-300"
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {cert.pdf_url && (
                          <a href={cert.pdf_url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-[#4B1E91]/20 hover:bg-[#4B1E91]/40 px-3 py-1.5 rounded-2xl text-[#D8B9FF] text-xs transition">
                            <Download size={12} /> PDF
                          </a>
                        )}
                        {cert.status === "active" && (
                          <button onClick={() => handleRevoke(cert.id)} disabled={revoking === cert.id}
                            className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-2xl text-red-300 text-xs disabled:opacity-50 transition">
                            <ShieldOff size={12} />
                            {revoking === cert.id ? "…" : "Revoke"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Issue Certificate Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-3xl w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Issue Certificate</h2>
              <button onClick={() => setShowModal(false)} className="text-[#F5F0E8]/50 hover:text-white text-lg">✕</button>
            </div>

            {/* Intern search */}
            <div className="space-y-2">
              <label className="text-[#F5F0E8] text-sm block">Select Intern *</label>
              <div className="flex items-center gap-2 bg-[#0D0118] px-3 py-2 border border-[#4B1E91] rounded-2xl">
                <Search size={14} className="text-[#F5F0E8]/50 shrink-0" />
                <input
                  value={internSearch}
                  onChange={(e) => { setInternSearch(e.target.value); setForm((p) => ({ ...p, intern_id: "" })); }}
                  placeholder="Search by name or email…"
                  className="bg-transparent text-sm text-white outline-none w-full placeholder:text-[#F5F0E8]/40"
                />
              </div>
              {internSearch && !form.intern_id && (
                <div className="bg-[#0D0118] border border-[#4B1E91] rounded-2xl max-h-48 overflow-y-auto">
                  {filteredInterns.length === 0 ? (
                    <p className="px-4 py-3 text-[#F5F0E8] text-xs">No approved interns found.</p>
                  ) : (
                    filteredInterns.slice(0, 8).map((i) => (
                      <button key={i.id} type="button"
                        onClick={() => { setForm((p) => ({ ...p, intern_id: String(i.id) })); setInternSearch(i.name); }}
                        className="w-full text-left px-4 py-3 hover:bg-[#4B1E91]/20 border-b border-[#4B1E91]/30 last:border-0">
                        <p className="text-sm text-white">{i.name}</p>
                        <p className="text-xs text-[#F5F0E8]/60">{i.email}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
              {form.intern_id && (
                <p className="text-green-400 text-xs">✓ {internSearch} selected</p>
              )}
            </div>

            {/* Programme name */}
            <label className="block text-[#F5F0E8] text-sm">
              Programme Name
              <input type="text" value={form.program_name}
                onChange={(e) => setForm((p) => ({ ...p, program_name: e.target.value }))}
                placeholder="Leave blank to auto-generate from department"
                className="mt-1.5 w-full bg-[#0D0118] border border-[#4B1E91] rounded-2xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#F5F0E8]/40" />
            </label>

            {/* Issue date */}
            <label className="block text-[#F5F0E8] text-sm">
              Issue Date
              <input type="date" value={form.issue_date}
                onChange={(e) => setForm((p) => ({ ...p, issue_date: e.target.value }))}
                className="mt-1.5 w-full bg-[#0D0118] border border-[#4B1E91] rounded-2xl px-4 py-3 text-white text-sm outline-none" />
            </label>

            {/* Template */}
            <label className="block text-[#F5F0E8] text-sm">
              Template
              <select value={form.template_id} onChange={(e) => setForm((p) => ({ ...p, template_id: e.target.value }))}
                className="mt-1.5 w-full bg-[#0D0118] border border-[#4B1E91] rounded-2xl px-4 py-3 text-white text-sm outline-none">
                <option value="">Default template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}{t.department ? ` (${t.department})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={handleIssue} disabled={!form.intern_id || issuing}
                className="flex-1 bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm transition disabled:cursor-not-allowed">
                {issuing ? "Generating PDF…" : "Issue Certificate"}
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-[#4B1E91] py-3 rounded-2xl text-[#F5F0E8] text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertificateManagement;
