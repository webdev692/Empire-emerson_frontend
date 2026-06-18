import React, { useState, useEffect } from "react";
import api from "../lib/axios";

interface Slot {
  id: number;
  title: string;
  department: string | null;
  description: string | null;
  slots_available: number;
  slots_filled: number;
  duration_weeks: number | null;
  stipend: number | null;
  is_remote: boolean;
  county: string | null;
  deadline: string | null;
  company_name: string | null;
  skills_required: string[] | null;
}

const STATIC_COMPANIES = [
  { id: 1, name: "Emerson Group",   industry: "Technology",     roles: "12 Open Roles" },
  { id: 2, name: "Nova Studio",     industry: "Design Agency",  roles: "5 Open Roles"  },
  { id: 3, name: "Skyline Digital", industry: "Marketing",      roles: "8 Open Roles"  },
];

const roles = ["intern", "company", "admin"];

type ApplicationStatus =
  | "Applied"
  | "Viewed"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Accepted"
  | "Rejected"
  | "Active Internship";

const projects = [
  "AI Research Project",
  "Mobile App Redesign",
  "Marketing Campaign",
  "Internal Dashboard System",
];

const teams = [
  "Frontend Team",
  "Design Team",
  "Marketing Team",
  "AI Engineering Team",
];

const messages = [
  {
    sender: "Emerson Recruiter",
    role: "Recruiter",
    message:
      "We reviewed your portfolio and would like to schedule an interview.",
  },
  {
    sender: "UI Mentor",
    role: "Mentor",
    message:
      "Please continue improving the responsiveness of your landing page.",
  },
];

const internshipTasks = [
  {
    title: "Landing Page Redesign",
    progress: "70%",
  },
  {
    title: "Dashboard Mockup",
    progress: "45%",
  },
];

// ─── Component ───────────────────────────────────────────────

