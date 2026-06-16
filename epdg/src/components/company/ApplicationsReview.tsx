import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AppStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

interface Application {
  id: number;
  name: string;
  initials: string;
  school: string;
  course: string;
  year: string;
  slot: string;
  appliedDate: string;
  coverLetter: string;
  status: AppStatus;
  rejectionReason: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockApplications: Application[] = [
  {
    id: 1,
    name: 'Amara Osei',
    initials: 'AO',
    school: 'University of Nairobi',
    course: 'Computer Science',
    year: 'Year 3',
    slot: 'Frontend Development Intern',
    appliedDate: '28 May 2026',
    coverLetter:
      'I am a passionate frontend developer with hands-on experience in React and TypeScript. I have built several projects that demonstrate my ability to deliver clean, responsive UI components.\nI am eager to contribute to TechCorp Kenya and grow within a professional environment. I believe this internship aligns perfectly with my career goals and academic background.',
    status: 'pending',
    rejectionReason: '',
  },
  {
    id: 2,
    name: 'Brian Mwangi',
    initials: 'BM',
    school: 'Strathmore University',
    course: 'Software Engineering',
    year: 'Year 4',
    slot: 'Backend Engineering Intern',
    appliedDate: '26 May 2026',
    coverLetter:
      'With strong experience in Node.js, Express, and PostgreSQL, I am confident in my ability to contribute meaningfully to your backend team.\nI have completed two backend projects during my coursework and freelanced for a local startup, building REST APIs consumed by mobile applications.',
    status: 'shortlisted',
    rejectionReason: '',
  },
  {
    id: 3,
    name: 'Cynthia Achieng',
    initials: 'CA',
    school: 'USIU Africa',
    course: 'Information Technology',
    year: 'Year 2',
    slot: 'Frontend Development Intern',
    appliedDate: '24 May 2026',
    coverLetter:
      'I have a deep interest in user interface design and frontend development. My coursework has equipped me with knowledge in HTML, CSS, and JavaScript, and I am currently learning React.\nI am a fast learner and team player who thrives in collaborative environments.',
    status: 'pending',
    rejectionReason: '',
  },
  {
    id: 4,
    name: 'Daniel Kipchoge',
    initials: 'DK',
    school: 'Kenyatta University',
    course: 'Business Information Technology',
    year: 'Year 3',
    slot: 'Data Analytics Intern',
    appliedDate: '22 May 2026',
    coverLetter:
      'My background in business and technology gives me a unique perspective on data analytics. I am proficient in Excel, SQL, and have begun learning Python for data analysis.\nI am excited about the opportunity to apply these skills in a real-world setting at TechCorp Kenya.',
    status: 'accepted',
    rejectionReason: '',
  },
  {
    id: 5,
    name: 'Esther Wanjiku',
    initials: 'EW',
    school: 'Technical University of Kenya',
    course: 'Computer Science',
    year: 'Year 4',
    slot: 'Backend Engineering Intern',
    appliedDate: '20 May 2026',
    coverLetter:
      'I am a final-year student with experience in Java, Python, and cloud services. I have worked on a capstone project building a microservices architecture using Docker and AWS.\nI am looking for an internship where I can deepen my backend skills and work alongside experienced engineers.',
    status: 'rejected',
    rejectionReason: 'Position was filled before review could be completed.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarColor = (initials: string): string => {
  const colors = [
    'bg-[#7C4FC4]',
    'bg-[#22C55E]/80',
    'bg-[#F59E0B]/80',
    'bg-[#EF4444]/80',
    'bg-[#A78BCC]/60',
  ];
  return colors[initials.charCodeAt(0) % colors.length];
};

const statusBadge = (status: AppStatus): string => {
  switch (status) {
    case 'pending':    return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40';
    case 'shortlisted':return 'bg-[#7C4FC4]/20 text-[#7C4FC4] border border-[#7C4FC4]/40';
    case 'accepted':   return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40';
    case 'rejected':   return 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40';
  }
};

const cardBorder = (status: AppStatus): string => {
  switch (status) {
    case 'accepted': return 'border-[#22C55E]/60';
    case 'rejected': return 'border-[#EF4444]/60';
    default:         return 'border-[#3A1D73]';
  }
};

// ─── Cover Letter Preview ─────────────────────────────────────────────────────

function CoverLetterPreview({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split('\n');
  const preview = lines.slice(0, 2).join(' ');
  const hasMore = lines.length > 2 || text.length > preview.length;

  return (
    <div className="mt-3">
      <p className="text-xs text-[#A78BCC] mb-1 font-medium uppercase tracking-wide">Cover Letter</p>
      <p className="text-sm text-white leading-relaxed">
        {expanded ? text : preview}
        {!expanded && hasMore && '…'}
      </p>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#7C4FC4] hover:text-[#A78BCC] mt-1 transition-colors"
        >
          {expanded ? 'Show less ▲' : 'Show more ▼'}
        </button>
      )}
    </div>
  );
}

// ─── CV Modal ─────────────────────────────────────────────────────────────────

function CVModal({ app, onClose }: { app: Application; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">CV Summary — {app.name}</h2>
          <button
            onClick={onClose}
            className="text-[#A78BCC] hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl"
          >×</button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div className="bg-[#0D0618] border border-[#3A1D73] rounded-xl p-4">
            <p className="text-[#A78BCC] text-xs uppercase tracking-wide mb-2">Education</p>
            <p className="text-white font-medium">{app.school}</p>
            <p className="text-[#A78BCC]">{app.course} · {app.year}</p>
          </div>
          <div className="bg-[#0D0618] border border-[#3A1D73] rounded-xl p-4">
            <p className="text-[#A78BCC] text-xs uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Git', 'REST APIs'].map((skill) => (
                <span key={skill} className="bg-[#7C4FC4]/20 text-[#A78BCC] border border-[#7C4FC4]/30 text-xs px-2.5 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#0D0618] border border-[#3A1D73] rounded-xl p-4">
            <p className="text-[#A78BCC] text-xs uppercase tracking-wide mb-2">Experience</p>
            <p className="text-white font-medium">Academic Projects (2 years)</p>
            <p className="text-[#A78BCC]">Built full-stack apps during coursework and personal time</p>
          </div>
          <div className="bg-[#0D0618] border border-[#3A1D73] rounded-xl p-4">
            <p className="text-[#A78BCC] text-xs uppercase tracking-wide mb-2">GPA</p>
            <p className="text-white font-medium">3.6 / 4.0</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApplicationsReview() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filter, setFilter] = useState<'all' | AppStatus>('all');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [cvAppId, setCvAppId] = useState<number | null>(null);

  const filtered = applications.filter(
    (a) => filter === 'all' || a.status === filter
  );

  const count = (status: 'all' | AppStatus) =>
    status === 'all'
      ? applications.length
      : applications.filter((a) => a.status === status).length;

  const pendingCount = count('pending');

  const updateStatus = (id: number, status: AppStatus, reason = '') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, rejectionReason: reason } : a))
    );
  };

  const handleShortlist = (id: number) => updateStatus(id, 'shortlisted');
  const handleAccept    = (id: number) => updateStatus(id, 'accepted');
  const handleReject    = (id: number) => { setRejectingId(id); setRejectionReason(''); };

  const handleConfirmReject = (id: number) => {
    updateStatus(id, 'rejected', rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
  };

  const cvApp = applications.find((a) => a.id === cvAppId) ?? null;

  const tabs: Array<'all' | AppStatus> = ['all', 'pending', 'shortlisted', 'accepted', 'rejected'];
  const tabLabel: Record<'all' | AppStatus, string> = {
    all: 'All', pending: 'Pending', shortlisted: 'Shortlisted',
    accepted: 'Accepted', rejected: 'Rejected',
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Applications Review</h1>
        <p className="text-[#A78BCC] text-sm mt-1">
          {pendingCount > 0
            ? `⚡ ${pendingCount} application${pendingCount !== 1 ? 's' : ''} waiting for review`
            : 'All applications have been reviewed'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-[#7C4FC4] text-white'
                : 'bg-[#1A0D35] border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4]'
            }`}
          >
            {tabLabel[tab]} ({count(tab)})
          </button>
        ))}
      </div>

      {/* Application Cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-8 text-center">
            <p className="text-[#A78BCC]">No applications in this category.</p>
          </div>
        )}

        {filtered.map((app) => (
          <div
            key={app.id}
            className={`bg-[#1A0D35] border rounded-2xl p-5 ${cardBorder(app.status)}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4 flex-1">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarColor(app.initials)}`}>
                  {app.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-white font-bold text-base">{app.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[#A78BCC] text-sm">{app.school}</p>
                  <p className="text-[#A78BCC] text-sm">{app.course} · {app.year}</p>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#A78BCC]">
                    <span>📋 Slot: <span className="text-white">{app.slot}</span></span>
                    <span>📅 Applied: <span className="text-white">{app.appliedDate}</span></span>
                  </div>

                  <CoverLetterPreview text={app.coverLetter} />

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-2.5">
                      <p className="text-xs text-[#EF4444] font-medium mb-0.5">Rejection Reason</p>
                      <p className="text-sm text-white">{app.rejectionReason}</p>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <div className="mt-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-4 py-2.5">
                      <p className="text-sm text-[#22C55E] font-medium">✓ Accepted — onboarding email will be sent</p>
                    </div>
                  )}
                </div>
              </div>

              {/* View CV */}
              <button
                onClick={() => setCvAppId(app.id)}
                className="self-start bg-[#0D0618] border border-[#3A1D73] hover:border-[#7C4FC4] text-[#A78BCC] hover:text-white text-sm px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                📄 View CV
              </button>
            </div>

            {/* Action Buttons */}
            {app.status !== 'accepted' && app.status !== 'rejected' && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#3A1D73]">
                <button
                  onClick={() => handleShortlist(app.id)}
                  disabled={app.status === 'shortlisted'}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    app.status === 'shortlisted'
                      ? 'border-[#7C4FC4] text-[#7C4FC4] opacity-60 cursor-not-allowed'
                      : 'border-[#7C4FC4] text-[#7C4FC4] hover:bg-[#7C4FC4]/10'
                  }`}
                >
                  ★ Shortlist
                </button>
                <button
                  onClick={() => handleAccept(app.id)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E] hover:bg-[#22C55E]/30 transition-colors"
                >
                  ✓ Accept
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                >
                  ✗ Reject
                </button>
              </div>
            )}

            {/* Rejection Textarea */}
            {rejectingId === app.id && (
              <div className="mt-4 pt-4 border-t border-[#3A1D73]">
                <label className="block text-sm text-[#A78BCC] mb-2">
                  Reason for rejection <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a brief reason for rejecting this application..."
                  rows={3}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#EF4444] transition-colors resize-none"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setRejectingId(null)}
                    className="px-4 py-2 rounded-xl text-sm border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmReject(app.id)}
                    className="px-4 py-2 rounded-xl text-sm bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/30 transition-colors font-medium"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CV Modal */}
      {cvApp && <CVModal app={cvApp} onClose={() => setCvAppId(null)} />}
    </div>
  );
}

