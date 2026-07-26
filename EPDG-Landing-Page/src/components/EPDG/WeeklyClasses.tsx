import React, { useState } from "react";
import { classes } from "./classData";
import { useFormModal } from "./FormModalContext";

const FORM_CLASSES =
  "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FORM_FEE_WAIVER = "https://forms.gle/fWm9gHownQeorkNn7";

const days = [
  "All Days",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const tierLabels: Record<string, string> = {
  "Free Classes": "Free General Admission",
  "Paid Workshops": "Low-Cost Workshop",
  "Paid Intensives": "Low-Cost Intensive",
};

const timeValue = (time: string): number => {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number.parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number.parseInt(match[2], 10);
};

const sortedClasses = [...classes].sort(
  (a, b) =>
    dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) ||
    timeValue(a.time) - timeValue(b.time),
);

const WeeklyClasses: React.FC = () => {
  const [activeDay, setActiveDay] = useState("All Days");
  const { openForm } = useFormModal();

  const filtered =
    activeDay === "All Days"
      ? sortedClasses
      : sortedClasses.filter((classItem) => classItem.day === activeDay);

  return (
    <section id="classes" aria-labelledby="classes-title" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-278.5">
        <p className="mb-2 font-bold text-gold-on-light text-[13px] uppercase tracking-[0.25em]">
          Weekly Class Series
        </p>
        <h1
          id="classes-title"
          className="mb-3 font-bold text-black text-3xl md:text-4xl uppercase tracking-tight"
        >
          21 Free &amp; Low-Cost Online Classes
        </h1>
        <div className="bg-[#041913] mb-5 rounded w-12 h-0.5" />
        <p className="mb-4 max-w-7xl text-gray-600 text-sm md:text-base leading-relaxed">
          Classes are hosted weekly on Google Meet. Every day includes a free 60-minute session at
          10 AM EDT, a $10 90-minute workshop at 2 PM EDT, and a $20 two-hour intensive at 7 PM EDT.
        </p>
        <p className="mb-10 max-w-7xl text-gray-700 text-sm leading-relaxed">
          Fee waivers are available for paid classes. The waiver request does not ask for sensitive
          documents.
        </p>

        <div
          className="flex flex-wrap gap-2 mb-10 rounded"
          role="group"
          aria-label="Filter classes by day"
        >
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              aria-pressed={activeDay === day}
              className={`cursor-pointer text-sm font-bold uppercase tracking-widest px-5 py-2 transition-all duration-200 ${
                activeDay === day
                  ? "bg-[#041913] text-white"
                  : "bg-white border border-[#041913]/30 text-[#041913] hover:border-[#041913]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="items-stretch gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((classItem) => (
            <article
              key={classItem.id}
              className="flex flex-col bg-white shadow-sm border border-gray-100 rounded-xl h-full overflow-hidden"
              style={{ borderTop: "3px solid #041913" }}
            >
              <div className="flex justify-between items-center gap-2 bg-[#041913] px-5 py-3">
                <p className="font-bold text-[#C9A84C] text-sm uppercase tracking-wider">
                  {classItem.day} · {classItem.time}
                </p>
                <span className="bg-[#C9A84C] px-2.5 py-0.5 font-bold text-[#022B1F] text-sm uppercase tracking-wider">
                  {classItem.price === 0 ? "Free" : `$${classItem.price}`}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h2 className="mb-1.5 font-bold text-[#041913] text-[16px] leading-snug">
                  {classItem.title}
                </h2>
                <p className="mb-2 font-medium text-gray-500 text-sm uppercase tracking-wide">
                  {tierLabels[classItem.ticketType] ?? classItem.ticketType} · {classItem.duration} ·
                  Google Meet
                </p>
                <p className="flex-1 mb-5 text-[15px] text-black leading-relaxed">
                  {classItem.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() =>
                      openForm(FORM_CLASSES, "Register for a Class", classItem.title)
                    }
                    className="bg-[#C9A84C] hover:bg-[#bba963] px-4 py-2.5 font-bold text-[#022B1F] text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    Register
                  </button>
                  {classItem.price > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        openForm(FORM_FEE_WAIVER, "Request a Fee Waiver", classItem.title)
                      }
                      className="px-4 py-2.5 border border-[#041913]/30 hover:border-[#041913] font-bold text-[#041913] text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    >
                      Fee Waiver
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-14 max-w-7xl text-gray-800 text-sm leading-relaxed">
          Classes are for general educational purposes only and do not constitute career counseling,
          legal, financial, tax, or insurance advice. Individualized support may be requested
          separately through a consultation.
        </p>
      </div>
    </section>
  );
};

export default WeeklyClasses;
