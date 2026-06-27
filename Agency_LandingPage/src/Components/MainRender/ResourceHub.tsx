import React from 'react';
import { Zap, Users, BookOpen } from 'lucide-react';

const ResourceHub: React.FC = () => {
  return (
    <section className="bg-[#2D1B4E] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-bold text-white text-4xl md:text-5xl uppercase leading-tight">
            A Growing Public Resource Hub
          </h2>
          <p className="mx-auto max-w-2xl text-[#E5D4B8] text-lg">
            Free and low-cost resources designed to help you move forward, no matter where you're starting.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
            <BookOpen className="mb-6 text-[#C9A84C]" size={40} />
            <h3 className="mb-4 font-bold text-white text-xl">Free Guides & Templates</h3>
            <p className="text-[#C9A84C]/80 text-sm leading-relaxed">
              Downloadable resources covering career readiness, resume building, financial planning, and business setup.
            </p>
          </div>

          <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
            <Zap className="mb-6 text-[#C9A84C]" size={40} />
            <h3 className="mb-4 font-bold text-white text-xl">Weekly Workshops</h3>
            <p className="text-[#C9A84C]/80 text-sm leading-relaxed">
              Interactive sessions hosted by our team and community partners covering topics from tax basics to business launch.
            </p>
          </div>

          <div className="bg-[#3D2A5F] border border-[#C9A84C]/20 rounded-lg p-8">
            <Users className="mb-6 text-[#C9A84C]" size={40} />
            <h3 className="mb-4 font-bold text-white text-xl">Community Support</h3>
            <p className="text-[#C9A84C]/80 text-sm leading-relaxed">
              Connect with other professionals, entrepreneurs, and learners in our growing community.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/classes"
            className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B555] px-8 py-4 rounded-sm font-bold text-[#0A1128] text-sm uppercase tracking-[0.15em] transition-colors duration-200"
          >
            Explore All Resources
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResourceHub;
