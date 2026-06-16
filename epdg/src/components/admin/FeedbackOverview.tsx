import { useMemo, useState } from "react";
import { MessageSquare, Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackItem {
  id: number;
  from: string;
  role: string;
  category: string;
  comment: string;
  rating: number;
  status: "new" | "reviewed" | "actioned";
}

const feedbacks: FeedbackItem[] = [];

const statusFilters = ["all", "new", "reviewed", "actioned"] as const;

const statusClass = (status: FeedbackItem["status"]) => {
  switch (status) {
    case "new": return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "reviewed": return "bg-green-500/15 text-green-200";
    case "actioned": return "bg-amber-500/15 text-amber-200";
    default: return "bg-white/10 text-white";
  }
};

const FeedbackOverview: React.FC = () => {
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("all");

  const filteredFeedback = useMemo(
    () => feedbacks.filter((item) => filter === "all" || item.status === filter),
    [filter]
  );

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Feedback overview</p>
            <h1 className="mt-2 text-3xl font-semibold">Stakeholder sentiment</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Review quality signals from students, companies and schools.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white">
            <MessageSquare size={16} /> Add note
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === status ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredFeedback.length === 0 && (
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-12 text-center">
            <p className="text-[#F5F0E8]">No feedback yet.</p>
            <p className="mt-1 text-xs text-[#F5F0E8]/50">Feedback from interns, companies and schools will appear here.</p>
          </div>
        )}
        {filteredFeedback.map((feedback) => (
          <div key={feedback.id} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#F5F0E8]">{feedback.category}</p>
                <h2 className="mt-2 text-xl font-semibold">{feedback.from} · {feedback.role}</h2>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} className={index < feedback.rating ? "text-amber-400" : "text-[#4B4B5A]"} />
                ))}
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(feedback.status)}`}>{feedback.status}</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#F5F0E8]">{feedback.comment}</p>
            <div className="mt-4 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-4 py-3 text-sm font-semibold text-white">
                <ThumbsUp size={16} /> Mark actioned
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-[#4B1E91] px-4 py-3 text-sm text-[#F5F0E8]">
                <ThumbsDown size={16} /> Defer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackOverview;
