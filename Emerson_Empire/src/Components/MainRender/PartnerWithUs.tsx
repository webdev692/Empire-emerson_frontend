import React from 'react';

const PartnerWithUs: React.FC = () => {
  return (
    <section className="bg-[#2D1B4E] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 grid-cols-1 lg:grid-cols-2">
          {/* Left: Text */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 font-bold text-white text-4xl md:text-5xl uppercase leading-tight">
              Partner With Us
            </h2>
            <p className="mb-6 text-[#E5D4B8] text-lg leading-relaxed">
              Schools, nonprofits, workforce programs, libraries, and community organizations: let's build something together.
            </p>
            <p className="mb-8 text-[#E5D4B8] text-lg leading-relaxed">
              We specialize in creating custom partnerships that serve your community while maintaining the integrity and accessibility The Emerson Empire is known for.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B555] w-fit px-8 py-4 rounded-sm font-bold text-[#12022A] text-sm uppercase tracking-[0.15em] transition-colors duration-200"
            >
              Start a Conversation
            </a>
          </div>

          {/* Right: Key Points */}
          <div className="flex flex-col gap-8">
            <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
              <h3 className="mb-3 font-bold text-[#C9A84C] text-lg">Custom Programming</h3>
              <p className="text-[#E5D4B8] text-sm leading-relaxed">
                Tailored workshops and programs designed to meet your community's unique needs.
              </p>
            </div>

            <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
              <h3 className="mb-3 font-bold text-[#C9A84C] text-lg">Flexible Pricing</h3>
              <p className="text-[#E5D4B8] text-sm leading-relaxed">
                From free community education to comprehensive partnership packages, we work with your budget.
              </p>
            </div>

            <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
              <h3 className="mb-3 font-bold text-[#C9A84C] text-lg">Long-Term Support</h3>
              <p className="text-[#E5D4B8] text-sm leading-relaxed">
                We build sustainable partnerships built on trust, transparency, and shared mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerWithUs;
