import { useState } from 'react';



type SubStatus = 'pending' | 'approved' | 'rejected';

interface Submission {
  id: number;
  internName: string;
  initials: string;
  taskName: string;
  fileName: string;
  fileSize: string;
  submittedAgo: string;
  status: SubStatus;
  reviewerComment: string;
  notes: string;
}



const mockSubmissions: Submission[] = [
  {
    id: 1,
    internName: 'Amara Osei',
    initials: 'AO',
    taskName: 'Build Login Page UI',
    fileName: 'login_page_v2.zip',
    fileSize: '2.4 MB',
    submittedAgo: '2 hours ago',
    status: 'pending',
    reviewerComment: '',
    notes: 'Includes responsive layout for mobile and desktop',
  },
  {
    id: 2,
    internName: 'Brian Mwangi',
    initials: 'BM',
    taskName: 'Set Up PostgreSQL Schema',
    fileName: 'db_schema.sql',
    fileSize: '48 KB',
    submittedAgo: '5 hours ago',
    status: 'approved',
    reviewerComment: 'Great work — schema is clean and well-normalised. Well done Brian.',
    notes: 'Schema with seed data included',
  },
  {
    id: 3,
    internName: 'Cynthia Achieng',
    initials: 'CA',
    taskName: 'Design Dashboard Wireframes',
    fileName: 'dashboard_wireframes.fig',
    fileSize: '1.1 MB',
    submittedAgo: '1 day ago',
    status: 'pending',
    reviewerComment: '',
    notes: 'Figma export with all 5 screens',
  },
  {
    id: 4,
    internName: 'Daniel Kipchoge',
    initials: 'DK',
    taskName: 'Quarterly Analytics Report',
    fileName: 'q2_report_draft.pdf',
    fileSize: '890 KB',
    submittedAgo: '2 days ago',
    status: 'rejected',
    reviewerComment: 'Missing the revenue breakdown section. Please resubmit with complete data.',
    notes: 'Draft version — awaiting feedback',
  },
  {
    id: 5,
    internName: 'Amara Osei',
    initials: 'AO',
    taskName: 'Implement Notification System',
    fileName: 'notifications_module.zip',
    fileSize: '3.2 MB',
    submittedAgo: '3 days ago',
    status: 'approved',
    reviewerComment: 'Excellent implementation — notifications are working perfectly across all browsers.',
    notes: 'Includes unit tests',
  },
  {
    id: 6,
    internName: 'Brian Mwangi',
    initials: 'BM',
    taskName: 'Write API Documentation',
    fileName: 'api_docs_v1.pdf',
    fileSize: '560 KB',
    submittedAgo: '4 days ago',
    status: 'pending',
    reviewerComment: '',
    notes: 'Covers all 24 endpoints',
  },
];



const avatarColor = (initials: string): string => {
  const colors = ['bg-[#7C4FC4]', 'bg-[#22C55E]/80', 'bg-[#F59E0B]/80', 'bg-[#EF4444]/80'];
  return colors[initials.charCodeAt(0) % colors.length];
};

const statusBadgeStyle = (status: SubStatus): string => {
  switch (status) {
    case 'pending':  return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40';
    case 'approved': return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40';
    case 'rejected': return 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40';
  }
};

const cardBorderStyle = (status: SubStatus): string => {
  switch (status) {
    case 'approved': return 'border-[#22C55E]/60';
    case 'rejected': return 'border-[#EF4444]/60';
    default:         return 'border-[#3A1D73]';
  }
};

const fileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':  return '📄';
    case 'zip':  return '🗜️';
    case 'sql':  return '🗃️';
    case 'fig':  return '🎨';
    default:     return '📁';
  }
};



