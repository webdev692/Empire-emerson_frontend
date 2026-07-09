import React, { useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaExternalLinkAlt,
  FaFilter,
  FaGraduationCap,
  FaHandsHelping,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import type { ClassItem } from "../data/classData";

const REGISTRATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FEE_WAIVER_URL = "https://forms.gle/fWm9gHownQeorkNn7";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDEX = DAY_ORDER.reduce<Record<string, number>>((acc, day, index) => {
  acc[day] = index;
  return acc;
}, {});

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function priceLabel(price: number) {
  return price === 0 ? "Free" : `$${price}`;
}

function tierLabel(item: ClassItem) {
  if (item.price === 0) return "Free 10 AM Class";
  if (item.price === 10) return "$10 Workshop";
  return "$20 Intensive";
}

function tierTone(item: ClassItem) {
  if (item.price === 0) return "bg-[#C9A84C] text-[#1C1336] border-[#C9A84C]";
  if (item.price === 10) return "bg-[#4B1E91] text-white border-[#4B1E91]";
  return "bg-[#1C1336] text-[#C9A84C] border-[#1C1336]";
}

function tierDescription(item: ClassItem) {
  if (item.price === 0) return "Open access, no cost to attend.";
  if (item.price === 10) return "Fee waiver available for participants who need assistance.";
  return "Deep-dive session with fee waiver access available.";
}

function getNextDate(dayName: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const targetIndex = DAY_INDEX[dayName] ?? 0;
  const diff = (targetIndex - todayIndex + 7) % 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next;
}

function formatNextDate(dayName: string) {
  const date = getNextDate(dayName);
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function parseStartHour(time: string) {
  if (time.startsWith("10:")) return 10;
  if (time.startsWith("2:")) return 14;
  if (time.startsWith("7:")) return 19;
  return 10;
}

function toCalendarTimestamp(date: Date, hour: number) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(hour).padStart(2, "0")}0000`;
}

function buildCalendarLink(item: ClassItem) {
  const date = getNextDate(item.day);
  const startHour = parseStartHour(item.time);
  const endDate = new Date(date);
  endDate.setHours(startHour, 0, 0, 0);
  endDate.setMinutes(endDate.getMinutes() + item.durationMinutes);

  const start = toCalendarTimestamp(date, startHour);
  const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}T${String(endDate.getHours()).padStart(2, "0")}${String(endDate.getMinutes()).padStart(2, "0")}00`;
  const title = encodeURIComponent(item.title);
  const details = encodeURIComponent(
    `${item.title}\n\nRecurring weekly session.\nTime: ${item.time}\nDuration: ${item.duration}\nPrice: ${priceLabel(item.price)}\n\nRegister: ${REGISTRATION_URL}\nFee waiver for paid classes: ${FEE_WAIVER_URL}`,
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}&ctz=America/New_York`;
}

function ClassCard({ item }: { item: ClassItem }) {
  const isPaid = item.price > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[#4B1E91]/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A84C]/70 hover:shadow-xl">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${tierTone(item)}`}>
            {tierLabel(item)}
          </span>
          <span className="rounded-full bg-[#4B1E91]/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#4B1E91]">
            {item.duration}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-[#C9A84C]">
          <FaGraduationCap />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#4B1E91]/70 line-clamp-1">
            {item.theme}
          </span>
        </div>

        <h3 className="mb-3 font-heading text-2xl font-black leading-tight text-[#1C1336]">
          {item.title}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-7 text-neutral-600">
          {item.description}
        </p>

        <div className="mb-5 grid gap-3 rounded-2xl bg-[#F8F5EE] p-4 text-sm text-[#1C1336]">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-[#4B1E91]" />
            <span><strong>Every {item.day}</strong> · Next session {formatNextDate(item.day)}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaClock className="text-[#4B1E91]" />
            <span>{item.time} · {item.duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaHandsHelping className="text-[#4B1E91]" />
            <span>{tierDescription(item)}</span>
          </div>
        </div>

        <div className="mt-auto grid gap-2">
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1C1336] transition-colors hover:bg-[#b8933e]"
          >
            Register for Class <FaExternalLinkAlt size={11} />
          </a>
          <div className={`grid gap-2 ${isPaid ? "sm:grid-cols-2" : ""}`}>
            {isPaid && (
              <a
                href={FEE_WAIVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4B1E91]/20 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B1E91] transition-colors hover:border-[#4B1E91] hover:bg-[#4B1E91] hover:text-white"
              >
                Fee Waiver <FaExternalLinkAlt size={10} />
              </a>
            )}
            <a
              href={buildCalendarLink(item)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/60 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#1C1336] transition-colors hover:bg-[#C9A84C]/15"
            >
              Add to Calendar <FaArrowRight size={10} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

interface ClassSearchProps {
  classes: ClassItem[];
}

const ClassSearch: React.FC<ClassSearchProps> = ({ classes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTier, setActiveTier] = useState("all");
  const [activeDay, setActiveDay] = useState("all");
  const [activeTheme, setActiveTheme] = useState("all");

  const themes = useMemo(() => Array.from(new Set(classes.map((item) => item.theme))), [classes]);

  const filtered = useMemo(() => {
    return classes
      .filter((item) => {
        if (activeTier === "free" && item.price !== 0) return false;
        if (activeTier === "workshop" && item.price !== 10) return false;
        if (activeTier === "intensive" && item.price !== 20) return false;
        if (activeDay !== "all" && item.day !== activeDay) return false;
        if (activeTheme !== "all" && item.theme !== activeTheme) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const daySort = (DAY_INDEX[a.day] ?? 0) - (DAY_INDEX[b.day] ?? 0);
        if (daySort !== 0) return daySort;
        return parseStartHour(a.time) - parseStartHour(b.time);
      });
  }, [activeDay, activeTheme, activeTier, classes, searchTerm]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTier("all");
    setActiveDay("all");
    setActiveTheme("all");
  };

  const tierButtons = [
    { id: "all", label: `All ${classes.length}` },
    { id: "free", label: "10 AM Free" },
    { id: "workshop", label: "2 PM $10" },
    { id: "intensive", label: "7 PM $20" },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-[#4B1E91]/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#4B1E91]">
              <FaFilter className="text-[#C9A84C]" /> Find the right class
            </p>
            <h2 className="font-heading text-3xl font-black text-[#1C1336]">Browse the weekly schedule</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Filter by day, price tier, or learning theme. All sessions are online in EDT, and paid sessions include a fee waiver option.
            </p>
          </div>
          <div className="rounded-2xl bg-[#1C1336] px-4 py-3 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C9A84C]">Correct weekly structure</p>
            <p className="text-sm text-white/75">10 AM free · 2 PM $10 · 7 PM $20</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_2fr]">
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B1E91]">Search classes</span>
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4B1E91]/40" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, topic, or skill..."
                className="w-full rounded-full border border-[#4B1E91]/15 bg-white py-3 pl-11 pr-10 text-sm text-[#1C1336] outline-none transition focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/30"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#4B1E91]"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </label>

          <div>
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B1E91]">Filter by access tier</span>
            <div className="flex flex-wrap gap-2">
              {tierButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setActiveTier(button.id)}
                  className={`rounded-full border px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition ${
                    activeTier === button.id
                      ? "border-[#4B1E91] bg-[#4B1E91] text-white"
                      : "border-[#4B1E91]/15 bg-white text-[#4B1E91] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B1E91]">Filter by day</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveDay("all")}
                className={`rounded-full border px-3 py-2 text-xs transition ${activeDay === "all" ? "border-[#C9A84C] bg-[#C9A84C] text-[#1C1336] font-bold" : "border-neutral-200 text-neutral-600 hover:border-[#C9A84C]"}`}
              >
                All Days
              </button>
              {DAY_ORDER.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${activeDay === day ? "border-[#C9A84C] bg-[#C9A84C] text-[#1C1336] font-bold" : "border-neutral-200 text-neutral-600 hover:border-[#C9A84C]"}`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B1E91]">Filter by learning theme</span>
            <select
              value={activeTheme}
              onChange={(event) => setActiveTheme(event.target.value)}
              className="w-full rounded-full border border-[#4B1E91]/15 bg-white px-4 py-3 text-sm text-[#1C1336] outline-none transition focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/30"
            >
              <option value="all">All learning themes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </label>
        </div>

        {(searchTerm || activeTier !== "all" || activeDay !== "all" || activeTheme !== "all") && (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#4B1E91]/10 bg-[#4B1E91]/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#4B1E91]">
              Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-red-500 hover:underline"
            >
              Clear filters <FaTimes />
            </button>
          </div>
        )}
      </section>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ClassCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#C9A84C]/60 bg-[#C9A84C]/5 py-16 text-center">
          <p className="mb-4 font-heading text-2xl font-bold text-[#1C1336]">No classes match these filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full bg-[#4B1E91] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3d1778]"
          >
            Reset class filters
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-[#C9A84C]/40 bg-[#FFF9E8] p-6 text-sm leading-7 text-[#1C1336]">
        <p className="font-heading text-xl font-bold">Fee waiver note</p>
        <p className="mt-2 text-neutral-700">
          Fee waivers are available for paid workshops and intensives. The waiver request is designed to be simple and does not ask for sensitive documents.
        </p>
      </div>
    </div>
  );
};

export default ClassSearch;
