import { useState, useEffect } from "react";
import { Bell, ShieldCheck, Palette, User, Lock, CheckCircle, ShieldAlert, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore, MOODS, type Mood } from "../../store/themeStore";

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({
  label, description, value, onToggle, disabled,
}: {
  label: string; description: string; value: boolean;
  onToggle: () => void; disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#12022A] px-4 py-4 gap-4">
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm">{label}</p>
        <p className="text-[#F5F0E8] text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className="shrink-0 disabled:opacity-40 transition-opacity"
      >
        {value
          ? <ToggleRight size={38} className="text-[#4B1E91]" />
          : <ToggleLeft  size={38} className="text-[#4B1E91]/40" />
        }
      </button>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const PlatformSettings: React.FC = () => {
  const navigate       = useNavigate();
  const user           = useAuthStore((s) => s.user);
  const isSuperAdmin   = user?.admin_role === 'super_admin';
  const { mood, setMood } = useThemeStore();

  // DB-backed settings
  const [notifications,   setNotifications]   = useState(true);
  const [auditLogs,       setAuditLogs]       = useState(true);
  const [openReg,         setOpenReg]         = useState(true);
  const [dataRetention,   setDataRetention]   = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [toast,           setToast]           = useState("");
  const [toastType,       setToastType]       = useState<"ok" | "err">("ok");

  useEffect(() => {
    api.get<{ success: boolean; data: Record<string, string> }>('/api/admin/settings')
      .then(({ data }) => {
        const s = data.data;
        if (s.notifications_enabled  !== undefined) setNotifications(s.notifications_enabled  === 'true');
        if (s.audit_logs_enabled     !== undefined) setAuditLogs(s.audit_logs_enabled          === 'true');
        if (s.open_registration      !== undefined) setOpenReg(s.open_registration              === 'true');
        if (s.data_retention_enabled !== undefined) setDataRetention(s.data_retention_enabled   === 'true');
      })
      .catch(() => {});
  }, []);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 3000);
  }

  async function saveSetting(key: string, value: boolean, setter: (v: boolean) => void) {
    setter(value);
    setSaving(true);
    try {
      await api.patch('/api/admin/settings', { [key]: String(value) });
      showToast("Setting saved.");
    } catch {
      showToast("Failed to save setting.", "err");
      setter(!value);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Platform Settings</p>
            <h1 className="mt-2 text-3xl font-semibold">Control &amp; Customise</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8] text-sm">
              Manage system policies, personalise the interface mood, and adjust account security.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-sm text-[#F5F0E8]">
            {saving
              ? <><span className="inline-block w-3 h-3 border border-[#4B1E91] border-t-transparent rounded-full animate-spin mr-2" />Saving…</>
              : <><CheckCircle size={14} className="text-green-400 mr-2" />Auto-saved</>
            }
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex justify-between items-center rounded-3xl border px-4 py-3 text-sm ${toastType === "ok" ? "border-green-500/30 bg-green-500/10 text-green-200" : "border-red-500/30 bg-red-500/10 text-red-200"}`}>
          <span>{toast}</span>
          <button onClick={() => setToast("")} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* ── Appearance / Mood ────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-[#4B1E91]/20 p-2 rounded-xl">
            <Palette size={18} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Appearance</p>
            <h2 className="font-semibold text-white">Mood Theme</h2>
          </div>
        </div>

        <p className="text-[#F5F0E8] text-xs mb-4 leading-relaxed">
          Choose a colour palette for the admin panel. Your preference is saved locally and applied instantly.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOODS.map((m) => {
            const isActive = mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMood(m.id as Mood)}
                className={`group relative flex flex-col items-center gap-3 rounded-3xl border-2 p-4 transition-all duration-200 ${
                  isActive
                    ? "border-[#C9A84C] scale-105"
                    : "border-[#4B1E91]/40 hover:border-[#4B1E91] hover:scale-102"
                }`}
                style={{ backgroundColor: m.deep }}
              >
                {/* Colour swatch row */}
                <div className="flex gap-1.5">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: m.mid }} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: m.accent }} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: m.gold }} />
                </div>
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs font-semibold text-white/80">{m.label}</span>
                {isActive && (
                  <span className="absolute top-2 right-2 text-[#C9A84C]">
                    <CheckCircle size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Super-admin lock notice ───────────────────────────────────────────── */}
      {!isSuperAdmin && (
        <div className="flex items-center gap-3 rounded-3xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-5 py-4 text-sm text-[#C9A84C]">
          <ShieldAlert size={18} className="shrink-0" />
          <span>Platform controls are <strong>read-only</strong> for standard admins. Only a Super Admin can toggle these settings.</span>
        </div>
      )}

      {/* ── Notifications & Audit ────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#4B1E91]/20 p-2 rounded-xl">
              <Bell size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Notifications</p>
              <h2 className="font-semibold text-white">Alert Preferences</h2>
            </div>
          </div>
          <div className="space-y-3">
            <ToggleRow
              label="Platform alerts"
              description="Notify admins about new approvals, sign-ups and system events."
              value={notifications}
              onToggle={() => saveSetting('notifications_enabled', !notifications, setNotifications)}
              disabled={saving || !isSuperAdmin}
            />
            <ToggleRow
              label="Audit streaming"
              description="Track login events and admin action history in real-time."
              value={auditLogs}
              onToggle={() => saveSetting('audit_logs_enabled', !auditLogs, setAuditLogs)}
              disabled={saving || !isSuperAdmin}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[#4B1E91]/20 p-2 rounded-xl">
              <ShieldCheck size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Security &amp; Access</p>
              <h2 className="font-semibold text-white">Platform Controls</h2>
            </div>
          </div>
          <div className="space-y-3">
            <ToggleRow
              label="Open registration"
              description="Allow new companies, institutions and interns to sign up through the portal."
              value={openReg}
              onToggle={() => saveSetting('open_registration', !openReg, setOpenReg)}
              disabled={saving || !isSuperAdmin}
            />
            <ToggleRow
              label="Data retention"
              description="Keep audit logs and credential data for a 12-month retention window."
              value={dataRetention}
              onToggle={() => saveSetting('data_retention_enabled', !dataRetention, setDataRetention)}
              disabled={saving || !isSuperAdmin}
            />
          </div>
        </div>
      </div>

      {/* ── Account ──────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-[#4B1E91]/20 p-2 rounded-xl">
            <User size={18} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Account</p>
            <h2 className="font-semibold text-white">Your Profile</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Profile card */}
          <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4B1E91] text-lg font-bold text-[#C9A84C]">
                {user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() ?? 'AD'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[#F5F0E8] text-xs truncate">{user?.email}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${user?.admin_role === 'super_admin' ? 'bg-[#C9A84C]/15 text-[#C9A84C]' : 'bg-[#4B1E91]/20 text-[#D8B9FF]'}`}>
                  {user?.admin_role === 'super_admin' ? '⭐ Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Security actions */}
          <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#F5F0E8] text-xs uppercase tracking-[0.2em]">
              <Lock size={13} /> Security
            </div>
            <button
              onClick={() => navigate('/change-password')}
              className="w-full rounded-2xl bg-[#4B1E91] py-3 text-sm font-semibold text-white hover:bg-[#5a26a8] transition"
            >
              Change Password
            </button>
            <p className="text-[#F5F0E8]/50 text-xs">
              Passwords are hashed with bcrypt and never stored in plain text.
            </p>
          </div>
        </div>
      </div>

      {/* ── Platform info ─────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8] mb-4">Platform Info</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Version',     value: 'epdg v1.0.0'       },
            { label: 'Environment', value: import.meta.env.MODE },
            { label: 'Region',      value: 'Railway · East US'  },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-5 py-4">
              <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.2em]">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PlatformSettings;
