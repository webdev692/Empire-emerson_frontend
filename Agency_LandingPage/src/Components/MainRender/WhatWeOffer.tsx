import React from 'react';
import { Users, Globe, Briefcase, BookOpen, Building, Shield } from 'lucide-react';

const SERVICES = [
  {
    icon: Users,
    title: 'General Consultation and Intake',
    description: 'A first conversation to understand what you need and determine the best next step.',
  },
  {
    icon: Globe,
    title: 'Community Resource Navigation',
    description: 'Support identifying local agencies, workforce resources, and community-based support options.',
  },
  {
    icon: Briefcase,
    title: 'Business Direction and Brand Intake',
    description: 'A structured conversation to help entrepreneurs clarify services and brand direction.',
  },
  {
    icon: BookOpen,
    title: 'Community Workshops and Group Education',
    description: 'Public or partner-based workshops covering career readiness and financial education.',
  },
  {
    icon: Building,
    title: 'Partnership and Referral Coordination',
    description: 'Partnership conversations for schools, nonprofits, and community organizations.',
  },
  {
    icon: Shield,
    title: 'Consultation Pathway',
    description: 'Custom support tailored to your unique needs and circumstances.',
  },
];

const WhatWeOffer: React.FC = () => {
  return (
    <section className="bg-[#2D1B4E] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-bold text-white text-4xl md:text-5xl uppercase leading-tight">
            What do you need help finding?
          </h2>
          <p className="mx-auto max-w-2xl text-[#E5D4B8] text-lg">
            Choose the service that best fits your situation and let's get started.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-[#3D2A5F] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-lg p-8 transition-all duration-300"
              >
                <Icon className="mb-6 text-[#C9A84C]" size={32} />
                <h3 className="mb-4 font-bold text-white text-lg">{service.title}</h3>
                <p className="text-[#C9A84C]/80 text-sm leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
