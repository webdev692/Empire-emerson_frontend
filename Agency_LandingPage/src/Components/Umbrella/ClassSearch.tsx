import React, { useState, useEffect } from "react";
import { Zap, Calendar, Clock, X, Check, GraduationCap, ArrowRight } from "lucide-react";
import type { ClassItem } from "../data/classData";

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY     = "emerson_registrations";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform?embedded=true";

// ── Date helpers ──────────────────────────────────────────────────────────────

const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_FULL    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/** Returns the next (or current) occurrence of a named weekday as a Date at midnight. */
function getNextSession(dayName: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = ((DAY_INDEX[dayName] ?? 0) - today.getDay() + 7) % 7;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d;
}

type SessionType = "today" | "tomorrow" | "soon" | "later";

function sessionStatus(dayName: string): { date: Date; label: string; type: SessionType } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = ((DAY_INDEX[dayName] ?? 0) - today.getDay() + 7) % 7;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  const fmt = `${DAY_SHORT[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
  if (diff === 0) return { date: d, label: "Today",    type: "today"    };
  if (diff === 1) return { date: d, label: "Tomorrow", type: "tomorrow" };
  return { date: d, label: fmt, type: diff <= 3 ? "soon" : "later" };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function spotsLeft(item: ClassItem) {
  return item.spotsTotal - item.spotsTaken;
}

function priceLabel(price: number) {
  return price === 0 ? "FREE" : `$${price}`;
}

function buildCalendarLink(item: ClassItem, date?: Date) {
  const d   = date ?? getNextSession(item.day);
  const ds  = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const title   = encodeURIComponent(item.title);
  const details = encodeURIComponent(
    `${item.description}\n\nDate: ${d.toDateString()} | Time: ${item.time}\n\nJoin via Google Meet — link sent after registration.`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${ds}/${ds}`;
}

// ── Session badge ─────────────────────────────────────────────────────────────

const BADGE_STYLE: Record<SessionType, string> = {
  today:    "bg-green-500 text-white",
  tomorrow: "bg-[#C9A84C] text-[#0A1128]",
  soon:     "bg-[#4B1E91]/10 text-[#4B1E91]",
  later:    "bg-neutral-100 text-neutral-500",
};

function SessionBadge({ dayName }: { dayName: string }) {
  const { label, type } = sessionStatus(dayName);
  const icon = type === "today" ? <Zap className="inline mr-1 text-yellow-400" size={16} /> : type === "tomorrow" ? <Calendar className="inline mr-1" size={16} /> : null;
  return (
    <span className={`inline-block px-2 py-0.5 font-mono text-xs uppercase tracking-wider font-bold ${BADGE_STYLE[type]}`}>
      {icon}{label}
    </span>
  );
}

// ── Weekly timeline ───────────────────────────────────────────────────────────

interface WeeklyTimelineProps {
  classes: ClassItem[];
  activeDay: string | null;
  onDayClick: (day: string | null) => void;
}

