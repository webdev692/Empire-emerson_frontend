import React from "react";
import { useFormModal } from "./FormModalContext";
import careerBg from "../../assets/CareerSupportBackground.png";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const ic = "w-5 h-5";

const ResumeIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h8M8 9h2" />
  </svg>
);
const MailIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
const LinkedInIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const ChatIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SearchIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const SparkleIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.6 4.9L18.5 9.5 13.6 11.1 12 16l-1.6-4.9L5.5 9.5l4.9-1.6z" /><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </svg>
);
const CompassIcon = (
  <svg viewBox="0 0 24 24" className={ic} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
  </svg>
);

const rowOne = [
  { title: "Resume Support", desc: "Build or refine a clear, results-focused resume.", icon: ResumeIcon },
  { title: "Cover Letter Support", desc: "Craft cover letters tailored to specific roles.", icon: MailIcon },
  { title: "LinkedIn Profile Support", desc: "Strengthen your profile to be found by recruiters.", icon: LinkedInIcon },
];

const rowTwo = [
  { title: "Interview Preparation", desc: "Practice common questions and refine your responses.", icon: ChatIcon },
  { title: "Job Search Support", desc: "Build a focused, organized job search strategy.", icon: SearchIcon },
  { title: "Professional Development Coaching", desc: "Grow skills, confidence, and long-term career goals.", icon: SparkleIcon },
  { title: "Career Change Support", desc: "Explore new directions and plan a thoughtful transition.", icon: CompassIcon },
];

const Card: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="bg-white shadow-[0_2px_14px_rgba(40,50,30,0.06)] p-6 rounded-2xl">
    <span className="flex justify-center items-center bg-[#E5EDE2] mb-5 rounded-full w-10 h-10 text-[#3E5C44]">
      {icon}
    </span>
    <h3 className="mb-2 font-bold text-[#1A2620] text-[15px]">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const CareerServices: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section
      id="services"
      className="relative bg-[#041814] px-4 py-20 sm:py-28 overflow-hidden text-white"
      style={{
        backgroundImage: `url(${careerBg})`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#03110f]/70" />
      <div className="relative mx-auto max-w-278.5">
        <p className="mb-3 text-[#C9A84C]/90 text-lg uppercase tracking-[0.25em] font-bold">
          Career Services
        </p>
        <h2 className="mb-6 max-w-3xl font-bold text-white text-4xl sm:text-5xl tracking-tight heading">
          Practical, <span className="text-[#C9A84C] italic">one-on-one</span> career support.
        </h2>
        <p className="mb-12 max-w-xl text-white/70 text-base leading-relaxed">
          Personalized services to help you take the next step in your career with clarity and confidence.
        </p>

        <div className="gap-6 grid sm:grid-cols-3 mb-8">
          {rowOne.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>

        <div className="gap-6 grid sm:grid-cols-2 mb-12 max-w-190">
          {rowTwo.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>

        <button
          onClick={() => openForm(FORM_SERVICES, "Request Services", "Career & professional support services")}
          className="bg-[#C9A84C] hover:bg-[#bda55f] px-8 py-3.5 rounded-full font-semibold text-[#07120f] text-sm uppercase tracking-[0.18em] transition duration-200 cursor-pointer hover:bg-[#ffffff] hover:text-[#07120f] hover:border hover:border-[#07120f] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          Request Services
        </button>

        <p className="mt-10 max-w-3xl text-white/60 text-sm leading-relaxed">
          Classes are for general educational purposes only and do not constitute career counseling,
          legal, financial, tax, or insurance advice. Individualized support may be requested separately.
        </p>
      </div>
    </section>
  );
};

export default CareerServices;
