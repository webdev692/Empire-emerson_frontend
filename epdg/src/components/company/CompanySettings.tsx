import { useState } from "react";

interface Mentor {
  id: number;
  name: string;
  initials: string;
  role: string;
  email: string;
  internCount: number;
}


const initialMentors: Mentor[] = [
  {
    id: 1,
    name: "Dr. Kuria Mwangi",
    initials: "KM",
    role: "Senior Frontend Engineer",
    email: "k.mwangi@techcorpkenya.com",
    internCount: 3,
  },
  {
    id: 2,
    name: "Sophia Wanjiku",
    initials: "SW",
    role: "Backend Lead",
    email: "s.wanjiku@techcorpkenya.com",
    internCount: 2,
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

const Toggle = ({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
      enabled ? "bg-[#7C4FC4]" : "bg-[#3A1D73]"
    }`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);



export default function CompanySettings() {

  const [editMode, setEditMode] = useState(false);


  const [companyName, setCompanyName] = useState("TechCorp Kenya");
  const [industry, setIndustry] = useState("Technology");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [website, setWebsite] = useState("www.techcorpkenya.com");
  const [description, setDescription] = useState(
    "A leading tech company building innovative solutions for East Africa."
  );

 
  const [contactName, setContactName] = useState("Dr. Amina Omondi");
  const [contactPhone, setContactPhone] = useState("+254 712 345 678");
  const [contactEmail, setContactEmail] = useState(
    "amina.omondi@techcorpkenya.com"
  );

 
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorFormName, setMentorFormName] = useState("");
  const [mentorFormRole, setMentorFormRole] = useState("");
  const [mentorFormEmail, setMentorFormEmail] = useState("");
  const [mentorFormError, setMentorFormError] = useState("");


  const [departments, setDepartments] = useState<string[]>([
    "Frontend",
    "Backend",
    "UX/UI",
  ]);
  const [newDept, setNewDept] = useState("");
  const [showDeptInput, setShowDeptInput] = useState(false);

 
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [notifySessions, setNotifySessions] = useState(false);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);


  const handleRemoveMentor = (id: number) => {
    setMentors((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMentor = () => {
    if (!mentorFormName || !mentorFormRole || !mentorFormEmail) {
      setMentorFormError("Please fill in all fields.");
      return;
    }
    const initials = mentorFormName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const newMentor: Mentor = {
      id: Date.now(),
      name: mentorFormName,
      initials,
      role: mentorFormRole,
      email: mentorFormEmail,
      internCount: 0,
    };
    setMentors((prev) => [...prev, newMentor]);
    setShowMentorModal(false);
    setMentorFormName("");
    setMentorFormRole("");
    setMentorFormEmail("");
    setMentorFormError("");
  };

  const closeMentorModal = () => {
    setShowMentorModal(false);
    setMentorFormName("");
    setMentorFormRole("");
    setMentorFormEmail("");
    setMentorFormError("");
  };

  const handleDeptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newDept.trim()) {
      setDepartments((prev) => [...prev, newDept.trim()]);
      setNewDept("");
      setShowDeptInput(false);
    }
    if (e.key === "Escape") {
      setShowDeptInput(false);
      setNewDept("");
    }
  };

  const handleRemoveDept = (dept: string) => {
    setDepartments((prev) => prev.filter((d) => d !== dept));
  };


  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Company Settings</h1>
        <p className="text-[#A78BCC] text-sm mt-1">
          Manage your company profile, mentors, and preferences
        </p>
      </div>

      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Company Profile</h2>
          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">

          <div className="w-20 h-20 rounded-2xl bg-[#7C4FC4] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            TC
          </div>

          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
           
            <div>
              <label className="block text-xs text-[#A78BCC] mb-1">
                Company Name
              </label>
              {editMode ? (
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{companyName}</p>
              )}
            </div>

            
            <div>
              <label className="block text-xs text-[#A78BCC] mb-1">
                Industry
              </label>
              {editMode ? (
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{industry}</p>
              )}
            </div>

          
            <div>
              <label className="block text-xs text-[#A78BCC] mb-1">
                Location
              </label>
              {editMode ? (
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{location}</p>
              )}
            </div>

          
            <div>
              <label className="block text-xs text-[#A78BCC] mb-1">
                Website
              </label>
              {editMode ? (
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              ) : (
                <p className="text-white text-sm font-medium">{website}</p>
              )}
            </div>

            
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#A78BCC] mb-1">
                Description
              </label>
              {editMode ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none"
                />
              ) : (
                <p className="text-white text-sm font-medium">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">
            Contact Coordinator
          </h2>
          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         
          <div>
            <label className="block text-xs text-[#A78BCC] mb-1">Name</label>
            {editMode ? (
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
              />
            ) : (
              <p className="text-white text-sm font-medium">{contactName}</p>
            )}
          </div>

        
          <div>
            <label className="block text-xs text-[#A78BCC] mb-1">Phone</label>
            {editMode ? (
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
              />
            ) : (
              <p className="text-white text-sm font-medium">{contactPhone}</p>
            )}
          </div>

        
          <div>
            <label className="block text-xs text-[#A78BCC] mb-1">Email</label>
            {editMode ? (
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
              />
            ) : (
              <p className="text-white text-sm font-medium">{contactEmail}</p>
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Mentors</h2>
          <button
            onClick={() => setShowMentorModal(true)}
            className="bg-[#7C4FC4] hover:bg-[#6a3db0] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            + Add Mentor
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center justify-between gap-4 bg-[#0D0618] border border-[#3A1D73] rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColor(mentor.initials)}`}
                >
                  {mentor.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {mentor.name}
                  </p>
                  <p className="text-[#A78BCC] text-xs">{mentor.role}</p>
                  <p className="text-[#A78BCC] text-xs">
                    {mentor.internCount} intern
                    {mentor.internCount !== 1 ? "s" : ""} assigned
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveMentor(mentor.id)}
                className="text-[#EF4444] text-xs border border-[#EF4444]/40 hover:bg-[#EF4444]/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}

          {mentors.length === 0 && (
            <p className="text-[#A78BCC] text-sm text-center py-4">
              No mentors added yet.
            </p>
          )}
        </div>
      </div>

      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5 mb-6">
        <h2 className="text-white font-bold text-base mb-4">Departments</h2>

        <div className="flex flex-wrap gap-2">
        
          {departments.map((dept) => (
            <span
              key={dept}
              className="flex items-center gap-1.5 bg-[#7C4FC4]/20 border border-[#7C4FC4]/40 text-[#7C4FC4] text-sm px-3 py-1.5 rounded-full"
            >
              {dept}
              <button
                onClick={() => handleRemoveDept(dept)}
                className="text-[#7C4FC4] hover:text-white leading-none transition-colors"
              >
                ×
              </button>
            </span>
          ))}

         
          {showDeptInput ? (
            <input
              autoFocus
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              onKeyDown={handleDeptKeyDown}
              placeholder="Type and press Enter…"
              className="bg-[#0D0618] border border-[#7C4FC4] text-white placeholder-[#A78BCC]/50 rounded-full px-3 py-1.5 text-sm focus:outline-none w-44"
            />
          ) : (
            <button
              onClick={() => setShowDeptInput(true)}
              className="flex items-center gap-1 border border-dashed border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] text-sm px-3 py-1.5 rounded-full transition-colors"
            >
              + Add Department
            </button>
          )}
        </div>
      </div>

     
      <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5">
        <h2 className="text-white font-bold text-base mb-4">
          Notification Preferences
        </h2>

        <div className="flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">New Applications</p>
              <p className="text-[#A78BCC] text-xs mt-0.5">
                Get notified when an intern applies for a slot
              </p>
            </div>
            <Toggle
              enabled={notifyApplications}
              onToggle={() => setNotifyApplications((prev) => !prev)}
            />
          </div>

          <div className="border-t border-[#3A1D73]" />

       
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">
                Submission Reviews
              </p>
              <p className="text-[#A78BCC] text-xs mt-0.5">
                Get notified when an intern submits work for review
              </p>
            </div>
            <Toggle
              enabled={notifySubmissions}
              onToggle={() => setNotifySubmissions((prev) => !prev)}
            />
          </div>

          <div className="border-t border-[#3A1D73]" />

         
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">
                Session Reminders
              </p>
              <p className="text-[#A78BCC] text-xs mt-0.5">
                Receive reminders 1 hour before a scheduled session
              </p>
            </div>
            <Toggle
              enabled={notifySessions}
              onToggle={() => setNotifySessions((prev) => !prev)}
            />
          </div>

          <div className="border-t border-[#3A1D73]" />

         
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Weekly Report</p>
              <p className="text-[#A78BCC] text-xs mt-0.5">
                Receive a weekly summary of intern performance
              </p>
            </div>
            <Toggle
              enabled={notifyWeeklyReport}
              onToggle={() => setNotifyWeeklyReport((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      
      {showMentorModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeMentorModal}
        >
          <div
            className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
           
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Add Mentor</h2>
              <button
                onClick={closeMentorModal}
                className="text-[#A78BCC] hover:text-white text-xl leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
           
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Full Name *
                </label>
                <input
                  value={mentorFormName}
                  onChange={(e) => setMentorFormName(e.target.value)}
                  placeholder="e.g. James Otieno"
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

             
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Role *
                </label>
                <input
                  value={mentorFormRole}
                  onChange={(e) => setMentorFormRole(e.target.value)}
                  placeholder="e.g. Backend Engineer"
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

            
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={mentorFormEmail}
                  onChange={(e) => setMentorFormEmail(e.target.value)}
                  placeholder="e.g. james@techcorpkenya.com"
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

             
              {mentorFormError && (
                <p className="text-[#EF4444] text-sm">{mentorFormError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddMentor}
                  className="flex-1 bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Add Mentor
                </button>
                <button
                  onClick={closeMentorModal}
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
