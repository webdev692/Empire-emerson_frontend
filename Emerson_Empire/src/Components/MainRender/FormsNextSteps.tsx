import React from 'react';
import { FileText, Users, CheckCircle, Award } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: 'Request Services',
    description: 'Tell us what you need. We will help guide you to the right pathway.',
    href: '/contact',
  },
  {
    icon: Users,
    title: 'Register for Weekly Classes',
    description: 'Career readiness, professional development, and workforce training.',
    href: '/classes',
  },
  {
    icon: CheckCircle,
    title: 'Request Business Consultation or Partnership',
    description: 'For entrepreneurs, small businesses, nonprofits, and mission-aligned organizations.',
    href: '/contact',
  },
  {
    icon: Award,
    title: 'Apply for Internship',
    description: 'For students and emerging professionals seeking structured experience.',
    href: '/global-internship',
  },
];

const FormsNextSteps: React.FC = () => {
  return (
    <section className="bg-[#f0e0ca] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 font-semibold text-[#12022A] text-xs sm:text-sm uppercase tracking-[0.3em]">
            Take the Next Steps
          </p>
          <h2 className="font-bold text-[#12022A] text-5xl md:text-6xl uppercase leading-tight">
            Forms and Next Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#12022A]/70 text-lg leading-relaxed">
            Use the form that fits where you are. Each opens in a new tab.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <a
                key={idx}
                href={step.href}
                className="group block rounded-[32px] border border-[#12022A]/10 bg-white/95 p-8 transition-shadow duration-200 hover:shadow-[0_24px_70px_rgba(18,2,42,0.12)]"
              >
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-[#12022A]/10 w-12 h-12 text-[#12022A]">
                  <Icon size={22} />
                </div>
                <h3 className="mb-4 font-semibold text-[#12022A] text-xl uppercase tracking-[0.08em]">
                  {step.title}
                </h3>
                <p className="text-[#12022A]/75 text-sm leading-7">
                  {step.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-[#C9A84C] font-semibold text-sm uppercase tracking-[0.18em] group-hover:translate-x-1 transition-transform duration-200">
                  Open form <span aria-hidden="true">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FormsNextSteps;
