import { useState, useEffect, useRef } from "react";
import api from "../../lib/axios";

type Track = "web_design" | "sales_marketing" | "social_media" | "digital_marketing";
type SubmissionType = "code" | "file" | "link";
type Status = "draft" | "submitted" | "approved" | "published";

interface Intern {
  id: string;
  name: string;
  email: string;
}

interface Submission {
  id: string;
  track: Track;
  title: string;
  task_description: string;
  contribution: string;
  outcome: string;
  tools_used: string[];
  submission_type: SubmissionType;
  code_content: string;
  file_urls: string[];
  repo_url: string;
  live_url: string;
  status: Status;
  admin_notes: string;
  created_at: string;
  intern: Intern;
}

const TRACKS: { value: Track; label: string; icon: string }[] = [
  { value: "web_design",        label: "Web Design",        icon: "🎨" },
  { value: "sales_marketing",   label: "Sales & Marketing", icon: "📈" },
  { value: "social_media",      label: "Social Media",      icon: "📱" },
  { value: "digital_marketing", label: "Digital Marketing", icon: "🚀" },
];

const STATUS_OPTIONS: Status[] = ["draft", "submitted", "approved", "published"];

const STATUS_STYLE: Record<Status, string> = {
  draft:     "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  approved:  "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
};

const emptyForm = (internId = "", track: Track = "web_design") => ({
  intern_id: internId,
  track,
  title: "",
  task_description: "",
  contribution: "",
  outcome: "",
  tools_used: [] as string[],
  submission_type: "file" as SubmissionType,
  code_content: "",
  file_urls: [] as string[],
  repo_url: "",
  live_url: "",
});

async function fetchSubmissions(
  track: Track | "all",
  status: Status | "all",
): Promise<Submission[]> {
  const params: Record<string, string> = {};
  if (track !== "all") params.track = track;
  if (status !== "all") params.status = status;
  const { data } = await api.get<Submission[]>("/api/portfolio/submissions", { params });
  return data;
}

