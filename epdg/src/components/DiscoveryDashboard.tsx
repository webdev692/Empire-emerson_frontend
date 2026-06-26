import React, { useState, useEffect, useMemo } from "react";
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

type ApplicationStatus =
  | "Applied"
  | "Viewed"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Accepted"
  | "Rejected"
  | "Active Internship";

const DEPARTMENTS = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "UX/UI",
  "Sales",
  "Marketing",
  "Social Media",
  "Data & Analytics",
  "HR & Admin",
];

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  "Applied":             "bg-gray-100 text-gray-700",
  "Viewed":              "bg-blue-100 text-blue-700",
  "Shortlisted":         "bg-yellow-100 text-yellow-700",
  "Interview Scheduled": "bg-purple-100 text-purple-700",
  "Accepted":            "bg-green-100 text-green-700",
  "Rejected":            "bg-red-100 text-red-700",
  "Active Internship":   "bg-black text-white",
};

const DiscoveryDashboard: React.FC = () => {
  const [slots,        setSlots]        = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [applying,     setApplying]     = useState<number | null>(null);
  const [appliedIds,   setAppliedIds]   = useState<number[]>([]);
  const [slotMessage,  setSlotMessage]  = useState("");

  const [search,    setSearch]    = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "remote" | "onsite">("all");

  const [applications, setApplications] = useState<
    { id: number; role: string; company: string; status: ApplicationStatus }[]
  >([]);

  useEffect(() => {
    async function loadSlots() {
      setSlotsLoading(true);
      try {
        const { data } = await api.get<{ success: boolean; data: Slot[] }>("/api/intern/slots");
        setSlots(data.data);
      } catch {
        // silently ignore if not authenticated
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return slots.filter((s) => {
      if (deptFilter !== "All" && s.department !== deptFilter) return false;
      if (typeFilter === "remote" && !s.is_remote) return false;
      if (typeFilter === "onsite" && s.is_remote) return false;
      if (q && !s.title.toLowerCase().includes(q) &&
               !(s.company_name ?? "").toLowerCase().includes(q) &&
               !(s.department ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [slots, deptFilter, typeFilter, search]);

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
      setSlotMessage(`Applied to "${slot.title}" successfully!`);
    } catch (err: any) {
      setSlotMessage(err?.response?.data?.message ?? "Application failed.");
    } finally {
      setApplying(null);
    }
  };

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-gray-500 text-sm uppercase tracking-[4px]">Discovery Dashboard</p>
          <h1 className="font-bold text-black text-3xl sm:text-4xl">Explore Opportunities</h1>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-50 mb-10 p-4 border border-black rounded-2xl">
          <div className="flex xl:flex-row flex-col gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, company, or department…"
                className="bg-white px-4 py-3 border border-black rounded-xl outline-none w-full"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white px-4 py-3 border border-black rounded-xl min-w-40"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "remote" | "onsite")}
              className="bg-white px-4 py-3 border border-black rounded-xl min-w-35"
            >
              <option value="all">All Types</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
            </select>

            <button
              onClick={() => { setSearch(""); setDeptFilter("All"); setTypeFilter("all"); }}
              className="bg-black px-6 py-3 rounded-xl text-white whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Feedback banner */}
        {slotMessage && (
          <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            slotMessage.startsWith("Applied")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {slotMessage}
          </div>
        )}

        {/* Live Opportunities */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl sm:text-3xl">Open Internships</h2>
            <span className="text-sm text-gray-500">
              {slotsLoading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {slotsLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-black p-10 text-center text-gray-400">
              {slots.length === 0
                ? "No open internship opportunities right now. Check back soon!"
                : "No results match your filters."}
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
              {filtered.map((slot) => {
                const applied   = appliedIds.includes(slot.id);
                const isApplying = applying === slot.id;
                const isFull    = slot.slots_filled >= slot.slots_available;

                return (
                  <div key={slot.id} className="p-6 border border-black rounded-3xl flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1.5 border border-black rounded-xl text-xs">
                        {slot.is_remote ? "Remote" : "On-site"}
                      </span>
                      {slot.duration_weeks && (
                        <span className="px-3 py-1.5 border border-black rounded-xl text-xs">
                          {slot.duration_weeks}w
                        </span>
                      )}
                      {slot.department && (
                        <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs">
                          {slot.department}
                        </span>
                      )}
                    </div>

                    <p className="mb-1 text-gray-500 text-sm">{slot.company_name ?? "EPDG Internal"}</p>
                    <h3 className="mb-2 font-bold text-xl">{slot.title}</h3>

                    {slot.description && (
                      <p className="mb-3 text-gray-500 text-sm line-clamp-2">{slot.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                      {slot.stipend   && <span>💰 ${Number(slot.stipend).toLocaleString()}/mo</span>}
                      {slot.deadline  && <span>📅 {new Date(slot.deadline).toLocaleDateString()}</span>}
                      {slot.county    && <span>📍 {slot.county}</span>}
                      <span>
                        {slot.slots_available - slot.slots_filled} spot
                        {slot.slots_available - slot.slots_filled !== 1 ? "s" : ""} left
                      </span>
                    </div>

                    {slot.skills_required && slot.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {slot.skills_required.slice(0, 4).map((sk) => (
                          <span key={sk} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{sk}</span>
                        ))}
                        {slot.skills_required.length > 4 && (
                          <span className="text-xs text-gray-400">+{slot.skills_required.length - 4} more</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <button
                        onClick={() => handleApply(slot)}
                        disabled={applied || isApplying || isFull}
                        className={`py-3 rounded-2xl w-full font-semibold text-sm transition ${
                          applied
                            ? "bg-green-600 text-white cursor-default"
                            : isFull
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                        }`}
                      >
                        {isApplying ? "Applying…" : applied ? "Applied ✓" : isFull ? "Full" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Application Pipeline — populated as intern applies */}
        {applications.length > 0 && (
          <div className="mb-14">
            <h2 className="font-bold text-2xl sm:text-3xl mb-6">Your Applications</h2>
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
              {applications.map((app) => (
                <div key={app.id} className="p-6 border border-black rounded-3xl">
                  <p className="mb-2 text-gray-500 text-sm">{app.company}</p>
                  <h3 className="mb-4 font-bold text-xl">{app.role}</h3>
                  <span className={`inline-block px-4 py-2 rounded-2xl text-sm font-semibold ${STATUS_COLOR[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default DiscoveryDashboard;