const DiscoveryDashboard: React.FC = () => {
  const [role, setRole] = useState("intern");

  const [slots,        setSlots]        = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [applying,     setApplying]     = useState<number | null>(null);
  const [appliedIds,   setAppliedIds]   = useState<number[]>([]);
  const [slotMessage,  setSlotMessage]  = useState("");

  const [connectedCompanies, setConnectedCompanies] = useState<number[]>([]);
  const [applications, setApplications] = useState<
    { id: number; role: string; company: string; status: ApplicationStatus }[]
  >([]);
  const [interviewRequests, setInterviewRequests] = useState<number[]>([]);

  useEffect(() => {
    async function loadSlots() {
      setSlotsLoading(true);
      try {
        const { data } = await api.get<{ success: boolean; data: Slot[] }>("/api/intern/slots");
        setSlots(data.data);
      } catch {
        // silently ignore — no auth token if not logged in as intern
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, []);

  const handleConnect = (id: number) => {
    if (!connectedCompanies.includes(id)) setConnectedCompanies((prev) => [...prev, id]);
  };

  const handleApply = async (slot: Slot) => {
    if (appliedIds.includes(slot.id)) return;
    setApplying(slot.id);
    setSlotMessage("");
    try {
      await api.post("/api/intern/apply", { slot_id: slot.id });
      setAppliedIds((prev) => [...prev, slot.id]);
      setApplications((prev) => [
        ...prev,
        { id: slot.id, role: slot.title, company: slot.company_name ?? "EPDG", status: "Applied" },
      ]);
      setSlotMessage(`✅ Applied to "${slot.title}" successfully!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Application failed.";
      setSlotMessage(`❌ ${msg}`);
    } finally {
      setApplying(null);
    }
  };

  const handleInterviewRequest = (id: number) => {
    if (!interviewRequests.includes(id)) setInterviewRequests((prev) => [...prev, id]);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Applied":
        return "bg-gray-200";

      case "Viewed":
        return "bg-blue-200";

      case "Shortlisted":
        return "bg-yellow-200";

      case "Interview Scheduled":
        return "bg-purple-200";

      case "Accepted":
        return "bg-green-200";

      case "Rejected":
        return "bg-red-200";

      case "Active Internship":
        return "bg-black text-white";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Role Switcher */}
        <div className="flex flex-wrap gap-3 mb-10">
          {roles.map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              className={`px-5 py-3 rounded-2xl border transition-all duration-200 ${
                role === item
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        {/* ───────────────── INTERN DASHBOARD ───────────────── */}
        {role === "intern" && (
          <>
            {/* HEADER */}
            <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-5 mb-10">
              <div>
                <p className="mb-3 text-gray-500 text-sm uppercase tracking-[4px]">
                  Discovery Dashboard
                </p>

                <h1 className="font-bold text-black text-3xl sm:text-4xl">
                  Explore Opportunities
                </h1>
              </div>
            </div>

            {/* PROFILE SUMMARY */}
            <div className="mb-10 p-6 border border-black rounded-3xl">
              <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-6">
                <div>
                  <p className="mb-2 text-gray-500 text-sm">Welcome Back</p>

                  <h2 className="mb-3 font-bold text-3xl">Interns</h2>

                  <p className="text-gray-600">
                    Continue building your professional journey.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-4 border border-black rounded-2xl">
                    <p className="mb-1 text-gray-500 text-sm">Applications</p>

                    <h3 className="font-bold text-2xl">
                      {applications.length}
                    </h3>
                  </div>

                  <div className="px-6 py-4 border border-black rounded-2xl">
                    <p className="mb-1 text-gray-500 text-sm">
                      Profile Completion
                    </p>

                    <h3 className="font-bold text-2xl">80%</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="bg-gray-50 mb-10 p-4 border border-black rounded-2xl">
              <div className="flex xl:flex-row flex-col gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search opportunities, companies, skills..."
                    className="bg-white px-4 py-3 border border-black rounded-xl outline-none w-full"
                  />
                </div>

                <select className="bg-white px-4 py-3 border border-black rounded-xl min-w-45">
                  <option>Industry</option>
                </select>

                <select className="bg-white px-4 py-3 border border-black rounded-xl min-w-45">
                  <option>Skills</option>
                </select>

                <select className="bg-white px-4 py-3 border border-black rounded-xl min-w-45">
                  <option>Work Type</option>
                </select>

                <button className="bg-black px-6 py-3 rounded-xl text-white">
                  Apply
                </button>
              </div>
            </div>

            {/* PHASE 6 — COMPANIES */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Discover Companies
                </h2>

                <button className="text-sm underline">View All</button>
              </div>

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {STATIC_COMPANIES.map((company) => (
                  <div
                    key={company.id}
                    className="bg-gray-50 p-6 border border-black rounded-3xl"
                  >
                    <div className="mb-5 border border-black rounded-2xl w-14 h-14" />

                    <h3 className="mb-2 font-bold text-2xl">{company.name}</h3>

                    <p className="mb-4 text-gray-600">{company.industry}</p>

                    <div className="inline-block mb-6 px-4 py-3 border border-black rounded-xl">
                      {company.roles}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleConnect(company.id)}
                        className="bg-black py-3 rounded-2xl w-full text-white"
                      >
                        {connectedCompanies.includes(company.id)
                          ? "Connected"
                          : "Connect"}
                      </button>

                      <button className="py-3 border border-black rounded-2xl w-full">
                        About Company
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE OPPORTUNITIES */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Discover Opportunities
                </h2>
                <span className="text-sm text-gray-500">{slots.length} open</span>
              </div>

              {slotMessage && (
                <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${slotMessage.startsWith("✅") ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                  {slotMessage}
                </div>
              )}

              {slotsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-3xl border border-black p-10 text-center text-gray-400">
                  No open internship opportunities right now. Check back soon!
                </div>
              ) : (
                <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
                  {slots.map((slot) => {
                    const applied = appliedIds.includes(slot.id);
                    const isApplying = applying === slot.id;
                    return (
                      <div key={slot.id} className="p-6 border border-black rounded-3xl flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {slot.is_remote
                            ? <span className="px-3 py-1.5 border border-black rounded-xl text-xs">Remote</span>
                            : <span className="px-3 py-1.5 border border-black rounded-xl text-xs">On-site</span>
                          }
                          {slot.duration_weeks && (
                            <span className="px-3 py-1.5 border border-black rounded-xl text-xs">{slot.duration_weeks}w</span>
                          )}
                          {slot.department && (
                            <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs">{slot.department}</span>
                          )}
                        </div>

                        <p className="mb-1 text-gray-500 text-sm">
                          {slot.company_name ?? "EPDG Internal"}
                        </p>
                        <h3 className="mb-2 font-bold text-xl">{slot.title}</h3>

                        {slot.description && (
                          <p className="mb-3 text-gray-500 text-sm line-clamp-2">{slot.description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                          {slot.stipend && <span>💰 ${Number(slot.stipend).toLocaleString()}/mo</span>}
                          {slot.deadline && <span>📅 {new Date(slot.deadline).toLocaleDateString()}</span>}
                          {slot.county && <span>📍 {slot.county}</span>}
                          <span>{slot.slots_available - slot.slots_filled} spot{slot.slots_available - slot.slots_filled !== 1 ? "s" : ""} left</span>
                        </div>

                        {slot.skills_required && slot.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {slot.skills_required.slice(0, 4).map((sk) => (
                              <span key={sk} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{sk}</span>
                            ))}
                            {slot.skills_required.length > 4 && (
                              <span className="text-xs text-gray-400">+{slot.skills_required.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="mt-auto flex flex-col gap-3">
                          <button
                            onClick={() => handleApply(slot)}
                            disabled={applied || isApplying || slot.slots_filled >= slot.slots_available}
                            className={`py-3 rounded-2xl w-full font-semibold text-sm transition ${
                              applied
                                ? "bg-green-600 text-white cursor-default"
                                : slot.slots_filled >= slot.slots_available
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-black text-white hover:bg-gray-800"
                            }`}
                          >
                            {isApplying ? "Applying…" : applied ? "Applied ✓" : slot.slots_filled >= slot.slots_available ? "Full" : "Apply Now"}
                          </button>
                          <button
                            onClick={() => handleInterviewRequest(slot.id)}
                            className="py-3 border border-black rounded-2xl w-full text-sm"
                          >
                            {interviewRequests.includes(slot.id) ? "Interview Requested" : "Request Interview"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PHASE 7 — MESSAGES */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Messages & Communication
                </h2>
              </div>

              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                {messages.map((message) => (
                  <div
                    key={message.sender}
                    className="p-6 border border-black rounded-3xl"
                  >
                    <p className="mb-2 text-gray-500 text-sm">{message.role}</p>

                    <h3 className="mb-4 font-bold text-2xl">
                      {message.sender}
                    </h3>

                    <p className="mb-6 text-gray-700 leading-relaxed">
                      {message.message}
                    </p>

                    <button className="bg-black py-3 rounded-2xl w-full text-white">
                      Reply Message
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PHASE 8 — APPLICATION TRACKING */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Internship Pipeline Tracking
                </h2>
              </div>

              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="p-6 border border-black rounded-3xl"
                  >
                    <p className="mb-2 text-gray-500">{application.company}</p>

                    <h3 className="mb-6 font-bold text-2xl">
                      {application.role}
                    </h3>

                    <div
                      className={`inline-block px-5 py-3 rounded-2xl font-semibold ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHASE 9 — INTERNSHIP EXECUTION */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Internship Workspace
                </h2>
              </div>

              {/* Teams */}
              <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                {teams.map((team) => (
                  <div
                    key={team}
                    className="p-6 border border-black rounded-3xl"
                  >
                    <div className="mb-5 border border-black rounded-full w-16 h-16" />

                    <h3 className="mb-3 font-bold text-xl">{team}</h3>

                    <p className="mb-6 text-gray-600">
                      Collaborative internship workspace.
                    </p>

                    <button className="bg-black py-3 rounded-2xl w-full text-white">
                      Join Team
                    </button>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                {internshipTasks.map((task) => (
                  <div
                    key={task.title}
                    className="bg-gray-50 p-6 border border-black rounded-3xl"
                  >
                    <h3 className="mb-6 font-bold text-2xl">{task.title}</h3>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p>Progress</p>

                        <p>{task.progress}</p>
                      </div>

                      <div className="bg-gray-200 rounded-full w-full h-3 overflow-hidden">
                        <div
                          className="bg-black h-full"
                          style={{
                            width: task.progress,
                          }}
                        />
                      </div>
                    </div>

                    <button className="mt-6 py-3 border border-black rounded-2xl w-full">
                      View Task
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="mb-14">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Discover Projects
                </h2>

                <button className="text-sm underline">Explore</button>
              </div>

              <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {projects.map((project) => (
                  <div
                    key={project}
                    className="bg-gray-50 p-6 border border-black rounded-3xl"
                  >
                    <div className="mb-5 border border-black rounded-2xl w-full h-36" />

                    <h3 className="mb-4 font-bold text-xl leading-snug">
                      {project}
                    </h3>

                    <button className="py-3 border border-black rounded-2xl w-full">
                      View Project
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* ───────────────── COMPANY DASHBOARD ───────────────── */}
        {role === "company" && (
          <>
            {" "}
            <div className="mb-10">
              {" "}
              <p className="mb-3 text-gray-500 text-sm uppercase tracking-[4px]">
                {" "}
                Company Dashboard{" "}
              </p>{" "}
              <h1 className="font-bold text-4xl">
                {" "}
                Manage Internship Programs{" "}
              </h1>{" "}
            </div>{" "}
            {/* Stats */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-12">
              {" "}
              {["Open Positions", "Applicants", "Interns Active"].map(
                (item) => (
                  <div
                    key={item}
                    className="p-6 border border-black rounded-3xl"
                  >
                    {" "}
                    <p className="mb-3 text-gray-500"> {item} </p>{" "}
                    <h2 className="font-bold text-4xl"> 24 </h2>{" "}
                  </div>
                ),
              )}{" "}
            </div>{" "}
            {/* Applicants */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-14">
              {" "}
              {["Frontend", "UI/UX", "Marketing"].map((item) => (
                <div
                  key={item}
                  className="bg-gray-50 p-6 border border-black rounded-3xl"
                >
                  {" "}
                  <div className="mb-5 border border-black rounded-full w-16 h-16" />{" "}
                  <h3 className="mb-3 font-bold text-2xl">
                    {" "}
                    {item} Applicant{" "}
                  </h3>{" "}
                  <p className="mb-6 text-gray-600">
                    {" "}
                    View portfolio and applications.{" "}
                  </p>{" "}
                  <button className="bg-black py-3 rounded-2xl w-full text-white">
                    {" "}
                    View Applicant{" "}
                  </button>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            {/* Posted Jobs */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-14">
              {" "}
              {["Frontend Internship", "AI Research", "Product Design"].map(
                (item) => (
                  <div
                    key={item}
                    className="p-6 border border-black rounded-3xl"
                  >
                    {" "}
                    <div className="mb-5 border border-black rounded-2xl w-full h-36" />{" "}
                    <h3 className="mb-6 font-bold text-2xl"> {item} </h3>{" "}
                    <div className="flex gap-3">
                      {" "}
                      <button className="flex-1 bg-black py-3 rounded-2xl text-white">
                        {" "}
                        Manage{" "}
                      </button>{" "}
                      <button className="flex-1 py-3 border border-black rounded-2xl">
                        {" "}
                        Applicants{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                ),
              )}{" "}
            </div>{" "}
          </>
        )}
        {/* ───────────────── ADMIN DASHBOARD ───────────────── */}
        {role === "admin" && (
          <>
            {" "}
            <div className="mb-10">
              {" "}
              <p className="mb-3 text-gray-500 text-sm uppercase tracking-[4px]">
                {" "}
                Admin Dashboard{" "}
              </p>{" "}
              <h1 className="font-bold text-4xl"> Platform Overview </h1>{" "}
            </div>{" "}
            {/* Analytics */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-14">
              {" "}
              {["Total Users", "Companies", "Applications", "Reports"].map(
                (item) => (
                  <div
                    key={item}
                    className="p-6 border border-black rounded-3xl"
                  >
                    {" "}
                    <p className="mb-3 text-gray-500"> {item} </p>{" "}
                    <h2 className="font-bold text-4xl"> 120 </h2>{" "}
                  </div>
                ),
              )}{" "}
            </div>{" "}
            {/* User Management */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-14">
              {" "}
              {["Manage Interns", "Manage Companies", "Manage Reports"].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-gray-50 p-6 border border-black rounded-3xl"
                  >
                    {" "}
                    <div className="mb-5 border border-black rounded-2xl w-full h-32" />{" "}
                    <h3 className="mb-5 font-bold text-2xl"> {item} </h3>{" "}
                    <button className="bg-black py-3 rounded-2xl w-full text-white">
                      {" "}
                      Open Panel{" "}
                    </button>{" "}
                  </div>
                ),
              )}{" "}
            </div>{" "}
            {/* Reports */}{" "}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
              {" "}
              {[
                "Analytics Report",
                "Internship Report",
                "Platform Summary",
              ].map((item) => (
                <div key={item} className="p-6 border border-black rounded-3xl">
                  {" "}
                  <div className="mb-5 border border-black rounded-2xl w-full h-36" />{" "}
                  <h3 className="mb-5 font-bold text-2xl"> {item} </h3>{" "}
                  <button className="py-3 border border-black rounded-2xl w-full">
                    {" "}
                    View Report{" "}
                  </button>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </>
        )}{" "}
      </div>{" "}
    </section>
  );
};

export default DiscoveryDashboard;
