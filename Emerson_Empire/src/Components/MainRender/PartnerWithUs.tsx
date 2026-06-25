import React from 'react';

const PartnerWithUs: React.FC = () => {
  return (
    <section className="bg-[#12022A] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="lg:w-3/5">
            <p className="mb-4 font-semibold text-[#C9A84C] text-xs uppercase tracking-[0.35em]">
              COLLABORATION
            </p>
            <h2 className="mb-6 font-semibold text-white text-5xl md:text-[3.5rem] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Partner With Us
            </h2>
            <p className="mb-6 max-w-xl text-[#E5D4B8] text-lg leading-[1.85]">
              Organizations, schools, libraries, community groups, and mission-aligned partners can request collaboration or workshops. We work with partners to expand access to education, professional development, and community resources.
            </p>
          </div>

          <div className="lg:w-2/5 flex items-center justify-end">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[#C9A84C] hover:bg-[#E8C97A] px-8 py-4 rounded-md font-semibold text-[#12022A] text-sm uppercase tracking-[0.18em] transition-colors duration-200"
            >
              Request Partnership
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerWithUs;
