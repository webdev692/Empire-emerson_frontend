import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModal";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

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
  const navigate = useNavigate();

  return (
    <section className="bg-[#FCF5E9] px-4 pt-4 pb-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 font-bold text-[#B8943D] text-xs uppercase tracking-[0.25em]">
          Weekly Classes
        </p>
        <h2 className="mb-5 max-w-3xl font-bold text-[#0B2018] text-4xl sm:text-5xl heading">
          21 weekly group classes, <span className="text-[#0B5C3B] italic">every week.</span>
        </h2>
        <p className="mb-12 max-w-2xl text-gray-600 text-base leading-relaxed">
          EPDG offers 21 weekly group classes designed for students, job seekers, workers, and
          lifelong learners. Each class includes curriculum, a quiz, workbook, worksheets,
          activities, an in-depth overview, and hands-on help.
        </p>

        {/* Session cards */}
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-3 mb-12">
          {sessions.map((s) => (
            <div
              key={s.time}
              className="bg-white shadow-sm border border-gray-200/70 rounded-2xl overflow-hidden"
            >
              <div className="bg-[#F4EEDD] px-6 py-3 border-gray-200/60 border-b">
                <p className="font-medium text-gray-500 text-sm">{s.duration}</p>
              </div>
              <div className="px-6 py-6">
                <p className="mb-2 font-bold text-[#0B2018] text-2xl heading">{s.time}</p>
                <p className="text-gray-500 text-sm">{s.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature checklist */}
        <div className="gap-x-12 gap-y-4 grid grid-cols-1 sm:grid-cols-2 mb-12 max-w-2xl">
          <ul className="space-y-4">
            {featuresLeft.map((f) => (
              <li key={f} className="flex items-center gap-3 text-gray-700 text-[15px]">
                <Check /> {f}
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {featuresRight.map((f) => (
              <li key={f} className="flex items-center gap-3 text-gray-700 text-[15px]">
                <Check /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2 bg-[#0B5C3B] hover:bg-[#094a30] px-7 py-3.5 rounded-lg font-semibold text-white text-[15px] transition-all duration-200 cursor-pointer"
          >
            Register for Weekly Classes <span aria-hidden>→</span>
          </button>
          <button
            onClick={() => openForm(FORM_SERVICES, "Ask about a Fee Waiver", "Reduced cost & fee waiver options")}
            className="bg-white hover:bg-gray-50 px-7 py-3.5 border border-gray-300 hover:border-[#0B5C3B] rounded-lg font-semibold text-[#0B2018] text-[15px] transition-all duration-200 cursor-pointer"
          >
            Ask about a Fee Waiver
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClassHighlight;
