import React from 'react';

const FeeWaiverSection: React.FC = () => {
  return (
    <section className="bg-[#3D2A5F] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gradient-to-r from-[#2D1B4E] to-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg px-8 sm:px-12 py-16 text-center">
          <p className="mb-4 font-semibold text-[#C9A84C] text-sm uppercase tracking-[0.15em]">
            ACCESSIBILITY MATTERS
          </p>
          <h2 className="mb-8 font-bold text-white text-4xl md:text-5xl uppercase leading-tight">
            Fee Waiver And Reduced Cost Support
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-[#E5D4B8] text-lg">
            We believe access to quality professional development should never depend on your ability to pay. If cost is a barrier, we have options.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B555] px-8 py-4 rounded-sm font-bold text-[#0A1128] text-sm uppercase tracking-[0.15em] transition-colors duration-200"
          >
            Request a Fee Waiver
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeeWaiverSection;
