import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Layers, TrendingUp, Share2, Briefcase,
  Globe, Award, Users, CheckCircle, ArrowRight,
  Clock, ChevronDown, Star, BookOpen,
} from 'lucide-react';
import { EPDG, development, study, meeting, sales } from '../../assets';



const SCHEMA_PROGRAM = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalProgram',
  name: 'Free Virtual Internship Program',
  description:
    'A free, unpaid, fully-remote internship program offering real-world experience in web design, UX/UI design, digital marketing, social media, and sales & marketing. Open to students, graduates, and career changers worldwide. No experience required.',
  provider: {
    '@type': 'Organization',
    name: 'Emerson Professional Development Group',
    url: 'https://www.theemersonempire.com',
  },
  programType: 'Internship',
  educationalProgramMode: 'online',
  occupationalCategory: [
    'Web Design', 'UX/UI Design', 'Digital Marketing', 'Social Media', 'Sales and Marketing',
  ],
  timeToComplete: 'P3M',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the internship paid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This is an unpaid internship program. Interns do not receive wages, stipends, or compensation for participation. The program is designed to provide experience, portfolio work, and professional development. There are also no fees to join — participation is free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the internship really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There are no application fees or participation fees. The internship is unpaid — meaning interns are not compensated for their work — but it costs nothing to apply or participate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need prior experience to apply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No prior professional experience is required. The program is designed for beginners, students, recent graduates, and career changers who want to build real skills.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can international students apply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The program is fully remote and open to applicants worldwide. No visa is required as all work is done virtually.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is the internship?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The program is semester-based, typically running 10–16 weeks depending on the track and cohort schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I receive a certificate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Completion documentation is issued to interns who meet all stated program requirements. This is not a third-party accredited credential but serves as a portfolio and professional reference document.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is employment guaranteed after the internship?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Completion of the internship program does not guarantee employment or job placement. The program is designed to build experience, skills, and portfolio pieces that support your own job search.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are gig projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gig projects are short-term, one-time project opportunities that may become available to qualified interns and alumni as they arise. These are not guaranteed and are subject to availability. In some cases they may include compensation. They are separate from the internship program itself.',
      },
    },
  ],
};

// ── Tracks data ───────────────────────────────────────────────────────────────

const TRACKS = [
  {
    id: 'web-design',
    icon: Monitor,
    title: 'Web Design & Development',
    subtitle: 'Frontend + Backend',
    color: '#4B1E91',
    description:
      'Build real websites from scratch. Learn HTML, CSS, JavaScript, and React on the frontend. Get introduced to backend concepts including APIs, databases, and server-side fundamentals.',
    skills: ['HTML & CSS', 'JavaScript & React', 'Responsive Design', 'Backend Fundamentals', 'Version Control (Git)', 'Deployment Basics'],
    build: 'Live websites, React components, and a frontend portfolio.',
    bestFor: 'Beginners and students interested in coding, web development, or tech careers.',
    img: development,
  },
  {
    id: 'ux-ui',
    icon: Layers,
    title: 'UX/UI Design',
    subtitle: 'User Experience & Interface',
    color: '#C9A84C',
    description:
      'Design products people love to use. Learn user research, wireframing, prototyping, and interface design using industry-standard tools. Understand how great design decisions get made.',
    skills: ['User Research Methods', 'Wireframing & Prototyping', 'Figma Fundamentals', 'Design Systems', 'Usability Testing', 'Case Study Writing'],
    build: 'Design mockups, user flows, wireframes, and a UX case study.',
    bestFor: 'Creative thinkers interested in design, product, or human-centered experience.',
    img: study,
  },
  {
    id: 'digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing',
    subtitle: 'SEO, Content & Analytics',
    color: '#4B1E91',
    description:
      'Drive real results online. Learn SEO, email marketing, content strategy, Google Analytics, and campaign planning. Understand how businesses grow their online presence.',
    skills: ['SEO Fundamentals', 'Content Strategy', 'Email Marketing', 'Google Analytics', 'Campaign Planning', 'Keyword Research'],
    build: 'SEO audits, content calendars, email campaigns, and an analytics report.',
    bestFor: 'Students and career changers drawn to marketing, communications, or business growth.',
    img: meeting,
  },
  {
    id: 'social-media',
    icon: Share2,
    title: 'Social Media Management',
    subtitle: 'Content, Strategy & Community',
    color: '#C9A84C',
    description:
      'Build brands and grow audiences across platforms. Learn platform strategy, content creation, community management, scheduling tools, and how to measure what works.',
    skills: ['Platform Strategy', 'Content Creation', 'Brand Voice', 'Scheduling & Tools', 'Community Management', 'Performance Metrics'],
    build: 'Content calendars, brand voice guides, post templates, and a platform strategy deck.',
    bestFor: 'Creative communicators who enjoy storytelling, brand building, and audience engagement.',
    img: EPDG,
  },
  {
    id: 'sales-marketing',
    icon: Briefcase,
    title: 'Sales & Marketing',
    subtitle: 'Strategy, Outreach & Conversion',
    color: '#4B1E91',
    description:
      'Learn how to sell with confidence and strategy. Cover lead generation, client communication, pitch development, and the fundamentals of building a pipeline and closing conversations.',
    skills: ['Sales Fundamentals', 'Lead Generation', 'Client Communication', 'Pitch Development', 'CRM Basics', 'Objection Handling'],
    build: 'Sales scripts, pitch decks, outreach templates, and a lead generation plan.',
    bestFor: 'Communicators and entrepreneurs who want to build confidence in sales and business development.',
    img: sales,
  },
];

