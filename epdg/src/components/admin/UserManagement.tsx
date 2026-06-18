import { useMemo, useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "company" | "school" | "intern";
  status: "approved" | "pending" | "rejected" | "unverified";
  last_login_at: string | null;
  created_at: string;
}

const roleLabels   = ["all", "admin", "company", "school", "intern"] as const;
const statusLabels = ["all", "approved", "pending", "rejected", "unverified"] as const;

const badgeClass = (role: User["role"]) => {
  switch (role) {
    case "admin":   return "bg-red-500/15 text-red-200";
    case "company": return "bg-blue-500/15 text-blue-200";
    case "school":  return "bg-amber-500/15 text-amber-200";
    case "intern":  return "bg-emerald-500/15 text-emerald-200";
    default:        return "bg-white/10 text-white";
  }
};

const statusClass = (status: User["status"]) => {
  switch (status) {
    case "approved":   return "bg-green-500/15 text-green-200";
    case "pending":    return "bg-[#4B1E91]/15 text-[#D8B9FF]";
    case "rejected":   return "bg-red-500/15 text-red-200";
    case "unverified": return "bg-white/10 text-[#F5F0E8]";
    default:           return "bg-white/10 text-white";
  }
};

const fmtLogin = (dt: string | null) => {
  if (!dt) return "Never";
  const d = new Date(dt);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return d.toLocaleDateString();
};

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const UserManagement: React.FC = () => {
  const [users, setUsers]             = useState<User[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState<(typeof roleLabels)[number]>("all");
  const [statusFilter, setStatusFilter] = useState<(typeof statusLabels)[number]>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [formValues, setFormValues]   = useState({ name: "", email: "", role: "intern", password: "" });
  const [saving, setSaving]           = useState(false);
  const [message, setMessage]         = useState("");

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: User[] }>("/api/admin/users");
      setUsers(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    if (!formValues.name || !formValues.email || !formValues.password) {
      setMessage("Name, email and password are required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/admin/users", formValues);
      setMessage("✅ User created successfully.");
      setShowCreateModal(false);
      setFormValues({ name: "", email: "", role: "intern", password: "" });
      fetchUsers();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Failed to create user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteTarget === null) return;
    try {
      await api.delete(`/api/admin/users/${deleteTarget}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget));
      setMessage("User deleted.");
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setMessage(e.response?.data?.message ?? "Delete failed.");
    } finally {
      setDeleteTarget(null);
    }
  }

  const filteredUsers = useMemo(() => users.filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [users, filter, statusFilter, search]);

  const counts = useMemo(() => ({
    admin:   users.filter((u) => u.role === "admin").length,
    company: users.filter((u) => u.role === "company").length,
    school:  users.filter((u) => u.role === "school").length,
    intern:  users.filter((u) => u.role === "intern").length,
  }), [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">User management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage platform accounts</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">
              Search, filter and manage all user accounts across roles.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchUsers}
              className="rounded-2xl border border-[#4B1E91] px-4 py-2 text-sm text-[#F5F0E8] hover:text-white transition">
              Refresh
            </button>
            <button onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E91] px-5 py-3 text-sm font-semibold text-white">
              <Plus size={16} /> Create User
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4">
            <div className="flex items-center gap-2 rounded-3xl border border-[#4B1E91] bg-[#12022A] px-3 py-2">
              <Search size={16} className="text-[#F5F0E8]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#F5F0E8]" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8] mb-2">Role</p>
              <div className="flex flex-wrap gap-1.5">
                {roleLabels.map((l) => (
                  <button key={l} onClick={() => setFilter(l)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === l ? "bg-[#4B1E91] text-white" : "bg-[#12022A] text-[#F5F0E8]"}`}>
                    {l === "all" ? "All" : `${l === "school" ? "Institution" : l.charAt(0).toUpperCase() + l.slice(1)} (${counts[l as keyof typeof counts] ?? 0})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F5F0E8] mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {statusLabels.map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${statusFilter === s ? "bg-[#4B1E91] text-white" : "bg-[#12022A] text-[#F5F0E8]"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-4 text-sm text-[#F5F0E8]">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4B1E91] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.3em] text-[#F5F0E8]">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-[#F5F0E8]">No users match this filter.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4B1E91]/20 text-sm font-semibold text-white">
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-[#F5F0E8]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(user.role)}`}>
                          {user.role === "school" ? "Institution" : user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#F5F0E8]">{fmtLogin(user.last_login_at)}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          onClick={() => setDeleteTarget(user.id)}
                          className="rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20 transition">
                          ⊘ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <p className="text-xs text-[#F5F0E8] mt-2">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white">Create User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name",  key: "name",     type: "text",     ph: "Jane Doe"           },
                { label: "Email",      key: "email",    type: "email",    ph: "jane@example.com"   },
                { label: "Password",   key: "password", type: "password", ph: "Min. 8 characters"  },
              ].map(({ label, key, type, ph }) => (
                <label key={key} className="block text-sm text-[#F5F0E8]">
                  {label}
                  <input type={type} placeholder={ph}
                    value={(formValues as Record<string, string>)[key]}
                    onChange={(e) => setFormValues((p) => ({ ...p, [key]: e.target.value }))}
                    className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none focus:border-[#4B1E91]" />
                </label>
              ))}
              <label className="block text-sm text-[#F5F0E8]">
                Role
                <select value={formValues.role}
                  onChange={(e) => setFormValues((p) => ({ ...p, role: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-white outline-none">
                  <option value="intern">Intern</option>
                  <option value="company">Company</option>
                  <option value="school">Institution</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleCreateUser} disabled={saving}
                className="flex-1 rounded-2xl bg-[#4B1E91] py-3 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Creating…" : "Create User"}
              </button>
              <button onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-2xl border border-[#4B1E91] py-3 text-sm text-[#F5F0E8]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
            <h2 className="text-xl font-semibold text-white">Delete user?</h2>
            <p className="mt-3 text-sm text-[#F5F0E8]">
              This will permanently remove the account. The user will lose all access immediately.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={handleDelete} className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white">
                Confirm Delete
              </button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-2xl border border-[#4B1E91] py-3 text-sm text-[#F5F0E8]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
