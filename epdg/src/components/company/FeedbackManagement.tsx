import { useState } from "react";



interface WeeklyRating {
  week: string;
  avgRating: number;
  submissionCount: number;
}

interface InternComment {
  id: number;
  internName: string;
  internInitials: string;
  comment: string;
  rating: number;
  weekAgo: string;
}

interface FeedbackEntry {
  id: number;
  internName: string;
  internInitials: string;
  mentorName: string;
  sessionDate: string;
  rating: number;
  comment: string;
}


const overallRating = 4.2;
const totalSubmissions = 24;

const mockWeeklyRatings: WeeklyRating[] = [
  { week: "Week 1", avgRating: 4.0, submissionCount: 5 },
  { week: "Week 2", avgRating: 4.3, submissionCount: 7 },
  { week: "Week 3", avgRating: 4.1, submissionCount: 6 },
  { week: "Week 4", avgRating: 4.5, submissionCount: 6 },
];

const mockRecentComments: InternComment[] = [
  {
    id: 1,
    internName: "Amara Osei",
    internInitials: "AO",
    comment:
      "The sessions have been incredibly helpful. My mentor gives clear, actionable feedback every time.",
    rating: 5,
    weekAgo: "1 week ago",
  },
  {
    id: 2,
    internName: "Brian Mwangi",
    internInitials: "BM",
    comment:
      "Really enjoying the mentorship so far. Sophia is very patient and explains complex topics well.",
    rating: 4,
    weekAgo: "1 week ago",
  },
  {
    id: 3,
    internName: "Cynthia Achieng",
    internInitials: "CA",
    comment:
      "Great programme overall. Would love more frequent check-ins with my mentor.",
    rating: 4,
    weekAgo: "2 weeks ago",
  },
];

const mockFeedbackEntries: FeedbackEntry[] = [
  {
    id: 1,
    internName: "Amara Osei",
    internInitials: "AO",
    mentorName: "James Otieno",
    sessionDate: "20 May 2026",
    rating: 5,
    comment: "Excellent session, covered React hooks in depth.",
  },
  {
    id: 2,
    internName: "Brian Mwangi",
    internInitials: "BM",
    mentorName: "Sophia Wanjiku",
    sessionDate: "22 May 2026",
    rating: 4,
    comment: "Very helpful explanation of database indexing.",
  },
  {
    id: 3,
    internName: "Cynthia Achieng",
    internInitials: "CA",
    mentorName: "Dr. Kuria Mwangi",
    sessionDate: "25 May 2026",
    rating: 5,
    comment: "Amazing session on Figma prototyping techniques.",
  },
  {
    id: 4,
    internName: "Daniel Kipchoge",
    internInitials: "DK",
    mentorName: "Sophia Wanjiku",
    sessionDate: "28 May 2026",
    rating: 3,
    comment: "Session was okay but felt a bit rushed.",
  },
  {
    id: 5,
    internName: "Faith Njeri",
    internInitials: "FN",
    mentorName: "James Otieno",
    sessionDate: "1 Jun 2026",
    rating: 4,
    comment: "Good feedback on my UI mockups. Very constructive.",
  },
  {
    id: 6,
    internName: "Kevin Odhiambo",
    internInitials: "KO",
    mentorName: "Dr. Kuria Mwangi",
    sessionDate: "3 Jun 2026",
    rating: 4,
    comment: "Helpful session, learned a lot about component design.",
  },
];

const mentorOptions = [
  "all",
  "Dr. Kuria Mwangi",
  "Sophia Wanjiku",
  "James Otieno",
];



const avatarColor = (initials: string): string => {
  const colors = [
    "bg-[#7C4FC4]",
    "bg-[#22C55E]/80",
    "bg-[#F59E0B]/80",
    "bg-[#EF4444]/80",
  ];
  return colors[initials.charCodeAt(0) % colors.length];
};


const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= Math.round(rating) ? "text-[#F59E0B]" : "text-[#3A1D73]"}
      >
        ★
      </span>
    ))}
  </div>
);


const StarSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= (hovered || value) ? "text-[#F59E0B]" : "text-[#3A1D73]"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};