// ── How It Works ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: '01',
    title: 'Apply Online',
    body: 'Fill out the application form. No resume required — just your goals, your track of interest, and your availability. Applications are reviewed on a rolling basis.',
  },
  {
    step: '02',
    title: 'Get Matched & Onboarded',
    body: 'Once accepted, you receive a welcome email with your track assignment, onboarding materials, and your weekly schedule. No experience required to start.',
  },
  {
    step: '03',
    title: 'Complete Weekly Assignments',
    body: 'Work through weekly assignments, team projects, and communication exercises at your own pace. All work is done virtually — no commute, no relocation.',
  },
  {
    step: '04',
    title: 'Build Your Portfolio & Complete',
    body: 'Finish your track requirements, collect your portfolio pieces, and receive your completion documentation. Use your experience to strengthen your resume and job search.',
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQS = SCHEMA_FAQ.mainEntity.map((q) => ({
  q: q.name,
  a: q.acceptedAnswer.text,
}));

// ── Application form URL ──────────────────────────────────────────────────────

const APPLY_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform?embedded=true';

// ── Sub-components ────────────────────────────────────────────────────────────

const TrackCard: React.FC<(typeof TRACKS)[0] & { open: boolean; onToggle: () => void }> = ({
  icon: Icon, title, subtitle, color, description, skills, build, bestFor, img, open, onToggle,
}) => (
  <motion.div
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 24 }}
    viewport={{ once: true }}
    transition={{ duration: 0.38 }}
    className="bg-white border border-neutral-100 overflow-hidden"
  >
    {/* Card header image */}
    <div className="relative h-44 overflow-hidden bg-[#1C1336]">
      <img src={img} alt={title} className="w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div
          className="inline-flex items-center gap-2 px-2 py-1 w-fit mb-2"
          style={{ backgroundColor: color }}
        >
          <Icon size={12} className="text-white" />
          <span className="font-mono text-white text-xs uppercase tracking-widest">{subtitle}</span>
        </div>
        <h3 className="font-black text-white text-lg leading-snug uppercase">{title}</h3>
      </div>
    </div>

    {/* Card body */}
    <div className="p-6">
      <p className="text-neutral-500 text-sm leading-relaxed mb-4">{description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills.map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 font-mono text-xs uppercase tracking-wider bg-neutral-100 text-neutral-600"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Toggle details */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full font-mono text-xs text-[#4B1E91] uppercase tracking-wider py-2 border-t border-neutral-100"
      >
        {open ? 'Show Less' : 'What You\'ll Build + Best For'}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              <div>
                <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-1">What You'll Build</p>
                <p className="text-xs text-neutral-600 leading-relaxed">{build}</p>
              </div>
              <div>
                <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-1">Best For</p>
                <p className="text-xs text-neutral-600 leading-relaxed">{bestFor}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

// ── ApplicationForm ───────────────────────────────────────────────────────────

const ApplicationForm: React.FC = () => {
  const [loadCount, setLoadCount] = useState(0);
  const submitted = loadCount >= 2;

  return (
    <div className="bg-white border border-neutral-100">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-[#C9A84C] text-[#1C1336] text-2xl font-bold mb-6">
            ✓
          </div>
          <h3 className="font-bold text-[#1C1336] text-2xl uppercase mb-3">Application Submitted!</h3>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-8">
            Thank you for applying. Our team will review your application and follow up within 48 business hours.
          </p>
          <Link
            to="/contact"
            className="border border-[#4B1E91] text-[#4B1E91] font-mono text-xs uppercase tracking-wider py-3 px-8 hover:bg-[#4B1E91] hover:text-white transition-colors duration-200"
          >
            Have a Question? Contact Us
          </Link>
        </div>
      ) : (
        <iframe
          src={APPLY_FORM}
          title="Internship Application Form"
          onLoad={() => setLoadCount((n) => n + 1)}
          className="w-full h-135 border-0"
          allow="camera; microphone"
        />
      )}
    </div>
  );
};

