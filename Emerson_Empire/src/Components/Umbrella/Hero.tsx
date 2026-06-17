import React from 'react';
import { Helena, HelenaAvif, HelenaWebp } from '../../assets';

const Hero: React.FC = () => {
  return (
    <section className="bg-white pt-24 w-full">
      <div className="flex lg:flex-row flex-col-reverse items-center gap-12 lg:gap-16 mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-7xl">

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col justify-center lg:w-1/2 text-left">

          {/* Eyebrow */}
          <div className="relative flex items-center mb-6">
            <div className="flex items-center w-full">
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
              <span className="flex-1 bg-[#C9A84C]/40 h-px" />
              <span className="flex-1 bg-[#C9A84C]/40 h-px" />
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
              <svg width="28" height="28" className="shrink-0"><line x1="28" y1="0" x2="0" y2="28" stroke="#C9A84C" strokeWidth="1.5" /></svg>
            </div>
            <p
              className="left-1/2 absolute font-semibold text-[#12022A]/55 text-xs uppercase tracking-[0.3em] whitespace-nowrap -translate-x-1/2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The Emerson Empire
            </p>
          </div>

          {/* Headline */}
          <h1
            className="mb-6 font-black text-[#12022A] text-5xl md:text-6xl leading-[1.02] tracking-tight"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Your bridge from ambition to actual impact.
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-lg text-[#12022A]/70 text-base leading-[1.8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            We connect individuals, families, students, entrepreneurs, and small businesses with practical support, career readiness, financial education, and business guidanceall in one place.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="/services"
              className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-6 py-3 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Request Services
            </a>
          </div>
        </div>

        {/* ── RIGHT: Image preview card ── */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-[#12022A] shadow-lg rounded-2xl w-full sm:w-[70%] lg:w-[70%] h-72 sm:h-96 lg:h-120 overflow-hidden">
            <picture>
              <source srcSet={HelenaAvif} type="image/avif" />
              <source srcSet={HelenaWebp} type="image/webp" />
              <img
                src={Helena}
                alt="Emerson Empire founder"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-center object-cover"
              />
            </picture>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