export default function SubmissionReview() {

  
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [filter, setFilter]           = useState<'all' | SubStatus>('all');
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [comment, setComment]         = useState('');

  
  const filtered = submissions.filter(
    (s) => filter === 'all' || s.status === filter
  );

  const count = (status: 'all' | SubStatus): number =>
    status === 'all'
      ? submissions.length
      : submissions.filter((s) => s.status === status).length;

  const pendingCount  = count('pending');
  const approvedCount = count('approved');
  const rejectedCount = count('rejected');

  
  const updateSubmission = (id: number, status: SubStatus, reviewerComment: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, reviewerComment } : s))
    );
  };

  const handleReviewClick = (id: number) => {
    setReviewingId(id);
    setComment('');
  };

  const handleApprove = (id: number) => {
    updateSubmission(id, 'approved', comment);
    setReviewingId(null);
    setComment('');
  };

  const handleReject = (id: number) => {
    updateSubmission(id, 'rejected', comment);
    setReviewingId(null);
    setComment('');
  };

  const tabs: Array<'all' | SubStatus> = ['all', 'pending', 'approved', 'rejected'];
  const tabLabel: Record<'all' | SubStatus, string> = {
    all: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
   
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Submission Review</h1>
        <p className="text-[#A78BCC] text-sm mt-1">
          {pendingCount > 0
            ? `📋 ${pendingCount} submission${pendingCount !== 1 ? 's' : ''} waiting for review`
            : 'All submissions have been reviewed'}
        </p>
      </div>

 
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-white text-2xl font-bold">{submissions.length}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Total</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#F59E0B] text-2xl font-bold">{pendingCount}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Pending</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#22C55E] text-2xl font-bold">{approvedCount}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Approved</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#EF4444] text-2xl font-bold">{rejectedCount}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Rejected</p>
        </div>
      </div>

    
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? 'bg-[#7C4FC4] text-white'
                : 'bg-[#1A0D35] border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4]'
            }`}
          >
            {tabLabel[tab]} ({count(tab)})
          </button>
        ))}
      </div>

     
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-8 text-center">
            <p className="text-[#A78BCC]">No submissions in this category.</p>
          </div>
        )}

        {filtered.map((sub) => (
          <div
            key={sub.id}
            className={`bg-[#1A0D35] border rounded-2xl p-5 ${cardBorderStyle(sub.status)}`}
          >
          
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

              
              <div className="flex gap-4 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarColor(sub.initials)}`}>
                  {sub.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-white font-bold text-base">{sub.internName}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadgeStyle(sub.status)}`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-[#A78BCC] text-sm mb-2">
                    Task: <span className="text-white">{sub.taskName}</span>
                  </p>

                
                  <div className="flex items-center gap-2 bg-[#0D0618] border border-[#3A1D73] rounded-xl px-3 py-2 w-fit">
                    <span className="text-lg">{fileIcon(sub.fileName)}</span>
                    <div>
                      <p className="text-white text-xs font-medium">{sub.fileName}</p>
                      <p className="text-[#A78BCC] text-xs">{sub.fileSize}</p>
                    </div>
                  </div>

                  <p className="text-[#A78BCC] text-xs mt-2">🕐 Submitted {sub.submittedAgo}</p>

                  {sub.notes && (
                    <p className="text-[#A78BCC] text-xs mt-1 italic">"{sub.notes}"</p>
                  )}

                 
                  {sub.status === 'approved' && sub.reviewerComment && (
                    <div className="mt-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-4 py-2.5">
                      <p className="text-xs text-[#22C55E] font-medium mb-0.5">✓ Reviewer Comment</p>
                      <p className="text-sm text-white">{sub.reviewerComment}</p>
                    </div>
                  )}

                
                  {sub.status === 'rejected' && sub.reviewerComment && (
                    <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-4 py-2.5">
                      <p className="text-xs text-[#EF4444] font-medium mb-0.5">✗ Rejection Reason</p>
                      <p className="text-sm text-white">{sub.reviewerComment}</p>
                    </div>
                  )}
                </div>
              </div>

             
              {sub.status === 'pending' && reviewingId !== sub.id && (
                <button
                  onClick={() => handleReviewClick(sub.id)}
                  className="self-start bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                >
                  Review
                </button>
              )}
            </div>

          
            {reviewingId === sub.id && (
              <div className="mt-4 pt-4 border-t border-[#3A1D73]">

               
                <div className="w-full h-28 bg-[#0D0618] border border-[#3A1D73] rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-4xl mb-1">{fileIcon(sub.fileName)}</p>
                    <p className="text-[#A78BCC] text-xs">{sub.fileName} · {sub.fileSize}</p>
                    <p className="text-[#A78BCC]/50 text-xs mt-0.5">File preview</p>
                  </div>
                </div>

               
                <label className="block text-sm text-[#A78BCC] mb-2">Reviewer comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment for the intern (optional for approval, recommended for rejection)..."
                  rows={3}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none mb-3"
                />

                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="flex-1 bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E] hover:bg-[#22C55E]/30 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Approve ✓
                  </button>
                  <button
                    onClick={() => handleReject(sub.id)}
                    className="flex-1 bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/30 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Reject ✗
                  </button>
                  <button
                    onClick={() => setReviewingId(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}