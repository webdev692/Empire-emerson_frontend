import React, { useState, useEffect, useRef } from "react";
import api from "../lib/axios";

interface Task {
  id: number;
  title: string;
  status: string;
}

interface SubmissionItem {
  id: number;
  task_title: string;
  file_name: string | null;
  file_url: string;
  notes: string | null;
  status: "submitted" | "under_review" | "approved" | "rejected";
  reviewer_comment: string | null;
  submitted_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

const SubmissionHub: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [tasks, setTasks]             = useState<Task[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [notes, setNotes]           = useState("");
  const [file, setFile]             = useState<File | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // resubmit state
  const [resubmitId, setResubmitId] = useState<number | null>(null);
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);
  const [resubmitNotes, setResubmitNotes] = useState("");
  const [resubmitting, setResubmitting] = useState(false);
  const resubmitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.allSettled([
      api.get<{ success: boolean; data: SubmissionItem[] }>("/api/intern/submissions"),
      api.get<{ success: boolean; data: Task[] }>("/api/intern/tasks"),
    ]).then(([s, t]) => {
      if (s.status === "fulfilled") setSubmissions(s.value.data.data ?? []);
      if (t.status === "fulfilled") setTasks((t.value.data.data ?? []).filter(tk => tk.status !== "done"));
    }).finally(() => setLoading(false));
  }, []);

  const uploadFile = async (f: File): Promise<{ url: string; name: string; sizeKb: number }> => {
    const form = new FormData();
    form.append("file", f);
    const r = await api.post<{ success: boolean; url: string; name: string; sizeKb: number }>(
      "/api/intern/submissions/upload", form, { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { url: r.data.url, name: r.data.name, sizeKb: r.data.sizeKb };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !file) return;
    setUploading(true);
    try {
      const { url, name, sizeKb } = await uploadFile(file);
      const r = await api.post<{ success: boolean; data: SubmissionItem }>("/api/intern/submissions", {
        task_id: Number(selectedTaskId),
        file_url: url, file_name: name, file_size_kb: sizeKb, notes,
      });
      setSubmissions(prev => [r.data.data, ...prev]);
      setSelectedTaskId(""); setNotes(""); setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setToast("Deliverable package mounted successfully!");
      setTimeout(() => setToast(""), 4000);
    } catch (err: any) {
      setToast(`Error: ${err.message ?? "Upload failed."}`);
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = async (subId: number) => {
    if (!resubmitFile) return;
    setResubmitting(true);
    try {
      const { url, name, sizeKb } = await uploadFile(resubmitFile);
      const r = await api.patch<{ success: boolean; data: SubmissionItem }>(`/api/intern/submissions/${subId}`, {
        file_url: url, file_name: name, file_size_kb: sizeKb, notes: resubmitNotes,
      });
      setSubmissions(prev => prev.map(s => s.id === subId ? r.data.data : s));
      setResubmitId(null); setResubmitFile(null); setResubmitNotes("");
      setToast("Resubmission sent for review.");
      setTimeout(() => setToast(""), 4000);
    } catch (err: any) {
      setToast(`Error: ${err.message}`);
    } finally {
      setResubmitting(false);
    }
  };

  const filtered = activeFilter === "all" ? submissions : submissions.filter(s => s.status === activeFilter);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  const counts = {
    submitted:    submissions.filter(s => s.status === "submitted").length,
    under_review: submissions.filter(s => s.status === "under_review").length,
    approved:     submissions.filter(s => s.status === "approved").length,
    rejected:     submissions.filter(s => s.status === "rejected").length,
  };

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Submission Hub</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">Upload active assignment deliverables or review chronological evaluation history records</p>
      </header>

      {toast && (
        <div className={`mb-6 border p-4 rounded-xl text-xs font-mono text-white animate-in fade-in duration-200 ${
          toast.startsWith("Error") ? "bg-red-500/20 border-red-500" : "bg-[#22C55E]/20 border-[#22C55E]"
        }`}>
          {toast.startsWith("Error") ? toast : `✓ ${toast}`}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Submitted",    value: counts.submitted,    textStyle: "text-white" },
          { label: "Under Review", value: counts.under_review, textStyle: "text-[#4B1E91]" },
          { label: "Approved",     value: counts.approved,     textStyle: "text-[#22C55E]" },
          { label: "Rejected",     value: counts.rejected,     textStyle: "text-[#EF4444]" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8]">{stat.label}</p>
            <p className={`text-2xl font-black mt-2 ${stat.textStyle}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        {/* Upload form */}
        <div id="upload-card-view" className="lg:col-span-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Upload Asset Package</h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Select a task and upload your file</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">Target Active Task</label>
              <select required value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)}
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none">
                <option value="">-- Select Task Lane --</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">File Package</label>
              <div onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  file ? "border-[#22C55E] bg-[#22C55E]/5" : "border-[#4B1E91] bg-[#0D0118] hover:bg-[#12022A]"
                }`}>
                <div className="text-2xl mb-2">{file ? "📦" : "☁️"}</div>
                <p className="text-xs text-white font-medium">{file ? file.name : "Click to select file"}</p>
                <p className="text-[10px] text-[#F5F0E8] mt-1">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, ZIP, PNG, JPG, DOCX"}
                </p>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.zip,.png,.jpg,.jpeg,.docx" className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">Developer Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Provide short structural remarks for review context..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none placeholder-neutral-600" />
            </div>

            <button type="submit" disabled={!selectedTaskId || !file || uploading}
              className={`w-full font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors ${
                selectedTaskId && file && !uploading ? "bg-[#4B1E91] text-white hover:bg-[#683cb0]" : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
              }`}>
              {uploading ? "Uploading…" : "Submit Deliverable Package"}
            </button>
          </form>
        </div>

        {/* Submissions list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E0A4A] border border-[#4B1E91] p-3 rounded-2xl">
            <span className="text-xs font-bold px-1">Evaluation Feed</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All Logs" },
                { id: "submitted", label: "Submitted" },
                { id: "under_review", label: "Review" },
                { id: "approved", label: "Approved" },
                { id: "rejected", label: "Rejected" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                    activeFilter === tab.id ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8] border border-[#4B1E91] hover:border-[#4B1E91]"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center border border-dashed border-[#4B1E91] rounded-2xl py-12 bg-[#1E0A4A]">
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-mono text-sm text-[#F5F0E8]">No submissions found matching filter.</p>
              </div>
            ) : filtered.map(sub => {
              let borderStyle = "border-[#4B1E91]";
              let badgeStyle  = "bg-neutral-800 text-neutral-400";
              if (sub.status === "approved")     { borderStyle = "border-[#22C55E]"; badgeStyle = "bg-[#22C55E]/10 text-[#22C55E]"; }
              if (sub.status === "rejected")     { borderStyle = "border-[#EF4444]"; badgeStyle = "bg-[#EF4444]/10 text-[#EF4444]"; }
              if (sub.status === "under_review") badgeStyle = "bg-[#4B1E91]/20 text-[#F5F0E8]";
              if (sub.status === "submitted")    badgeStyle = "bg-neutral-800 text-white";

              return (
                <div key={sub.id} className={`bg-[#1E0A4A] border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all ${borderStyle}`}>
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">{sub.task_title}</h3>
                        {sub.file_name && (
                          <p className="text-[11px] font-mono text-[#F5F0E8] mt-0.5">
                            📦 <a href={sub.file_url} target="_blank" rel="noreferrer" className="underline hover:text-white">{sub.file_name}</a>
                          </p>
                        )}
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shrink-0 ${badgeStyle}`}>
                        {sub.status.replace("_", " ")}
                      </span>
                    </div>
                    {sub.notes && (
                      <p className="text-xs text-neutral-300 mt-2 bg-[#0D0118]/60 p-2.5 rounded-xl border border-[#4B1E91]/40 text-justify">
                        <span className="text-[10px] font-mono text-[#F5F0E8] block mb-0.5">Developer Notes:</span>
                        {sub.notes}
                      </p>
                    )}
                    {sub.status === "approved" && sub.reviewer_comment && (
                      <div className="mt-3 text-xs text-[#22C55E] italic bg-[#22C55E]/5 p-2.5 border border-[#22C55E]/20 rounded-xl text-justify">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider block not-italic mb-0.5">Architect Evaluation:</span>
                        "{sub.reviewer_comment}"
                      </div>
                    )}
                    {sub.status === "rejected" && sub.reviewer_comment && (
                      <div className="mt-3 text-xs text-[#EF4444] italic bg-[#EF4444]/5 p-2.5 border border-[#EF4444]/20 rounded-xl text-justify">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider block not-italic mb-0.5">Rejection Audit Comment:</span>
                        "{sub.reviewer_comment}"
                      </div>
                    )}
                    {sub.status === "under_review" && (
                      <p className="mt-3 text-[11px] font-mono text-[#F5F0E8]/50 italic pl-1">No reviewer comment yet. Evaluation pending in lane queue.</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91]/50 text-[11px] font-mono text-[#F5F0E8]">
                    <span>⏱ {timeAgo(sub.submitted_at)}</span>
                    {sub.status === "rejected" && (
                      resubmitId === sub.id ? (
                        <div className="flex items-center gap-2">
                          <input type="file" ref={resubmitRef} className="hidden"
                            onChange={e => setResubmitFile(e.target.files?.[0] ?? null)} />
                          <button onClick={() => resubmitRef.current?.click()}
                            className="text-[10px] font-mono border border-[#4B1E91] px-2 py-1 rounded-lg text-[#F5F0E8] hover:text-white">
                            {resubmitFile ? resubmitFile.name.slice(0, 15) + "…" : "Select file"}
                          </button>
                          <button disabled={!resubmitFile || resubmitting} onClick={() => handleResubmit(sub.id)}
                            className="bg-[#F59E0B] text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg hover:bg-[#d98207] disabled:opacity-50 transition-all">
                            {resubmitting ? "…" : "Send"}
                          </button>
                          <button onClick={() => { setResubmitId(null); setResubmitFile(null); }}
                            className="text-[#F5F0E8]/50 hover:text-white text-xs">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setResubmitId(sub.id); document.getElementById("upload-card-view")?.scrollIntoView({ behavior: "smooth" }); }}
                          className="bg-[#F59E0B] text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg hover:bg-[#d98207] transition-all">
                          Resubmit Package
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHub;
