import { useState } from "react";


type ReqStatus = "pending" | "confirmed" | "cancelled";

interface SessionRequest {
  id: number;
  internName: string;
  internInitials: string;
  mentorName: string;
  mentorInitials: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: ReqStatus;
}

interface UpcomingSession {
  id: number;
  internName: string;
  internInitials: string;
  mentorName: string;
  mentorInitials: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
}

interface PastSession {
  id: number;
  internName: string;
  internInitials: string;
  mentorName: string;
  mentorInitials: string;
  topic: string;
  date: string;
  duration: string;
  rating: number;
  mentorNotes: string;
}



const mockRequests: SessionRequest[] = [
  {
    id: 1,
    internName: "Amara Osei",
    internInitials: "AO",
    mentorName: "Dr. Kuria Mwangi",
    mentorInitials: "KM",
    topic: "React State Management & Performance",
    date: "10 Jun 2026",
    time: "14:00",
    duration: "60 min",
    status: "pending",
  },
];

const mockUpcoming: UpcomingSession[] = [
  {
    id: 1,
    internName: "Brian Mwangi",
    internInitials: "BM",
    mentorName: "Sophia Wanjiku",
    mentorInitials: "SW",
    topic: "Database Optimisation",
    date: "8 Jun 2026",
    time: "10:00",
    duration: "45 min",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    internName: "Cynthia Achieng",
    internInitials: "CA",
    mentorName: "Dr. Kuria Mwangi",
    mentorInitials: "KM",
    topic: "UI Design Principles",
    date: "9 Jun 2026",
    time: "15:30",
    duration: "60 min",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
  },
  {
    id: 3,
    internName: "Daniel Kipchoge",
    internInitials: "DK",
    mentorName: "Sophia Wanjiku",
    mentorInitials: "SW",
    topic: "Data Visualisation Techniques",
    date: "11 Jun 2026",
    time: "11:00",
    duration: "30 min",
    meetingLink: "https://meet.google.com/lmn-opqr-stu",
  },
  {
    id: 4,
    internName: "Amara Osei",
    internInitials: "AO",
    mentorName: "James Otieno",
    mentorInitials: "JO",
    topic: "Code Review Best Practices",
    date: "12 Jun 2026",
    time: "09:00",
    duration: "60 min",
    meetingLink: "https://meet.google.com/vwx-yz12-345",
  },
];

const mockPast: PastSession[] = [
  {
    id: 1,
    internName: "Amara Osei",
    internInitials: "AO",
    mentorName: "James Otieno",
    mentorInitials: "JO",
    topic: "Introduction & Onboarding",
    date: "20 May 2026",
    duration: "60 min",
    rating: 5,
    mentorNotes:
      "Excellent first session. Amara is highly motivated and quick to grasp new concepts.",
  },
  {
    id: 2,
    internName: "Brian Mwangi",
    internInitials: "BM",
    mentorName: "Sophia Wanjiku",
    mentorInitials: "SW",
    topic: "PostgreSQL Deep Dive",
    date: "22 May 2026",
    duration: "45 min",
    rating: 4,
    mentorNotes:
      "Good understanding of joins and indexing. Needs more practice with query optimisation.",
  },
  {
    id: 3,
    internName: "Cynthia Achieng",
    internInitials: "CA",
    mentorName: "Dr. Kuria Mwangi",
    mentorInitials: "KM",
    topic: "Figma Prototyping",
    date: "25 May 2026",
    duration: "60 min",
    rating: 5,
    mentorNotes: "Outstanding creativity. Wireframes are clean and well thought out.",
  },
  {
    id: 4,
    internName: "Daniel Kipchoge",
    internInitials: "DK",
    mentorName: "Sophia Wanjiku",
    mentorInitials: "SW",
    topic: "Analytics Report Structure",
    date: "28 May 2026",
    duration: "30 min",
    rating: 3,
    mentorNotes:
      "Report structure needs improvement. Missing key sections on revenue breakdown.",
  },
  {
    id: 5,
    internName: "Brian Mwangi",
    internInitials: "BM",
    mentorName: "James Otieno",
    mentorInitials: "JO",
    topic: "API Design Patterns",
    date: "1 Jun 2026",
    duration: "60 min",
    rating: 4,
    mentorNotes:
      "Strong REST design instincts. Discussed RESTful conventions and error handling.",
  },
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

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rating ? "text-[#F59E0B]" : "text-[#3A1D73]"}
      >
        ★
      </span>
    ))}
  </div>
);



