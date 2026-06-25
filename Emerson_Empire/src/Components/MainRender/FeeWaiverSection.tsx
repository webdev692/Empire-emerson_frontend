import React from 'react';

const FeeWaiverSection: React.FC = () => {
  return (
    <section className="bg-[#12022A] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#2D1B4E] border border-[#C9A84C]/20 rounded-[32px] px-8 sm:px-12 py-16 text-center shadow-[0_40px_80px_rgba(18,2,42,0.16)]">
          <p className="mb-4 font-semibold text-[#C9A84C] text-sm uppercase tracking-[0.25em]">
            ACCESSIBILITY MATTERS
          </p>
          <h2 className="mb-8 font-bold text-white text-4xl md:text-5xl uppercase leading-tight">
            Fee Waiver And Reduced-Cost Support
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-[#E5D4B8] text-lg leading-[1.85]">
            We believe access matters. Some classes, services, and support options may have fee waiver or reduced-cost pathways available for people who cannot afford the full cost.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-[#C9A84C] hover:bg-[#E8C97A] px-8 py-4 rounded-md font-bold text-[#12022A] text-sm uppercase tracking-[0.18em] transition-colors duration-200"
          >
            Request Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeeWaiverSection;
