import React, { useState } from "react";
import { classes } from "./classData";
import { useFormModal } from "./FormModal";

const FORM_CLASSES  = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FORM_FEE_WAIVER = "https://forms.gle/fWm9gHownQeorkNn7";

const days = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const tierLabels: Record<string, string> = {
  "Free Classes": "Free General Admission",
  "Paid Workshops": "Low-Cost Workshop",
  "Paid Intensives": "Low-Cost Intensive",
};

const timeValue = (time: string): number => {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let hours = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + parseInt(m[2], 10);
};

const sortedClasses = [...classes].sort(
  (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || timeValue(a.time) - timeValue(b.time)
);

const WeeklyClasses: React.FC = () => {
  const [activeDay, setActiveDay] = useState("All Days");
  const { openForm } = useFormModal();

  const filtered =
    activeDay === "All Days" ? sortedClasses : sortedClasses.filter((c) => c.day === activeDay);
 
  return (
    <section id="classes" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-278.5">
        <p className="mb-2 font-bold text-[#C9A84C] text-[13px] uppercase tracking-[0.25em]">
          Weekly Class Series
        </p>
        <h2 className="mb-3 font-bold text-black text-3xl md:text-4xl uppercase tracking-tight">
          21 Free &amp; Low-Cost Online Classes
        </h2>
        <div className="bg-[#041913] mb-5 rounded w-12 h-0.5" />
        <p className="mb-10 max-w-7xl text-gray-500 text-sm md:text-base leading-relaxed">
          Classes are hosted weekly on Google Meet. Free sessions run at 10 AM EDT.
          Low-cost workshops and intensives are available at 2 PM and 7 PM EDT. Fee waivers are
          available for paid classes.
        </p>

        <div className="flex flex-wrap gap-2 mb-10 rounded">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
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

        <div className="items-start gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex flex-col bg-white shadow-sm border border-gray-100 rounded-xl h-96 overflow-y-scroll"
              style={{ borderTop: "3px solid #041913" }}
            >
              <div className="flex justify-between items-center gap-2 bg-[#041913] px-5 py-3">
                <p className="font-bold text-[#C9A84C] text-sm uppercase tracking-wider">
                  {c.day} · {c.time}
                </p>
                <span className="bg-[#C9A84C] px-2.5 py-0.5 font-bold text-[#022B1F] text-sm uppercase tracking-wider">
                  {c.price === 0 ? "Free" : `$${c.price}`}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3 className="mb-1.5 font-bold text-[#041913] text-[16px] leading-snug">
                  {c.title}
                </h3>
                <p className="mb-2 font-medium text-gray-400 text-sm uppercase tracking-wide">
                  {tierLabels[c.ticketType] ?? c.ticketType} · 2 hrs · Google Meet
                </p>
                <p className="flex-1 mb-5 text-[15px] text-black leading-relaxed">{c.description}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openForm(FORM_CLASSES, "Register for a Class", c.title)}
                    className="bg-[#C9A84C] hover:bg-[#bba963] px-4 py-2.5 font-bold text-[#022B1F] text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => openForm(FORM_FEE_WAIVER, "Request a Fee Waiver", c.title)}
                    className="px-4 py-2.5 border border-[#041913]/30 hover:border-[#041913] font-bold text-[#041913] text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    Fee Waiver
                  </button>
                </div>
              </div>
            </div>
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
