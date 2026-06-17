import React from 'react';
import { Globe } from '../../assets';

const BuildingReal: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text content */}
          <div className="lg:w-1/2">
            <h2 className="mb-6 font-bold text-[#12022A] text-4xl md:text-5xl uppercase leading-tight">
              We're Building Something Real —<br />
              <span className="text-[#C9A84C]">And You Can Be Part of It.</span>
            </h2>
            <p className="mb-6 text-[#12022A]/70 text-lg leading-relaxed">
              The Emerson Empire isn't just another training program. We're building a global movement of financially literate, professionally equipped individuals who are ready to lead their own futures and serve their communities.
            </p>
            <p className="mb-8 text-[#12022A]/70 text-lg leading-relaxed">
              Whether you're an individual looking to level up, an entrepreneur building something from scratch, or a community partner looking for real solutions — we have the infrastructure, expertise, and commitment to help you succeed.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-8 py-4 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
            >
              Apply for the Internship
            </a>
          </div>

          {/* Right: Globe Image */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={Globe} 
                alt="Global opportunity" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildingReal;