export default function AdminPortfolioBuilder() {
  const [submissions, setSubmissions]   = useState<Submission[]>([]);
  const [filterTrack, setFilterTrack]   = useState<Track | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected]         = useState<Submission | null>(null);
  const [showBuilder, setShowBuilder]   = useState(false);
  const [form, setForm]                 = useState(emptyForm());
  const [toolInput, setToolInput]       = useState("");
  const [adminNotes, setAdminNotes]     = useState("");
  const [patchStatus, setPatchStatus]   = useState<Status>("submitted");
  const [uploading, setUploading]       = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    fetchSubmissions(filterTrack, filterStatus)
      .then((data) => {
        if (active) setSubmissions(data);
      })
      .catch(() => {});

    return () => { active = false; };
  }, [filterTrack, filterStatus]);

  function setF(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addTool(e: React.KeyboardEvent) {
    if (e.key === "Enter" && toolInput.trim()) {
      e.preventDefault();
      setF("tools_used", [...form.tools_used, toolInput.trim()]);
      setToolInput("");
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post<{ url: string }>("/api/portfolio/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setF("file_urls", [...form.file_urls, data.url]);
    } catch { setError("Upload failed."); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveBuilt() {
    if (!form.title.trim() || !form.intern_id) { setError("Intern and title are required."); return; }
    setSaving(true); setError("");
    try {
      await api.post("/api/portfolio/submissions", { ...form, status: "submitted" });
      setSuccess("Submission created for intern.");
      setShowBuilder(false);
      setForm(emptyForm());
      const refreshed = await fetchSubmissions(filterTrack, filterStatus);
      setSubmissions(refreshed);
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Save failed."); }
    finally { setSaving(false); }
  }

  async function applyPatch() {
    if (!selected) return;
    setSaving(true); setError("");
    try {
      const payload: Record<string, unknown> = { status: patchStatus };
      if (adminNotes.trim()) payload.admin_notes = adminNotes;
      const { data } = await api.patch<Submission>(`/api/portfolio/submissions/${selected.id}`, payload);
      setSelected(data);
      setSubmissions((prev) => prev.map((s) => s.id === data.id ? data : s));
      setSuccess("Updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Update failed."); }
    finally { setSaving(false); }
  }

  const filtered = submissions.filter((s) => {
    if (filterTrack  !== "all" && s.track  !== filterTrack)  return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  const byTrack = TRACKS.map((t) => ({
    ...t,
    items: filtered.filter((s) => s.track === t.value),
  }));

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B1E91] transition";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="flex bg-gray-50 h-full min-h-screen">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:block bg-white border-gray-100 border-r w-72 overflow-y-auto shrink-0">
        <div className="p-5 border-gray-100 border-b">
          <h2 className="font-black text-[15px] text-gray-900">Portfolio Builder</h2>
          <p className="mt-0.5 text-[12px] text-gray-400">Admin view — all submissions</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 p-4 border-gray-100 border-b">
          <div>
            <label className={labelCls}>Track</label>
            <select className="bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none w-full text-[13px] text-gray-700"
              value={filterTrack} onChange={(e) => setFilterTrack(e.target.value as Track | "all")}>
              <option value="all">All Tracks</option>
              {TRACKS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select className="bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none w-full text-[13px] text-gray-700"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "all")}>
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Grouped list */}
        <div className="p-3">
          {byTrack.map((t) => t.items.length > 0 && (
            <div key={t.value} className="mb-4">
              <p className="mb-1.5 px-2 font-bold text-[11px] text-gray-400 uppercase tracking-wider">
                {t.icon} {t.label} ({t.items.length})
              </p>
              {t.items.map((s) => (
                <button key={s.id} onClick={() => { setSelected(s); setPatchStatus(s.status); setAdminNotes(s.admin_notes || ""); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition ${selected?.id === s.id ? "bg-[#4B1E91]/10 text-[#4B1E91]" : "hover:bg-gray-50 text-gray-700"}`}>
                  <p className="font-semibold text-[13px] truncate">{s.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                    <span className="text-[11px] text-gray-400">{s.intern?.name}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Build for intern button */}
        <div className="p-4 border-gray-100 border-t">
          <button onClick={() => { setShowBuilder(true); setSelected(null); }}
            className="bg-[#4B1E91] hover:bg-[#3d1778] py-2.5 rounded-xl w-full font-bold text-[12px] text-white uppercase tracking-wider transition">
            + Build for Intern
          </button>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Alerts */}
        {error   && <div className="bg-red-50 mb-4 px-4 py-3 border border-red-200 rounded-xl text-[13px] text-red-600">{error}</div>}
        {success && <div className="bg-green-50 mb-4 px-4 py-3 border border-green-200 rounded-xl text-[13px] text-green-700">{success}</div>}

        {/* ── Submission detail / admin controls ── */}
        {selected && !showBuilder && (
          <div className="bg-white shadow-sm mb-6 p-6 border border-gray-100 rounded-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
                <h2 className="mt-2 font-black text-gray-900 text-xl">{selected.title}</h2>
                <p className="mt-0.5 text-[13px] text-gray-400">{selected.intern?.name} · {selected.track.replace(/_/g, " ")}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>

            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mb-5">
              {[
                { label: "Task", value: selected.task_description },
                { label: "Contribution", value: selected.contribution },
                { label: "Outcome", value: selected.outcome },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className={labelCls}>{label}</p>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{value}</p>
                </div>
              ))}
              <div>
                <p className={labelCls}>Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tools_used.map((t) => (
                    <span key={t} className="bg-[#4B1E91]/10 px-2 py-0.5 rounded-full font-medium text-[#4B1E91] text-[11px]">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code preview */}
            {selected.submission_type === "code" && selected.code_content && (
              <div className="mb-5">
                <p className={labelCls}>Code</p>
                <pre className="bg-gray-950 p-4 rounded-xl max-h-64 overflow-x-auto font-mono text-[12px] text-green-400">
                  {selected.code_content}
                </pre>
              </div>
            )}

            {/* Files */}
            {selected.file_urls.length > 0 && (
              <div className="mb-5">
                <p className={labelCls}>Files</p>
                <div className="flex flex-wrap gap-3">
                  {selected.file_urls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer"
                      className="block hover:opacity-80 border border-gray-200 rounded-xl w-24 h-24 overflow-hidden transition">
                      {url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                        ? <img src={url} alt="file" className="w-full h-full object-cover" />
                        : <div className="flex justify-center items-center bg-gray-100 w-full h-full text-2xl">📄</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(selected.repo_url || selected.live_url) && (
              <div className="flex gap-3 mb-5">
                {selected.repo_url && <a href={selected.repo_url} target="_blank" rel="noreferrer" className="text-[#4B1E91] text-[13px] hover:underline">GitHub →</a>}
                {selected.live_url && <a href={selected.live_url} target="_blank" rel="noreferrer" className="text-[#4B1E91] text-[13px] hover:underline">Live Site →</a>}
              </div>
            )}

            {/* Admin controls */}
            <div className="space-y-4 pt-5 border-gray-100 border-t">
              <div>
                <label className={labelCls}>Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => setPatchStatus(s)}
                      className={`px-4 py-2 rounded-lg text-[12px] font-semibold border transition capitalize ${
                        patchStatus === s ? "bg-[#4B1E91] text-white border-[#4B1E91]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4B1E91]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Admin Notes</label>
                <textarea rows={3} className={`${inputCls} resize-none`}
                  placeholder="Feedback for the intern (optional)"
                  value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
              </div>
              <button onClick={applyPatch} disabled={saving}
                className="bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-50 py-3 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── Build for intern form ── */}
        {showBuilder && (
          <div className="bg-white shadow-sm mb-6 p-6 border border-gray-100 rounded-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-[17px] text-gray-900">Build Portfolio Entry</h2>
              <button onClick={() => setShowBuilder(false)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Intern ID</label>
                <input className={inputCls} placeholder="Paste intern UUID"
                  value={form.intern_id} onChange={(e) => setF("intern_id", e.target.value)} />
              </div>

              <div>
                <label className={labelCls}>Track</label>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((t) => (
                    <button key={t.value} type="button" onClick={() => setF("track", t.value)}
                      className={`px-3 py-2 rounded-lg text-[12px] font-semibold border transition ${form.track === t.value ? "bg-[#4B1E91] text-white border-[#4B1E91]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4B1E91]"}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { key: "title",            label: "Title",            ph: "e.g. Social media campaign for launch week" },
                { key: "task_description", label: "Task Description", ph: "What was the task?" },
                { key: "contribution",     label: "Contribution",     ph: "What did the intern do?" },
                { key: "outcome",          label: "Outcome",          ph: "Results achieved" },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <textarea rows={2} className={`${inputCls} resize-none`} placeholder={ph}
                    value={(form as unknown as Record<string, string>)[key]}
                    onChange={(e) => setF(key, e.target.value)} />
                </div>
              ))}

              <div>
                <label className={labelCls}>Tools (press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tools_used.map((t) => (
                    <span key={t} className="flex items-center gap-1 bg-[#4B1E91]/10 px-3 py-1 rounded-full font-medium text-[#4B1E91] text-[12px]">
                      {t}<button type="button" onClick={() => setF("tools_used", form.tools_used.filter((x) => x !== t))} className="ml-1 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <input className={inputCls} placeholder="Add tool…"
                  value={toolInput} onChange={(e) => setToolInput(e.target.value)} onKeyDown={addTool} />
              </div>

              {/* File upload */}
              <div>
                <label className={labelCls}>Upload Files</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {form.file_urls.map((url) => (
                    <div key={url} className="group relative w-20 h-20">
                      {url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                        ? <img src={url} alt="file" className="border border-gray-200 rounded-xl w-full h-full object-cover" />
                        : <div className="flex justify-center items-center bg-gray-100 border rounded-xl w-full h-full text-2xl">📄</div>}
                      <button type="button" onClick={() => setF("file_urls", form.file_urls.filter((u) => u !== url))}
                        className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 opacity-0 group-hover:opacity-100 rounded-full w-5 h-5 text-[11px] text-white transition">×</button>
                    </div>
                  ))}
                  <label className={`w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition ${uploading ? "border-gray-200 text-gray-300" : "border-gray-300 text-gray-400 hover:border-[#4B1E91]"}`}>
                    <span className="text-2xl">{uploading ? "⏳" : "+"}</span>
                    <span className="mt-1 text-[10px]">{uploading ? "…" : "Add"}</span>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <button onClick={saveBuilt} disabled={saving}
                className="bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-50 py-3 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition">
                {saving ? "Creating…" : "Create Submission"}
              </button>
            </div>
          </div>
        )}

        {/* ── Submissions table ── */}
        {!showBuilder && !selected && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[15px] text-gray-900">All Submissions ({filtered.length})</h2>
              <button onClick={() => setShowBuilder(true)}
                className="lg:hidden bg-[#4B1E91] px-4 py-2 rounded-xl font-bold text-[12px] text-white uppercase tracking-wider">
                + Build
              </button>
            </div>

            {/* Mobile filters */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-4">
              <select className="bg-white px-3 py-2 border border-gray-200 rounded-lg text-[13px]" value={filterTrack} onChange={(e) => setFilterTrack(e.target.value as Track | "all")}>
                <option value="all">All Tracks</option>
                {TRACKS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select className="bg-white px-3 py-2 border border-gray-200 rounded-lg text-[13px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "all")}>
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-16 text-gray-400 text-center">
                  <p className="mb-2 text-3xl">📂</p>
                  <p className="text-[14px]">No submissions match the current filters.</p>
                </div>
              ) : (
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 border-gray-100 border-b">
                      {["Intern", "Title", "Track", "Status", "Date", ""].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold text-[11px] text-gray-500 text-left uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 border-gray-50 border-b transition">
                        <td className="px-4 py-3 font-medium text-gray-800">{s.intern?.name ?? "—"}</td>
                        <td className="px-4 py-3 max-w-40 text-gray-700 truncate">{s.title}</td>
                        <td className="px-4 py-3 text-gray-500 capitalize">{s.track.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setSelected(s); setPatchStatus(s.status); setAdminNotes(s.admin_notes || ""); }}
                            className="font-semibold text-[#4B1E91] hover:underline">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
