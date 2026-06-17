import React from 'react';
import { Helena, HelenaAvif, HelenaWebp } from '../../assets';

const Hero: React.FC = () => {
  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6">

          <div className="sm:w-1/2 w-full">
            <div className="relative flex items-center mb-4">
              <div className="flex items-center w-full">
                <span className="flex-1 bg-[#C9A84C]/30 h-px" />
              </div>
              <p className="absolute left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-[#12022A]/70 font-semibold">
                The Emerson Empire
              </p>
            </div>

            <h1 className="mb-4 font-black text-[#12022A] text-2xl sm:text-3xl leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Your bridge from ambition to actual impact.
            </h1>

            <p className="mb-6 text-[#12022A]/75 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We connect individuals, families, students, entrepreneurs, and small businesses with practical support, career readiness, financial education, and business guidance all in one place.
            </p>

            <div className="flex items-center gap-3">
              <a href="/services" className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-4 py-2 rounded-sm font-bold text-white text-sm uppercase tracking-[0.12em] transition-colors duration-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Request Services
              </a>
            </div>
          </div>

          <div className="sm:w-1/2 w-full flex justify-end">
            <div className="relative bg-[#12022A] shadow-md rounded-lg w-full sm:w-[220px] h-36 overflow-hidden">
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
      </div>
    </section>
  );
};

export default Hero;
