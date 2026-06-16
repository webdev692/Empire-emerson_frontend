import React, { useState } from "react";

interface SubmissionItem {
  id: number;
  taskName: string;
  fileName: string;
  fileType: string;
  submittedAgo: string;
  status: "approved" | "rejected" | "under_review" | "submitted";
  reviewerComment?: string;
  notes?: string;
}

const MOCK_SUBMISSIONS_DATA: SubmissionItem[] = [
  {
    id: 1,
    taskName: "Initial Workspace Architecture",
    fileName: "workspace_v1.zip",
    fileType: "ZIP",
    submittedAgo: "3 days ago",
    status: "approved",
    reviewerComment:
      "Excellent clean-code separation and solid routing tree integration. Project file structures completely match the internal guidelines.",
    notes: "Initialized the main App.tsx components layout.",
  },
  {
    id: 2,
    taskName: "Tax Readiness Checklist Compilation",
    fileName: "tax_readiness_draft.pdf",
    fileType: "PDF",
    submittedAgo: "1 day ago",
    status: "rejected",
    reviewerComment:
      "The master checklist layout is missing the mandatory legal compliance disclaimer sections. Please inject it immediately and resubmit.",
    notes: "Compiled list of required personal identification records.",
  },
  {
    id: 3,
    taskName: "Figma Typography Verification",
    fileName: "typography_specs.png",
    fileType: "PNG",
    submittedAgo: "5h ago",
    status: "under_review",
    notes:
      "Verified that DM Sans is systematically rendered across all target responsive components.",
  },
  {
    id: 4,
    taskName: "Draft Initial Sales Script",
    fileName: "sales_outreach_v1.docx",
    fileType: "DOCX",
    submittedAgo: "10m ago",
    status: "submitted",
    notes:
      "Included non-pressure conversation scripts for early startup tracks.",
  },
];

