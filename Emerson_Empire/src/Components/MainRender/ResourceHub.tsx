import React from 'react';
import { meeting } from '../../assets';

const ResourceHub: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="lg:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-[0_80px_120px_rgba(18,2,42,0.12)]">
              <img
                src={meeting}
                alt="Public resource hub"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <p className="mb-4 font-semibold text-[#C9A84C] text-xs uppercase tracking-[0.35em]">
              RESOURCES
            </p>
            <h2 className="mb-6 font-medium text-[#12022A] text-5xl lg:text-[3.5rem] leading-[1.05]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              A growing public resource hub
            </h2>
            <p className="mb-8 max-w-xl text-[#12022A]/75 text-lg leading-[1.85]" style={{ fontFamily: "'Inter', sans-serif" }}>
              The Emerson Empire is building a growing public resource hub to help people find educational, professional, financial, and community support resources. New resources are added as they are reviewed and organized.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-8 py-4 rounded-md font-semibold text-white text-sm uppercase tracking-[0.18em] transition-colors duration-200"
            >
              Request Guidance
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceHub;
