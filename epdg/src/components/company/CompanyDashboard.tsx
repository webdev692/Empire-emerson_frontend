import { Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/epd_logo.png";
import { useAuthStore } from "../../store/authStore";

interface Intern {
  id: number;
  initials: string;
  name: string;
  dept: string;
  progress: number;
  status: 'Active' | 'Onboarding' | 'Completed';
}

interface Session {
  id: number;
  mentorName: string;
  internName: string;
  date: string;
  time: string;
}

interface Feedback {
  id: number;
  internInitials: string;
  internName: string;
  rating: number;
  comment: string;
  week: string;
}

const CompanyDashboard = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  // Mock data
  const mockInterns: Intern[] = [
    { id: 1, initials: 'AM', name: 'Alice Mwangi', dept: 'Frontend', progress: 75, status: 'Active' },
    { id: 2, initials: 'BK', name: 'Brian Kipchoge', dept: 'Backend', progress: 60, status: 'Active' },
    { id: 3, initials: 'CN', name: 'Cynthia Njoki', dept: 'UX/UI', progress: 85, status: 'Active' },
    { id: 4, initials: 'DM', name: 'David Mutua', dept: 'Frontend', progress: 50, status: 'Onboarding' },
    { id: 5, initials: 'EW', name: 'Eve Wangari', dept: 'Backend', progress: 95, status: 'Active' },
  ];

  const mockSessions: Session[] = [
    { id: 1, mentorName: 'James Chen', internName: 'Alice Mwangi', date: 'Today', time: '2:00 PM' },
    { id: 2, mentorName: 'Sarah Kipchoge', internName: 'Brian Kipchoge', date: 'Tomorrow', time: '10:00 AM' },
    { id: 3, mentorName: 'John Ochieng', internName: 'Cynthia Njoki', date: 'Jun 5', time: '3:30 PM' },
  ];

  const mockFeedback: Feedback[] = [
    {
      id: 1,
      internInitials: 'AM',
      internName: 'Alice Mwangi',
      rating: 4.5,
      comment: 'Great progress on the UI redesign. Keep pushing!',
      week: 'Week 8',
    },
    {
      id: 2,
      internInitials: 'BK',
      internName: 'Brian Kipchoge',
      rating: 4,
      comment: 'Good API design. Work on error handling.',
      week: 'Week 7',
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#22C55E]/20 text-[#22C55E]';
      case 'Onboarding':
        return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'Completed':
        return 'bg-[#4B1E91]/20 text-[#4B1E91]';
      default:
        return 'bg-[#F5F0E8]/20 text-[#F5F0E8]';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#F5F0E8]'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#0D0118] min-h-screen flex flex-col text-[#FFFFFF]">
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 lg:px-6 py-3 bg-[#0D0118]/80 shadow-sm shadow-white backdrop-blur-md border-b border-[#4B1E91]/60">
        <img src={logo} alt="Emerson Professional" className="w-auto h-28 object-contain" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#F5F0E8] hover:text-white hover:bg-[#4B1E91]/20 transition-all"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
      <div className="mx-auto p-4 lg:p-8 max-w-7xl">
        <div className="flex lg:flex-row flex-col items-start lg:items-center gap-4 mb-8">
      
      
          <div className="bg-[#4B1E91] rounded-lg w-16 lg:w-20 h-16 lg:h-20 shrink-0" />

          <div className="flex-1">
            <h1 className="mb-2 font-bold text-3xl lg:text-4xl">TechCorp Kenya</h1>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block bg-[#22C55E]/20 px-3 py-1 rounded-full font-medium text-[#22C55E] text-sm">
                ✓ Verified Company
              </span>
              <span className="inline-block bg-[#4B1E91]/20 px-3 py-1 rounded-full font-medium text-[#4B1E91] text-sm">
                Active Programme
              </span>
            </div>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-[#1E0A4A] p-4 lg:p-6 border border-[#4B1E91] rounded-2xl">
            <p className="mb-2 text-[#F5F0E8] text-sm">Active Interns</p>
            <p className="font-bold text-3xl lg:text-4xl">8</p>
          </div>
          <div className="bg-[#1E0A4A] p-4 lg:p-6 border border-[#4B1E91] rounded-2xl">
            <p className="mb-2 text-[#F5F0E8] text-sm">Open Slots</p>
            <p className="font-bold text-3xl lg:text-4xl">3</p>
          </div>
          <div className="bg-[#1E0A4A] p-4 lg:p-6 border border-amber-500/50 rounded-2xl">
            <p className="mb-2 text-[#F5F0E8] text-sm">Pending Applications</p>
            <p className="font-bold text-3xl lg:text-4xl">5</p>
          </div>
          <div className="bg-[#1E0A4A] p-4 lg:p-6 border border-[#4B1E91] rounded-2xl">
            <p className="mb-2 text-[#F5F0E8] text-sm">Pending Reviews</p>
            <p className="font-bold text-3xl lg:text-4xl">2</p>
          </div>
        </div>

      
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mb-8">
         
          <div className="bg-[#1E0A4A] p-6 border border-[#F59E0B]/50 rounded-2xl">
            <p className="mb-4 font-medium text-[#F59E0B]">⚡ 5 applications waiting.</p>
            <button className="bg-[#F59E0B] hover:bg-[#F59E0B]/80 px-4 py-2 rounded-lg w-full lg:w-auto font-semibold text-black transition-colors cursor-pointer">
              Review Applications →
            </button>
          </div>

       
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-2xl">
            <p className="mb-4 font-medium text-[#4B1E91]">📋 2 submissions waiting.</p>
            <button className="bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-4 py-2 rounded-lg w-full lg:w-auto font-semibold text-[#FFFFFF] transition-colors cursor-pointer">
              Review Submissions →
            </button>
          </div>
        </div>

       
        <div className="bg-[#1E0A4A] mb-8 p-6 border border-[#4B1E91] rounded-2xl">
          <h2 className="mb-4 font-bold text-xl">Active Interns</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {mockInterns.map((intern) => (
              <div key={intern.id} className="flex items-center gap-4 pb-4 border-[#4B1E91] border-b last:border-b-0">
               
                <div className="flex justify-center items-center bg-[#4B1E91] rounded-full w-10 h-10 font-semibold text-sm shrink-0">
                  {intern.initials}
                </div>

             
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-semibold">{intern.name}</p>
                      <p className="text-[#F5F0E8] text-sm">{intern.dept}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(intern.status)}`}>
                      {intern.status}
                    </span>
                  </div>

               
                  <div className="bg-[#0D0118] rounded-full w-full h-2">
                    <div
                      className="bg-[#4B1E91] rounded-full h-2 transition-all"
                      style={{ width: `${intern.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[#F5F0E8] text-xs">{intern.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 font-medium text-[#4B1E91] hover:text-[#4B1E91]/80 text-sm transition-colors cursor-pointer">
            View All Interns →
          </button>
        </div>

       
        <div className="mb-8">
          <h2 className="mb-4 font-bold text-xl">Upcoming Sessions</h2>
          <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-2xl">
                <p className="mb-2 text-[#F5F0E8] text-sm">Mentor & Intern</p>
                <p className="mb-1 font-semibold">{session.mentorName}</p>
                <p className="mb-4 text-[#F5F0E8] text-sm">{session.internName}</p>
                <p className="mb-1 font-medium text-sm">{session.date} • {session.time}</p>
                <span className="inline-block bg-[#22C55E]/20 px-2 py-1 rounded font-medium text-[#22C55E] text-xs">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>

       
        <div className="mb-8">
          <h2 className="mb-4 font-bold text-xl">Quick Actions</h2>
          <div className="flex lg:flex-row flex-col gap-4">
            <button className="flex-1 bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-6 py-3 rounded-lg font-semibold text-[#FFFFFF] transition-colors cursor-pointer">
              + Post New Slot
            </button>
            <button className="flex-1 bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-6 py-3 rounded-lg font-semibold text-[#FFFFFF] transition-colors cursor-pointer">
              👁 Review Applications
            </button>
            <button className="flex-1 bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-6 py-3 rounded-lg font-semibold text-[#FFFFFF] transition-colors cursor-pointer">
              📊 View Analytics
            </button>
          </div>
        </div>

        
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-2xl">
          <h2 className="mb-4 font-bold text-xl">Recent Feedback</h2>
          <div className="space-y-4">
            {mockFeedback.map((feedback) => (
              <div key={feedback.id} className="pb-4 border-[#4B1E91] border-b last:border-b-0">
                <div className="flex items-start gap-4">
                
                  <div className="flex justify-center items-center bg-[#4B1E91] rounded-full w-10 h-10 font-semibold text-sm shrink-0">
                    {feedback.internInitials}
                  </div>

                 
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{feedback.internName}</p>
                        <p className="text-[#F5F0E8] text-sm">{feedback.week}</p>
                      </div>
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-[#F5F0E8] text-sm">{feedback.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
