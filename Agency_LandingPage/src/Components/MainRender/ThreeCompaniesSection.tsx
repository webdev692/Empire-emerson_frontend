import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  BookOpen, GraduationCap, Wallet, Briefcase, Building2, Handshake,
} from 'lucide-react';
import {
  EPDGWebp, EPDGAvif, empire, empireWebp, empireAvif,
  AgencyWebp, AgencyAvif, Logo1, Logo2, globe,
} from '../../assets';
import ResourceHub from './ResourceHub';
import FeeWaiverSection from './FeeWaiverSection';
import FormsNextSteps from './FormsNextSteps';
import PartnerWithUs from './PartnerWithUs';
import GetInTouch from './GetInTouch';

const FIND_PATHS = [
  { icon: BookOpen,      title: 'Free resources and guidance',              href: '/about'             },
  { icon: GraduationCap, title: 'Career classes and professional development', href: '/classes'        },
  { icon: Wallet,        title: 'Financial education and organization',     href: '/agency'            },
  { icon: Briefcase,     title: 'Internship opportunities',                 href: '/global-internship' },
  { icon: Building2,     title: 'Business consultation and project support', href: '/contact'          },
  { icon: Handshake,     title: 'Community or organizational partnership',  href: '/contact'           },
];

const COMPANIES = [
  {
    title: 'EMERSON PROFESSIONAL DEVELOPMENT GROUP',
    description:
      'Weekly classes, career readiness, internship programming, professional development, and workforce training.',
    img: Logo2,
    imgWebp: EPDGWebp,
    imgAvif: EPDGAvif,
    alt: 'Emerson Professional Development Group',
    href: '/global-internship',
    logoCls: '',
  },
  {
    title: 'THE EMERSON EMPIRE',
    description:
      'Central hub for free resources, community guidance, referrals, and partnership pathways.',
    img: empire,
    imgWebp: empireWebp,
    imgAvif: empireAvif,
    alt: 'The Emerson Empire',
    href: '/about',
    logoCls: 'scale-[1.35]',
  },
  {
    title: 'THE EMERSON AGENCY LLC',
    description:
      'Financial education, tax readiness, insurance education, household financial organization, credit and debt education, and small business financial organization.',
    img: Logo1,
    imgWebp: AgencyWebp,
    imgAvif: AgencyAvif,
    alt: 'The Emerson Agency LLC',
    href: '/agency',
    logoCls: '',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

// ── Global Internship ────────────────────────────────────────────────────────

const GlobalReachSection: React.FC = () => (
  <div
    className="relative flex items-center overflow-hidden min-h-[560px] lg:min-h-[660px]"
    style={{ background: '#f0e0ca' }}
  >
    {/* Globe image — desktop: bleeds off the right edge, cream background blends into the section */}
    <img
      src={globe}
      alt="Interns connected across the globe"
      aria-hidden="true"
      className="hidden lg:block top-1/2 right-0 z-0 absolute w-auto h-[120%] max-w-none -translate-y-1/2 pointer-events-none select-none"
    />

    <div className="z-10 relative mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24 w-full max-w-7xl">

      {/* Left — copy */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="lg:max-w-[48%]"
      >
        <p
          className="mb-5 font-bold text-[#4B3FA0] text-xs sm:text-sm uppercase tracking-[0.25em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Global Internship
        </p>

        <h2
          className="mb-6 font-medium text-[#1c1a17] text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          We're Building Something Real —
          <span className="block text-[#5a3e9e]">And You Can Be Part of It.</span>
        </h2>

        <p
          className="mb-5 max-w-xl text-[#44423c] text-base sm:text-lg leading-[1.7]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          The Emerson Empire Global Internship Program is founder-led and
          intern-supported. Students, career changers, and emerging professionals
          from around the world contribute to real public-facing systems — web
          development, marketing, content, sales, operations, and more.
        </p>

        <p
          className="mb-8 max-w-xl text-[#44423c] text-base sm:text-lg leading-[1.7]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Internship participation is free. You'll gain structured onboarding, real
          project experience, portfolio-ready work, and completion documentation.
        </p>

        <a
          href="/global-internship#application-form"
          className="inline-flex items-center bg-[#0A1128] hover:bg-[#241b45] px-7 py-3.5 rounded-lg font-bold text-white text-sm transition-colors duration-200"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Apply for the Internship
        </a>
      </motion.div>

      {/* Globe image — mobile / tablet */}
      <div className="lg:hidden mt-10">
        <img
          src={globe}
          alt="Interns connected across the globe"
          className="mx-auto w-full max-w-md"
        />
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const ThreeCompaniesSection: React.FC = () => {
  return (
    <section className="bg-white py-0 lg:py-0">

      {/* ── Find Your Path ── */}
      <div className="bg-[#0A1128] px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-3 font-semibold text-[#C9A84C] text-xs sm:text-sm uppercase tracking-[0.3em]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Find Your Path
          </p>
          <h2
            className="mb-12 font-medium text-white text-4xl sm:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            What do you need help finding?
          </h2>

          <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
            {FIND_PATHS.map(({ icon: Icon, title, href }) => (
              <a
                key={title}
                href={href}
                className="group flex items-start gap-4 bg-white/[0.03] hover:bg-white/[0.06] p-5 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 rounded-lg transition-colors duration-200"
              >
                <Icon className="mt-0.5 text-[#C9A84C] shrink-0" size={24} strokeWidth={1.5} />
                <div>
                  <p
                    className="font-semibold text-white text-sm leading-snug"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {title}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 font-medium text-[#C9A84C] text-xs">
                    Explore <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── The Ecosystem — Three Emerson Pathways ── */}
      <div className="px-6 sm:px-10 lg:px-16 py-16 lg:py-20 text-center">
        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-3 font-semibold text-[#C9A84C] text-xs sm:text-sm uppercase tracking-[0.3em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          The Ecosystem
        </motion.p>

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-medium text-[#0A1128] text-4xl sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Three Emerson Pathways
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-12 max-w-2xl text-[#0A1128]/60 text-base sm:text-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          One ecosystem. Three doors. Choose the one that fits where you are right now.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="gap-6 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl"
        >
          {COMPANIES.map((company) => (
            <motion.div
              key={company.title}
              variants={cardVariants}
              className="flex flex-col items-center p-8 border-[1.5px] border-[#C9A84C]/55 rounded-lg text-center"
            >
              {/* Logo — no frame */}
              <div className="flex justify-center items-center mb-7 w-full h-40">
                <img
                  src={company.img}
                  alt={company.alt}
                  className={`max-w-[80%] max-h-full object-contain ${company.logoCls}`}
                />
              </div>

              {/* Divider line between logo and text */}
              <div className="bg-[#C9A84C]/40 mb-7 w-full h-px" />

              <h3
                className="mb-4 font-medium text-[#0A1128] text-xl sm:text-2xl leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {company.title}
              </h3>
              <p
                className="flex-1 mb-7 text-[#0A1128]/70 text-sm leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {company.description}
              </p>
              <a
                href={company.href}
                className="inline-flex justify-center items-center bg-[#0A1128] hover:bg-[#1b2547] px-6 py-3.5 rounded-sm w-full max-w-[240px] font-semibold text-white text-xs uppercase tracking-[0.18em] transition-colors duration-200"
              >
                Learn More
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <GlobalReachSection />

      {/* ── Sections below the globe ── */}
      <ResourceHub />
      <FeeWaiverSection />
      <FormsNextSteps />
      <PartnerWithUs />
      <GetInTouch />

    </section>
  );
};

export default ThreeCompaniesSection;
