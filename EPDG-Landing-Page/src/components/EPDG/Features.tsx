import React from "react";

const iconClass = "w-8 h-8";

const topRow = [
  {
    label: "21 WEEKLY CLASSES",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "CAREER READINESS",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <polyline points="9 14 11.5 16.5 15.5 11.5" />
      </svg>
    ),
  },
  {
    label: "RESUME & LINKEDIN",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "INTERVIEW PREP",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
];

const bottomRow = [
  {
    label: "INTERNSHIP PROGRAM",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    ),
  },
  {
    label: "WORKFORCE TRAINING",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </svg>
    ),
  },
  {
    label: "ORG PARTNERSHIPS",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </svg>
    ),
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-[#044E37] py-12 px-4 border-b border-[#C9A84C]/20">
      <div className="max-w-5xl mx-auto text-white">
        {/* Top row — 4 items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center mb-10">
          {topRow.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-3">
              <div className="text-[#C9A84C]">{f.icon}</div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/80">
                {f.label}
              </p>
            </div>
          ))}
        </div>
        {/* Divider */}
        <div className="border-t border-white/10 mb-10" />
        {/* Bottom row — 3 items centered */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-center">
          {bottomRow.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-3">
              <div className="text-[#C9A84C]">{f.icon}</div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/80">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
