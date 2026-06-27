import React from 'react';
import { motion, type Variants } from 'framer-motion';

const FORMS = [
  {
    title: 'Request Services',
    description: 'Tell us what you need. We will help guide you to the right pathway.',
    href: '/contact',
  },
  {
    title: 'Register for Weekly Classes',
    description: 'Career readiness, professional development, and workforce training.',
    href: '/classes',
  },
  {
    title: 'Request Business Consultation or Partnership',
    description: 'For founders, small business, and mission-aligned organizations.',
    href: '/contact',
  },
  {
    title: 'Apply for Internship',
    description: 'For students and emerging professionals seeking structured experience.',
    href: '/global-internship',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const FormsNextSteps: React.FC = () => (
  <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
    <div className="mx-auto max-w-7xl">
      <p
        className="mb-3 font-semibold text-[#5a3e9e] text-xs sm:text-sm uppercase tracking-[0.3em]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Take the Next Steps
      </p>

      <h2
        className="mb-4 font-medium text-[#12022A] text-4xl sm:text-5xl"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Forms and <span className="text-[#5a3e9e]">Next Steps</span>
      </h2>

      <p
        className="mb-12 text-[#12022A]/60 text-base sm:text-lg"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Use the form that fits where you are. Each opens in a new tab.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="gap-5 sm:gap-6 grid sm:grid-cols-2"
      >
        {FORMS.map((form) => (
          <motion.a
            key={form.title}
            href={form.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            className="group flex flex-col bg-[#f0e0ca] hover:bg-[#ecd8ba] p-7 sm:p-8 border border-[#e2cfa9] border-l-4 border-l-[#C9A84C] transition-colors duration-200"
          >
            <h3
              className="mb-3 font-medium text-[#5a3e9e] text-xl sm:text-2xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {form.title}
            </h3>
            <p
              className="flex-1 mb-6 text-[#12022A]/75 text-sm sm:text-base leading-[1.7]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {form.description}
            </p>
            <span
              className="inline-flex items-center gap-1 font-semibold text-[#12022A] text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Open form
              <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </div>
  </div>
);

export default FormsNextSteps;
