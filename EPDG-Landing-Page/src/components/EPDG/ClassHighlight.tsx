import React from "react";
import { useFormModal } from "./FormModal";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";
const CLASS_REGISTRATION_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform"

const sessions = [
  { duration: "60 minutes", time: "10 AM EDT", price: "Free" },
  { duration: "90 minutes", time: "2 PM EDT", price: "$10 (fee waiver available)" },
  { duration: "2 hours", time: "7 PM EDT", price: "$20 (fee waiver available)" },
];

const featuresLeft = ["Curriculum", "Workbook", "Activities", "Hands-on help"];
const featuresRight = ["Quiz", "Worksheets", "In-depth overview"];

const Check: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0B5C3B] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

const ClassHighlight: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="classes" className="bg-[#FCF5E9] px-4 pt-10 pb-20 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-278.5">
        <p className="mb-3 text-[#8c7434] text-lg uppercase tracking-[0.28em] font-bold">
          Weekly Classes
        </p>
        <h2 className="mb-6 max-w-3xl font-bold text-[#0B2018] text-4xl sm:text-6xl tracking-tight heading">
          21 weekly group classes, <span className="text-[#0B5C3B] italic">every week.</span>
        </h2>
        <p className="mb-14 max-w-2xl text-[#4f4c42] text-base leading-relaxed">
          EPDG offers 21 weekly group classes designed for students, job seekers, workers, and lifelong learners. Each session includes curriculum, a quiz, a workbook, worksheets, activities, and guided hands-on support.
        </p>

        <div className="gap-6 grid sm:grid-cols-3 mb-12">
          {sessions.map((s) => (
            <div key={s.time} className="bg-white shadow-[0_16px_50px_rgba(14,19,11,0.08)] p-7 border border-[#d7ceb7] rounded-4xl">
              <span className="inline-flex bg-[#f4edda] px-3 py-2 rounded-full font-semibold text-[#000000] text-[13px] uppercase tracking-[0.2em]">
                {s.duration}
              </span>
              <p className="mt-6 mb-1 font-bold text-[#0B2018] text-3xl">{s.time}</p>
              <p className="text-[#5b5a50] text-sm">{s.price}</p>
            </div>
          ))}
        </div>

        <div className="gap-2.5 grid sm:grid-cols-2 mb-12 max-w-3xl">
          {[...featuresLeft, ...featuresRight].map((f) => (
            <div key={f} className="flex items-start gap-3">
              <Check />
              <p className="text-[#4f4c42] text-sm leading-relaxed">{f}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => openForm(CLASS_REGISTRATION_FORM, "Register for a Class")}
            className="bg-[#013F0B] hover:bg-[#094a30] px-8 py-3.5 rounded-full font-semibold text-white text-sm uppercase tracking-[0.16em] transition duration-200 cursor-pointer"
          >
            Register for weekly classes
          </button>
          <button
            onClick={() => openForm(FORM_SERVICES, "Ask about a Fee Waiver", "Reduced cost & fee waiver options")}
            className="bg-white hover:bg-[#f7f2e8] px-8 py-3.5 border border-[#b0a57f] rounded-full font-semibold text-[#0B2018] text-sm uppercase tracking-[0.16em] transition duration-200 cursor-pointer"
          >
            Ask about a fee waiver
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClassHighlight;
