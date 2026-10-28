import { publicIntakeEnabled } from '../../../../shared/public-intake';
import { intakeHref } from '../../../../shared/development-preview';
import { integratedPreview } from '../../../../shared/development-preview';
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModalContext";

const FORM_FEE_WAIVER = intakeHref("https://forms.gle/fWm9gHownQeorkNn7");

const legacySessions = [
  { duration: "60 minutes", time: "10 AM Eastern", price: "Free" },
  { duration: "90 minutes", time: "2 PM Eastern", price: "$10 USD or fee waiver" },
  { duration: "2 hours", time: "7 PM Eastern", price: "$20 USD or fee waiver" },
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
  const sessions = integratedPreview && !publicIntakeEnabled ? [{duration:"Free community education",time:"Free",price:"7 documented class descriptions"},{duration:"Low-cost workshops",time:"Price by inquiry",price:"6 listings; numeric prices not supplied"},{duration:"Low-cost intensives",time:"Price by inquiry",price:"6 listings; numeric prices not supplied"}] : legacySessions;

  return (
    <section className="bg-[#FCF5E9] px-4 pt-10 pb-20 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-278.5">
        <p className="mb-3 text-[#8c7434] text-lg uppercase tracking-[0.28em] font-bold">
          Daily Classes
        </p>
        <h2 className="mb-6 max-w-3xl font-bold text-[#0B2018] text-4xl sm:text-5xl tracking-tight heading">
          {publicIntakeEnabled ? <>Daily classes, <span className="text-[#0B5C3B] italic">every day.</span></> : integratedPreview ? <>Explore the class curriculum, <span className="text-[#0B5C3B] italic">at your own pace.</span></> : <>21 weekly group classes, <span className="text-[#0B5C3B] italic">every week.</span></>}
        </h2>
        <p className="mb-14 max-w-2xl text-[#4f4c42] text-base leading-relaxed">
          {publicIntakeEnabled ? "Join a free 60-minute class at 10 AM Eastern, a 90-minute workshop at 2 PM for $10 USD or fee waiver, or a two-hour intensive at 7 PM for $20 USD or fee waiver. Register through the class Google Form." : integratedPreview ? "Explore 19 sourced class descriptions and two additional intern curriculum topics. Dates, capacity and registration are not confirmed. Free and low-cost class types are identified separately; optional career services have their own planning estimates." : "EPDG offers 21 weekly group classes designed for students, job seekers, workers, and lifelong learners. Each session includes curriculum, a quiz, a workbook, worksheets, activities, and guided hands-on support."}
        </p>

        <div className="gap-6 grid sm:grid-cols-3 mb-12">
          {sessions.map((s) => (
            <div key={s.duration} className="bg-white shadow-[0_16px_50px_rgba(14,19,11,0.08)] p-7 border border-[#d7ceb7] rounded-4xl">
              <span className="inline-flex bg-[#f4edda] px-3 py-2 rounded-full font-semibold text-[#000000] text-[13px] uppercase tracking-[0.2em]">
                {s.duration}
              </span>
              <p className="mt-6 mb-1 font-bold text-[#0B2018] text-3xl">{s.time}</p>
              <p className="text-[#5b5a50] text-sm">{s.price}</p>
            </div>
          ))}
        </div>

        <div className="gap-2.5 grid sm:grid-cols-2 mb-12 max-w-3xl">
          {(integratedPreview && !publicIntakeEnabled ? ["Public class descriptions", "Intended audiences", "Learning outcomes", "Free / low-cost distinctions", "Educational qualifications", "Inquiry by email"] : [...featuresLeft, ...featuresRight]).map((f) => (
            <div key={f} className="flex items-start gap-3">
              <Check />
              <p className="text-[#4f4c42] text-sm leading-relaxed">{f}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/classes")}
            className="bg-[#0B5C3B] hover:bg-[#094a30] px-8 py-3.5 rounded-full font-semibold text-white text-sm uppercase tracking-[0.16em] transition duration-200 cursor-pointer"
          >
            {integratedPreview && !publicIntakeEnabled ? "Browse existing class topics" : "Register for daily classes"}
          </button>
          <button
            onClick={() => integratedPreview && !publicIntakeEnabled ? navigate("/services-pricing#access-options") : openForm(FORM_FEE_WAIVER, "Ask about a Fee Waiver", "Reduced cost & fee waiver options")}
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