export default function FeedbackManagement() {

  const [formIntern, setFormIntern] = useState("");
  const [formWeek, setFormWeek] = useState("");
  const [formStars, setFormStars] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  
  const [mentorFilter, setMentorFilter] = useState("all");


  const filteredFeedback =
    mentorFilter === "all"
      ? mockFeedbackEntries
      : mockFeedbackEntries.filter((e) => e.mentorName === mentorFilter);

  
  const handleSubmit = () => {
    if (!formIntern || !formWeek || formStars === 0 || !formComment) {
      setFormError("Please fill in all fields and select a star rating.");
      return;
    }
    setFormError("");
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setFormIntern("");
    setFormWeek("");
    setFormStars(0);
    setFormComment("");
    setFormError("");
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Feedback Management</h1>
        <p className="text-[#A78BCC] text-sm mt-1">
          Monitor programme ratings and manage mentor feedback
        </p>
      </div>

      
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[#A78BCC] text-sm mb-1">Overall Programme Rating</p>
            <div className="flex items-end gap-2">
              <span className="text-white text-5xl font-bold">
                {overallRating}
              </span>
              <span className="text-[#A78BCC] text-lg mb-1">/5</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay rating={overallRating} />
              <span className="text-[#A78BCC] text-xs">
                Based on {totalSubmissions} submissions
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-[#A78BCC] text-xs">Total Submissions</p>
            <p className="text-white text-3xl font-bold">{totalSubmissions}</p>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E]">
              Active Programme
            </span>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">
            Weekly Averages
          </h2>
          <div className="flex flex-col gap-4">
            {mockWeeklyRatings.map((week) => (
              <div key={week.week} className="flex items-center gap-3">
                <span className="text-[#A78BCC] text-xs w-14 flex-shrink-0">
                  {week.week}
                </span>
                <StarDisplay rating={week.avgRating} />
                <span className="text-white text-sm font-medium">
                  {week.avgRating}
                </span>
                <span className="text-[#A78BCC] text-xs ml-auto">
                  {week.submissionCount} reviews
                </span>
              </div>
            ))}
          </div>
        </div>

     
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">
            Recent Intern Comments
          </h2>
          <div className="flex flex-col gap-4">
            {mockRecentComments.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(entry.internInitials)}`}
                >
                  {entry.internInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white text-sm font-semibold">
                      {entry.internName}
                    </p>
                    <span className="text-[#A78BCC] text-xs">
                      {entry.weekAgo}
                    </span>
                  </div>
                  <StarDisplay rating={entry.rating} />
                  <p className="text-[#A78BCC] text-xs mt-1 leading-relaxed">
                    "{entry.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

   
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <h2 className="text-white font-bold text-base mb-4">
          Write Mentor Feedback
        </h2>

      
        {formSubmitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white font-bold text-lg">Feedback Submitted!</p>
            <p className="text-[#A78BCC] text-sm mt-1 mb-4">
              Your feedback has been recorded successfully.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium transition-colors"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
          
            <div>
              <label className="block text-sm text-[#A78BCC] mb-1.5">
                Intern *
              </label>
              <select
                value={formIntern}
                onChange={(e) => setFormIntern(e.target.value)}
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
              >
                <option value="">Select intern…</option>
                <option>Amara Osei</option>
                <option>Brian Mwangi</option>
                <option>Cynthia Achieng</option>
                <option>Daniel Kipchoge</option>
                <option>Faith Njeri</option>
                <option>Kevin Odhiambo</option>
              </select>
            </div>

          
            <div>
              <label className="block text-sm text-[#A78BCC] mb-1.5">
                Week Number *
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={formWeek}
                onChange={(e) => setFormWeek(e.target.value)}
                placeholder="e.g. 4"
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A78BCC] mb-1.5">
                Rating *
              </label>
              <StarSelector value={formStars} onChange={setFormStars} />
              {formStars > 0 && (
                <p className="text-[#A78BCC] text-xs mt-1">
                  {formStars === 1 && "Poor"}
                  {formStars === 2 && "Fair"}
                  {formStars === 3 && "Good"}
                  {formStars === 4 && "Very Good"}
                  {formStars === 5 && "Excellent"}
                </p>
              )}
            </div>

          
            <div>
              <label className="block text-sm text-[#A78BCC] mb-1.5">
                Comment *
              </label>
              <textarea
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="Share feedback on this intern's progress, attitude, and areas for improvement…"
                rows={4}
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none"
              />
            </div>


            {formError && (
              <p className="text-[#EF4444] text-sm">{formError}</p>
            )}

            <button
              onClick={handleSubmit}
              className="self-start bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl mb-6 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5 border-b border-[#3A1D73]">
          <h2 className="text-white font-bold text-base">
            Intern-to-Mentor Ratings
          </h2>
         
          <select
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
            className="bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
          >
            {mentorOptions.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Mentors" : m}
              </option>
            ))}
          </select>
        </div>

      
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#3A1D73]">
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Intern
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Mentor
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Session Date
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Rating
                </th>
                <th className="text-left text-[#A78BCC] text-xs font-medium px-5 py-3">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#3A1D73] last:border-b-0"
                >
                
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(entry.internInitials)}`}
                      >
                        {entry.internInitials}
                      </div>
                      <span className="text-white text-sm whitespace-nowrap">
                        {entry.internName}
                      </span>
                    </div>
                  </td>
              
                  <td className="px-5 py-3">
                    <span className="text-[#A78BCC] text-sm whitespace-nowrap">
                      {entry.mentorName}
                    </span>
                  </td>
                
                  <td className="px-5 py-3">
                    <span className="text-[#A78BCC] text-sm whitespace-nowrap">
                      {entry.sessionDate}
                    </span>
                  </td>
                
                  <td className="px-5 py-3">
                    <StarDisplay rating={entry.rating} />
                  </td>
            
                  <td className="px-5 py-3">
                    <p className="text-[#A78BCC] text-xs max-w-xs">
                      {entry.comment}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5">
        <h2 className="text-white font-bold text-base mb-1">Feedback Trend</h2>
        <p className="text-[#A78BCC] text-xs mb-5">
          Average rating per week — bar width reflects score out of 5
        </p>
        <div className="flex flex-col gap-4">
          {mockWeeklyRatings.map((week) => {
            const widthPct = Math.round((week.avgRating / 5) * 100);
            return (
              <div key={week.week} className="flex items-center gap-3">
              
                <span className="text-[#A78BCC] text-xs w-14 flex-shrink-0">
                  {week.week}
                </span>
               
                <div className="flex-1 bg-[#0D0618] rounded-full h-3">
                  <div
                    className="bg-[#7C4FC4] h-3 rounded-full transition-all"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
          
                <span className="text-white text-sm font-medium w-8 flex-shrink-0">
                  {week.avgRating}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
