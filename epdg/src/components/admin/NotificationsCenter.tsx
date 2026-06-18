import { useState, useMemo } from "react";
// import { X } from "lucide-react";

type Audience = "all" | "interns" | "companies" | "schools" | "mentors";
type EventType = "info" | "warning" | "error";

interface Announcement {
  id: number;
  subject: string;
  message: string;
  targetAudience: Audience;
  sentDate: string;
  totalRecipients: number;
  readCount: number;
}

interface SystemEvent {
  id: number;
  event: string;
  triggeredAt: string;
  affectedUser: string;
  type: EventType;
}

interface Preference {
  id: number;
  label: string;
  enabled: boolean;
}

const INIT_ANNOUNCEMENTS: Announcement[] = [];
const INIT_EVENTS: SystemEvent[] = [];

const INIT_PREFS: Preference[] = [
  { id: 1, label: "New company registration",     enabled: true  },
  { id: 2, label: "Intern application submitted", enabled: true  },
  { id: 3, label: "Failed login attempts (5×)",   enabled: true  },
  { id: 4, label: "Cohort attendance below 70%",  enabled: true  },
  { id: 5, label: "Placement completed",          enabled: false },
  { id: 6, label: "Certificate issued",           enabled: false },
];

const AUDIENCE_META: Record<Audience, { label: string; cls: string }> = {
  all:       { label: "All Users",    cls: "bg-[#4B1E91]/15 text-[#D8B9FF]" },
  interns:   { label: "Interns",      cls: "bg-blue-500/15 text-blue-200"   },
  companies: { label: "Companies",    cls: "bg-amber-500/15 text-amber-200" },
  schools:   { label: "Institutions",  cls: "bg-green-500/15 text-green-200" },
  mentors:   { label: "Mentors",      cls: "bg-pink-500/15 text-pink-200"   },
};

const EVENT_META: Record<EventType, string> = {
  info:    "bg-blue-500/15 text-blue-200",
  warning: "bg-amber-500/15 text-amber-200",
  error:   "bg-red-500/15 text-red-300",
};

const MAX_CHARS = 500;

