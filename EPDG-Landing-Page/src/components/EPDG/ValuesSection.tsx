import React from "react";
import logo from "../../assets/EPDG_LOGO.webp";

const iconCls = "w-6 h-6";

const values = [
  {
    label: "Access",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18" />
        <path d="M3 22h18" />
        <circle cx="15" cy="12" r="1" />
      </svg>
    ),
  },
  {
    label: "Growth",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V11" />
        <path d="M12 11C8 11 5 9 5 4c5 0 7 2 7 7z" />
        <path d="M12 9c0-3 2-5 5-5 0 3-2 5-5 5z" />
      </svg>
    ),
  },
  {
    label: "Professionalism",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Empowerment",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3" />
        <path d="M12 12v6M9 21l3-3 3 3" />
        <path d="M5 5 4 4M19 5l1-1M12 4V2" />
      </svg>
    ),
  },
  {
    label: "Lifelong Learning",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6s3-1.5 6-1.5S12 6 12 6v13s-1.5-1.5-4.5-1.5S2 19 2 19z" />
        <path d="M12 6s3-1.5 6-1.5S22 6 22 6v13s-1.5-1.5-4.5-1.5S12 19 12 19z" />
      </svg>
    ),
  },
  {
    label: "Community",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
        <path d="M15 20c0-2 .5-3 2-3.5" />
      </svg>
    ),
  },
];

const ValuesSection: React.FC = () => (
  <section className="bg-[#F7F2E6] px-4 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="relative bg-gradient-to-br from-[#0B3D2B] via-[#0A3324] to-[#072018] shadow-2xl p-1 border border-[#C9A84C]/40 rounded-2xl overflow-hidden">
        <div className="relative px-8 sm:px-12 py-12 rounded-xl overflow-hidden">
          {/* Decorative gold swooshes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none">
            <path d="M-50 360 C 250 240, 250 60, 600 -40" stroke="#C9A84C" strokeWidth="2.5" opacity="0.5" />
            <path d="M-50 400 C 280 280, 300 100, 660 -20" stroke="#C9A84C" strokeWidth="1" opacity="0.28" />
          </svg>

          <div className="z-10 relative flex flex-col items-center text-center">
            <img src={logo} alt="EPDG" className="mb-4 w-14 h-14" />
            <p className="mb-1 font-semibold text-white text-sm uppercase tracking-[0.2em]">Our</p>
            <h2 className="mb-5 font-bold text-[#C9A84C] text-5xl sm:text-6xl italic heading">Values</h2>

            <p className="mb-10 max-w-xl text-white/85 text-base leading-relaxed">
              We value access, growth, professionalism, empowerment, lifelong learning, and
              community-centered support.
            </p>

            {/* Value icons */}
            <div className="gap-x-6 gap-y-8 grid grid-cols-3 lg:grid-cols-6 w-full">
              {values.map((v) => (
                <div key={v.label} className="flex flex-col items-center gap-3">
                  <span className="flex justify-center items-center border border-[#C9A84C]/60 rounded-full w-14 h-14 text-[#C9A84C]">
                    {v.icon}
                  </span>
                  <span className="font-semibold text-white/90 text-[11px] uppercase tracking-[0.12em] leading-tight">
                    {v.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ValuesSection;
