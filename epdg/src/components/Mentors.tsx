import React, { useState } from "react";

interface PastSessionItem {
  id: number;
  topic: string;
  duration: string;
  date: string;
  rating: number | null;
  mentorNotes: string;
}

const MOCK_MENTOR_DATA = {
  name: "Sanjiv Kumar",
  role: "Lead Frontend Solutions Architect",
  department: "Frontend Engineering",
  initials: "SK",
  expertise: [
    "React Architecture",
    "TypeScript Typings",
    "Tailwind Fluid UI",
    "State Optimizations",
  ],
  nextSession: "Tomorrow at 2:00 PM EDT",
};

const MOCK_UPCOMING_SESSIONS = [
  {
    id: 1,
    dateTime: "Today at 3:00 PM EDT",
    duration: "60 minutes",
    label: "Video Call",
    status: "Confirmed",
    countdown: "Starts in 1 hour",
  },
  {
    id: 2,
    dateTime: "Friday at 10:00 AM EDT",
    duration: "60 minutes",
    label: "Video Call",
    status: "Pending",
    countdown: "In 2 days",
  },
];

const MOCK_PAST_SESSIONS: PastSessionItem[] = [
  {
    id: 1,
    topic: "Workspace Environment & Tailwind Configuration Audit",
    duration: "60 mins",
    date: "May 28, 2026",
    rating: 5,
    mentorNotes:
      "Brian demonstrated solid repository initializing layout control tracking.",
  },
  {
    id: 2,
    topic: "Responsive Framework Design Systems & Grid Realignment",
    duration: "45 mins",
    date: "May 22, 2026",
    rating: 4,
    mentorNotes:
      "Excellent mobile viewport adaptation. Needs minor padding fine-tuning.",
  },
  {
    id: 3,
    topic: "Strict TypeScript Interfaces & Code Purging Operations",
    duration: "60 mins",
    date: "May 15, 2026",
    rating: null,
    mentorNotes:
      "Reviewed modular data operations. Session ready for trainee score submission.",
  },
];