// ── FAQ Accordion ─────────────────────────────────────────────────────────────

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="font-bold text-[#1C1336] text-sm pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[#4B1E91] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-neutral-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const GlobalInternship: React.FC = () => {
  const [openTrack, setOpenTrack] = useState<string | null>(null);

  const toggleTrack = (id: string) =>
    setOpenTrack((prev) => (prev === id ? null : id));

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-[#FAFAF9] font-sans antialiased">

      {/* ── SEO ── */}
      <Helmet>
        <title>Free Virtual Internship Program | Emerson Professional Development</title>
        <meta
          name="description"
          content="Gain real-world experience with our free, fully-remote internship tracks in web design, UX/UI, digital marketing, social media & sales. Open to students worldwide. No experience required."
        />
        <meta name="keywords" content="free online internship, virtual internship program, remote internship no experience, web design internship, digital marketing internship, UX UI design internship, social media internship, sales marketing internship, international internship remote, career changer internship" />
        <meta property="og:title" content="Free Virtual Internship Program | Emerson Professional Development" />
        <meta property="og:description" content="Free, fully-remote internship tracks in web design, UX/UI, digital marketing, social media & sales. Open worldwide." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA_PROGRAM)}</script>
        <script type="application/ld+json">{JSON.stringify(SCHEMA_FAQ)}</script>
      </Helmet>

      {/* ── Hero ── */}
      <div className="bg-[#1C1336] text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-24 max-w-7xl">
          <motion.span
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="inline-block font-mono text-[#C9A84C] text-xs uppercase tracking-[4px] mb-4"
          >
            Emerson Professional Development Group
          </motion.span>

          <motion.h1
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-none tracking-tight mb-6 max-w-4xl"
          >
            Free Virtual<br />
            <span className="text-[#C9A84C]">Internship Program</span>
          </motion.h1>

          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="max-w-2xl text-white/65 text-base leading-relaxed mb-10"
          >
            An unpaid, fully remote internship program in web design, UX/UI design, digital marketing,
            social media, or sales. Free to join, open worldwide, no experience required.
            Build real portfolio work — and stay connected for gig projects and job opportunities as they arise.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#application-form"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-4 font-mono font-bold text-[#1C1336] text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Apply Now — It's Free
              <ArrowRight size={14} />
            </a>
            <a
              href="#tracks"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#C9A84C]/60 hover:bg-white/5 px-8 py-4 font-mono text-white text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Explore Tracks ↓
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8 max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: Globe,  stat: '100% Remote',  label: 'Work from anywhere'         },
                { icon: Star,   stat: 'Unpaid',       label: 'Free to join, no wages'     },
                { icon: Clock,  stat: '10 – 16 Weeks',label: 'Semester-based program'     },
                { icon: Users,  stat: '5 Tracks',     label: 'Choose your focus area'     },
              ].map(({ icon: Icon, stat, label }) => (
                <div key={stat} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-[#C9A84C]/15 shrink-0">
                    <Icon size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm leading-none">{stat}</p>
                    <p className="font-mono text-white/40 text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Who Can Apply ── */}
      <section className="bg-white border-b border-neutral-100 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Who Can Apply</p>
              <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-4">
                Students, Graduates &amp; Career Changers Welcome.
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                This program was built for people who want to build real skills and real experience —
                not just add another certification to a shelf. If you're willing to show up, complete
                assignments, and put in the work, you belong here.
              </p>
              <ul className="space-y-3">
                {[
                  'Current students at any level',
                  'Recent graduates looking for practical experience',
                  'Career changers entering tech, design, or marketing',
                  'International applicants — no visa required',
                  'Beginners with no prior professional experience',
                  'Professionals seeking to expand into new skill areas',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src={meeting}
                alt="Internship program collaboration"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#1C1336]/90 px-4 py-3">
                <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-0.5">Disclaimer</p>
                <p className="text-white/60 text-xs leading-relaxed">
                  This is an unpaid program. No wages or stipends are provided. Completion does not guarantee employment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section id="tracks" className="py-20 scroll-mt-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Internship Tracks</p>
          <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-3">
            Choose Your Track.
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-10 max-w-2xl">
            Five focus areas. Pick the one that matches your goals — or apply and tell us where you want to grow.
          </p>

          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((track) => (
              <TrackCard
                key={track.id}
                {...track}
                open={openTrack === track.id}
                onToggle={() => toggleTrack(track.id)}
              />
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-[#1C1336] text-white py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Process</p>
          <h2 className="font-black text-white text-2xl sm:text-3xl uppercase leading-tight mb-12">
            How Our Free Virtual Internship Works.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="relative">
                <span className="block font-black text-[#C9A84C]/15 text-[64px] leading-none select-none mb-4">
                  {s.step}
                </span>
                <h3 className="font-bold text-white text-sm mb-2">{s.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section id="portfolio" className="py-20 scroll-mt-20 bg-white border-b border-neutral-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Portfolio & Experience</p>
              <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-4">
                What You'll Build &amp; Take With You.
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                The internship isn't about watching videos. It's about doing the work. By the time you
                finish your track, you'll have real, shareable portfolio pieces you can show employers.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Real project work', body: 'Weekly assignments and team projects that produce actual deliverables — not hypotheticals.' },
                  { label: 'Portfolio documentation', body: 'Guidance on how to present your work, write about your experience, and frame it for job applications.' },
                  { label: 'Professional communication practice', body: 'Written communication, feedback cycles, and collaboration experience in a professional setting.' },
                  { label: 'Track-specific deliverables', body: 'Each track produces specific outputs — code, designs, campaigns, or strategy documents — that are yours to keep.' },
                ].map((item) => (
                  <div key={item.label} className="pl-4 border-l-2 border-[#4B1E91]/30">
                    <p className="font-bold text-[#1C1336] text-sm mb-1">{item.label}</p>
                    <p className="text-neutral-500 text-xs leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src={study}
              alt="Intern working on portfolio project"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Beyond the Program ── */}
      <section className="py-20 bg-[#1C1336] text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">What Comes Next</p>
          <h2 className="font-black text-white text-2xl sm:text-3xl uppercase leading-tight mb-3">
            Beyond the Internship.
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-10 max-w-2xl">
            Completing the program is the foundation. Here's what may be available to qualified interns and alumni — subject to availability, not guaranteed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Gig Projects */}
            <div className="border border-[#C9A84C]/25 p-8">
              <div className="flex items-center justify-center w-10 h-10 bg-[#C9A84C]/15 mb-5">
                <Briefcase size={18} className="text-[#C9A84C]" />
              </div>
              <div className="inline-block px-2 py-0.5 bg-[#C9A84C] font-mono text-[#1C1336] text-xs uppercase tracking-widest mb-4">
                One-Time Gig Projects
              </div>
              <h3 className="font-black text-white text-lg uppercase leading-tight mb-3">
                Short-Term Project Work
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                As client projects, community work, and internal assignments arise, qualified interns and program alumni may be considered for short-term, one-time gig projects in their track area. These are project-based engagements — not employment — and may include compensation depending on the project scope.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Available to interns and program alumni',
                  'Project-based, not ongoing employment',
                  'May include compensation depending on scope',
                  'Subject to availability — not guaranteed',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={13} className="text-[#C9A84C] mt-0.5 shrink-0" />
                    <span className="text-white/55 text-xs">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-[#C9A84C]/50 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 px-5 py-3 font-mono text-[#C9A84C] text-xs uppercase tracking-wider transition-colors duration-200"
              >
                Express Interest
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Job Placement */}
            <div className="border border-[#4B1E91] p-8">
              <div className="flex items-center justify-center w-10 h-10 bg-[#4B1E91]/30 mb-5">
                <Users size={18} className="text-white" />
              </div>
              <div className="inline-block px-2 py-0.5 bg-[#4B1E91] font-mono text-white text-xs uppercase tracking-widest mb-4">
                Job Placement Opportunities
              </div>
              <h3 className="font-black text-white text-lg uppercase leading-tight mb-3">
                Connections When Available
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                When job openings, referral opportunities, or employer connections become available through our network, completed interns in good standing may be considered for referrals or introductions. We are not a staffing agency. Placement is not guaranteed.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Available to interns who complete in good standing',
                  'Network referrals and introductions when available',
                  'Not a staffing service — no placement guarantee',
                  'Opportunities shared as they arise',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={13} className="text-white/40 mt-0.5 shrink-0" />
                    <span className="text-white/55 text-xs">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 px-5 py-3 font-mono text-white/70 text-xs uppercase tracking-wider transition-colors duration-200"
              >
                Learn More
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

          {/* Honest disclaimer */}
          <div className="mt-8 px-5 py-4 border border-white/10 bg-white/5">
            <p className="font-mono text-white/30 text-xs uppercase tracking-widest mb-1">Important</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Gig project opportunities and job placement connections are not guaranteed and are entirely subject to availability. Completing the internship program does not automatically qualify anyone for these opportunities. The internship is, at its core, an unpaid educational and experience-building program.
            </p>
          </div>
        </div>
      </section>

      {/* ── Evidence & Certificates ── */}
      <section id="evidence-certificates" className="py-20 scroll-mt-20 bg-[#4B1E91]/5">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Evidence &amp; Certificates</p>
          <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-3">
            What You Receive Upon Completion.
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-10 max-w-2xl">
            Interns who meet all stated program requirements receive completion documentation and portfolio evidence. Here's what that means.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: Award,
                title: 'Completion Documentation',
                body: 'A written record of your participation, track, duration, and accomplishments — issued by Emerson Professional Development Group when all requirements are met.',
              },
              {
                icon: BookOpen,
                title: 'Portfolio Evidence',
                body: 'The actual work you produce during the internship — deliverables, projects, and documents you can present directly to employers or include in a portfolio.',
              },
              {
                icon: Star,
                title: 'Professional Reference',
                body: 'Interns who complete the program in good standing may request a professional reference letter to support job applications, internship applications, or school admissions.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white p-6 border border-neutral-100">
                <div className="flex items-center justify-center w-10 h-10 bg-[#4B1E91]/10 mb-4">
                  <Icon size={18} className="text-[#4B1E91]" />
                </div>
                <h3 className="font-bold text-[#1C1336] text-sm mb-2">{title}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#1C1336] px-6 py-4 border-l-4 border-[#C9A84C]">
            <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-1">Important Note</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Completion documentation issued by Emerson Professional Development Group is not a third-party accredited
              certification and is not recognized by any licensing or academic body unless independently arranged.
              Intern names and data are not published publicly without explicit written consent.
            </p>
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="application-form" className="py-20 scroll-mt-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Apply Now</p>
          <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-3">
            Start Your Application.
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Applications are reviewed on a rolling basis. No resume required. Just your goals and your
            commitment to show up and do the work.
          </p>
          <div className="border-t-4 border-[#C9A84C]">
            <ApplicationForm />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#FAFAF9] border-t border-neutral-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="font-black text-[#1C1336] text-2xl sm:text-3xl uppercase leading-tight mb-8">
            Frequently Asked Questions.
          </h2>
          <div className="bg-white border border-neutral-100 px-6">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <div className="bg-[#4B1E91] text-white py-20">
        <div className="mx-auto px-6 max-w-4xl text-center">
          <p className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Ready to Start?</p>
          <h2 className="font-black text-3xl sm:text-4xl uppercase leading-tight mb-4">
            Apply for the Free Internship Program.
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            No experience required. No cost. Fully remote. Pick your track and apply today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#application-form"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-4 font-mono font-bold text-[#1C1336] text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Apply Now — It's Free
              <ArrowRight size={14} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/60 px-8 py-4 font-mono text-white text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GlobalInternship;