const NotificationsCenter: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INIT_ANNOUNCEMENTS);
  const [events, setEvents]               = useState<SystemEvent[]>(INIT_EVENTS);
  const [prefs, setPrefs]                 = useState<Preference[]>(INIT_PREFS);

  const [subject,    setSubject]  = useState("");
  const [message,   setMessage]  = useState("");
  const [audience,  setAudience] = useState<Audience>("all");
  const [toast,     setToast]    = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function handleSend() {
    if (!subject.trim() || !message.trim()) return;
    const recipientMap: Record<Audience, number> = { all: 0, interns: 0, companies: 0, schools: 0, mentors: 0 };
    const next: Announcement = {
      id:              Date.now(),
      subject:         subject.trim(),
      message:         message.trim(),
      targetAudience:  audience,
      sentDate:        new Date().toISOString().slice(0, 10),
      totalRecipients: recipientMap[audience],
      readCount:       0,
    };
    setAnnouncements((prev) => [next, ...prev]);
    setSubject(""); setMessage(""); setAudience("all");
    showToast("✅ Announcement sent successfully.");
  }

  const readRateColor = (r: number, t: number) => {
    const pct = t === 0 ? 0 : (r / t) * 100;
    if (pct >= 70) return "bg-green-500";
    if (pct >= 40) return "bg-amber-400";
    return "bg-red-500";
  };

  const sorted = useMemo(() =>
    [...announcements].sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()),
  [announcements]);

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <p className="text-[#F5F0E8] text-sm uppercase tracking-[0.25em]">Notifications & Announcements</p>
        <h1 className="mt-2 font-semibold text-3xl">Communication Centre</h1>
        <p className="mt-2 max-w-2xl text-[#F5F0E8]">Broadcast messages, review sent history, and monitor system events.</p>
      </div>

      {toast && (
        <div className="flex justify-between items-center bg-[#0D0118] p-4 border border-[#4B1E91] rounded-3xl text-[#F5F0E8] text-sm">
          <span>{toast}</span><button onClick={() => setToast("")} className="ml-4 hover:text-white">✕</button>
        </div>
      )}

      {/* Compose + history */}
      <div className="gap-6 grid xl:grid-cols-[1fr_1.3fr]">
        {/* Compose */}
        <div className="space-y-4 bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div>
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">New announcement</p>
            <h2 className="mt-2 font-semibold text-xl">Compose</h2>
          </div>

          <label className="block text-[#F5F0E8] text-sm">
            To
            <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)}
              className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white">
              <option value="all">All Users</option>
              <option value="interns">Interns Only</option>
              <option value="companies">Companies Only</option>
              <option value="schools">Institutions Only</option>
              <option value="mentors">Mentors Only</option>
            </select>
          </label>

          <label className="block text-[#F5F0E8] text-sm">
            Subject
            <input type="text" placeholder="Announcement subject…" value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white" />
          </label>

          <label className="block text-[#F5F0E8] text-sm">
            Message
            <textarea rows={5} placeholder="Write your announcement…"
              value={message} maxLength={MAX_CHARS}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] focus:border-[#4B1E91] rounded-2xl outline-none w-full text-white resize-none" />
            <span className={`text-xs mt-1 block text-right ${message.length >= MAX_CHARS ? "text-red-400" : "text-[#F5F0E8]"}`}>
              {message.length}/{MAX_CHARS}
            </span>
          </label>

          <button onClick={handleSend} disabled={!subject.trim() || !message.trim()}
            className="bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-50 py-3 rounded-2xl w-full font-semibold text-white text-sm transition disabled:cursor-not-allowed">
            Send Announcement
          </button>
        </div>

        {/* Sent history */}
        <div className="space-y-4 bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <div>
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">History</p>
            <h2 className="mt-2 font-semibold text-xl">Sent Announcements</h2>
          </div>
          <div className="space-y-3 pr-1 max-h-120 overflow-y-auto">
            {sorted.map((a) => {
              const readPct = a.totalRecipients === 0 ? 0 : Math.round((a.readCount / a.totalRecipients) * 100);
              return (
                <div key={a.id} className="space-y-2 bg-[#0D0118] p-4 border border-[#4B1E91] rounded-2xl">
                  <div className="flex justify-between items-start gap-3">
                    <p className="font-medium text-sm">{a.subject}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${AUDIENCE_META[a.targetAudience].cls}`}>
                      {AUDIENCE_META[a.targetAudience].label}
                    </span>
                  </div>
                  <p className="text-[#F5F0E8] text-xs line-clamp-2">{a.message}</p>
                  <div className="flex justify-between items-center text-[#F5F0E8] text-xs">
                    <span>{new Date(a.sentDate).toLocaleDateString()} · {a.totalRecipients} recipients</span>
                    <span>{a.readCount} read ({readPct}%)</span>
                  </div>
                  <div className="bg-[#1E0A4A] rounded-full h-1.5">
                    <div className={`${readRateColor(a.readCount, a.totalRecipients)} h-1.5 rounded-full`}
                      style={{ width: `${readPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System events */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div>
            <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">System</p>
            <h2 className="mt-1 font-semibold text-xl">Notification Log</h2>
          </div>
          <button onClick={() => { setEvents([]); showToast("🗑️ System log cleared."); }}
            className="px-4 py-2 border border-[#4B1E91] rounded-2xl text-[#F5F0E8] hover:text-white text-sm transition">
            Clear Log
          </button>
        </div>
        {events.length === 0 ? (
          <p className="py-8 text-[#F5F0E8] text-sm text-center">No system events.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#F5F0E8] text-xs uppercase tracking-[0.3em]">
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">Triggered</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="bg-[#0D0118]">
                    <td className="px-4 py-3 rounded-l-2xl text-white">{ev.event}</td>
                    <td className="px-4 py-3 text-[#F5F0E8]">{ev.triggeredAt}</td>
                    <td className="px-4 py-3 text-[#F5F0E8]">{ev.affectedUser}</td>
                    <td className="px-4 py-3 rounded-r-2xl">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${EVENT_META[ev.type]}`}>
                        {ev.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
        <div>
          <p className="text-[#F5F0E8] text-xs uppercase tracking-[0.25em]">Settings</p>
          <h2 className="mt-1 mb-4 font-semibold text-xl">Notification Preferences</h2>
        </div>
        <div className="space-y-3">
          {prefs.map((p) => (
            <div key={p.id} className="flex justify-between items-center bg-[#0D0118] px-5 py-4 border border-[#4B1E91] rounded-2xl">
              <span className="text-sm">{p.label}</span>
              <button
                onClick={() => setPrefs((prev) => prev.map((x) => x.id === p.id ? { ...x, enabled: !x.enabled } : x))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.enabled ? "bg-[#4B1E91]" : "bg-[#4B1E91]"}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${p.enabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
