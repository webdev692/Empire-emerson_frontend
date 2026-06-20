import React from "react";
import { useFormModal } from "./FormModal";
import logo from "../../assets/EPDG_LOGO.webp";
import biz from "../../assets/bussines.png";

const FORM_CLASSES  = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

/* ── Small gold-ringed pillar icons (Learn / Grow / Lead) ─────────────── */
const pillars = [
  {
    label: "Learn.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15a1 1 0 0 0-1-1H4a2 2 0 0 1-2-2z" />
        <path d="M22 5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v15a1 1 0 0 1 1-1h7a2 2 0 0 0 2-2z" />
      </svg>
    ),
  },
  {
    label: "Grow.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c0-6 0-9 0-9" />
        <path d="M12 13c-4 0-7-2-7-7 4 0 7 2 7 7z" />
        <path d="M12 11c0-3 2-6 6-6 0 3-2 6-6 6z" />
      </svg>
    ),
  },
  {
    label: "Lead.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 20 9-15 9 15z" />
        <path d="M8.5 12.5 12 7l3.5 5.5" />
      </svg>
    ),
  },
];

/* ── Recreated "Our Mission" banner ───────────────────────────────────── */
const MissionBanner: React.FC = () => (
  <div className="relative bg-gradient-to-br from-[#0B3D2B] via-[#0A3324] to-[#072018] shadow-2xl mx-auto p-1 border border-[#C9A84C]/40 rounded-2xl max-w-5xl overflow-hidden">
    <div className="relative gap-6 grid md:grid-cols-2 p-7 sm:p-9 rounded-xl overflow-hidden">
      {/* Decorative gold swoosh */}
      <svg className="-z-0 absolute inset-0 w-full h-full" viewBox="0 0 800 360" preserveAspectRatio="none" fill="none">
        <path d="M380 -40 C 560 120, 360 300, 560 420" stroke="#C9A84C" strokeWidth="2.5" opacity="0.55" />
        <path d="M420 -40 C 600 120, 400 300, 600 420" stroke="#C9A84C" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Left — text */}
      <div className="z-10 relative">
        <div className="flex items-center gap-3 mb-5">
          <img src={logo} alt="EPDG" className="w-12 h-12" />
          <div className="leading-tight">
            <p className="font-bold text-white text-xl heading">Emerson</p>
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.18em]">
              Professional Development Group · EPDG
            </p>
          </div>
        </div>

        <h2 className="mb-3 font-bold text-[#C9A84C] text-4xl sm:text-5xl heading">Our Mission</h2>

        <p className="mb-6 max-w-md text-white/85 text-sm leading-relaxed">
          Emerson Professional Development Group equips students, professionals, and emerging
          leaders with education, training, and development pathways that strengthen skills,
          confidence, and opportunity.
        </p>

        <div className="flex items-center gap-6">
          {pillars.map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className="flex justify-center items-center border border-[#C9A84C]/60 rounded-full w-9 h-9 text-[#C9A84C]">
                {p.icon}
              </span>
              <span className="font-semibold text-white text-sm">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — framed image */}
      <div className="z-10 relative hidden md:block">
        <div className="relative shadow-lg border-2 border-[#C9A84C]/50 rounded-xl h-full min-h-56 overflow-hidden">
          <img src={biz} alt="Professional development at EPDG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0B3D2B]/15" />
        </div>
      </div>
    </div>
  </div>
);

const Hero: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="home" className="bg-gradient-to-b from-[#0B3D2B] to-[#072018] px-4 pt-10 pb-16">
      <div className="mx-auto max-w-6xl">
        <MissionBanner />

        {/* Hero copy */}
        <div className="mt-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-[#C9A84C]/40 rounded-full font-medium text-[#C9A84C] text-xs tracking-wide">
            <span className="text-sm">✦</span> Now enrolling for weekly classes
          </span>

          <h1 className="mb-6 font-bold text-white text-6xl sm:text-7xl leading-none tracking-tight heading">
            Learn. <span className="text-[#C9A84C] italic">Grow.</span> Lead.
          </h1>

          <p className="mb-9 max-w-xl text-white/80 text-lg leading-relaxed">
            Classes, career readiness, internships, and professional development for students,
            job seekers, workers, and organizations.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => openForm(FORM_CLASSES, "Register for a Class", "Free & low-cost weekly classes")}
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] px-7 py-3.5 rounded-lg font-semibold text-[#0B3D2B] text-[15px] transition-all duration-200 cursor-pointer"
            >
              Register for a Class <span aria-hidden>→</span>
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request Career Support", "Resume, coaching, interview prep & more")}
              className="bg-transparent hover:bg-white/5 px-7 py-3.5 border border-white/40 hover:border-[#C9A84C]/70 rounded-lg font-semibold text-white text-[15px] transition-all duration-200 cursor-pointer"
            >
              Request Career Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
