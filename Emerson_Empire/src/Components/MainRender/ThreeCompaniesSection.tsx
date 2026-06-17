import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  BookOpen, GraduationCap, Wallet, Briefcase, Building2, Handshake,
} from 'lucide-react';
import {
  EPDGWebp, EPDGAvif, hos, malikbg,
  wiltordb, matheosbg, jonath, kashawn, empire, empireWebp, empireAvif,
  AgencyWebp, AgencyAvif, Logo1, Logo2, Vincent,
} from '../../assets';

const FIND_PATHS = [
  { icon: BookOpen,      title: 'Free resources and guidance',              href: '/about'             },
  { icon: GraduationCap, title: 'Career classes and professional development', href: '/classes'        },
  { icon: Wallet,        title: 'Financial education and organization',     href: '/agency'            },
  { icon: Briefcase,     title: 'Internship opportunities',                 href: '/global-internship' },
  { icon: Building2,     title: 'Business consultation and project support', href: '/contact'          },
  { icon: Handshake,     title: 'Community or organizational partnership',  href: '/contact'           },
];

const TEAM_SLIDES = [
  {
    Name: "Hosea",
    img: hos,
    Department: "Web Development",
    skill: "React · JSX/TSX · Git · HTML5 · CSS · Tailwind",
  },
  {
    Name: "Matheus Alves",
    img: matheosbg,
    Department: "Web Development",
    skill: "React · JSX/TSX · Git · HTML5 · CSS · Tailwind · Full Stack",
  },
  {
    Name: "Khaishawn Edward Gant",
    img: kashawn,
    Department: "Social Media & Content Creation",
    skill: "Content Strategy · Copywriting · Canva · Adobe Premiere · Instagram · TikTok",
  },
  {
    Name: "Kamdem Wiltord Netting",
    img: wiltordb,
    Department: "Web Development",
    skill: "React · JSX/TSX · Git · HTML5 · CSS · Tailwind",
  },
  {
    Name: "Jonathan Smith",
    img: jonath,
    Department: "Web Development",
    skill: "React · JSX/TSX · Git · HTML5 · CSS · Tailwind",
  },
  {
    Name: "Muhamed Malik Bouras",
    img: malikbg,
    Department: "Web Development",
    skill: "Full Stack Engineer · Backend Architecture",
  },
  {
    Name: "Vincent Majembe",
    img: Vincent,
    Department: "Web Development",
    skill: "Full Stack · Leadership · System Flow · System Architecture · Project Management",
  },
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

const Service = [
  {
    Title: "Career Readiness & Resume Support",
    Description: "Resume writing, LinkedIn, interview prep, job search strategy",
  },
  {
    Title: "Financial Education & Household Organisation",
    Description: "Budgeting, financial planning, household systems",
  },
  {
    Title: "Tax Education & Household Organization",
    Description: "Individual, family, and small business tax support",
  },
  {
    Title: "Insurance Education & Needs Review",
    Description: "Understanding your options and what coverage fits you",
  },
  {
    Title: "Business Consulting & Operations Support",
    Description: "Startup direction, systems, sales, digital presence",
  },
  {
    Title: "Internship Program & Workforce Development",
    Description: "Real-world experience, portfolio building, career launch",
  },
];

const chos_path = [
  {
    Total: "Request Services",
    Description: "Not sure what you need? Start here. We'll help you find the right service, class, or next step during intake.",
    Button: "Request Service",
    href: "/contact",
  },
  {
    Total: "Register for Group Classes",
    Description: "Browse and register for free and low-cost weekly classes in career, finance, and professional development.",
    Button: "Register for Group Classes",
    href: "/classes",
  },
  {
    Total: "Request Business Consultation",
    Description: "For entrepreneurs, small businesses, nonprofits, and organizations seeking consultation, project support, or operations help.",
    Button: "Request Business Consultation",
    href: "/contact",
  },
  {
    Total: "Apply for the Internship Program",
    Description: "Join our founder-led structured global internship program and build a real-world portfolio while contributing to live systems.",
    Button: "Apply for the Internship Program",
    href: "/global-internship",
  },
];

// ── Image Slider ──────────────────────────────────────────────────────────────

const ImageSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    TEAM_SLIDES.forEach(({ img }) => {
      const image = new Image();
      image.src = img;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % TEAM_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + TEAM_SLIDES.length) % TEAM_SLIDES.length);
  };

  const current = TEAM_SLIDES[index];

  return (
    <div className="relative shadow-md mx-auto rounded-2xl max-w-3xl h-125 sm:h-150 overflow-hidden">
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ x: direction * 100 + '%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: direction * -100 + '%', opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 m-2.5 rounded-2xl overflow-hidden"
        >
          <img
            src={current.img}
            alt={current.Name}
            className="w-full h-full object-contain object-top"
          />
          <div className="right-0 bottom-0 left-0 absolute bg-linear-to-t from-black/80 to-transparent px-6 py-5 rounded-b-2xl text-left">
            <p className="font-bold text-white text-lg leading-tight">{current.Name}</p>
            <p className="mt-0.5 text-[#C9A84C] text-xs uppercase tracking-widest">{current.Department}</p>
            <p className="mt-1 text-white/70 text-xs">{current.skill}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => go(-1)} className="top-1/2 left-3 absolute flex justify-center items-center bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 text-white transition -translate-y-1/2">‹</button>
      <button onClick={() => go(1)}  className="top-1/2 right-3 absolute flex justify-center items-center bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 text-white transition -translate-y-1/2">›</button>

      <div className="right-6 bottom-3 absolute flex gap-2">
        {TEAM_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-[#C9A84C] w-4' : 'bg-white/40 w-2'}`}
          />
        ))}
      </div>
    </div>
  );
};