const Mentors: React.FC = () => {
  const [pastSessions, setPastSessions] =
    useState<PastSessionItem[]>(MOCK_PAST_SESSIONS);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ratingTargetId, setRatingTargetId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ date: "", time: "", topic: "" });
  const [showToast, setShowToast] = useState<boolean>(false);

  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ date: "", time: "", topic: "" });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleOpenRatingModal = (id: number) => {
    setRatingTargetId(id);
    setSelectedRating(0);
    setHoveredStar(0);
    setFeedbackText("");
    setShowModal(true);
  };

  const handleSubmissionRating = () => {
    if (ratingTargetId === null || selectedRating === 0) return;

    setPastSessions((prev) =>
      prev.map((session) =>
        session.id === ratingTargetId
          ? { ...session, rating: selectedRating }
          : session,
      ),
    );
    setShowModal(false);
    setRatingTargetId(null);
  };

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Mentorship Dashboard
        </h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Coordinate synchronous developer alignments, schedule sessions, and
          review evaluation records
        </p>
      </header>

      {showToast && (
        <div className="mb-6 bg-[#22C55E]/20 border border-[#22C55E] p-4 rounded-xl text-xs font-mono text-white animate-in fade-in duration-200">
          ✓ Sync session request transmitted successfully! Your mentor will
          confirm parameters within 24 hours.
        </div>
      )}

      <div className="bg-[#1E0A4A] border-l-4 border-l-[#4B1E91] border-y border-r border-[#4B1E91] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#4B1E91] text-white flex items-center justify-center font-mono font-bold text-xl tracking-wider shadow-md shrink-0">
            {MOCK_MENTOR_DATA.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {MOCK_MENTOR_DATA.name}
              </h2>
              <span className="bg-[#4B1E91]/20 text-[#F5F0E8] text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-[#4B1E91]/30">
                {MOCK_MENTOR_DATA.department}
              </span>
            </div>
            <p className="text-xs text-[#F5F0E8] mt-0.5">
              {MOCK_MENTOR_DATA.role}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {MOCK_MENTOR_DATA.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="bg-[#0D0118] text-[#4B1E91] text-[9px] font-mono border border-[#4B1E91] px-2 py-0.5 rounded-md"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-[#4B1E91]/50 pt-4 md:pt-0">
          <div className="text-left md:text-right flex flex-col justify-center px-1">
            <span className="text-[10px] font-mono text-[#F5F0E8] uppercase tracking-wider">
              Next Track Alignment
            </span>
            <span className="text-xs font-mono text-[#F5F0E8] mt-0.5">
              {MOCK_MENTOR_DATA.nextSession}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() =>
                document
                  .getElementById("request-session-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 sm:flex-none bg-[#4B1E91] hover:bg-[#683cb0] text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors whitespace-nowrap"
            >
              📅 Request Session
            </button>
            <button className="flex-1 sm:flex-none bg-transparent hover:bg-[#4B1E91]/10 border border-[#4B1E91] text-[#4B1E91] hover:text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all Gold-out-line whitespace-nowrap">
              💬 Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">
            Scheduled Lanes
          </h3>
          <div className="space-y-3">
            {MOCK_UPCOMING_SESSIONS.map((session) => (
              <div
                key={session.id}
                className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {session.dateTime}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        session.status === "Confirmed"
                          ? "bg-[#22C55E]/10 text-[#22C55E]"
                          : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F0E8] font-mono">
                    ⏳ Duration: {session.duration}{" "}
                    <span className="mx-1.5">·</span> 📹 Mode: {session.label}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto border-t sm:border-t-0 border-[#4B1E91]/30 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[11px] font-mono text-[#EF4444] font-bold">
                    {session.countdown}
                  </span>
                  <button className="bg-transparent hover:bg-[#4B1E91] border border-[#4B1E91] text-white font-mono text-[10px] uppercase tracking-wider py-2 px-3 rounded-xl transition-all whitespace-nowrap">
                    Join Meeting →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="request-session-form"
          className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Schedule a New Session
            </h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">
              Select timeline coordinates below
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                  Target Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none focus:border-[#4B1E91]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                  Target Time
                </label>
                <input
                  required
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full focus:outline-none focus:border-[#4B1E91]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#F5F0E8] mb-1.5">
                Alignment Objectives
              </label>
              <textarea
                required
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="Outline specific development blocks or layout configurations to audit..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4B1E91] hover:bg-[#683cb0] text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors"
            >
              Send Request
            </button>
          </form>
          <p className="text-[10px] font-mono text-[#F5F0E8]/50 text-center italic">
            Your mentor will confirm parameters within 24 hours
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">
          Historical Logs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-4 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono text-[#F5F0E8]">
                    {session.date} ({session.duration})
                  </span>
                  <span className="bg-[#22C55E]/10 text-[#22C55E] text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">
                    Completed
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                  {session.topic}
                </h4>
                <p className="text-xs text-[#F5F0E8]/80 bg-[#0D0118]/40 p-2.5 border border-[#4B1E91]/30 rounded-xl text-justify h-16 overflow-hidden">
                  <span className="text-[9px] font-mono uppercase tracking-wide text-[#F5F0E8] block mb-0.5">
                    Mentor Notes:
                  </span>
                  "{session.mentorNotes}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#4B1E91]/50">
                <span className="text-[10px] font-mono uppercase text-[#F5F0E8]/60">
                  Performance Score
                </span>

                {session.rating !== null ? (
                  <div className="flex gap-0.5 text-[#F59E0B] tracking-wider text-sm select-none">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= (session.rating ?? 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenRatingModal(session.id)}
                    className="bg-[#4B1E91] text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg hover:bg-[#683cb0] transition-colors"
                  >
                    Rate this session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center">
              <h4 className="text-base font-bold text-white tracking-tight">
                Evaluate Session Pipeline
              </h4>
              <p className="text-xs text-[#F5F0E8] mt-0.5">
                Provide feedback indicators for data logging
              </p>
            </div>

            <div className="flex justify-center gap-1.5 text-2xl text-[#F59E0B] py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform active:scale-95 focus:outline-none"
                >
                  {star <= (hoveredStar || selectedRating) ? "★" : "☆"}
                </button>
              ))}
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Optional: Provide comments regarding track optimization guidelines..."
              className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#0D0118] border border-[#4B1E91] text-[#F5F0E8] font-mono text-xs uppercase tracking-wider py-2 rounded-xl hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedRating === 0}
                onClick={handleSubmissionRating}
                className={`flex-1 font-mono text-xs uppercase tracking-wider py-2 rounded-xl transition-colors ${
                  selectedRating > 0
                    ? "bg-[#4B1E91] text-white hover:bg-[#683cb0]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                }`}
              >
                Submit Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
