import React, { useState, useEffect } from "react";
import api from "../lib/axios";

interface MentorData {
  mentor_id: number;
  mentor_name: string;
  mentor_email: string;
  mentor_department: string | null;
  mentor_bio: string | null;
  mentor_skills: string[] | null;
  placement_id: number;
}

interface Session {
  id: number;
  scheduled_at: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  intern_rating: number | null;
  mentor_notes: string | null;
  mentor_name: string;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function countdown(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

const Mentors: React.FC = () => {
  const [mentor, setMentor]           = useState<MentorData | null>(null);
  const [upcoming, setUpcoming]       = useState<Session[]>([]);
  const [past, setPast]               = useState<Session[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  const [formData, setFormData] = useState({ date: "", time: "", topic: "" });
  const [showToast, setShowToast] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get<{ success: boolean; data: MentorData | null }>("/api/intern/mentor"),
      api.get<{ success: boolean; data: { upcoming: Session[]; past: Session[] } }>("/api/intern/mentor/sessions"),
    ]).then(([m, s]) => {
      if (m.status === "fulfilled") setMentor(m.value.data.data);
      if (s.status === "fulfilled") {
        setUpcoming(s.value.data.data?.upcoming ?? []);
        setPast(s.value.data.data?.past ?? []);
      }
    }).catch(() => setError("Failed to load mentor data."))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      const r = await api.post<{ success: boolean; data: Session }>("/api/intern/mentor/sessions", {
        date: formData.date,
        time: formData.time,
        notes: formData.topic,
      });
      setUpcoming(prev => [...prev, r.data.data]);
      setFormData({ date: "", time: "", topic: "" });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      setError("Failed to request session.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
    </div>
  );

  const initials = mentor?.mentor_name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "??";

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Mentorship Dashboard</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">Coordinate synchronous developer alignments, schedule sessions, and review evaluation records</p>
      </header>

      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-300 text-sm">{error}</div>}

      {showToast && (
        <div className="mb-6 bg-[#22C55E]/20 border border-[#22C55E] p-4 rounded-xl text-xs font-mono text-white animate-in fade-in duration-200">
          ✓ Sync session request transmitted successfully! Your mentor will confirm parameters within 24 hours.
        </div>
      )}

      {/* Mentor card */}
      {mentor ? (
        <div className="bg-[#1E0A4A] border-l-4 border-l-[#4B1E91] border-y border-r border-[#4B1E91] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-xl tracking-wider shadow-md shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">{mentor.mentor_name}</h2>
                {mentor.mentor_department && (
                  <span className="bg-[#4B1E91]/20 text-[#F5F0E8] text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-[#4B1E91]/30">
                    {mentor.mentor_department}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#F5F0E8] mt-0.5">{mentor.mentor_email}</p>
              {mentor.mentor_skills && mentor.mentor_skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {mentor.mentor_skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="bg-[#0D0118] text-[#4B1E91] text-[9px] font-mono border border-[#4B1E91] px-2 py-0.5 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-[#4B1E91]/50 pt-4 md:pt-0">
            <button onClick={() => document.getElementById("request-session-form")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-1 sm:flex-none bg-[#4B1E91] hover:bg-[#683cb0] text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors whitespace-nowrap">
              📅 Request Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6 mb-8 text-center text-[#F5F0E8] text-sm">
          No mentor assigned yet. A mentor will be assigned once your placement is confirmed.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        {/* Upcoming sessions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">Scheduled Lanes</h3>
          {upcoming.length === 0 ? (
            <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6 text-center text-[#F5F0E8] text-xs">
              No upcoming sessions. Request one below.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(s => (
                <div key={s.id} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {fmtDate(s.scheduled_at)} at {fmtTime(s.scheduled_at)}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        s.status === "confirmed" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    {s.notes && <p className="text-xs text-[#F5F0E8] font-mono">{s.notes}</p>}
                  </div>
                  <span className="text-[11px] font-mono text-[#EF4444] font-bold self-end sm:self-auto">
                    {countdown(s.scheduled_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request session form */}
        <div id="request-session-form" className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Schedule a New Session</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Select timeline coordinates below</p>
          </div>
          <form onSubmit={handleRequestSession} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">Target Date</label>
                <input required type="date" value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">Target Time</label>
                <input required type="time" value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">Alignment Objectives</label>
              <textarea required value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Outline specific development blocks to audit..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none placeholder-neutral-600" />
            </div>
            <button type="submit" disabled={requesting || !mentor}
              className="w-full bg-[#4B1E91] hover:bg-[#683cb0] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors">
              {requesting ? "Sending…" : "Send Request"}
            </button>
          </form>
          <p className="text-[10px] font-mono text-[#F5F0E8]/50 text-center italic">Your mentor will confirm parameters within 24 hours</p>
        </div>
      </div>

      {/* Past sessions */}
      {past.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">Historical Logs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map(s => (
              <div key={s.id} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono text-[#F5F0E8]">{fmtDate(s.scheduled_at)}</span>
                    <span className="bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">Completed</span>
                  </div>
                  {s.notes && (
                    <p className="text-xs text-[#F5F0E8]/80 bg-[#0D0118]/40 p-2.5 border border-[#4B1E91]/30 rounded-xl text-justify h-16 overflow-hidden">
                      <span className="text-[9px] font-mono uppercase tracking-wide text-[#F5F0E8] block mb-0.5">Notes:</span>
                      "{s.notes}"
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91]/50">
                  <span className="text-[10px] font-mono uppercase text-[#F5F0E8]/60">Performance Score</span>
                  {s.intern_rating !== null ? (
                    <div className="flex gap-0.5 text-[#F59E0B] tracking-wider text-sm select-none">
                      {[1,2,3,4,5].map(star => <span key={star}>{star <= s.intern_rating! ? "★" : "☆"}</span>)}
                    </div>
                  ) : (
                    <span className="max-w-36 text-right text-[9px] font-mono uppercase leading-relaxed text-[#F5F0E8]/60">
                      Session feedback is temporarily unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