function WeeklyTimeline({ classes, activeDay, onDayClick }: WeeklyTimelineProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Sunday of this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dayName    = DAY_FULL[d.getDay()];
    const classCount = classes.filter((c) => c.day === dayName).length;
    const isToday    = d.getTime() === today.getTime();
    const isPast     = d < today;
    return { date: d, dayName, classCount, isToday, isPast };
  });

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekLabel =
    MONTH_SHORT[weekStart.getMonth()] === MONTH_SHORT[weekEnd.getMonth()]
      ? `${MONTH_SHORT[weekStart.getMonth()]} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${today.getFullYear()}`
      : `${MONTH_SHORT[weekStart.getMonth()]} ${weekStart.getDate()} – ${MONTH_SHORT[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${today.getFullYear()}`;

  return (
    <div className="bg-white mb-8 border border-[#4B1E91]/20 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0A1128] px-4 py-2.5">
        <div>
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest">
            Weekly Schedule
          </p>
          <p className="font-mono text-white/50 text-xs">Week of {weekLabel}</p>
        </div>
        {activeDay && (
          <button
            onClick={() => onDayClick(null)}
            className="font-mono text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            <>Clear filter <X className="inline ml-1" size={16} /></>
          </button>
        )}
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 divide-x divide-neutral-100">
        {days.map(({ date, dayName, classCount, isToday, isPast }) => {
          const isActive = activeDay === dayName;
          return (
            <button
              key={dayName}
              onClick={() => classCount > 0 ? onDayClick(isActive ? null : dayName) : undefined}
              disabled={classCount === 0}
              className={`flex flex-col items-center py-3 px-1 transition-colors duration-150 ${
                isActive   ? "bg-[#4B1E91] text-white" :
                isToday    ? "bg-[#C9A84C]/12" :
                isPast     ? "bg-neutral-50 cursor-default" :
                classCount > 0 ? "hover:bg-[#4B1E91]/5 cursor-pointer" : "cursor-default"
              }`}
            >
              <span className={`font-mono text-xs uppercase tracking-wider mb-1 ${
                isActive ? "text-white/70" :
                isPast   ? "text-neutral-300" :
                isToday  ? "text-[#C9A84C] font-bold" : "text-neutral-400"
              }`}>
                {DAY_SHORT[date.getDay()]}
              </span>
              <span className={`font-bold text-sm leading-none mb-1 ${
                isActive ? "text-white" :
                isPast   ? "text-neutral-300" :
                isToday  ? "text-[#C9A84C]" : "text-[#0A1128]"
              }`}>
                {date.getDate()}
              </span>
              {classCount > 0 ? (
                <span className={`font-mono text-xs mt-0.5 ${
                  isActive ? "text-white/70" :
                  isPast   ? "text-neutral-300" :
                  isToday  ? "text-[#C9A84C]" : "text-neutral-400"
                }`}>
                  {classCount}
                </span>
              ) : (
                <span className="mt-0.5 text-neutral-200 text-xs">–</span>
              )}
              {isToday && !isActive && (
                <span className="bg-[#C9A84C] mt-1 rounded-full w-1.5 h-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// �──────�──────────────────

interface FormModalProps {
  classItem: ClassItem;
  onClose: () => void;
  onComplete: () => void;
}

function RegistrationFormModal({ classItem, onClose, onComplete }: FormModalProps) {
  const [loadCount, setLoadCount] = useState(0);
  const submitted = loadCount >= 2;

  // Google Forms fires iframe onLoad once when the form loads,
  // and again when it redirects to the thank-you page after submission.
  const handleIframeLoad = () => {
    setLoadCount((n) => {
      const next = n + 1;
      if (next >= 2) onComplete();
      return next;
    });
  };

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-end sm:items-center bg-[#0A1128]/80 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-white shadow-2xl border-[#C9A84C] border-t-4 sm:rounded-sm w-full sm:max-w-2xl h-[92vh] sm:h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal header ── */}
        <div className="flex justify-between items-start bg-white px-5 py-4 border-neutral-100 border-b shrink-0">
          <div className="flex-1 min-w-0">
            <p className="mb-0.5 font-mono text-[#4B1E91] text-xs uppercase tracking-widest">
              {submitted ? "Registration Submitted" : "The Emerson Empire – Class Registration"}
            </p>
            <h3 className="font-bold text-[#0A1128] text-sm truncate leading-snug">{classItem.title}</h3>
            <div className="flex flex-wrap gap-3 mt-1 font-mono text-neutral-400 text-xs">
              <span> {classItem.day}</span>
              <span>{classItem.time}</span>
              <span className={classItem.price === 0 ? "text-[#C9A84C] font-bold" : "text-[#4B1E91] font-bold"}>
                {priceLabel(classItem.price)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="mt-0.5 ml-4 text-neutral-300 hover:text-[#0A1128] text-xl leading-none transition-colors shrink-0"
          >
            
          </button>
        </div>

        {/* ── Submitted confirmation ── */}
        {submitted ? (
          <div className="flex flex-col flex-1 justify-center items-center px-8 py-12 text-center">
            <div className="flex justify-center items-center bg-[#C9A84C] mb-5 rounded-sm w-14 h-14 text-[#0A1128] text-2xl"><Check /></div>
            <h3 className="mb-3 font-bold text-[#0A1128] text-xl">Registration Submitted!</h3>
            <p className="mb-2 max-w-sm text-neutral-500 text-sm leading-relaxed">
              Your registration for <span className="font-semibold text-[#0A1128]">{classItem.title}</span> has been received.
            </p>
            <p className="mb-8 max-w-sm text-neutral-400 text-sm leading-relaxed">
              The Emerson Empire team will follow up at the email you provided with your Google Meet link, class details, and any next steps.
            </p>
            <div className="flex sm:flex-row flex-col gap-3 w-full max-w-xs">
              <a
                href={buildCalendarLink(classItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 justify-center items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] px-4 py-3 font-mono text-white text-xs uppercase tracking-wider transition-colors"
              >
                Add to Calendar
              </a>
              <button
                onClick={onClose}
                className="flex-1 hover:bg-[#C9A84C]/10 px-4 py-3 border border-[#C9A84C] font-mono text-[#C9A84C] text-xs uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ── Embedded Google Form ── */
          <iframe
            src={GOOGLE_FORM_URL}
            onLoad={handleIframeLoad}
            title="Class Registration Form"
            className="flex-1 border-none w-full"
            allow="camera; microphone"
          />
        )}
      </div>
    </div>
  );
}

// ── ClassCard ─────────────────────────────────────────────────────────────────

interface ClassCardProps {
  item: ClassItem;
  isRegistered: boolean;
  onRegister: () => void;
  onCancel: () => void;
}

function ClassCard({ item, isRegistered, onRegister, onCancel }: ClassCardProps) {
  const left        = spotsLeft(item);
  const isFree      = item.ticketType.toLowerCase().includes("free");
  const isIntensive = item.ticketType.toLowerCase().includes("intensive");
  const isUrgent    = left > 0 && left <= 5;
  const fillPct     = Math.round((item.spotsTaken / item.spotsTotal) * 100);

  const badgeStyle: React.CSSProperties = isFree
    ? { background: "#C9A84C", color: "#0A1128", borderColor: "#C9A84C" }
    : isIntensive
    ? { background: "#0A1128", color: "#C9A84C", borderColor: "#0A1128" }
    : { background: "#4B1E91", color: "#ffffff", borderColor: "#4B1E91" };

  const buttonCls = left === 0
    ? "bg-neutral-50 text-neutral-300 cursor-not-allowed"
    : isFree
    ? "bg-[#C9A84C] text-[#0A1128] hover:bg-[#b8933e]"
    : "bg-[#4B1E91] text-white hover:bg-[#3d1778]";

  return (
    <div className="flex flex-col bg-white hover:shadow-sm border border-neutral-100 hover:border-[#4B1E91]/25 transition-all duration-200">
      <div className="flex flex-col flex-1 p-6">

        {/* Theme row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-[#4B1E91]/10 w-7 h-7 shrink-0">
              <GraduationCap size={13} className="text-[#4B1E91]" />
            </div>
            <span className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest line-clamp-1">
              {item.theme}
            </span>
          </div>
          <span
            className="shrink-0 px-2 py-0.5 font-mono font-bold text-xs uppercase tracking-wider"
            style={badgeStyle}
          >
            {priceLabel(item.price)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-heading font-bold text-[#0A1128] text-xl leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="flex-1 mb-4 font-body text-neutral-500 text-sm leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Schedule */}
        <div className="mb-4 pl-3 border-l-2 border-[#4B1E91]/25">
          <p className="mb-1 font-mono text-[#4B1E91]/50 text-xs uppercase tracking-wider">Schedule</p>
          <div className="flex items-center gap-2 font-body text-[#0A1128] text-sm mb-0.5">
            <Calendar size={11} className="text-[#4B1E91] shrink-0" />
            <span>{item.day} · {MONTH_SHORT[getNextSession(item.day).getMonth()]} {getNextSession(item.day).getDate()}</span>
          </div>
          <div className="flex items-center gap-2 font-body text-[#0A1128] text-sm">
            <Clock size={11} className="text-[#4B1E91] shrink-0" />
            <span>{item.time}</span>
          </div>
        </div>

        {/* Spots */}
        <div className="flex items-start gap-1.5 mb-3">
          <span className={`inline-block mt-1.5 rounded-full w-1.5 h-1.5 shrink-0 ${isUrgent ? "bg-red-500" : "bg-[#C9A84C]"}`} />
          <p className={`font-mono text-sm ${isUrgent ? "text-red-500 font-bold" : "text-neutral-500"}`}>
            {isUrgent
              ? <><Zap className="inline mr-1" size={16} />Only {left} spots left!</>
              : <>{left} of {item.spotsTotal} spots remaining</>
            }
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 bg-neutral-100 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isUrgent ? "bg-red-500" : "bg-[#C9A84C]"}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>

        {/* Session badge */}
        <div className="mb-5">
          <SessionBadge dayName={item.day} />
        </div>

        {/* CTA */}
        {isRegistered ? (
          <div className="mt-auto space-y-2">
            <div className="flex justify-center items-center gap-2 bg-[#C9A84C]/10 px-4 py-3 border border-[#C9A84C] w-full font-mono font-bold text-[#4B1E91] text-xs uppercase tracking-wider">
              <Check className="text-[#C9A84C]" /> Registered
            </div>
            <div className="flex justify-between items-center">
              <a
                href={buildCalendarLink(item, getNextSession(item.day))}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#C9A84C] hover:text-[#b8933e] text-xs hover:underline uppercase"
              >
                Add to Calendar
              </a>
              <button
                onClick={onCancel}
                className="font-mono text-red-400 hover:text-red-600 text-xs hover:underline uppercase"
              >
                <>Cancel <X className="inline ml-1" size={16} /></>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onRegister}
            disabled={left === 0}
            className={`mt-auto flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${buttonCls}`}
          >
            {left === 0 ? "Class Full" : "Register for Class"}
            {left > 0 && <ArrowRight size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}
// ── ClassSearch ───────────────────────────────────────────────────────────────

interface ClassSearchProps {
  classes: ClassItem[];
  showTodayFilter?: boolean;
}

const ClassSearch: React.FC<ClassSearchProps> = ({ classes, showTodayFilter = true }) => {
  const [searchTerm, setSearchTerm]       = useState("");
  const [activeFilter, setActiveFilter]   = useState("all");
  const [activeTheme, setActiveTheme]     = useState<string | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<string | null>(null);
  const [modalClass, setModalClass]       = useState<ClassItem | null>(null);
  const [registeredIds, setRegisteredIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });

  const uniqueThemes = Array.from(new Set(classes.map((c) => c.theme)));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredIds));
  }, [registeredIds]);

  const handleComplete = () => {
    if (!modalClass) return;
    setRegisteredIds((prev) => prev.includes(modalClass.id) ? prev : [...prev, modalClass.id]);
  };

  const handleCancel = (id: number) => {
    setRegisteredIds((prev) => prev.filter((i) => i !== id));
  };

  const filtered = classes
    .filter((item) => {
      if (activeFilter === "free"      && !item.ticketType.toLowerCase().includes("free"))      return false;
      if (activeFilter === "workshop"  && !item.ticketType.toLowerCase().includes("workshop"))  return false;
      if (activeFilter === "intensive" && !item.ticketType.toLowerCase().includes("intensive")) return false;
      if (activeFilter === "today" && item.day !== DAY_FULL[new Date().getDay()])               return false;
      if (activeDayFilter && item.day !== activeDayFilter)                                      return false;
      if (activeTheme && item.theme !== activeTheme)                                            return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    })
    // Sort by next occurrence: Today's classes first, then tomorrow's, etc.
    .sort((a, b) => {
      const todayIdx = new Date().getDay();
      const dA = ((DAY_INDEX[a.day] ?? 0) - todayIdx + 7) % 7;
      const dB = ((DAY_INDEX[b.day] ?? 0) - todayIdx + 7) % 7;
      return dA - dB;
    });

  const registeredInView = classes.filter((c) => registeredIds.includes(c.id));

  const tierButtons = [
    { id: "all",       label: `All ${classes.length} Classes` },
    ...(showTodayFilter ? [{ id: "today", label: "Today", icon: <Zap className="inline mr-1" size={16} /> }] : []),
    { id: "free",      label: "Free" },
    { id: "workshop",  label: "Workshops ($10�$25)" },
    { id: "intensive", label: "Intensives ($25–$50)" },
  ];

  return (
    <>
      {/* ── Registered schedule ── */}
      {registeredInView.length > 0 && (
        <div className="bg-[#C9A84C]/5 mb-10 p-6 border border-[#C9A84C]">
          <h2 className="mb-4 font-mono text-[#4B1E91] text-xs uppercase tracking-widest">
            Your Registered Schedule ({registeredInView.length})
          </h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {registeredInView.map((item) => (
              <div key={item.id} className="flex flex-col justify-between bg-white p-4 border border-[#C9A84C]/30">
                <div>
                  <span
                    className="px-1.5 py-0.5 border font-mono font-bold text-xs uppercase tracking-wider"
                    style={{ background: "#4B1E91", color: "#ffffff", borderColor: "#4B1E91" }}
                  >
                    {item.ticketType}
                  </span>
                  <h4 className="mt-2 font-bold text-[#0A1128] text-sm line-clamp-1">{item.title}</h4>
                  <p className="mt-1 font-mono text-neutral-400 text-xs flex items-center gap-1 flex-wrap">
                    <Calendar className="inline" size={16} /> {item.day}, {MONTH_SHORT[getNextSession(item.day).getMonth()]} {getNextSession(item.day).getDate()} · <Clock className="inline" size={16} /> {item.time}
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <a
                    href={buildCalendarLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#C9A84C] hover:text-[#b8933e] text-xs hover:underline uppercase"
                  >
                     Add to Calendar
                  </a>
                  <button
                    onClick={() => handleCancel(item.id)}
                    className="font-mono text-red-400 text-xs hover:underline uppercase"
                  >
                    Cancel 
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weekly Timeline ── */}
      {showTodayFilter && (
        <WeeklyTimeline
          classes={classes}
          activeDay={activeDayFilter}
          onDayClick={setActiveDayFilter}
        />
      )}

      {/* ── Filters ── */}
      <div className="space-y-6 mb-10">
        <div className="flex lg:flex-row flex-col justify-between lg:items-end gap-6">
          {/* Search */}
          <div className="w-full lg:max-w-md">
            <label className="block mb-2 font-mono text-[#4B1E91] text-xs uppercase tracking-wider">
              Search By Title or Content
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2.5 border border-neutral-200 focus:border-[#C9A84C] focus:outline-none focus:ring-[#C9A84C] focus:ring-2 w-full font-mono text-xs transition-colors placeholder-neutral-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="top-2.5 right-3 absolute font-mono text-neutral-400 hover:text-[#4B1E91] text-xs"
                >
                
                </button>
              )}
            </div>
          </div>

          {/* Tier filter */}
          <div className="w-full lg:w-auto">
            <label className="block mb-2 font-mono text-[#4B1E91] text-xs uppercase tracking-wider">
              Filter by Access Tier
            </label>
            <div className="flex flex-wrap gap-2">
              {tierButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  className={`px-3 py-1.5 border font-mono text-xs transition-colors duration-150 ${
                    activeFilter === btn.id
                      ? "bg-[#4B1E91] text-white border-[#4B1E91]"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-[#4B1E91] hover:text-[#4B1E91]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme filter */}
        {uniqueThemes.length > 1 && (
          <div className="pt-4 border-[#4B1E91]/10 border-t">
            <label className="block mb-2 font-mono text-[#4B1E91] text-xs uppercase tracking-wider">
              Filter by Learning Theme
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTheme(null)}
                className={`px-3 py-1 text-xs font-mono border rounded-full transition-colors ${
                  activeTheme === null
                    ? "bg-[#C9A84C] text-[#0A1128] border-[#C9A84C] font-bold"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-[#C9A84C] hover:text-[#0A1128]"
                }`}
              >
                All Themes
              </button>
              {uniqueThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-3 py-1 text-xs font-mono border rounded-full transition-colors ${
                    activeTheme === theme
                      ? "bg-[#C9A84C] text-[#0A1128] border-[#C9A84C] font-bold"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-[#C9A84C] hover:text-[#0A1128]"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filter summary bar */}
        {(searchTerm || activeFilter !== "all" || activeTheme || activeDayFilter) && (
          <div className="flex justify-between items-center bg-[#4B1E91]/5 px-4 py-2.5 border border-[#4B1E91]/15 font-mono text-xs">
            <p className="text-neutral-600">
              Found <span className="font-bold text-[#4B1E91]">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
              {activeFilter === "today" && " for today"}
              {activeDayFilter && ` for ${activeDayFilter}`}
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveFilter("all"); setActiveTheme(null); setActiveDayFilter(null); }}
              className="font-bold text-red-400 text-xs hover:underline uppercase"
            >
              <>Clear All <X className="inline ml-1" size={16} /></>
            </button>
          </div>
        )}
      </div>

      {/* ── Class Grid ── */}
      {filtered.length > 0 ? (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ClassCard
              key={item.id}
              item={item}
              isRegistered={registeredIds.includes(item.id)}
              onRegister={() => setModalClass(item)}
              onCancel={() => handleCancel(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 border border-[#C9A84C]/30 border-dashed text-center">
          <p className="mb-3 font-mono text-neutral-400 text-sm">No classes match your current filters.</p>
          <button
            onClick={() => { setSearchTerm(""); setActiveFilter("all"); setActiveTheme(null); }}
            className="font-mono text-[#4B1E91] hover:text-[#C9A84C] text-xs underline uppercase"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Registration Modal (embedded Google Form) ── */}
      {modalClass && (
        <RegistrationFormModal
          classItem={modalClass}
          onClose={() => setModalClass(null)}
          onComplete={handleComplete}
        />
      )}
    </>
  );
};

export default ClassSearch;