export default function SessionsManagement() {
  //state
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<SessionRequest[]>(mockRequests);

  // Modal form state
  const [formIntern, setFormIntern] = useState("");
  const [formMentor, setFormMentor] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formDuration, setFormDuration] = useState("60");
  const [formLink, setFormLink] = useState("");
  const [formError, setFormError] = useState("");

  // Derived
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const totalSessions = mockUpcoming.length + mockPast.length;

  // Handlers
  const handleConfirm = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r))
    );
  };

  const handleCancel = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
  };

  const handleSubmit = () => {
    if (!formIntern || !formMentor || !formTopic || !formDate || !formTime) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setFormError("");
    setShowModal(false);
    setFormIntern("");
    setFormMentor("");
    setFormDate("");
    setFormTime("");
    setFormTopic("");
    setFormDuration("60");
    setFormLink("");
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
     
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mentor Sessions</h1>
          <p className="text-[#A78BCC] text-sm mt-1">
            Manage intern–mentor sessions and track progress
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          + Schedule New Session
        </button>
      </div>

   
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-white text-2xl font-bold">{totalSessions}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Total Sessions</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#F59E0B] text-2xl font-bold">
            {pendingRequests.length}
          </p>
          <p className="text-[#A78BCC] text-xs mt-1">Pending Requests</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#7C4FC4] text-2xl font-bold">
            {mockUpcoming.length}
          </p>
          <p className="text-[#A78BCC] text-xs mt-1">Upcoming</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#22C55E] text-2xl font-bold">
            {mockPast.length}
          </p>
          <p className="text-[#A78BCC] text-xs mt-1">Completed</p>
        </div>
      </div>

      
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">
            Session Requests
          </h2>
          <div className="flex flex-col gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#F59E0B]/10 border border-[#F59E0B]/40 rounded-2xl p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  
                  <div className="flex items-center gap-4">
                   
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0D0618] z-10 ${avatarColor(req.internInitials)}`}
                      >
                        {req.internInitials}
                      </div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0D0618] -ml-3 ${avatarColor(req.mentorInitials)}`}
                      >
                        {req.mentorInitials}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {req.internName}{" "}
                        <span className="text-[#A78BCC] font-normal">with</span>{" "}
                        {req.mentorName}
                      </p>
                      <p className="text-[#A78BCC] text-xs mt-0.5">
                        📌 {req.topic}
                      </p>
                      <p className="text-[#F59E0B] text-xs mt-0.5">
                        🗓 {req.date} at {req.time} · {req.duration}
                      </p>
                    </div>
                  </div>
               
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleConfirm(req.id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E] hover:bg-[#22C55E]/30 transition-colors"
                    >
                      Confirm ✓
                    </button>
                    <button className="px-4 py-2 rounded-xl text-sm font-medium bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] hover:bg-[#F59E0B]/30 transition-colors">
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      Cancel ✗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-3">Upcoming Sessions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockUpcoming.map((session) => (
            <div
              key={session.id}
              className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5"
            >
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  
                  <div className="flex items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#1A0D35] z-10 ${avatarColor(session.internInitials)}`}
                    >
                      {session.internInitials}
                    </div>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#1A0D35] -ml-2 ${avatarColor(session.mentorInitials)}`}
                    >
                      {session.mentorInitials}
                    </div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">
                      {session.internName}
                    </p>
                    <p className="text-[#A78BCC] text-xs">
                      with {session.mentorName}
                    </p>
                  </div>
                </div>
                
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#7C4FC4]/20 border border-[#7C4FC4]/40 text-[#7C4FC4] font-medium whitespace-nowrap">
                  Scheduled
                </span>
              </div>
             
              <p className="text-white text-sm font-medium mb-1">
                📌 {session.topic}
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#A78BCC] text-xs mb-4">
                <span>🗓 {session.date}</span>
                <span>🕐 {session.time}</span>
                <span>⏱ {session.duration}</span>
              </div>
              
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Join Meeting →
              </a>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Past Sessions</h2>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl overflow-hidden">
          {mockPast.map((session, idx) => (
            <div
              key={session.id}
              className={`p-5 ${
                idx < mockPast.length - 1 ? "border-b border-[#3A1D73]" : ""
              }`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                
                <div className="flex gap-3 flex-1 min-w-0">
                  
                  <div className="flex items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#1A0D35] z-10 ${avatarColor(session.internInitials)}`}
                    >
                      {session.internInitials}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#1A0D35] -ml-2 ${avatarColor(session.mentorInitials)}`}
                    >
                      {session.mentorInitials}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-white text-sm font-semibold">
                        {session.topic}
                      </p>
                     
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E]">
                        Completed
                      </span>
                    </div>
                    <p className="text-[#A78BCC] text-xs mb-1">
                      {session.internName} · {session.mentorName}
                    </p>
                    
                    <p className="text-[#A78BCC]/70 text-xs italic truncate">
                      "{session.mentorNotes}"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start lg:items-end gap-1 flex-shrink-0">
                  <span className="text-[#A78BCC] text-xs">{session.date}</span>
                  <span className="text-[#A78BCC] text-xs">
                    ⏱ {session.duration}
                  </span>
                  <StarRating rating={session.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                Schedule New Session
              </h2>
              <button
                onClick={closeModal}
                className="text-[#A78BCC] hover:text-white text-xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>

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
                </select>
              </div>

              
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Mentor *
                </label>
                <select
                  value={formMentor}
                  onChange={(e) => setFormMentor(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                >
                  <option value="">Select mentor…</option>
                  <option>Dr. Kuria Mwangi</option>
                  <option>Sophia Wanjiku</option>
                  <option>James Otieno</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1.5">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                  />
                </div>
              </div>

           
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Topic *
                </label>
                <textarea
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="What will the session cover?"
                  rows={3}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none"
                />
              </div>

          
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Duration
                </label>
                <select
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>

          
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Meeting Link{" "}
                  <span className="text-[#A78BCC]/50">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

              
              {formError && (
                <p className="text-[#EF4444] text-sm">{formError}</p>
              )}

         
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Schedule Session
                </button>
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
