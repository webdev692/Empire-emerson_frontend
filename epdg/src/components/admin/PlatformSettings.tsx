import { useState } from "react";
import { Bell, ShieldCheck, ToggleLeft, Users } from "lucide-react";

const PlatformSettings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState(false);
  const [auditLogs, setAuditLogs] = useState(true);
  const [openRegistration, setOpenRegistration] = useState(true);

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#F5F0E8]">Platform settings</p>
            <h1 className="mt-2 text-3xl font-semibold">Control system-wide policies</h1>
            <p className="mt-2 max-w-2xl text-[#F5F0E8]">Adjust security, registration and notification preferences for the admin portal.</p>
          </div>
          <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] px-4 py-3 text-sm text-[#F5F0E8]">
            Settings saved automatically
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
          <div className="flex items-center gap-3 text-[#F5F0E8]">
            <Bell size={18} />
            <p className="text-sm uppercase tracking-[0.25em]">Notifications</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#12022A] px-4 py-4">
              <div>
                <p className="font-semibold">Platform alerts</p>
                <p className="text-sm text-[#F5F0E8]">Notify admins about new approvals and system events.</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${notifications ? "bg-[#4B1E91] text-white" : "bg-white/10 text-[#F5F0E8]"}`}
              >
                {notifications ? "On" : "Off"}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-[#4B1E91] bg-[#12022A] px-4 py-4">
              <div>
                <p className="font-semibold">Audit streaming</p>
                <p className="text-sm text-[#F5F0E8]">Track login events and admin activity securely.</p>
              </div>
              <button
                onClick={() => setAuditLogs((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${auditLogs ? "bg-[#4B1E91] text-white" : "bg-white/10 text-[#F5F0E8]"}`}
              >
                {auditLogs ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#4B1E91] bg-[#0D0118] p-6">
          <div className="flex items-center gap-3 text-[#F5F0E8]">
            <ShieldCheck size={18} />
            <p className="text-sm uppercase tracking-[0.25em]">Security & access</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Open registration</p>
                  <p className="text-sm text-[#F5F0E8]">Allow new companies, schools and interns to onboard through the portal.</p>
                </div>
                <button
                  onClick={() => setOpenRegistration((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${openRegistration ? "bg-[#4B1E91] text-white" : "bg-white/10 text-[#F5F0E8]"}`}
                >
                  {openRegistration ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Data retention</p>
                  <p className="text-sm text-[#F5F0E8]">Keep audit and credential data for the configured retention period.</p>
                </div>
                <button
                  onClick={() => setDataRetention((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${dataRetention ? "bg-[#4B1E91] text-white" : "bg-white/10 text-[#F5F0E8]"}`}
                >
                  <ToggleLeft size={16} />
                  {dataRetention ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">User roles</p>
                  <p className="text-sm text-[#F5F0E8]">Assign roles based on internal policy and review cycles.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#4B1E91] px-4 py-2 text-sm font-semibold text-white">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#4B1E91] bg-[#1E0A4A] p-6">
        <div className="flex items-center gap-3 text-[#F5F0E8]">
          <Users size={18} />
          <p className="text-sm uppercase tracking-[0.25em]">Admin tools</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-4">
            <p className="font-semibold">Session limits</p>
            <p className="mt-2 text-sm text-[#F5F0E8]">Configure the max active sessions per admin account.</p>
          </div>
          <div className="rounded-3xl border border-[#4B1E91] bg-[#12022A] p-4">
            <p className="font-semibold">Data retention</p>
            <p className="mt-2 text-sm text-[#F5F0E8]">Keep audit logs and reports for 12 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
