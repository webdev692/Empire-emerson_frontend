import React from 'react';
import { BookOpen, Handshake, HeartHandshake } from 'lucide-react';
import { Helena, HelenaAvif, HelenaWebp } from '../../assets';

const FEATURES = [
  { icon: BookOpen,      title: 'EDUCATION', subtitle: 'Learning for Every Stage' },
  { icon: Handshake,     title: 'RESOURCES', subtitle: 'Tools and Connections'    },
  { icon: HeartHandshake, title: 'SUPPORT',   subtitle: 'Guidance Every Step'      },
];

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white pt-20 w-full overflow-hidden">
      {/* Soft warm glow behind the portrait */}
      <div
        className="top-0 right-0 absolute w-[55%] h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 55% at 70% 35%, rgba(201,168,76,0.34) 0%, rgba(201,168,76,0.16) 35%, rgba(255,255,255,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex lg:flex-row flex-col-reverse items-center gap-12 lg:gap-16 mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20 max-w-7xl">

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col justify-center lg:w-1/2 text-left">

          {/* Headline */}
          <h1
            className="mb-5 font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="block text-[#12022A]">Welcome to</span>
            <span className="block text-[#C9A84C]">The Emerson Empire</span>
          </h1>

          {/* Gold line — star — gold line */}
          <div className="flex items-center gap-3 mb-7">
            <span className="bg-[#C9A84C] w-14 h-px" />
            <span className="text-[#C9A84C] text-sm leading-none">★</span>
            <span className="bg-[#C9A84C] w-14 h-px" />
          </div>

          {/* Subtitle */}
          <p
            className="mb-9 max-w-lg text-[#12022A]/75 text-base leading-[1.9]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The Emerson Empire connects people, students, families, workers,
            entrepreneurs, and community partners with education, resources,
            services, and support pathways.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="/about"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C97A] px-7 py-3.5 rounded-md font-bold text-[#12022A] text-sm transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Start Here <span aria-hidden="true">→</span>
            </a>
            <a
              href="/services"
              className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-7 py-3.5 rounded-md font-bold text-white text-sm transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Find Emerson Services
            </a>
          </div>

          {/* Divider above features */}
          <div className="bg-[#C9A84C]/25 mb-7 w-full max-w-md h-px" />

          {/* Feature columns */}
          <div className="gap-6 grid grid-cols-3 max-w-md">
            {FEATURES.map(({ icon: Icon, title, subtitle }) => (
              <div key={title}>
                <Icon className="mb-2 text-[#C9A84C]" size={22} strokeWidth={1.5} />
                <p
                  className="font-bold text-[#C9A84C] text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {title}
                </p>
                <p
                  className="mt-1 text-[#12022A]/60 text-[11px] leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Portrait ── */}
        <div className="flex justify-center w-full lg:w-1/2">
          <div className="relative w-full sm:w-[80%] lg:w-[90%] h-[400px] sm:h-[480px] lg:h-[540px]">

            {/* Gold diagonal accent lines, top-right corner */}
            <svg
              className="-top-2 -right-2 z-10 absolute pointer-events-none"
              width="110" height="110" viewBox="0 0 110 110" fill="none" aria-hidden="true"
            >
              <line x1="110" y1="20" x2="20" y2="110" stroke="#C9A84C" strokeWidth="1.5" />
              <line x1="110" y1="42" x2="42" y2="110" stroke="#C9A84C" strokeWidth="1.5" />
              <line x1="110" y1="64" x2="64" y2="110" stroke="#C9A84C" strokeWidth="1.5" />
            </svg>

            <div className="relative bg-[#12022A] shadow-2xl rounded-2xl w-full h-full overflow-hidden">
              <picture>
                <source srcSet={HelenaAvif} type="image/avif" />
                <source srcSet={HelenaWebp} type="image/webp" />
                <img
                  src={Helena}
                  alt="The Emerson Empire founder"
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-top object-cover"
                />
              </picture>

              {/* Rising stock-chart with upward arrow, bottom-right */}
              <svg
                className="right-0 bottom-5 absolute opacity-60 pointer-events-none"
                width="150" height="90" viewBox="0 0 150 90" fill="none" aria-hidden="true"
              >
                {/* Ascending bars */}
                <rect x="2"   y="66" width="16" height="24" fill="#C9A84C" fillOpacity="0.35" />
                <rect x="26"  y="54" width="16" height="36" fill="#C9A84C" fillOpacity="0.45" />
                <rect x="50"  y="42" width="16" height="48" fill="#C9A84C" fillOpacity="0.55" />
                <rect x="74"  y="28" width="16" height="62" fill="#C9A84C" fillOpacity="0.65" />
                <rect x="98"  y="16" width="16" height="74" fill="#C9A84C" fillOpacity="0.8" />
                {/* Upward trend arrow */}
                <path d="M6 70 L42 50 L74 56 L124 14" stroke="#E8C97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M124 14 L106 16 M124 14 L122 32" stroke="#E8C97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
