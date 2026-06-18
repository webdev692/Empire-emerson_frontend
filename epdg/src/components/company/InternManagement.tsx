import { useState } from 'react';
import { X } from 'lucide-react';

interface Intern {
  id: number;
  name: string;
  initials: string;
  department: 'Frontend' | 'Backend' | 'UX/UI';
  progress: number;
  status: 'Active' | 'Onboarding' | 'Completed';
  mentor: string;
  daysLeft: number;
  email: string;
  school: string;
  course: string;
  year: string;
  tasks: number;
  submissions: number;
  sessions: number;
  points: number;
  rank: number;
}

const InternManagement = () => {
 
  const mockInterns: Intern[] = [
    {
      id: 1,
      name: 'Alice Mwangi',
      initials: 'AM',
      department: 'Frontend',
      progress: 75,
      status: 'Active',
      mentor: 'James Chen',
      daysLeft: 45,
      email: 'alice@example.com',
      school: 'Nairobi University',
      course: 'Computer Science',
      year: '3rd Year',
      tasks: 12,
      submissions: 10,
      sessions: 8,
      points: 320,
      rank: 1,
    },
    {
      id: 2,
      name: 'Brian Kipchoge',
      initials: 'BK',
      department: 'Backend',
      progress: 60,
      status: 'Active',
      mentor: 'Sarah Kipchoge',
      daysLeft: 60,
      email: 'brian@example.com',
      school: 'KCA University',
      course: 'Software Engineering',
      year: '2nd Year',
      tasks: 10,
      submissions: 8,
      sessions: 6,
      points: 280,
      rank: 2,
    },
    {
      id: 3,
      name: 'Cynthia Njoki',
      initials: 'CN',
      department: 'UX/UI',
      progress: 85,
      status: 'Active',
      mentor: 'Grace Mwangi',
      daysLeft: 30,
      email: 'cynthia@example.com',
      school: 'Multimedia University',
      course: 'Digital Design',
      year: '1st Year',
      tasks: 14,
      submissions: 13,
      sessions: 10,
      points: 380,
      rank: 1,
    },
    {
      id: 4,
      name: 'David Mutua',
      initials: 'DM',
      department: 'Frontend',
      progress: 50,
      status: 'Onboarding',
      mentor: 'James Chen',
      daysLeft: 75,
      email: 'david@example.com',
      school: 'Strathmore University',
      course: 'Information Technology',
      year: '2nd Year',
      tasks: 5,
      submissions: 3,
      sessions: 2,
      points: 150,
      rank: 5,
    },
    {
      id: 5,
      name: 'Eve Wangari',
      initials: 'EW',
      department: 'Backend',
      progress: 95,
      status: 'Active',
      mentor: 'John Ochieng',
      daysLeft: 15,
      email: 'eve@example.com',
      school: 'University of Nairobi',
      course: 'Computer Science',
      year: '3rd Year',
      tasks: 15,
      submissions: 15,
      sessions: 12,
      points: 450,
      rank: 1,
    },
    {
      id: 6,
      name: 'Festus Kariuki',
      initials: 'FK',
      department: 'UX/UI',
      progress: 40,
      status: 'Onboarding',
      mentor: 'Grace Mwangi',
      daysLeft: 80,
      email: 'festus@example.com',
      school: 'Jomo Kenyatta University',
      course: 'Design',
      year: '1st Year',
      tasks: 3,
      submissions: 1,
      sessions: 1,
      points: 100,
      rank: 6,
    },
  ];


  const [deptFilter, setDeptFilter] = useState<'all' | 'Frontend' | 'Backend' | 'UX/UI'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Onboarding' | 'Completed'>('all');
  const [selectedIntern, setSelectedIntern] = useState<number | null>(null);

  
  const filteredInterns = mockInterns.filter((intern) => {
    const deptMatch = deptFilter === 'all' || intern.department === deptFilter;
    const statusMatch = statusFilter === 'all' || intern.status === statusFilter;
    return deptMatch && statusMatch;
  });

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

 
  const selectedInternData = mockInterns.find((i) => i.id === selectedIntern);

  return (
    <div className="bg-[#0D0118] min-h-screen text-[#FFFFFF]">
    
      <div className="mx-auto p-4 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl lg:text-4xl">Intern Management</h1>
          <p className="text-[#F5F0E8]">
            Total Interns: <span className="font-semibold text-[#FFFFFF]">{filteredInterns.length}</span>
          </p>
        </div>

        
        <div className="mb-8">
        
          <div className="mb-4">
            <p className="mb-3 font-medium text-[#F5F0E8] text-sm">Department</p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'Frontend', 'Backend', 'UX/UI'] as const).map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    deptFilter === dept
                      ? 'bg-[#4B1E91] text-[#FFFFFF]'
                      : 'bg-[#1E0A4A] border border-[#4B1E91] text-[#F5F0E8] hover:border-[#4B1E91]'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>

        
          <div>
            <p className="mb-3 font-medium text-[#F5F0E8] text-sm">Status</p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'Active', 'Onboarding', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-[#4B1E91] text-[#FFFFFF]'
                      : 'bg-[#1E0A4A] border border-[#4B1E91] text-[#F5F0E8] hover:border-[#4B1E91]'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          {filteredInterns.map((intern) => (
            <div
              key={intern.id}
              className="bg-[#1E0A4A] p-6 border border-[#4B1E91] hover:border-[#4B1E91] rounded-2xl transition-colors"
            >
          
              <div className="flex items-start gap-4 mb-4">
                <div className="flex justify-center items-center bg-[#4B1E91] rounded-full w-12 h-12 font-semibold text-sm shrink-0">
                  {intern.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{intern.name}</h3>
                  <p className="text-[#F5F0E8] text-sm">{intern.department}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(intern.status)}`}>
                  {intern.status}
                </span>
              </div>

           
              <div className="mb-4">
                <span className="inline-block bg-[#4B1E91]/20 px-3 py-1 rounded-full font-medium text-[#4B1E91] text-xs">
                  {intern.department}
                </span>
              </div>

          
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#F5F0E8] text-sm">Progress</p>
                  <p className="font-semibold text-sm">{intern.progress}%</p>
                </div>
                <div className="bg-[#0D0118] rounded-full w-full h-2">
                  <div
                    className="bg-[#4B1E91] rounded-full h-2 transition-all"
                    style={{ width: `${intern.progress}%` }}
                  />
                </div>
              </div>

          
              <div className="gap-4 grid grid-cols-2 mb-4 pb-4 border-[#4B1E91] border-b">
                <div>
                  <p className="mb-1 text-[#F5F0E8] text-xs">Mentor</p>
                  <p className="font-medium text-sm">{intern.mentor}</p>
                </div>
                <div>
                  <p className="mb-1 text-[#F5F0E8] text-xs">Days Left</p>
                  <p className="font-medium text-sm">{intern.daysLeft} days</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedIntern(intern.id)}
                className="bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-4 py-2 rounded-lg w-full font-semibold text-[#FFFFFF] transition-colors"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>

    
      {selectedIntern && selectedInternData && (
        <div className="top-0 right-0 z-50 fixed bg-[#1E0A4A] p-6 border-[#4B1E91] border-l w-80 h-full overflow-y-auto">
        
          <button
            onClick={() => setSelectedIntern(null)}
            className="top-6 right-6 absolute hover:bg-[#0D0118] p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

      
          <div className="mb-6 pr-8">
            <div className="flex justify-center items-center bg-[#4B1E91] mb-4 rounded-full w-16 h-16 font-bold text-lg">
              {selectedInternData.initials}
            </div>
            <h2 className="mb-1 font-bold text-2xl">{selectedInternData.name}</h2>
            <p className="text-[#F5F0E8]">{selectedInternData.department}</p>
          </div>

      
          <div className="mb-6 pb-6 border-[#4B1E91] border-b">
            <h3 className="mb-4 font-bold text-[#4B1E91] text-sm">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Email</p>
                <p className="text-sm">{selectedInternData.email}</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Institution</p>
                <p className="text-sm">{selectedInternData.school}</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Course</p>
                <p className="text-sm">{selectedInternData.course}</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Year</p>
                <p className="text-sm">{selectedInternData.year}</p>
              </div>
            </div>
          </div>

       
          <div className="mb-6 pb-6 border-[#4B1E91] border-b">
            <h3 className="mb-4 font-bold text-[#4B1E91] text-sm">Placement Details</h3>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(selectedInternData.status)}`}>
                  {selectedInternData.status}
                </span>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Mentor</p>
                <p className="text-sm">{selectedInternData.mentor}</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Days Remaining</p>
                <p className="text-sm">{selectedInternData.daysLeft} days</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Rank</p>
                <p className="text-sm">#{selectedInternData.rank}</p>
              </div>
              <div>
                <p className="mb-1 text-[#F5F0E8] text-xs">Points</p>
                <p className="text-sm">{selectedInternData.points} points</p>
              </div>
            </div>
          </div>

       
          <div className="mb-6 pb-6 border-[#4B1E91] border-b">
            <h3 className="mb-4 font-bold text-[#4B1E91] text-sm">Activity Summary</h3>
            <div className="gap-3 grid grid-cols-3">
              <div className="bg-[#0D0118] p-3 rounded-lg text-center">
                <p className="font-bold text-2xl">{selectedInternData.tasks}</p>
                <p className="text-[#F5F0E8] text-xs">Tasks</p>
              </div>
              <div className="bg-[#0D0118] p-3 rounded-lg text-center">
                <p className="font-bold text-2xl">{selectedInternData.submissions}</p>
                <p className="text-[#F5F0E8] text-xs">Submissions</p>
              </div>
              <div className="bg-[#0D0118] p-3 rounded-lg text-center">
                <p className="font-bold text-2xl">{selectedInternData.sessions}</p>
                <p className="text-[#F5F0E8] text-xs">Sessions</p>
              </div>
            </div>
          </div>

         
          <div className="space-y-3">
            <button className="bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-4 py-2 rounded-lg w-full font-semibold text-[#FFFFFF] transition-colors">
              Assign Task
            </button>
            <button className="bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-4 py-2 rounded-lg w-full font-semibold text-[#FFFFFF] transition-colors">
              Schedule Session
            </button>
            <button className="bg-[#4B1E91] hover:bg-[#4B1E91]/80 px-4 py-2 rounded-lg w-full font-semibold text-[#FFFFFF] transition-colors">
              Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternManagement;
