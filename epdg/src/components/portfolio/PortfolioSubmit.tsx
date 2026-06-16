import { useState, useEffect, useRef } from "react";
import api from "../../lib/axios";

type Track = "web_design" | "sales_marketing" | "social_media" | "digital_marketing";
type SubmissionType = "code" | "file" | "link";
type Status = "draft" | "submitted" | "approved" | "published";

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
}

const TRACKS: { value: Track; label: string }[] = [
  { value: "web_design",        label: "Web Design" },
  { value: "sales_marketing",   label: "Sales & Marketing" },
  { value: "social_media",      label: "Social Media" },
  { value: "digital_marketing", label: "Digital Marketing" },
];

const STATUS_BADGE: Record<Status, string> = {
  draft:     "bg-slate-100 text-slate-600",
  submitted: "bg-yellow-100 text-yellow-700",
  approved:  "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
};

const empty = (): Omit<Submission, "id" | "status" | "admin_notes" | "created_at"> => ({
  track:            "web_design",
  title:            "",
  task_description: "",
  contribution:     "",
  outcome:          "",
  tools_used:       [],
  submission_type:  "code",
  code_content:     "",
  file_urls:        [],
  repo_url:         "",
  live_url:         "",
});

export default function PortfolioSubmit() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [form, setForm]               = useState(empty());
  const [toolInput, setToolInput]     = useState("");
  const [editId, setEditId]           = useState<string | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMine(); }, []);

  async function fetchMine() {
    try {
      const { data } = await api.get<Submission[]>("/api/portfolio/submissions/my");
      setSubmissions(data);
    } catch { /* silent */ }
  }

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addTool(e: React.KeyboardEvent) {
    if (e.key === "Enter" && toolInput.trim()) {
      e.preventDefault();
      set("tools_used", [...form.tools_used, toolInput.trim()]);
      setToolInput("");
    }
  }

  function removeTool(t: string) {
    set("tools_used", form.tools_used.filter((x) => x !== t));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post<{ url: string }>("/api/portfolio/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("file_urls", [...form.file_urls, data.url]);
    } catch {
      setError("Upload failed. Max 10 MB, images or PDF only.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeFile(url: string) {
    set("file_urls", form.file_urls.filter((u) => u !== url));
  }

  async function save(status: "draft" | "submitted") {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.task_description.trim()) { setError("Task description is required."); return; }
    setError("");
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/api/portfolio/submissions/${editId}`, { ...form, status });
      } else {
        await api.post("/api/portfolio/submissions", { ...form, status });
      }
      setSuccess(status === "draft" ? "Saved as draft." : "Submitted for review!");
      setForm(empty());
      setEditId(null);
      fetchMine();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s: Submission) {
    setEditId(s.id);
    setForm({
      track:            s.track,
      title:            s.title,
      task_description: s.task_description,
      contribution:     s.contribution,
      outcome:          s.outcome,
      tools_used:       s.tools_used,
      submission_type:  s.submission_type,
      code_content:     s.code_content,
      file_urls:        s.file_urls,
      repo_url:         s.repo_url,
      live_url:         s.live_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteDraft(id: string) {
    if (!confirm("Delete this draft?")) return;
    try {
      await api.delete(`/api/portfolio/submissions/${id}`);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch { setError("Delete failed."); }
  }

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B1E91] transition";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-black text-gray-900 text-2xl tracking-tight">Portfolio Submission</h1>
        <p className="mt-1 text-gray-500 text-sm">Document your work and submit for review. Approved entries become part of your public portfolio.</p>
      </div>

      {/* Alerts */}
      {error   && <div className="bg-red-50 mb-4 px-4 py-3 border border-red-200 rounded-xl text-[13px] text-red-600">{error}</div>}
      {success && <div className="bg-green-50 mb-4 px-4 py-3 border border-green-200 rounded-xl text-[13px] text-green-700">{success}</div>}

      {/* Form card */}
      <div className="bg-white shadow-sm mb-8 p-6 border border-gray-100 rounded-2xl">
        <h2 className="mb-5 font-bold text-[15px] text-gray-800">
          {editId ? "Edit Submission" : "New Submission"}
        </h2>

        <div className="space-y-5">

          {/* Track */}
          <div>
            <label className={labelCls}>Track</label>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <button key={t.value} type="button"
                  onClick={() => set("track", t.value)}
                  className={`px-4 py-2 rounded-lg text-[12px] font-semibold border transition ${
                    form.track === t.value
                      ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4B1E91]"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input className={inputCls} placeholder="e.g. Landing page redesign for client X"
              value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          {/* Task description */}
          <div>
            <label className={labelCls}>Task Description *</label>
            <textarea rows={3} className={`${inputCls} resize-none`}
              placeholder="What was the task or challenge you were given?"
              value={form.task_description} onChange={(e) => set("task_description", e.target.value)} />
          </div>

          {/* Contribution */}
          <div>
            <label className={labelCls}>Your Contribution</label>
            <textarea rows={3} className={`${inputCls} resize-none`}
              placeholder="What did YOU specifically do to complete this?"
              value={form.contribution} onChange={(e) => set("contribution", e.target.value)} />
          </div>

          {/* Outcome */}
          <div>
            <label className={labelCls}>Outcome / Results</label>
            <textarea rows={2} className={`${inputCls} resize-none`}
              placeholder="What was the measurable result? e.g. +30% conversions, client approved design"
              value={form.outcome} onChange={(e) => set("outcome", e.target.value)} />
          </div>

          {/* Tools used */}
          <div>
            <label className={labelCls}>Tools Used (press Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tools_used.map((t) => (
                <span key={t} className="flex items-center gap-1 bg-[#4B1E91]/10 px-3 py-1 rounded-full font-medium text-[#4B1E91] text-[12px]">
                  {t}
                  <button type="button" onClick={() => removeTool(t)} className="ml-1 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <input className={inputCls} placeholder="e.g. Figma, React, Tailwind…"
              value={toolInput} onChange={(e) => setToolInput(e.target.value)} onKeyDown={addTool} />
          </div>

          {/* Submission type toggle */}
          <div>
            <label className={labelCls}>Submission Type</label>
            <div className="flex gap-2">
              {(["code", "file", "link"] as SubmissionType[]).map((t) => (
                <button key={t} type="button"
                  onClick={() => set("submission_type", t)}
                  className={`flex-1 py-2.5 rounded-lg text-[12px] font-semibold capitalize border transition ${
                    form.submission_type === t
                      ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4B1E91]"
                  }`}>
                  {t === "code" ? "💻 Code" : t === "file" ? "📎 File" : "🔗 Link"}
                </button>
              ))}
            </div>
          </div>

          {/* Code editor */}
          {form.submission_type === "code" && (
            <div>
              <label className={labelCls}>Code Snippet</label>
              <textarea rows={12}
                className="bg-gray-950 px-4 py-3 border border-gray-700 focus:border-[#4B1E91] rounded-xl focus:outline-none w-full font-mono text-[13px] text-green-400 transition resize-y"
                placeholder="// Paste your code here..."
                value={form.code_content} onChange={(e) => set("code_content", e.target.value)} />
            </div>
          )}

          {/* File upload */}
          {form.submission_type === "file" && (
            <div>
              <label className={labelCls}>Screenshots / Files</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.file_urls.map((url) => (
                  <div key={url} className="group relative">
                    {url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                      ? <img src={url} alt="upload" className="border border-gray-200 rounded-xl w-24 h-24 object-cover" />
                      : <div className="flex justify-center items-center bg-gray-100 border border-gray-200 rounded-xl w-24 h-24 text-2xl">📄</div>
                    }
                    <button type="button" onClick={() => removeFile(url)}
                      className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 opacity-0 group-hover:opacity-100 rounded-full w-5 h-5 text-[11px] text-white transition">
                      ×
                    </button>
                  </div>
                ))}
                <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition ${uploading ? "border-gray-200 text-gray-300" : "border-gray-300 text-gray-400 hover:border-[#4B1E91] hover:text-[#4B1E91]"}`}>
                  <span className="text-2xl">{uploading ? "⏳" : "+"}</span>
                  <span className="mt-1 text-[10px]">{uploading ? "Uploading" : "Add file"}</span>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          )}

          {/* Link fields */}
          {(form.submission_type === "link" || form.submission_type === "code") && (
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelCls}>GitHub Repo URL</label>
                <input className={inputCls} placeholder="https://github.com/you/project"
                  value={form.repo_url} onChange={(e) => set("repo_url", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Live URL</label>
                <input className={inputCls} placeholder="https://yourproject.com"
                  value={form.live_url} onChange={(e) => set("live_url", e.target.value)} />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => save("draft")} disabled={saving}
              className="flex-1 disabled:opacity-50 py-3 border border-gray-300 hover:border-gray-400 rounded-xl font-semibold text-[13px] text-gray-700 transition">
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button type="button" onClick={() => save("submitted")} disabled={saving}
              className="flex-1 bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-50 py-3 rounded-xl font-bold text-[13px] text-white uppercase tracking-wider transition">
              {saving ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>

      {/* Submission history */}
      {submissions.length > 0 && (
        <div>
          <h2 className="mb-4 font-bold text-[15px] text-gray-800">My Submissions</h2>
          <div className="space-y-3">
            {submissions.map((s) => (
              <div key={s.id} className="flex justify-between items-start gap-4 bg-white shadow-sm p-5 border border-gray-100 rounded-2xl">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[s.status]}`}>
                      {s.status}
                    </span>
                    <span className="text-[11px] text-gray-400 capitalize">{s.track.replace(/_/g, " ")}</span>
                  </div>
                  <p className="font-semibold text-[14px] text-gray-900 truncate">{s.title}</p>
                  {s.admin_notes && (
                    <p className="bg-amber-50 mt-1 px-2 py-1 rounded-lg text-[12px] text-amber-700">
                      📝 {s.admin_notes}
                    </p>
                  )}
                </div>
                {s.status === "draft" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(s)}
                      className="px-3 py-1.5 border border-gray-200 hover:border-[#4B1E91] rounded-lg text-[12px] text-gray-600 hover:text-[#4B1E91] transition">
                      Edit
                    </button>
                    <button onClick={() => deleteDraft(s.id)}
                      className="hover:bg-red-50 px-3 py-1.5 border border-red-200 rounded-lg text-[12px] text-red-500 transition">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