// ── World Connection ─────────────────────────────────────────────────────────

const WORLD_NODES = [
  { id: 'ny',  x: 248, y: 148, hub: true,  label: 'Career',   color: '#C9A84C' },
  { id: 'lon', x: 488, y: 118, hub: true,  label: 'Finance',  color: '#7C4DBA' },
  { id: 'sin', x: 762, y: 255, hub: true,  label: 'Business', color: '#4B1E91' },
  { id: 'la',  x: 142, y: 162, hub: false, color: '#C9A84C' },
  { id: 'tor', x: 242, y: 132, hub: false, color: '#C9A84C' },
  { id: 'mia', x: 268, y: 180, hub: false, color: '#C9A84C' },
  { id: 'sao', x: 342, y: 302, hub: false, color: '#C9A84C' },
  { id: 'mad', x: 462, y: 132, hub: false, color: '#7C4DBA' },
  { id: 'ber', x: 518, y: 110, hub: false, color: '#7C4DBA' },
  { id: 'lag', x: 488, y: 240, hub: false, color: '#7C4DBA' },
  { id: 'nai', x: 572, y: 262, hub: false, color: '#7C4DBA' },
  { id: 'dub', x: 628, y: 185, hub: false, color: '#4B1E91' },
  { id: 'mum', x: 675, y: 204, hub: false, color: '#4B1E91' },
  { id: 'tok', x: 858, y: 155, hub: false, color: '#4B1E91' },
  { id: 'syd', x: 886, y: 308, hub: false, color: '#4B1E91' },
];

const WORLD_EDGES: [string, string, string][] = [
  ['ny',  'tor', '#C9A84C'], ['ny',  'la',  '#C9A84C'], ['ny',  'mia', '#C9A84C'],
  ['ny',  'lon', '#C9A84C'], ['ny',  'sao', '#C9A84C'], ['mia', 'sao', '#C9A84C'],
  ['lon', 'mad', '#7C4DBA'], ['lon', 'ber', '#7C4DBA'], ['lon', 'lag', '#7C4DBA'],
  ['lon', 'dub', '#7C4DBA'], ['lag', 'nai', '#7C4DBA'],
  ['dub', 'mum', '#4B1E91'], ['dub', 'sin', '#4B1E91'], ['mum', 'sin', '#4B1E91'],
  ['sin', 'tok', '#4B1E91'], ['sin', 'syd', '#4B1E91'],
];

