import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface Intern {
  id: number;
  name: string;
  email: string;
  department: string | null;
  course: string | null;
  track: string | null;
  onboarding_step: number;
  onboarding_complete: boolean;
  cv_url: string | null;
  created_at: string;
}

const MentorInterns: React.FC = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    api.get<{ success: boolean; data: Intern[] }>("/api/mentor/interns")
      .then(({ data }) => setInterns(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = interns.filter((i) =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.department ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Mentor Portal</p>
        <h1 className="mt-2 font-semibold text-3xl">My Interns</h1>
        <p className="mt-1 text-[#F5F0E8]/70 text-sm">{interns.length} intern{interns.length !== 1 ? "s" : ""} assigned to you.</p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or department…"
        className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1E0A4A] p-10 border border-[#4B1E91] rounded-3xl text-center text-[#F5F0E8]/50 text-sm">
          {interns.length === 0 ? "No interns assigned yet." : "No results match your search."}
        </div>
      ) : (
        <div className="gap-4 grid md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((intern) => (
            <div key={intern.id} className="bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-11 h-11 font-bold text-sm shrink-0">
                  {intern.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{intern.name}</p>
                  <p className="text-[#F5F0E8]/50 text-xs truncate">{intern.email}</p>
                </div>
              </div>

              <div className="gap-2 grid grid-cols-2 text-xs">
                {[
                  { label: "Department", value: intern.department ?? "—" },
                  { label: "Course",     value: intern.course     ?? "—" },
                  { label: "Track",      value: intern.track      ?? "—" },
                  { label: "Joined",     value: new Date(intern.created_at).toLocaleDateString() },
                ].map((f) => (
                  <div key={f.label} className="bg-[#0D0118] p-2.5 border border-[#4B1E91] rounded-xl">
                    <p className="text-[#F5F0E8]/50">{f.label}</p>
                    <p className="mt-0.5 font-medium text-[#F5F0E8] truncate">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  intern.onboarding_complete
                    ? "bg-green-500/15 text-green-300"
                    : "bg-amber-500/15 text-amber-300"
                }`}>
                  {intern.onboarding_complete ? "Onboarding Complete" : `Onboarding — Step ${intern.onboarding_step}`}
                </span>
                {intern.cv_url && (
                  <a
                    href={intern.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D8B9FF] text-xs hover:underline"
                  >
                    View CV
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorInterns;
