import React from 'react';
import { meeting } from '../../assets';

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Image */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={meeting} 
                alt="Team collaboration" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right: Text content */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <p className="mb-4 font-semibold text-[#C9A84C] text-sm uppercase tracking-[0.15em]">
              MEET THE TEAM
            </p>
            <h2 className="mb-6 font-bold text-[#1C1336] text-4xl md:text-5xl uppercase leading-tight">
              Real People, Real Experience, Real Results.
            </h2>
            <p className="mb-6 text-[#1C1336]/70 text-lg leading-relaxed">
              Our team is made up of professionals who have walked the same paths our clients walk. We've built businesses, navigated career transitions, managed finances under pressure, and learned what actually works in the real world.
            </p>
            <p className="mb-8 text-[#1C1336]/70 text-lg leading-relaxed">
              That's what makes us different. We're not teaching theory — we're sharing what we've learned through lived experience.
            </p>
            <a
              href="/about"
              className="inline-flex items-center bg-[#1C1336] hover:bg-[#1E0A4A] px-8 py-4 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
            >
              Meet Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
