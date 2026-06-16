import { useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  type: "guide" | "tool" | "template" | "video";
  owner: string;
  updated: string;
  status: "published" | "draft" | "archived";
}

const resources: Resource[] = [];

const statusClass = (status: Resource["status"]) => {
  switch (status) {
    case "published": return "bg-green-500/15 text-green-200";
    case "draft": return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "archived": return "bg-red-500/15 text-red-200";
    default: return "bg-white/10 text-white";
  }
};

const ResourceManagement: React.FC = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Resource["status"]>("all");

  const filteredResources = useMemo(
    () => resources.filter((resource) => {
      const matchesQuery = [resource.title, resource.owner, resource.type].some((value) => value.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
      return matchesQuery && matchesStatus;
    }),
    [query, statusFilter]
  );

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Resource management</p>
            <h1 className="mt-2 text-3xl font-semibold">Knowledge assets and templates</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Organize playbooks, learning tools and reusable resources for the platform.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white">
            <Plus size={16} /> Add resource
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F0E8]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assets"
              className="w-full rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-12 py-3 text-white outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(["all", "published", "draft", "archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredResources.length === 0 && (
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-12 text-center col-span-full">
            <p className="text-[#F5F0E8]">No resources yet.</p>
            <p className="mt-1 text-xs text-[#F5F0E8]/50">Resources will appear here once added.</p>
          </div>
        )}
        {filteredResources.map((resource) => (
          <div key={resource.id} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">{resource.type}</p>
                <h2 className="mt-2 text-xl font-semibold">{resource.title}</h2>
                <p className="mt-2 text-sm text-[#F5F0E8]">Managed by {resource.owner} · Updated {resource.updated}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(resource.status)}`}>{resource.status}</span>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-4 py-2 text-sm font-semibold text-white">
                  <SlidersHorizontal size={16} /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceManagement;
