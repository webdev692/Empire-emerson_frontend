import React from 'react';
import { FileText, Users, CheckCircle, Award } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: 'Register for a Class',
    description: 'Sign up for one of our weekly classes or workshops to start building your skills.',
  },
  {
    icon: Users,
    title: 'Request a Weekly Consultation',
    description: 'Meet one-on-one with our team to get personalized guidance and support.',
  },
  {
    icon: CheckCircle,
    title: 'Register for Weekly Classes',
    description: 'Join our ongoing series of professional development workshops.',
  },
  {
    icon: Award,
    title: 'Apply for Internship',
    description: 'Take the next step with our immersive professional development program.',
  },
];

const FormsNextSteps: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-bold text-[#12022A] text-4xl md:text-5xl uppercase leading-tight">
            Forms and Next Steps
          </h2>
          <p className="mx-auto max-w-2xl text-[#12022A]/70 text-lg">
            Choose the pathway that's right for you and take the first step forward.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5EFE7] border border-[#12022A]/10 rounded-lg p-8"
              >
                <div className="mb-4 inline-flex items-center justify-center bg-[#C9A84C]/10 rounded-lg w-12 h-12">
                  <Icon className="text-[#C9A84C]" size={24} />
                </div>
                <h3 className="mb-4 font-bold text-[#12022A] text-lg">{step.title}</h3>
                <p className="text-[#12022A]/70 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] px-8 py-4 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default FormsNextSteps;
