import { useMemo, useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import api from "../../lib/axios";

interface Resource {
  id:      number;
  title:   string;
  type:    "guide" | "tool" | "template" | "video";
  owner:   string;
  updated: string;
  status:  "published" | "draft" | "archived";
  url?:    string;
}

const statusClass = (status: Resource["status"]) => {
  switch (status) {
    case "published": return "bg-green-500/15 text-green-200";
    case "draft":     return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "archived":  return "bg-red-500/15 text-red-200";
    default:          return "bg-white/10 text-white";
  }
};

const BLANK = { title: "", type: "guide" as Resource["type"], owner: "", url: "", status: "draft" as Resource["status"] };

const ResourceManagement: React.FC = () => {
  const [resources, setResources]     = useState<Resource[]>([]);
  const [query, setQuery]             = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Resource["status"]>("all");
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState<Resource | null>(null);
  const [form, setForm]               = useState(BLANK);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState("");

  useEffect(() => {
    api.get<{ success: boolean; data: Resource[] }>('/api/admin/resources')
      .then(({ data }) => setResources(data.data))
      .catch(() => {});
  }, []);

  function showMsg(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function openCreate() {
    setEditTarget(null);
    setForm(BLANK);
    setShowModal(true);
  }

  function openEdit(r: Resource) {
    setEditTarget(r);
    setForm({ title: r.title, type: r.type, owner: r.owner, url: r.url || "", status: r.status });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await api.patch<{ success: boolean; data: any }>(`/api/admin/resources/${editTarget.id}`, form);
        const updated = data.data;
        setResources((prev) => prev.map((r) => r.id === editTarget.id ? {
          id: updated.id, title: updated.title, type: updated.type,
          owner: updated.owner || '', updated: new Date(updated.updated_at).toLocaleDateString(),
          status: updated.status, url: updated.url,
        } : r));
        showMsg('✅ Resource updated.');
      } else {
        const { data } = await api.post<{ success: boolean; data: any }>('/api/admin/resources', form);
        const created = data.data;
        setResources((prev) => [{
          id: created.id, title: created.title, type: created.type,
          owner: created.owner || '', updated: new Date(created.updated_at).toLocaleDateString(),
          status: created.status, url: created.url,
        }, ...prev]);
        showMsg('✅ Resource created.');
      }
      setShowModal(false);
    } catch {
      showMsg('⚠️ Failed to save resource.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/api/admin/resources/${id}`);
      setResources((prev) => prev.filter((r) => r.id !== id));
      showMsg('Resource deleted.');
    } catch {
      showMsg('⚠️ Failed to delete resource.');
    }
  }

  const filteredResources = useMemo(
    () => resources.filter((r) => {
      const matchesQuery  = [r.title, r.owner, r.type].some((v) => v.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    }),
    [resources, query, statusFilter]
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
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white">
            <Plus size={16} /> Add resource
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex justify-between items-center rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4 text-sm text-[#F5F0E8]">
          <span>{toast}</span><button onClick={() => setToast("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F0E8]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets"
              className="w-full rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-12 py-3 text-white outline-none" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(["all", "published", "draft", "archived"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === s ? "bg-[#4B1E91] text-white" : "bg-[#0D0118] text-[#F5F0E8]"}`}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredResources.length === 0 && (
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-12 text-center col-span-full">
            <p className="text-[#F5F0E8]">No resources yet.</p>
            <p className="mt-1 text-xs text-[#F5F0E8]/50">Click "Add resource" to create your first entry.</p>
          </div>
        )}
        {filteredResources.map((resource) => (
          <div key={resource.id} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">{resource.type}</p>
                <h2 className="mt-2 text-xl font-semibold">{resource.title}</h2>
                <p className="mt-2 text-sm text-[#F5F0E8]">
                  {resource.owner ? `Managed by ${resource.owner} · ` : ''}Updated {resource.updated}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(resource.status)}`}>
                  {resource.status}
                </span>
                <button onClick={() => openEdit(resource)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-4 py-2 text-sm font-semibold text-white">
                  <SlidersHorizontal size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(resource.id)}
                  className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white">{editTarget ? 'Edit Resource' : 'Add Resource'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm text-[#F5F0E8]">
                Title *
                <input type="text" placeholder="e.g. Intern Onboarding Guide" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm text-[#F5F0E8]">
                  Type
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Resource["type"] }))}
                    className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none">
                    <option value="guide">Guide</option>
                    <option value="tool">Tool</option>
                    <option value="template">Template</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <label className="block text-sm text-[#F5F0E8]">
                  Status
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Resource["status"] }))}
                    className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm text-[#F5F0E8]">
                Owner / Author
                <input type="text" placeholder="e.g. HR Team" value={form.owner}
                  onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-[#F5F0E8]">
                URL (optional)
                <input type="url" placeholder="https://…" value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none" />
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.title.trim() || saving}
                className="flex-1 rounded-2xl bg-[#4B1E91] py-3 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Resource'}
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl border border-[#4B1E91] py-3 text-sm text-[#F5F0E8]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