function arc(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.12;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

const WorldConnection: React.FC = () => (
  <div className="relative bg-[#0C011E] py-16 overflow-hidden">
    <style>{`
      @keyframes wc-pulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(2.8);opacity:0} }
      @keyframes wc-pulse2 { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(2);opacity:0} }
      @keyframes wc-flow { 0%{stroke-dashoffset:600} 100%{stroke-dashoffset:0} }
      @keyframes wc-dot { 0%,100%{opacity:.9} 50%{opacity:.35} }
    `}</style>

    <div className="relative z-10 mx-auto px-4 text-center mb-10">
      <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-[4px] mb-3">Global Reach</p>
      <h2 className="font-bold text-white text-2xl sm:text-3xl uppercase leading-tight tracking-tight">
        Connecting Communities <span className="text-[#C9A84C]">Worldwide</span>
      </h2>
      <p className="mt-3 text-white/45 font-mono text-xs uppercase tracking-widest">
        Career · Finance · Business — across every continent
      </p>
    </div>

    <div className="mx-auto max-w-5xl px-2">
      <svg viewBox="0 0 1000 420" className="w-full" style={{ maxHeight: 360 }}>
        <defs>
          <radialGradient id="wc-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a0535" />
            <stop offset="100%" stopColor="#0C011E" />
          </radialGradient>
          <pattern id="wc-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="#ffffff" opacity="0.07" />
          </pattern>
          <filter id="wc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="1000" height="420" fill="url(#wc-bg)" rx="12" />
        <rect width="1000" height="420" fill="url(#wc-dots)" rx="12" />

        {/* connection arcs */}
        {WORLD_EDGES.map(([from, to, color], i) => {
          const a = WORLD_NODES.find(n => n.id === from)!;
          const b = WORLD_NODES.find(n => n.id === to)!;
          return (
            <path
              key={i}
              d={arc(a.x, a.y, b.x, b.y)}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.45"
              strokeDasharray="600"
              strokeDashoffset="600"
              style={{ animation: `wc-flow ${2.4 + i * 0.18}s ease-out ${i * 0.12}s forwards` }}
            />
          );
        })}

        {/* regular nodes */}
        {WORLD_NODES.filter(n => !n.hub).map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="5" fill={n.color} opacity="0.15" />
            <circle cx={n.x} cy={n.y} r="2.5" fill={n.color} opacity="0.85"
              style={{ animation: `wc-dot ${1.8 + Math.random() * 1.2}s ease-in-out infinite` }}
            />
          </g>
        ))}

        {/* hub nodes */}
        {WORLD_NODES.filter(n => n.hub).map((n, i) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="14" fill="none" stroke={n.color} strokeWidth="1.5"
              style={{ animation: `wc-pulse 2.6s ease-out ${i * 0.9}s infinite`, transformOrigin: `${n.x}px ${n.y}px` }} />
            <circle cx={n.x} cy={n.y} r="14" fill="none" stroke={n.color} strokeWidth="1"
              style={{ animation: `wc-pulse2 2.6s ease-out ${i * 0.9 + 1.3}s infinite`, transformOrigin: `${n.x}px ${n.y}px` }} />
            <circle cx={n.x} cy={n.y} r="8" fill={n.color} opacity="0.2" filter="url(#wc-glow)" />
            <circle cx={n.x} cy={n.y} r="4.5" fill={n.color} filter="url(#wc-glow)" />
            <circle cx={n.x} cy={n.y} r="2" fill="white" />
            <text x={n.x} y={n.y - 17} textAnchor="middle"
              fill={n.color} fontSize="9" fontFamily="monospace"
              fontWeight="700" letterSpacing="1.5" opacity="0.9">
              {n.label?.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>

    {/* legend */}
    <div className="flex justify-center gap-8 mt-8 flex-wrap px-4">
      {[
        { label: 'Career & Services', color: '#C9A84C' },
        { label: 'Finance',           color: '#7C4DBA' },
        { label: 'Business',          color: '#4B1E91' },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="font-mono text-white/50 text-xs uppercase tracking-widest">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const ThreeCompaniesSection: React.FC = () => {
  return (
    <section className="bg-white py-0 lg:py-0">

      {/* ── Find Your Path ── */}
      <div className="bg-[#12022A] px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
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
          className="font-medium text-[#12022A] text-4xl sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Three Emerson Pathways
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-12 max-w-2xl text-[#12022A]/60 text-base sm:text-lg"
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
                className="mb-4 font-medium text-[#12022A] text-xl sm:text-2xl leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {company.title}
              </h3>
              <p
                className="flex-1 mb-7 text-[#12022A]/70 text-sm leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {company.description}
              </p>
              <a
                href={company.href}
                className="inline-flex justify-center items-center bg-[#12022A] hover:bg-[#1E0A4A] px-6 py-3.5 rounded-sm w-full max-w-[240px] font-semibold text-white text-xs uppercase tracking-[0.18em] transition-colors duration-200"
              >
                Learn More
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <WorldConnection />

      {/* ── What We Offer ── */}
      <div className="mt-2 px-6 sm:px-2 lg:px-16 py-16 text-center">
        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-4 font-semibold text-[#4B1E91] text-sm sm:text-base uppercase tracking-[4px]"
        >
          What We Offer
        </motion.p>

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto max-w-7xl font-bold text-[#12022A] text-[36px] sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
        >
          Services across career, finance, and business
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-14 max-w-7xl text-[#12022A]/55 text-lg sm:text-xl leading-[1.9]"
        >
          From career readiness to business consulting — if you need support, we likely have a pathway for you.
        </motion.p>

        <motion.div
          whileInView={{ scaleX: 1 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ originX: 0.5 }}
          className="bg-[#C9A84C] mx-auto mb-16 w-24 h-0.75"
        />

        <div className="gap-8 grid sm:grid-cols-2 lg:grid-cols-3">
          {Service.map((service) => (
            <div key={service.Title} className="shadow-md p-6 rounded-md text-left">
              <h3 className="mb-4 min-h-12 font-bold text-[#12022A] text-base leading-tight heading">{service.Title}</h3>
              <div className="bg-[#C9A84C] mt-2 w-[50%] h-0.75" />
              <p className="flex-1 mt-3 mb-6 text-[#12022A]/55 text-sm leading-[1.8]">{service.Description}</p>
            </div>
          ))}
        </div>

        <a href="/contact" className="inline-flex items-center bg-[#12022A] hover:bg-[#1E0A4A] mt-10 px-5 py-2.5 rounded-sm font-semibold text-white text-xs uppercase tracking-[0.18em] transition-colors duration-200">
          Request Service
        </a>
      </div>

      {/* ── Weekly Classes ── */}
      <div className="bg-[#12022A] mt-2 px-6 sm:px-2 lg:px-16 py-16 text-center">
        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-4 font-semibold text-[#C9A84C] text-sm sm:text-base uppercase tracking-[4px]"
        >
          Weekly Class Series
        </motion.p>

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto max-w-7xl font-bold text-[36px] text-white sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
        >
          FREE & LOW-COST <span className="font-semibold text-[#C9A84C]">WEEKLY CLASSES</span>
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-14 max-w-7xl text-white text-lg sm:text-xl leading-[1.9]"
        >
          The Emerson Empire weekly class series offers 21 free and low-cost online classes every week covering career readiness,
          financial literacy, tax readiness, entrepreneurship, sales, digital presence, leadership, and professional development.
          All classes are held online via Google Meet in EDT — open to anyone, no experience required.
        </motion.p>

        <a href="/classes" className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B56A] px-5 py-2.5 rounded-sm font-semibold text-[#12022A] text-xs uppercase tracking-[0.18em] transition-colors duration-200">
          View All 21 Classes & Register
        </a>
      </div>

      {/* ── Business Support ── */}
      <div className="bg-[#ddd] px-6 sm:px-10 lg:px-16 py-16 text-center">
        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45 }}
          className="mb-4 font-semibold text-[#C9A84C] text-sm sm:text-base uppercase tracking-[4px]"
        >
          Business Support
        </motion.p>

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto max-w-7xl font-bold text-[#12022A] text-[36px] sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
        >
          BUSINESS SUPPORT <span className="mb-4 font-semibold text-[#C9A84C]">BUILT AROUND YOU</span>
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-14 max-w-7xl text-[#12022A] text-lg sm:text-xl leading-[1.9]"
        >
          Whether you're launching a business, organizing your operations, or looking for strategic
          direction — we offer consultation, planning, and team-supported project services for entrepreneurs,
          small businesses, nonprofits, and organizations of all sizes.
          No corporate coldness — just real, practical support from people who understand what it takes.
        </motion.p>

        <a href="/classes" className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B56A] px-5 py-2.5 rounded-sm font-semibold text-[#12022A] text-xs uppercase tracking-[0.18em] transition-colors duration-200">
          View All 21 Classes & Register
        </a>
      </div>

      {/* ── Team Slider ── */}
      <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 text-center">
        <ImageSlider />
      </div>

      {/* ── Choose Your Path ── */}
      <div className="bg-[#ddd] px-6 sm:px-10 lg:px-16 py-16 text-center">
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-10 max-w-7xl font-bold text-[#12022A] text-[36px] sm:text-[38px] uppercase leading-tight tracking-tight heading"
        >
          Ready to get started?{' '}
          <span className="text-[#C9A84C]">Choose your path.</span>
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-14 max-w-7xl text-[#12022A] text-lg sm:text-xl leading-[1.9]"
        >
          Select the option that fits where you are right now.
        </motion.p>

        <div className="gap-8 grid sm:grid-cols-2 lg:grid-cols-3">
          {chos_path.map((path) => (
            <div key={path.Total} className="flex flex-col shadow-md mb-8 p-6 rounded-md text-left">
              <h3 className="mb-3 font-bold text-[#12022A] text-base leading-tight heading">{path.Total}</h3>
              <div className="bg-[#C9A84C] mb-3 w-12 h-0.75" />
              <p className="flex-1 mb-6 text-[#12022A]/70 text-sm leading-[1.8]">{path.Description}</p>
              <a
                href={path.href}
                className="inline-flex items-center self-start bg-[#12022A] hover:bg-[#1E0A4A] px-5 py-2.5 rounded-sm font-semibold text-white text-xs uppercase tracking-[0.18em] transition-colors duration-200"
              >
                {path.Button}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accessibility Banner ── */}
      <div className="bg-[#513086] px-6 sm:px-10 lg:px-16 py-16 text-center">
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto max-w-7xl font-bold text-[36px] text-white sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
        >
          WE BELIEVE SUPPORT SHOULD BE ACCESSIBLE.
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-4 mb-14 max-w-7xl text-white text-lg sm:text-xl leading-[1.9]"
        >
          Free and reduced-cost options may be available for students, low-income individuals,
          unemployed job seekers, single parents, caregivers, seniors, veterans, and clients referred
          by community agencies or workforce programs. If cost is a barrier, let us know during intake
          and we will do our best to find the right path for you.
        </motion.p>
      </div>

    </section>
  );
};

export default ThreeCompaniesSection;