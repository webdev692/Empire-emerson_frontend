import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

interface ReceivedFeedback {
  id: number;
  from_name: string;
  category: string;
  comment: string;
  rating: number;
  created_at: string;
}

const StarPicker: React.FC<{
  rating: number; hover: number;
  onSet: (r: number) => void; onHover: (r: number) => void; onLeave: () => void;
}> = ({ rating, hover, onSet, onHover, onLeave }) => (
  <div className="flex gap-1.5 text-2xl text-[#F59E0B]">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onSet(s)}
        onMouseEnter={() => onHover(s)} onMouseLeave={onLeave}
        className="transition-transform active:scale-95 focus:outline-none">
        {s <= (hover || rating) ? "★" : "☆"}
      </button>
    ))}
  </div>
);

const weekLabel = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const Feedback: React.FC = () => {
  const user = useAuthStore(s => s.user);

  const [received, setReceived]       = useState<ReceivedFeedback[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(true);

  // Programme
  const [progRating, setProgRating]   = useState(0);
  const [progHover, setProgHover]     = useState(0);
  const [progNotes, setProgNotes]     = useState("");
  const [progSubmitted, setProgSubmitted] = useState(false);
  const [progLoading, setProgLoading] = useState(false);

  // Mentor
  const [mentorRating, setMentorRating]   = useState(0);
  const [mentorHover, setMentorHover]     = useState(0);
  const [mentorNotes, setMentorNotes]     = useState("");
  const [mentorSubmitted, setMentorSubmitted] = useState(false);
  const [mentorLoading, setMentorLoading] = useState(false);

  // Suggestion
  const [suggestion, setSuggestion]         = useState("");
  const [suggSubmitted, setSuggSubmitted]   = useState(false);
  const [suggLoading, setSuggLoading]       = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: ReceivedFeedback[] }>("/api/intern/feedback/received")
      .then(r => setReceived(r.data.data ?? []))
      .finally(() => setLoadingReceived(false));
  }, []);

  const handleProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (progRating === 0) return;
    setProgLoading(true);
    try {
      await api.post("/api/intern/feedback", { type: "programme", rating: progRating, comment: progNotes || "Submitted.", name: user?.name });
      setProgSubmitted(true);
    } catch { /* silent */ }
    finally { setProgLoading(false); }
  };

  const handleMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorRating === 0) return;
    setMentorLoading(true);
    try {
      await api.post("/api/intern/feedback", { type: "mentor", rating: mentorRating, comment: mentorNotes || "Submitted.", name: user?.name });
      setMentorSubmitted(true);
    } catch { /* silent */ }
    finally { setMentorLoading(false); }
  };

  const handleSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSuggLoading(true);
    try {
      await api.post("/api/intern/feedback", { type: "suggestion", rating: 5, comment: suggestion, name: "Anonymous" });
      setSuggSubmitted(true);
      setSuggestion("");
      setTimeout(() => setSuggSubmitted(false), 4000);
    } catch { /* silent */ }
    finally { setSuggLoading(false); }
  };

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Feedback &amp; Evaluations</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">Submit weekly ratings, review mentor comments, and transmit anonymous structural suggestions</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">
        {/* Programme rating */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Weekly Programme Evaluation</h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Rate your overall experience during this curriculum block</p>
          </div>
          {progSubmitted ? (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 rounded-xl text-xs font-mono text-[#22C55E]">
              ✅ You rated this week {progRating}/5 stars
            </div>
          ) : (
            <form onSubmit={handleProgramme} className="space-y-4">
              <StarPicker rating={progRating} hover={progHover} onSet={setProgRating} onHover={setProgHover} onLeave={() => setProgHover(0)} />
              {progRating > 0 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <textarea value={progNotes} onChange={e => setProgNotes(e.target.value)}
                    placeholder="Provide additional context regarding your rating..."
                    className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none placeholder-neutral-600" />
                  <button type="submit" disabled={progLoading}
                    className="w-full bg-[#4B1E91] hover:bg-[#683cb0] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors">
                    {progLoading ? "Submitting…" : "Submit Programme Rating"}
                  </button>
                </div>
              )}
              {progRating === 0 && (
                <button type="button" disabled
                  className="w-full bg-neutral-800 text-neutral-500 border border-neutral-700 text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-xl opacity-50 cursor-not-allowed">
                  Select Rating To Submit
                </button>
              )}
            </form>
          )}
        </div>

        {/* Mentor rating */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Evaluate Your Mentor</h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Provide feedback indicators for your assigned solutions architect</p>
          </div>
          {mentorSubmitted ? (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 rounded-xl text-xs font-mono text-[#22C55E]">
              ✅ Mentor feedback submitted
            </div>
          ) : (
            <form onSubmit={handleMentor} className="space-y-4">
              <StarPicker rating={mentorRating} hover={mentorHover} onSet={setMentorRating} onHover={setMentorHover} onLeave={() => setMentorHover(0)} />
              <textarea value={mentorNotes} onChange={e => setMentorNotes(e.target.value)}
                placeholder="What went well? Highlight any guidance blocks or review sync adjustments..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none placeholder-neutral-600" />
              <button type="submit" disabled={mentorRating === 0 || mentorLoading}
                className={`w-full font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors ${
                  mentorRating > 0 ? "bg-[#4B1E91] text-white hover:bg-[#683cb0] disabled:opacity-50" : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-50"
                }`}>
                {mentorLoading ? "Submitting…" : "Submit Mentor Rating"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Received feedback */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">Architect Feedback Received</h3>
          {loadingReceived ? (
            <div className="flex justify-center py-8">
              <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-6 h-6 animate-spin" />
            </div>
          ) : received.length === 0 ? (
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6 text-center text-[#F5F0E8] text-xs">
              No feedback received from your mentor yet.
            </div>
          ) : (
            <div className="space-y-4">
              {received.map(fb => (
                <div key={fb.id} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#4B1E91]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#4B1E91]/10 border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-xs text-[#F5F0E8] rounded-xl">
                        {fb.from_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{fb.from_name}</h4>
                        <p className="text-[10px] text-[#F5F0E8] font-mono">{weekLabel(fb.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex text-[#F59E0B] text-xs select-none tracking-wider">
                      {[1,2,3,4,5].map(s => <span key={s}>{s <= fb.rating ? "★" : "☆"}</span>)}
                    </div>
                  </div>
                  <blockquote className="text-xs text-neutral-200 leading-relaxed text-justify bg-[#0D0118]/40 p-3.5 rounded-xl border border-[#4B1E91]/30 border-l-2 border-l-[#4B1E91] italic">
                    "{fb.comment}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anonymous suggestion */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Anonymous Suggestion Box</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Share architectural concerns or program improvement ideas</p>
          </div>
          {suggSubmitted && (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-3 rounded-xl text-[11px] font-mono text-[#22C55E] animate-in fade-in duration-150">
              ✅ Suggestion received. Thank you!
            </div>
          )}
          <form onSubmit={handleSuggestion} className="space-y-3">
            <div className="relative">
              <textarea required maxLength={500} value={suggestion} onChange={e => setSuggestion(e.target.value)}
                placeholder="Share an idea or concern..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-32 resize-none focus:outline-none placeholder-neutral-600" />
              <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-[#F5F0E8]/50 bg-[#0D0118] px-1.5 py-0.5 rounded border border-[#4B1E91]/30">
                {suggestion.length} / 500
              </div>
            </div>
            <button type="submit" disabled={!suggestion.trim() || suggLoading}
              className={`w-full font-mono text-xs uppercase tracking-wider py-2 rounded-xl transition-colors ${
                suggestion.trim() ? "bg-[#4B1E91] text-white hover:bg-[#683cb0] disabled:opacity-50" : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
              }`}>
              {suggLoading ? "Sending…" : "Transmit Suggestion"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
