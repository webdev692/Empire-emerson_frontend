import React, { useState } from "react";

interface MentorFeedback {
  id: number;
  initials: string;
  name: string;
  week: string;
  rating: number;
  comment: string;
}

const MOCK_MENTOR_FEEDBACK: MentorFeedback[] = [
  {
    id: 1,
    initials: "SK",
    name: "Sanjiv Kumar",
    week: "Week 4",
    rating: 5,
    comment: "Brian has displayed exceptional clean-code separation across the dashboard routing tree. Type definitions are strict and layout structures are pixel-perfect."
  },
  {
    id: 2,
    initials: "SK",
    name: "Sanjiv Kumar",
    week: "Week 3",
    rating: 4,
    comment: "Great operational momentum on state-driven components. Minor padding adjustments needed on responsive viewports, but overall architecture is solid."
  }
];

const Feedback: React.FC = () => {
  const [programmeRating, setProgrammeRating] = useState<number>(0);
  const [programmeHover, setProgrammeHover] = useState<number>(0);
  const [programmeNotes, setProgrammeNotes] = useState<string>("");
  const [programmeSubmitted, setProgrammeSubmitted] = useState<boolean>(false);

  const [mentorRating, setMentorRating] = useState<number>(0);
  const [mentorHover, setMentorHover] = useState<number>(0);
  const [mentorNotes, setMentorNotes] = useState<string>("");
  const [mentorSubmitted, setMentorSubmitted] = useState<boolean>(false);

  const [suggestion, setSuggestion] = useState<string>( "");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState<boolean>(false);

  const handleProgrammeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (programmeRating > 0) {
      setProgrammeSubmitted(true);
    }
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorRating > 0) {
      setMentorSubmitted(true);
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion.trim()) {
      setSuggestionSubmitted(true);
      setSuggestion("");
      setTimeout(() => setSuggestionSubmitted(false), 4000);
    }
  };

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Feedback &amp; Evaluations</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Submit weekly ratings, review mentor comments, and transmit anonymous structural suggestions
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">

        {/* ── STEP 1 & 2: PROGRAMME WEEKLY RATING CARD ── */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Weekly Programme Evaluation</h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Rate your overall experience during this curriculum block</p>
          </div>

          {programmeSubmitted ? (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 rounded-xl text-xs font-mono text-[#22C55E]">
              ✅ You rated this week {programmeRating}/5 stars
            </div>
          ) : (
            <form onSubmit={handleProgrammeSubmit} className="space-y-4">
              <div className="flex gap-1.5 text-2xl text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProgrammeRating(star)}
                    onMouseEnter={() => setProgrammeHover(star)}
                    onMouseLeave={() => setProgrammeHover(0)}
                    className="transition-transform active:scale-95 focus:outline-none"
                  >
                    {star <= (programmeHover || programmeRating) ? "★" : "☆"}
                  </button>
                ))}
              </div>

              {programmeRating > 0 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <textarea
                    value={programmeNotes}
                    onChange={(e) => setProgrammeNotes(e.target.value)}
                    placeholder="Provide additional context regarding your rating..."
                    className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#4B1E91] hover:bg-[#683cb0] text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Submit Programme Rating
                  </button>
                </div>
              )}

              {programmeRating === 0 && (
                <button
                  type="button"
                  disabled
                  className="w-full bg-neutral-800 text-neutral-500 border border-neutral-700 text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-xl opacity-50 cursor-not-allowed"
                >
                  Select Rating To Submit
                </button>
              )}
            </form>
          )}
        </div>

        {/* ── STEP 3: MENTOR RATING CARD ── */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Evaluate Your Mentor</h2>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Provide feedback indicators for your assigned solutions architect</p>
          </div>

          {mentorSubmitted ? (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 rounded-xl text-xs font-mono text-[#22C55E]">
              ✅ Submitted for Week 4
            </div>
          ) : (
            <form onSubmit={handleMentorSubmit} className="space-y-4">
              <div className="flex gap-1.5 text-2xl text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMentorRating(star)}
                    onMouseEnter={() => setMentorHover(star)}
                    onMouseLeave={() => setMentorHover(0)}
                    className="transition-transform active:scale-95 focus:outline-none"
                  >
                    {star <= (mentorHover || mentorRating) ? "★" : "☆"}
                  </button>
                ))}
              </div>

              <textarea
                value={mentorNotes}
                onChange={(e) => setMentorNotes(e.target.value)}
                placeholder="What went well? Highlight any guidance blocks or review sync adjustments..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-20 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
              />

              <button
                type="submit"
                disabled={mentorRating === 0}
                className={`w-full font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors ${
                  mentorRating > 0
                    ? "bg-[#4B1E91] text-white hover:bg-[#683cb0]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-50"
                }`}
              >
                Submit Mentor Rating
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ── STEP 2: MENTOR FEEDBACK RECEIVED (Takes 2 Columns) ── */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F0E8] px-1">Architect Feedback Received</h3>
          <div className="space-y-4">
            {MOCK_MENTOR_FEEDBACK.map((fb) => (
              <div key={fb.id} className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#4B1E91]/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#4B1E91]/10 border border-[#4B1E91] flex items-center justify-center font-mono font-bold text-xs text-[#F5F0E8] rounded-xl">
                      {fb.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{fb.name}</h4>
                      <p className="text-[10px] text-[#F5F0E8] font-mono">{fb.week}</p>
                    </div>
                  </div>
                  <div className="flex text-[#F59E0B] text-xs select-none tracking-wider">
                    {[1, 2, 3, 4, 5].map((s) => <span key={s}>{s <= fb.rating ? "★" : "☆"}</span>)}
                  </div>
                </div>

                <blockquote className="text-xs text-neutral-200 leading-relaxed text-justify bg-[#0D0118]/40 p-3.5 rounded-xl border border-[#4B1E91]/30 border-l-2 border-l-[#4B1E91] italic">
                  "{fb.comment}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 3: ANONYMOUS SUGGESTION BOX (Takes 1 Column) ── */}
        <div className="bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Anonymous Suggestion Box</h3>
            <p className="text-[11px] text-[#F5F0E8] mt-0.5">Share architectural concerns or program improvement ideas</p>
          </div>

          {suggestionSubmitted && (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-3 rounded-xl text-[11px] font-mono text-[#22C55E] animate-in fade-in duration-150">
              ✅ Suggestion received. Thank you!
            </div>
          )}

          <form onSubmit={handleSuggestionSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                required
                maxLength={500}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Share an idea or concern..."
                className="bg-[#0D0118] border border-[#4B1E91] rounded-xl text-white text-xs p-2.5 w-full h-32 resize-none focus:outline-none focus:border-[#4B1E91] placeholder-neutral-600"
              />
              <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-[#F5F0E8]/50 bg-[#0D0118] px-1.5 py-0.5 rounded border border-[#4B1E91]/30">
                {suggestion.length} / 500
              </div>
            </div>

            <button
              type="submit"
              disabled={!suggestion.trim()}
              className={`w-full font-mono text-xs uppercase tracking-wider py-2 rounded-xl transition-colors ${
                suggestion.trim()
                  ? "bg-[#4B1E91] text-white hover:bg-[#683cb0]"
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
              }`}
            >
              Transmit Suggestion
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Feedback;