import { useMemo, useState, useEffect } from "react";
import { Plus, X, Users, Star, RefreshCw, Copy, Check, KeyRound } from "lucide-react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";

interface Mentor {
  id: number;
  name: string;
  email: string;
  department: string;
  max_capacity: number;
  assigned_count: number;
}

const DEPTS = ["Frontend", "Backend", "Full Stack", "UX/UI", "Sales", "Marketing", "Social Media"];

const EMPTY_FORM = { name: "", email: "", password: "", department: "Frontend", max_capacity: 3 };

// Avoids visually ambiguous characters (0/O, 1/l/I) since admins read this aloud or copy it manually.
const PASSWORD_CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";

function generatePassword(length = 12): string {
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, (v) => PASSWORD_CHARSET[v % PASSWORD_CHARSET.length]).join("");
}

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[#4B1E91]"} />
    ))}
    <span className="ml-1 text-[#F5F0E8] text-xs">{rating.toFixed(1)}</span>
  </span>
);

const MentorManagement: React.FC = () => {
  const [mentors,          setMentors]    = useState<Mentor[]>([]);
  const [loading,          setLoading]    = useState(true);
  const [showAdd,          setShowAdd]    = useState(false);
  const [selectedMentor,   setSelected]   = useState<Mentor | null>(null);
  const [deactivateTarget, setDeactivate] = useState<Mentor | null>(null);
  const [form,             setForm]       = useState(EMPTY_FORM);
  const [saving,           setSaving]     = useState(false);
  const [toast,            setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

  // Holds the just-created mentor's credentials so the admin can copy/share them once.
  const [credentials, setCredentials] = useState<{ name: string; email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset password
  const [resetTarget, setResetTarget]   = useState<Mentor | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting]        = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  async function fetchMentors() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Mentor[] }>("/api/admin/mentors");
      setMentors(data.data);
    } catch {
      showToast("Failed to load mentors.", false);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function openAddModal() {
    setForm({ ...EMPTY_FORM, password: generatePassword() });
    setShowAdd(true);
  }

  function regeneratePassword() {
    setForm((p) => ({ ...p, password: generatePassword() }));
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post<{ success: boolean; data: Mentor }>("/api/admin/mentors", {
        name:         form.name.trim(),
        email:        form.email.trim(),
        password:     form.password.trim(),
        department:   form.department,
        max_capacity: Number(form.max_capacity),
      });
      setMentors((prev) => [data.data, ...prev]);
      setCredentials({ name: data.data.name, email: form.email.trim(), password: form.password.trim() });
      setForm(EMPTY_FORM);
      setShowAdd(false);
      showToast(`${data.data.name} added as mentor.`);
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>).response?.data?.message ?? "Failed to add mentor.";
      showToast(msg, false);
    } finally {
      setSaving(false);
    }
  }

  async function copyCredentials() {
    if (!credentials) return;
    await navigator.clipboard.writeText(
      `Email: ${credentials.email}\nTemporary password: ${credentials.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openReset(m: Mentor) {
    setResetTarget(m);
    setResetPassword(generatePassword());
  }

  async function handleReset() {
    if (!resetTarget || !resetPassword.trim()) return;
    setResetting(true);
    try {
      await api.patch(`/api/admin/mentors/${resetTarget.id}/reset-password`, {
        password: resetPassword.trim(),
      });
      setCredentials({ name: resetTarget.name, email: resetTarget.email, password: resetPassword.trim() });
      showToast(`Password reset for ${resetTarget.name}. Credentials email sent.`);
      setResetTarget(null);
      setResetPassword("");
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>).response?.data?.message ?? "Failed to reset password.";
      showToast(msg, false);
    } finally {
      setResetting(false);
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setSaving(true);
    try {
      await api.delete(`/api/admin/mentors/${deactivateTarget.id}`);
      setMentors((prev) => prev.filter((m) => m.id !== deactivateTarget.id));
      showToast(`${deactivateTarget.name} deactivated.`);
      if (selectedMentor?.id === deactivateTarget.id) setSelected(null);
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>).response?.data?.message ?? "Failed to deactivate.";
      showToast(msg, false);
    } finally {
      setSaving(false);
      setDeactivate(null);
    }
  }

  const stats = useMemo(() => ({
    total:     mentors.length,
    available: mentors.filter((m) => m.assigned_count < m.max_capacity).length,
    full:      mentors.filter((m) => m.assigned_count >= m.max_capacity).length,
  }), [mentors]);

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-4">
          <div>
            <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Mentor Management</p>
            <h1 className="mt-2 font-semibold text-3xl">Platform Mentors</h1>
            <p className="mt-2 text-[#F5F0E8]">Manage mentor accounts, capacity, and intern assignments.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#4B1E91] px-5 py-3 rounded-2xl font-semibold text-white text-sm"
          >
            <Plus size={16} /> Add Mentor
          </button>
        </div>
      </div>

      {toast && (
        <div className={`flex justify-between items-center p-4 border rounded-3xl text-sm ${
          toast.ok
            ? "bg-[#0D0118] border-green-500/40 text-green-300"
            : "bg-[#0D0118] border-red-500/40 text-red-300"
        }`}>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="hover:opacity-70 ml-4">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="gap-4 grid sm:grid-cols-3">
        {[
          { label: "Total Mentors", value: stats.total     },
          { label: "Available",     value: stats.available },
          { label: "At Capacity",   value: stats.full      },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl">
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">{s.label}</p>
            <p className="mt-3 font-semibold text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mentor cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : mentors.length === 0 ? (
        <div className="bg-[#1E0A4A] p-10 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-center">
          No mentors yet. Add the first mentor above.
        </div>
      ) : (
        <div className="gap-4 grid md:grid-cols-2 2xl:grid-cols-4 xl:grid-cols-3">
          {mentors.map((m) => {
            const fill     = m.max_capacity > 0 ? m.assigned_count / m.max_capacity : 0;
            const barColor = fill >= 0.8 ? "bg-amber-400" : "bg-[#4B1E91]";
            const isFull   = m.assigned_count >= m.max_capacity;

            return (
              <div key={m.id} className="flex flex-col gap-4 bg-[#1E0A4A] p-5 border border-[#4B1E91] rounded-3xl">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-12 h-12 font-bold text-white text-sm">
                      {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <span className="inline-block bg-[#4B1E91]/20 mt-1 px-2 py-0.5 rounded-full text-[#D8B9FF] text-xs">
                        {m.department}
                      </span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    isFull ? "bg-amber-500/15 text-amber-300" : "bg-green-500/15 text-green-300"
                  }`}>
                    {isFull ? "Full" : "Available"}
                  </span>
                </div>

                <Stars rating={0} />

                <div>
                  <div className="flex justify-between mb-1.5 text-[#F5F0E8] text-xs">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {m.assigned_count} / {m.max_capacity} interns
                    </span>
                    <span>{Math.round(fill * 100)}%</span>
                  </div>
                  <div className="bg-[#0D0118] rounded-full h-2">
                    <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${Math.min(fill * 100, 100)}%` }} />
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setSelected(m)}
                    className="flex-1 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-xs transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openReset(m)}
                    title="Reset password"
                    className="flex justify-center items-center bg-[#4B1E91]/20 hover:bg-[#4B1E91]/40 px-3 py-2 rounded-2xl text-[#D8B9FF] text-xs transition"
                  >
                    <KeyRound size={14} />
                  </button>
                  <button
                    onClick={() => setDeactivate(m)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-2xl text-red-300 text-xs transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selectedMentor && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-3 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-14 h-14 font-bold text-lg">
                  {selectedMentor.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-xl">{selectedMentor.name}</h2>
                  <p className="text-[#F5F0E8] text-sm">{selectedMentor.department}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#F5F0E8] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="gap-3 grid grid-cols-2">
              {[
                { label: "Email",        value: selectedMentor.email },
                { label: "Department",   value: selectedMentor.department },
                { label: "Max Capacity", value: String(selectedMentor.max_capacity) },
                { label: "Assigned",     value: String(selectedMentor.assigned_count) },
              ].map((f) => (
                <div key={f.label} className="bg-[#0D0118] p-3 border border-[#4B1E91] rounded-2xl">
                  <p className="text-[#F5F0E8] text-xs">{f.label}</p>
                  <p className="mt-1 font-medium text-sm break-all">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add mentor modal */}
      {showAdd && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center gap-3 mb-6">
              <h2 className="font-semibold text-xl">Add Mentor</h2>
              <button onClick={() => setShowAdd(false)} className="text-[#F5F0E8] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {([
                { label: "Full Name", key: "name",  type: "text",  ph: "Jane Doe" },
                { label: "Email",     key: "email", type: "email", ph: "jane@example.com" },
              ] as const).map(({ label, key, type, ph }) => (
                <label key={key} className="block text-[#F5F0E8] text-sm">
                  {label}
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                  />
                </label>
              ))}

              <label className="block text-[#F5F0E8] text-sm">
                Temporary Password
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    readOnly
                    value={form.password}
                    className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full font-mono text-white"
                  />
                  <button
                    type="button"
                    onClick={regeneratePassword}
                    title="Generate a new password"
                    className="flex justify-center items-center px-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white transition"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <p className="mt-1.5 text-[#F5F0E8]/50 text-xs">
                  Auto-generated. You'll get a copy to share with the mentor after creating their account.
                </p>
              </label>

              <label className="block text-[#F5F0E8] text-sm">
                Department
                <select
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                >
                  {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>

              <label className="block text-[#F5F0E8] text-sm">
                Max Intern Capacity
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.max_capacity}
                  onChange={(e) => setForm((p) => ({ ...p, max_capacity: Number(e.target.value) }))}
                  className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                />
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                disabled={saving || !form.name.trim() || !form.email.trim() || !form.password.trim()}
                className="flex-1 bg-[#4B1E91] disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm"
              >
                {saving ? "Adding…" : "Add Mentor"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials modal — shown once, right after a mentor is created */}
      {credentials && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <h2 className="font-semibold text-white text-xl">Share these credentials</h2>
            <p className="mt-2 text-[#F5F0E8] text-sm">
              This password won't be shown again. Copy it now and send it to{" "}
              <span className="font-medium text-white">{credentials.name}</span> through a secure channel.
            </p>

            <div className="space-y-3 bg-[#0D0118] mt-4 p-4 border border-[#4B1E91] rounded-2xl">
              <div>
                <p className="text-[#F5F0E8] text-xs">Email</p>
                <p className="font-mono text-sm break-all">{credentials.email}</p>
              </div>
              <div>
                <p className="text-[#F5F0E8] text-xs">Temporary Password</p>
                <p className="font-mono text-sm break-all">{credentials.password}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={copyCredentials}
                className="flex flex-1 justify-center items-center gap-2 bg-[#4B1E91] py-3 rounded-2xl font-semibold text-white text-sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
              <button
                onClick={() => setCredentials(null)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetTarget && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <div className="flex justify-between items-center gap-3 mb-5">
              <h2 className="font-semibold text-xl">Reset Password</h2>
              <button onClick={() => setResetTarget(null)} className="text-[#F5F0E8] hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-[#F5F0E8] text-sm mb-4">
              Generate a new temporary password for <span className="font-medium text-white">{resetTarget.name}</span>.
              They will be required to change it on next login.
            </p>
            <label className="block text-[#F5F0E8] text-sm">
              New Temporary Password
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  readOnly
                  value={resetPassword}
                  className="bg-[#0D0118] px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full font-mono text-white"
                />
                <button
                  type="button"
                  onClick={() => setResetPassword(generatePassword())}
                  title="Generate new password"
                  className="flex justify-center items-center px-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white transition"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </label>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 bg-[#4B1E91] disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm"
              >
                {resetting ? "Resetting…" : "Reset Password"}
              </button>
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate confirm modal */}
      {deactivateTarget && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4">
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl w-full max-w-md">
            <h2 className="font-semibold text-white text-xl">Remove mentor?</h2>
            <p className="mt-3 text-[#F5F0E8] text-sm">
              This will remove <span className="font-medium text-white">{deactivateTarget.name}</span> from the
              mentor list. Their account will remain but they won't appear in the mentor dropdown.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDeactivate}
                disabled={saving}
                className="flex-1 bg-red-500 disabled:opacity-50 py-3 rounded-2xl font-semibold text-white text-sm"
              >
                {saving ? "Removing…" : "Confirm Remove"}
              </button>
              <button
                onClick={() => setDeactivate(null)}
                className="flex-1 py-3 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;