const SubmissionHub: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(
    MOCK_SUBMISSIONS_DATA,
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [submissionNotes, setSubmissionNotes] = useState<string>("");
  const [simulatedFile, setSimulatedFile] = useState<{
    name: string;
    type: string;
  } | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleSimulateFileDrop = () => {
    if (!selectedTask) return;
    setSimulatedFile({
      name: `${selectedTask.toLowerCase().replace(/\s+/g, "_")}_final_draft.zip`,
      type: "ZIP",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !simulatedFile) return;

    const newSubmission: SubmissionItem = {
      id: Date.now(),
      taskName: selectedTask,
      fileName: simulatedFile.name,
      fileType: simulatedFile.type,
      submittedAgo: "Just now",
      status: "submitted",
      notes: submissionNotes,
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setSubmissionNotes("");
    setSimulatedFile(null);
    setSelectedTask("");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleResubmitTrigger = (taskName: string) => {
    setSelectedTask(taskName);
    setSimulatedFile({
      name: `${taskName.toLowerCase().replace(/\s+/g, "_")}_revised_v2.zip`,
      type: "ZIP",
    });
    document
      .getElementById("upload-card-view")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeFilter === "all") return true;
    return s.status === activeFilter;
  });

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Submission Hub
        </h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Upload active assignment deliverables or review chronological
          evaluation history records
        </p>
      </header>

      {showSuccessToast && (
        <div className="mb-6 bg-[#22C55E]/20 border border-[#22C55E] p-4 rounded-xl text-xs font-mono text-white animate-in fade-in duration-200">
          ✓ Deliverable package mounted successfully! Your submission entry has
          been queued for architect review evaluation.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Submitted",
            value: submissions.filter((s) => s.status === "submitted").length,
            textStyle: "text-white",
          },
          {
            label: "Under Review",
            value: submissions.filter((s) => s.status === "under_review")
              .length,
            textStyle: "text-[#4B1E91]",
          },
          {
            label: "Approved",
            value: submissions.filter((s) => s.status === "approved").length,
            textStyle: "text-[#22C55E]",
          },
          {
            label: "Rejected",
            value: submissions.filter((s) => s.status === "rejected").length,
            textStyle: "text-[#EF4444]",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8]">
              {stat.label}
            </p>
            <p className={`text-2xl font-black mt-2 ${stat.textStyle}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        <div
          id="upload-card-view"
          className="lg:col-span-1 bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4"
        >
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Upload Asset Package
            </h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">
              Select a task and mount your archive file
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                Target Active Task
              </label>
              <select
                required
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none focus:border-[#4B1E91]"
              >
                <option value="">-- Select Task Lane --</option>
                <option value="Draft Initial Sales Script">
                  Draft Initial Sales Script
                </option>
                <option value="Review CRM Spreadsheet Structure">
                  Review CRM Spreadsheet Structure
                </option>
                <option value="Tax Readiness Checklist Compilation">
                  Tax Readiness Checklist Compilation
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                File Package
              </label>
              <div
                onClick={handleSimulateFileDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  simulatedFile
                    ? "border-[#22C55E] bg-[#22C55E]/5"
                    : "border-[#4B1E91] bg-[#0D0118] hover:bg-[#12022A]"
                }`}
              >
                <div className="text-2xl mb-2">
                  {simulatedFile ? "📦" : "☁️"}
                </div>
                <p className="text-xs text-white font-medium">
                  {simulatedFile
                    ? simulatedFile.name
                    : "Click to mock drop file package"}
                </p>
                <p className="text-[10px] text-[#F5F0E8] mt-1">
                  {simulatedFile
                    ? "Package attached successfully"
                    : "Accepted extensions: PDF, ZIP, PNG, JPG"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                Developer Notes
              </label>
              <textarea
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Provide short structural remarks for review context..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
              />
            </div>

            <div className="flex items-center justify-between bg-[#0D0118] border border-[#4B1E91] px-3 py-2 rounded-xl">
              <span className="text-[10px] font-mono text-[#F5F0E8] uppercase">
                Deadline Countdown
              </span>
              <span className="text-[10px] font-mono text-[#EF4444] font-bold">
                Due in 18 hours
              </span>
            </div>

            <button
              type="submit"
              disabled={!selectedTask || !simulatedFile}
              className={`w-full font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors ${
                selectedTask && simulatedFile
                  ? "bg-[#4B1E91] text-white hover:bg-[#683cb0]"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
              }`}
            >
              Submit Deliverable Package
            </button>
          </form>
        </div>

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
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                    activeFilter === tab.id
                      ? "bg-[#4B1E91] text-white"
                      : "bg-[#0D0118] text-[#F5F0E8] border border-[#4B1E91] hover:border-[#4B1E91]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => {
                let borderStyle = "border-[#4B1E91]";
                let badgeStyle = "bg-neutral-800 text-neutral-400";

                if (sub.status === "approved") {
                  borderStyle = "border-[#22C55E]";
                  badgeStyle = "bg-[#22C55E]/10 text-[#22C55E]";
                } else if (sub.status === "rejected") {
                  borderStyle = "border-[#EF4444]";
                  badgeStyle = "bg-[#EF4444]/10 text-[#EF4444]";
                } else if (sub.status === "under_review") {
                  badgeStyle = "bg-[#4B1E91]/20 text-[#F5F0E8]";
                } else if (sub.status === "submitted") {
                  badgeStyle = "bg-neutral-800 text-white";
                }

                return (
                  <div
                    key={sub.id}
                    className={`bg-[#1E0A4A] border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all ${borderStyle}`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            {sub.taskName}
                          </h3>
                          <p className="text-[11px] font-mono text-[#F5F0E8] mt-0.5">
                            📦 Attached: {sub.fileName} ({sub.fileType})
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${badgeStyle}`}
                        >
                          {sub.status.replace("_", " ")}
                        </span>
                      </div>

                      {sub.notes && (
                        <p className="text-xs text-neutral-300 mt-2 bg-[#0D0118]/60 p-2.5 rounded-xl border border-[#4B1E91]/40 text-justify">
                          <span className="text-[10px] font-mono text-[#F5F0E8] block mb-0.5">
                            Developer Notes:
                          </span>
                          {sub.notes}
                        </p>
                      )}

                      {sub.status === "approved" && sub.reviewerComment && (
                        <div className="mt-3 text-xs text-[#22C55E] italic bg-[#22C55E]/5 p-2.5 border border-[#22C55E]/20 rounded-xl text-justify">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block not-italic mb-0.5">
                            Architect Evaluation:
                          </span>
                          "{sub.reviewerComment}"
                        </div>
                      )}

                      {sub.status === "rejected" && sub.reviewerComment && (
                        <div className="mt-3 text-xs text-[#EF4444] italic bg-[#EF4444]/5 p-2.5 border border-[#EF4444]/20 rounded-xl text-justify">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block not-italic mb-0.5">
                            Rejection Audit Comment:
                          </span>
                          "{sub.reviewerComment}"
                        </div>
                      )}

                      {sub.status === "under_review" && (
                        <p className="mt-3 text-[11px] font-mono text-[#F5F0E8]/50 italic pl-1">
                          No reviewer comment yet. Evaluation pending in lane
                          queue.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91]/50 text-[11px] font-mono text-[#F5F0E8]">
                      <span>⏱ {sub.submittedAgo}</span>
                      {sub.status === "rejected" && (
                        <button
                          onClick={() => handleResubmitTrigger(sub.taskName)}
                          className="bg-[#F59E0B] text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg hover:bg-[#d98207] transition-all"
                        >
                          Resubmit Package
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center border border-dashed border-[#4B1E91] rounded-2xl py-12 bg-[#1E0A4A]">
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-mono text-sm text-[#F5F0E8]">
                  No submissions found matching filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHub;
