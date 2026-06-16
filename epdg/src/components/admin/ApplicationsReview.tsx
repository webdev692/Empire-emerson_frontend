import { useMemo, useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "intern";
  status: "pending" | "approved" | "rejected";
  school: string;
  course: string;
  created_at: string;
  rejection_reason: string;
  department: string;
  mentor: string;
  cover_letter: string | null;
  cv_url: string | null;
}

interface Recommendation {
  id: number;
  title: string;
  department: string;
  score: number;
  matched_skills: string[];
  required_skills: string[];
}

interface CvAnalysis {
  skills: { categories: Record<string, string[]>; all: string[]; total: number };
  recommendations: Recommendation[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "Frontend":              "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Backend":               "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "Programming Languages": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "Databases":             "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Cloud & DevOps":        "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Tools & Practices":     "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "Digital Marketing":     "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "Design":                "bg-pink-500/15 text-pink-300 border-pink-500/30",
  "Soft Skills":           "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
};

const departments = ["Frontend", "Backend", "UX/UI", "Sales", "Marketing", "Social Media"];
const mentors     = ["Mila", "AJ", "Noor", "Zane"];

const sourceOptions = [
  { label: "All",     value: "all"     as const },
  { label: "Pending", value: "pending" as const },
  { label: "Approved",value: "approved"as const },
  { label: "Rejected",value: "rejected"as const },
] as const;

const ApplicationsReview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedIds, setSelectedIds]   = useState<number[]>([]);
  const [rejectingId, setRejectingId]   = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [message, setMessage]           = useState("");
  const [saving, setSaving]             = useState<number | null>(null);
  const [cvAnalysis, setCvAnalysis]     = useState<Record<number, CvAnalysis | "loading" | "error">>({});

  useEffect(() => { fetchApplications(); }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Application[] }>("/api/admin/users", {
        params: { role: "intern" },
      });
      setApplications(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: number, payload: Record<string, unknown>) {
    setSaving(id);
    try {
      const { data } = await api.patch<{ success: boolean; data: Application }>(`/api/admin/users/${id}`, payload);
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, ...data.data } : a));
      return data.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Action failed.");
    } finally {
      setSaving(null);
    }
  }

  async function approveApplication(id: number) {
    const app = applications.find((a) => a.id === id);
    if (!app?.department || !app?.mentor) {
      setMessage("Assign a department and mentor before approving.");
      return;
    }
    const updated = await updateUser(id, {
      status: "approved",
      department: app.department,
      mentor: app.mentor,
    });
    if (updated) setMessage(`✅ ${updated.name} approved — invite sent.`);
  }

  async function rejectApplication(id: number) {
    if (!rejectionReason.trim()) return;
    const updated = await updateUser(id, {
      status: "rejected",
      rejection_reason: rejectionReason,
    });
    if (updated) {
      setMessage(`❌ ${updated.name} rejected.`);
      setRejectingId(null);
      setRejectionReason("");
    }
  }

  async function approveSelected() {
    const toApprove = applications.filter(
      (a) => selectedIds.includes(a.id) && a.department && a.mentor
    );
    if (toApprove.length === 0) {
      setMessage("All selected applicants need a department and mentor assigned first.");
      return;
    }
    await Promise.all(
      toApprove.map((a) => updateUser(a.id, { status: "approved", department: a.department, mentor: a.mentor }))
    );
    setSelectedIds([]);
    setMessage(`✅ ${toApprove.length} application(s) approved.`);
  }

  function setLocalField(id: number, field: "department" | "mentor", value: string) {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, [field]: value } : a));
  }

  async function analyseCv(id: number) {
    setCvAnalysis((prev) => ({ ...prev, [id]: "loading" }));
    try {
      const { data } = await api.get<{ success: boolean; data: CvAnalysis }>(`/api/admin/users/${id}/cv-analysis`);
      setCvAnalysis((prev) => ({ ...prev, [id]: data.data }));
    } catch {
      setCvAnalysis((prev) => ({ ...prev, [id]: "error" }));
    }
  }

  const filtered = useMemo(() => {
    return applications.filter((a) => statusFilter === "all" || a.status === statusFilter);
  }, [applications, statusFilter]);

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Applications Review</p>
            <h1 className="mt-2 text-3xl font-semibold">Intern Applications</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">
              Review each applicant, assign mentors and approve.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-[#0D0118] px-4 py-3">
            <CheckCircle2 size={18} className="text-[#4B1E91]" />
            <span className="text-sm text-[#F5F0E8]">{selectedIds.length} selected</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4 text-sm text-[#F5F0E8]">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-[#F5F0E8] hover:text-white ml-4">✕</button>
        </div>
      )}

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {sourceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === opt.value ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              className="rounded-2xl bg-[#0D0118] border border-[#4B1E91] px-4 py-2 text-sm text-[#F5F0E8] hover:text-white transition"
            >
              Refresh
            </button>
            <button
              onClick={approveSelected}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve Selected <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#F5F0E8]">
          {loading ? "Loading…" : `${filtered.length} application(s) shown`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#4B1E91] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-12 text-center text-[#F5F0E8]">
          No applications match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const canApprove = !!app.department && !!app.mentor && app.status === "pending";
            const isSaving   = saving === app.id;
            return (
              <div key={app.id} className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#4B1E91]/20 text-xl font-semibold text-white">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{app.name}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#F5F0E8]">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          app.status === "approved" ? "bg-green-500/15 text-green-300" :
                          app.status === "rejected" ? "bg-red-500/15 text-red-300" :
                          "bg-amber-500/15 text-amber-200"
                        }`}>{app.status}</span>
                        <span>{app.email}</span>
                        {app.phone && <span>{app.phone}</span>}
                        {app.course && <span>{app.course}</span>}
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* CV + cover letter badges */}
                      {(app.cv_url || app.cover_letter) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {app.cv_url && (
                            <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#4B1E91]/15 px-3 py-1 text-xs text-[#D8B9FF] hover:bg-[#4B1E91]/30 transition">
                              📄 View CV
                            </a>
                          )}
                          {app.cover_letter && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 px-3 py-1 text-xs text-[#C9A84C]">
                              ✉️ Cover letter attached
                            </span>
                          )}
                        </div>
                      )}

                      {/* Cover letter expanded */}
                      {app.cover_letter && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-[#F5F0E8]/60 hover:text-white select-none">
                            Read cover letter ▾
                          </summary>
                          <div className="mt-2 rounded-2xl bg-[#0D0118] border border-[#4B1E91]/30 px-4 py-3 text-sm text-[#F5F0E8] leading-relaxed whitespace-pre-wrap">
                            {app.cover_letter}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>

                  {app.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0118] px-4 py-2 text-sm text-[#F5F0E8]">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app.id)}
                          onChange={() => setSelectedIds((prev) =>
                            prev.includes(app.id) ? prev.filter((x) => x !== app.id) : [...prev, app.id]
                          )}
                          className="h-4 w-4 rounded border-[#4B1E91] bg-[#12022A] text-[#4B1E91]"
                        />
                        Select
                      </label>
                      <button
                        onClick={() => { setRejectingId(app.id); setRejectionReason(""); }}
                        className="rounded-2xl bg-red-500/15 px-4 py-2 text-sm text-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <label className="space-y-2 text-sm text-[#F5F0E8]">
                      Assign Department
                      <select
                        value={app.department}
                        onChange={(e) => setLocalField(app.id, "department", e.target.value)}
                        className="w-full rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none"
                      >
                        <option value="">Select department</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </label>

                    <label className="space-y-2 text-sm text-[#F5F0E8]">
                      Assign Mentor
                      <select
                        value={app.mentor}
                        onChange={(e) => setLocalField(app.id, "mentor", e.target.value)}
                        className="w-full rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none"
                      >
                        <option value="">Select mentor</option>
                        {mentors.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </label>

                    <div className="space-y-3">
                      <button
                        onClick={() => approveApplication(app.id)}
                        disabled={!canApprove || isSaving}
                        className="w-full rounded-3xl bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Approving…" : "Approve & Send Invite"}
                      </button>
                      <button
                        onClick={() => { setRejectingId(app.id); setRejectionReason(""); }}
                        className="w-full rounded-3xl bg-[#F59E0B]/15 px-4 py-3 text-sm text-[#F59E0B]"
                      >
                        Reject with Reason
                      </button>
                    </div>
                  </div>
                )}

                {rejectingId === app.id && (
                  <div className="mt-4 rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection (required)"
                      className="w-full rounded-3xl border border-[#4B1E91] bg-[#12022A] px-4 py-3 text-white outline-none"
                      rows={3}
                    />
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        onClick={() => rejectApplication(app.id)}
                        disabled={!rejectionReason.trim() || isSaving}
                        className="rounded-3xl bg-red-500 px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Rejecting…" : "Confirm Reject"}
                      </button>
                      <button onClick={() => setRejectingId(null)} className="rounded-3xl border border-[#4B1E91] px-4 py-3 text-sm text-[#F5F0E8]">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* CV Analysis Panel */}
                {app.cv_url && (
                  <div className="mt-5 border-t border-[#4B1E91]/30 pt-5">
                    {!cvAnalysis[app.id] ? (
                      <button
                        onClick={() => analyseCv(app.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-2 text-sm text-[#C9A84C] hover:bg-[#C9A84C]/20 transition"
                      >
                        🔍 Analyse CV & Match Internships
                      </button>
                    ) : cvAnalysis[app.id] === "loading" ? (
                      <div className="flex items-center gap-3 text-sm text-[#F5F0E8]/60">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
                        Parsing CV and matching skills…
                      </div>
                    ) : cvAnalysis[app.id] === "error" ? (
                      <p className="text-sm text-red-400">Could not parse CV. The file may be inaccessible.</p>
                    ) : (() => {
                      const analysis = cvAnalysis[app.id] as CvAnalysis;
                      return (
                        <div className="space-y-5">
                          {/* Skills */}
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                              Extracted Skills — {analysis.skills.total} found
                            </p>
                            {Object.entries(analysis.skills.categories).length === 0 ? (
                              <p className="text-sm text-[#F5F0E8]/50">No recognisable skills found in CV.</p>
                            ) : (
                              <div className="space-y-3">
                                {Object.entries(analysis.skills.categories).map(([category, skills]) => (
                                  <div key={category}>
                                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#F5F0E8]/50">
                                      {category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {skills.map((skill) => (
                                        <span
                                          key={skill}
                                          className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[category] ?? "bg-white/5 text-white border-white/10"}`}
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Internship Recommendations */}
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                              Best Internship Matches
                            </p>
                            {analysis.recommendations.length === 0 ? (
                              <p className="text-sm text-[#F5F0E8]/50">No open internship slots available to match against.</p>
                            ) : (
                              <div className="space-y-2">
                                {analysis.recommendations.map((rec) => (
                                  <div
                                    key={rec.id}
                                    className="flex flex-col gap-2 rounded-2xl border border-[#4B1E91]/40 bg-[#0D0118] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <div className="flex-1">
                                      <p className="font-semibold text-white">{rec.title}</p>
                                      <p className="text-xs text-[#F5F0E8]/50">{rec.department}</p>
                                      {rec.matched_skills.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                          {rec.matched_skills.slice(0, 6).map((s) => (
                                            <span key={s} className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] text-green-300">
                                              ✓ {s}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      {/* Score ring */}
                                      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold ${
                                        rec.score >= 70 ? "border-green-400 text-green-300" :
                                        rec.score >= 40 ? "border-[#C9A84C] text-[#C9A84C]" :
                                        "border-white/20 text-[#F5F0E8]/50"
                                      }`}>
                                        {rec.score}%
                                      </div>
                                      {app.status === "pending" && rec.department && (
                                        <button
                                          onClick={() => setLocalField(app.id, "department", rec.department)}
                                          className="rounded-2xl border border-[#4B1E91] bg-[#4B1E91]/20 px-3 py-1.5 text-xs text-[#D8B9FF] hover:bg-[#4B1E91]/40 transition"
                                        >
                                          Pre-assign
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsReview;
