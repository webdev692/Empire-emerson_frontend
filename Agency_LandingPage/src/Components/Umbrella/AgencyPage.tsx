import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileText, TrendingUp, Briefcase,
  CheckCircle, ArrowRight, ChevronDown, X,
  BookOpen, Home, DollarSign, Users,
} from 'lucide-react';
import { Agency1, Tax, Taxing, Consult, study } from '../../assets';

// â”€â”€ SEO schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'The Emerson Agency LLC',
  description:
    'Education-centered financial guidance covering insurance education, tax readiness, tax preparation, financial literacy, household budgeting, credit education, and small business startup support.',
  url: 'https://www.theemersonempire.com/agency',
  parentOrganization: { '@type': 'Organization', name: 'The Emerson Empire' },
  serviceType: [
    'Tax Preparation',
    'Financial Education',
    'Insurance Education',
    'Credit and Debt Education',
    'Small Business Support',
    'Household Financial Organization',
  ],
  areaServed: { '@type': 'Country', name: 'United States' },
};

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between tax preparation and tax readiness?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tax readiness is the process of organizing your documents, understanding what you need, and preparing questions before you file. Tax preparation is the actual completion of your tax return. We offer both: a readiness review to get your documents in order, and preparation support for eligible individuals and small businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide licensed financial advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The Emerson Agency LLC provides education-centered support, not licensed financial, legal, or investment advice. Our services are designed to help you understand your options, organize your documents, and make more informed decisions â€” not to act as a licensed advisor.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I improve my credit score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our credit and debt education sessions help you understand how credit scores work, what factors influence them, how to read a credit report, and what habits tend to support improvement over time. We provide educational support only â€” we cannot guarantee credit score changes or debt removal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I know before buying insurance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our insurance education sessions cover key terms (premiums, deductibles, beneficiaries, coverage limits), common types of coverage (health, auto, renter\'s, life), and the questions to ask before choosing a policy. This is educational support â€” we are not a licensed insurance agency and do not sell insurance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I organize finances for a new small business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our small business startup organization service helps new founders separate personal and business finances, set up basic record-keeping, understand their tax obligations, and build an operational foundation. We work with people who have a skill or service and want to formalize it properly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are fee waivers available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Fee waivers and sliding-scale pricing are available for many services based on financial need and program capacity. Request a waiver when you submit your service request and we will review your situation.',
      },
    },
  ],
};

// â”€â”€ Form URLs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FORM_SERVICES = 'https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform?embedded=true';
const FORM_BUSINESS = 'https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform?embedded=true';

// â”€â”€ Service categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CATEGORIES = [
  {
    id: 'insurance',
    icon: Shield,
    label: 'Insurance',
    title: 'Insurance Education Without the Sales Pitch',
    tagline: 'Insurance Education',
    color: '#C9A84C',
    img: Agency1,
    summary: 'Understand your coverage options, common insurance terms, and the questions to ask before making decisions. No sales. No pressure.',
    services: [
      { name: 'Insurance Needs Review', note: 'Free initial conversation' },
      { name: 'Insurance Education Session', note: 'Low-cost or partner-sponsored' },
      { name: 'Policy Review & Organization', note: 'Sliding-scale available' },
    ],
    bullets: [
      'Health, auto, renter\'s, and life insurance basics',
      'How to read a policy summary',
      'Premiums, deductibles, and coverage limits explained',
      'What questions to ask your agent or provider',
      'Identifying gaps in household protection',
    ],
    disclaimer: 'The Emerson Agency LLC is not a licensed insurance agency and does not sell insurance products.',
    formUrl: FORM_SERVICES,
    formTitle: 'Insurance Education Support',
  },
  {
    id: 'tax',
    icon: FileText,
    label: 'Tax',
    title: 'Tax Preparation & Tax Readiness Planning',
    tagline: 'Tax Services',
    color: '#4B1E91',
    img: Tax,
    summary: 'From document organization to tax preparation for individuals and small businesses â€” practical, accessible support at every step of the tax process.',
    services: [
      { name: 'Tax Preparation Intake',                        note: 'Document review, free screening' },
      { name: 'Individual Tax Preparation',                    note: 'Pricing varies by complexity' },
      { name: 'Self-Employed / Small Business Tax Prep',       note: 'Custom quote' },
    ],
    bullets: [
      'Tax readiness checklist for individuals and families',
      'W-2, 1099, and common form identification',
      'Document organization before you file',
      'Preparation support for standard and moderate returns',
      'Guidance for freelancers, contractors, and small business owners',
    ],
    disclaimer: 'Tax preparation support is subject to document review, eligibility, and service capacity. Complex tax situations may require a licensed CPA or enrolled agent.',
    formUrl: FORM_SERVICES,
    formTitle: 'Tax Readiness & Preparation Support',
  },
  {
    id: 'financial',
    icon: TrendingUp,
    label: 'Financial Education',
    title: 'Financial Education & Household Organization',
    tagline: 'Financial Literacy',
    color: '#C9A84C',
    img: study,
    summary: 'Practical financial literacy for individuals, families, and households. Learn how to budget, organize bills, understand credit, and build a more stable financial foundation.',
    services: [
      { name: 'Financial Education Consultation',  note: 'Low-cost or sliding-scale' },
      { name: 'Household Financial Organization',  note: 'Pricing varies' },
      { name: 'Credit & Debt Education',           note: 'Educational support only' },
    ],
    bullets: [
      'Budgeting systems for households and families',
      'Organizing bills, income, and financial documents',
      'Understanding credit reports and credit scores',
      'Debt organization and payment habits',
      'Setting financial goals and tracking progress',
    ],
    disclaimer: 'Credit and debt education is educational support only. We cannot guarantee credit score improvements, debt removal, or loan approval.',
    formUrl: FORM_SERVICES,
    formTitle: 'Financial Education Support',
  },
  {
    id: 'business',
    icon: Briefcase,
    label: 'Business',
    title: 'Small Business Startup & Operations Support',
    tagline: 'Business Support',
    color: '#4B1E91',
    img: Consult,
    summary: 'From business idea to operational foundation. We help new founders and small businesses organize their structure, finances, and systems â€” so they can run like a real business.',
    services: [
      { name: 'Small Business Startup Organization', note: 'Consultation pricing varies' },
      { name: 'Business Operations Support',         note: 'Hourly, package, or monthly' },
    ],
    bullets: [
      'Business structure basics (LLC, sole proprietor, etc.)',
      'Separating personal and business finances',
      'Basic record-keeping and bookkeeping setup',
      'Tax readiness for new businesses',
      'Client intake, scheduling, and workflow systems',
    ],
    disclaimer: null,
    formUrl: FORM_BUSINESS,
    formTitle: 'Business Consultation',
  },
];

// â”€â”€ Form modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type ModalState = { title: string; formUrl: string } | null;

const ServiceModal: React.FC<{ modal: NonNullable<ModalState>; onClose: () => void }> = ({ modal, onClose }) => {
  const [loadCount, setLoadCount] = useState(0);
  const submitted = loadCount >= 2;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative flex flex-col bg-white border-[#C9A84C] border-t-4 w-full max-w-xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-4 border-neutral-100 border-b shrink-0">
            <div>
              <p className="mb-0.5 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">Service Request</p>
              <h3 className="font-bold text-[#0A1128] text-sm">{modal.title}</h3>
            </div>
            <button onClick={onClose} className="flex justify-center items-center w-8 h-8 text-neutral-400 hover:text-[#0A1128] transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {submitted ? (
              <div className="flex flex-col justify-center items-center px-8 py-16 h-full text-center">
                <div className="flex justify-center items-center bg-[#C9A84C] mb-6 w-16 h-16 font-bold text-[#0A1128] text-2xl">âœ“</div>
                <h4 className="mb-3 font-bold text-[#0A1128] text-xl uppercase">Request Submitted!</h4>
                <p className="mb-8 max-w-xs text-neutral-500 text-sm leading-relaxed">
                  Our team will follow up within 24â€“48 business hours.
                </p>
                <button
                  onClick={onClose}
                  className="hover:bg-[#4B1E91] px-8 py-3 border border-[#4B1E91] font-mono text-[#4B1E91] hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <iframe
                src={modal.formUrl}
                title="Service Request Form"
                onLoad={() => setLoadCount((n) => n + 1)}
                className="border-0 w-full h-135"
                allow="camera; microphone"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// â”€â”€ FAQ accordion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-neutral-100 last:border-0 border-b">
      <button onClick={() => setOpen(!open)} className="flex justify-between items-center gap-4 py-5 w-full text-left">
        <span className="font-bold text-[#0A1128] text-sm">{q}</span>
        <ChevronDown size={16} className={`text-[#4B1E91] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-neutral-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const AgencyPage: React.FC = () => {
  const [modal, setModal] = useState<ModalState>(null);

  const openModal = (title: string, formUrl: string) => setModal({ title, formUrl });
  const closeModal = () => setModal(null);

  return (
    <div className="bg-white pt-16 sm:pt-20 min-h-screen font-sans antialiased">

      {/* â”€â”€ SEO â”€â”€ */}
      <Helmet>
        <title>Financial Education, Tax Preparation & Business Support | The Emerson Agency</title>
        <meta
          name="description"
          content="Expert financial education, tax readiness, insurance literacy, credit education, and small business startup support. Sliding-scale pricing. Fee waivers available. No sales pressure."
        />
        <meta name="keywords" content="tax preparation services, tax readiness planning, financial education for families, insurance education, credit and debt education, household budgeting organization, small business startup planning, business operations support, financial literacy coaching, debt management strategies, personal finance organization, small business tax planning, fee waiver financial services" />
        <meta property="og:title" content="Financial Education, Tax & Business Support | The Emerson Agency" />
        <meta property="og:description" content="Education-centered financial guidance: tax prep, insurance literacy, credit education, budgeting, and small business support. Accessible pricing, fee waivers available." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA_ORG)}</script>
        <script type="application/ld+json">{JSON.stringify(SCHEMA_FAQ)}</script>
      </Helmet>

      {/* â”€â”€ Hero â”€â”€ */}
      <div className="bg-[#0A1128] text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 max-w-7xl">
          <div className="items-center gap-8 lg:gap-16 grid lg:grid-cols-2">
            <div>
              <motion.span
                whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
                className="inline-block mb-4 font-mono text-[#C9A84C] text-xs uppercase tracking-[4px]"
              >
                The Emerson Agency LLC
              </motion.span>
              <motion.h1
                whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="mb-6 font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight tracking-tight"
              >
                Financial Education,<br />
                Tax Readiness &amp;<br />
                <span className="text-[#C9A84C]">Business Support.</span>
              </motion.h1>
              <motion.p
                whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="mb-10 max-w-lg text-white/65 text-sm leading-relaxed"
              >
                Education-centered guidance for individuals, families, and small businesses.
                Insurance literacy, tax preparation, household budgeting, credit education,
                and startup support â€” all in one place, with accessible pricing and fee waivers available.
              </motion.p>
              <div className="flex sm:flex-row flex-col gap-4">
                <button
                  onClick={() => openModal('Request Services', FORM_SERVICES)}
                  className="inline-flex justify-center items-center gap-2 bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-3.5 font-mono font-bold text-[#0A1128] text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Request Services
                  <ArrowRight size={14} />
                </button>
                <a
                  href="#services"
                  className="inline-flex justify-center items-center gap-2 hover:bg-white/5 px-8 py-3.5 border border-white/20 hover:border-[#C9A84C]/60 font-mono text-white text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Explore All Services â†“
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src={Agency1} alt="The Emerson Agency financial education" className="w-full h-104 object-cover" />
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="border-white/10 border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
            <div className="gap-6 sm:gap-8 grid grid-cols-2 sm:grid-cols-4">
              {[
                { icon: BookOpen,   label: 'Education-First',        sub: 'No sales pressure'         },
                { icon: DollarSign, label: 'Sliding-Scale Pricing',  sub: 'Pay what you can'          },
                { icon: Home,       label: 'Household Focus',        sub: 'Families & individuals'    },
                { icon: Users,      label: 'Small Business Ready',   sub: 'Startups & entrepreneurs'  },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-[#C9A84C]/15 w-10 h-10 shrink-0">
                    <Icon size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs leading-none">{label}</p>
                    <p className="mt-0.5 font-mono text-white/40 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Service category quick-jump â”€â”€ */}
      <div id="services" className="bg-[#FAFAF9] py-12 border-neutral-100 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-3 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">What We Offer</p>
          <h2 className="mb-8 font-black text-[#0A1128] text-2xl sm:text-3xl uppercase leading-tight">
            Four Core Service Areas.
          </h2>
          <div className="gap-4 lg:gap-6 grid grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="group flex flex-col items-start bg-white hover:shadow-md p-6 border border-neutral-100 hover:border-[#4B1E91]/30 transition-all duration-200"
                >
                  <div
                    className="flex justify-center items-center mb-3 w-10 h-10"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon size={18} style={{ color: cat.color }} />
                  </div>
                  <p className="mb-1 font-mono text-xs uppercase tracking-widest" style={{ color: cat.color }}>
                    {cat.tagline}
                  </p>
                  <p className="font-bold text-[#0A1128] group-hover:text-[#4B1E91] text-sm leading-snug transition-colors">
                    {cat.label}
                  </p>
                  <p className="mt-1 text-neutral-400 text-xs">
                    {cat.services.length} services â†“
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* â”€â”€ Individual service sections â”€â”€ */}
      {CATEGORIES.map((cat, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section
            key={cat.id}
            id={cat.id}
            className={`py-16 sm:py-20 lg:py-24 scroll-mt-20 border-b border-neutral-100 ${isEven ? 'bg-white' : 'bg-[#FAFAF9]'}`}
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start ${!isEven ? 'lg:grid-flow-dense' : ''}`}>

                {/* Text */}
                <div className={!isEven ? 'lg:col-start-2' : ''}>
                  <div className="mb-4 pl-3" style={{ borderLeft: `3px solid ${cat.color}` }}>
                    <span className="font-mono text-xs uppercase tracking-[4px]" style={{ color: cat.color }}>
                      {cat.tagline}
                    </span>
                  </div>
                  <h2 className="mb-6 font-black text-[#0A1128] text-3xl sm:text-4xl uppercase leading-tight">
                    {cat.title}
                  </h2>
                  <p className="mb-6 text-neutral-500 text-sm leading-relaxed">{cat.summary}</p>

                  {/* What's covered */}
                  <div className="mb-6">
                    <p className="mb-3 font-mono text-[#4B1E91] text-xs uppercase tracking-widest">What's Covered</p>
                    <ul className="space-y-2">
                      {cat.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: cat.color }} />
                          <span className="text-neutral-600 text-sm">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services list */}
                  <div className="space-y-2 mb-8">
                    {cat.services.map((s) => (
                      <div key={s.name} className="flex justify-between items-center bg-white px-4 py-3 border border-neutral-100">
                        <span className="font-bold text-[#0A1128] text-sm">{s.name}</span>
                        <span className="ml-4 font-mono text-neutral-400 text-xs shrink-0">{s.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  {cat.disclaimer && (
                    <div className="bg-[#0A1128]/4 mb-6 px-4 py-3 border-neutral-300 border-l-2">
                      <p className="text-neutral-500 text-xs italic leading-relaxed">{cat.disclaimer}</p>
                    </div>
                  )}

                  <button
                    onClick={() => openModal(cat.formTitle, cat.formUrl)}
                    className="inline-flex items-center gap-2 hover:shadow-md px-8 py-4 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200"
                    style={{ backgroundColor: cat.color, color: cat.color === '#C9A84C' ? '#0A1128' : '#ffffff' }}
                  >
                    Request {cat.tagline}
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Image */}
                <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* â”€â”€ How to get started â”€â”€ */}
      <section className="bg-[#0A1128] py-20 text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-3 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">Process</p>
          <h2 className="mb-12 font-black text-white text-2xl sm:text-3xl uppercase leading-tight">
            Getting Started With Your Financial Goals.
          </h2>
          <div className="gap-10 lg:gap-12 grid grid-cols-1 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Submit a Service Request',
                body: 'Fill out the service request form. Tell us what you need and a little about your situation. No long applications â€” just a starting point.',
              },
              {
                step: '02',
                title: 'We Follow Up Within 48 Hours',
                body: 'Our team reviews your request and follows up to confirm the right service, clarify any details, and discuss pricing or fee waiver options.',
              },
              {
                step: '03',
                title: 'Get the Support You Need',
                body: 'Work with our team through your selected service â€” whether it\'s a consultation, an educational session, tax preparation, or ongoing support.',
              },
            ].map((s) => (
              <div key={s.step}>
                <span className="block mb-4 font-black text-[#C9A84C]/20 text-7xl lg:text-8xl leading-none select-none">
                  {s.step}
                </span>
                <h3 className="mb-2 font-bold text-white text-sm">{s.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Tax Preparation highlight â”€â”€ */}
      <section className="bg-[#4B1E91]/5 py-20 border-neutral-100 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="items-center gap-12 lg:gap-16 grid lg:grid-cols-2">
            <img src={Taxing} alt="Tax preparation and readiness services" className="w-full h-72 sm:h-80 lg:h-96 object-cover" />
            <div>
              <p className="mb-3 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">Tax Season Ready</p>
              <h2 className="mb-4 font-black text-[#0A1128] text-2xl sm:text-3xl uppercase leading-tight">
                Don't Let Tax Season Catch You Unprepared.
              </h2>
              <p className="mb-6 text-neutral-500 text-sm leading-relaxed">
                Whether you're a W-2 employee, a freelancer, a contractor, or a small business owner â€”
                the tax process starts well before April. We help you get documents in order, understand
                what forms you need, and determine whether you qualify for free public filing pathways
                or need paid preparation support.
              </p>
              <div className="gap-4 grid grid-cols-2 mb-10">
                {[
                  'Tax readiness checklist',
                  'W-2 and 1099 review',
                  'Document organization',
                  'Self-employed filing guidance',
                  'Individual tax preparation',
                  'Business tax prep support',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-[#C9A84C] shrink-0" />
                    <span className="text-neutral-600 text-xs">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => openModal('Tax Readiness & Preparation', FORM_SERVICES)}
                className="inline-flex items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] px-8 py-4 font-mono font-bold text-white text-xs uppercase tracking-wider transition-colors duration-200"
              >
                Request Tax Support
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€ */}
      <section className="bg-white py-20 border-neutral-100 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="mb-3 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">FAQ</p>
          <h2 className="mb-8 font-black text-[#0A1128] text-2xl sm:text-3xl uppercase leading-tight">
            Frequently Asked Questions.
          </h2>
          <div className="px-6 sm:px-8 border border-neutral-100">
            {SCHEMA_FAQ.mainEntity.map((item) => (
              <FAQItem key={item.name} q={item.name} a={item.acceptedAnswer.text} />
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Bottom CTA â”€â”€ */}
      <div className="bg-[#C9A84C] py-20">
        <div className="mx-auto px-6 max-w-4xl text-center">
          <p className="mb-4 font-mono text-[#0A1128]/60 text-xs uppercase tracking-widest">Ready to Get Started?</p>
          <h2 className="mb-4 font-black text-[#0A1128] text-3xl sm:text-4xl uppercase leading-tight">
            Get the Financial Support You Deserve.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[#0A1128]/70 text-sm leading-relaxed">
            Fee waivers available. No sales pressure. Education-first approach.
            Submit a request and our team will follow up within 24â€“48 business hours.
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
            <button
              onClick={() => openModal('Request Services â€” The Emerson Agency', FORM_SERVICES)}
              className="inline-flex justify-center items-center gap-2 bg-[#0A1128] hover:bg-[#1b2547] px-8 py-4 font-mono font-bold text-white text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Request Services
              <ArrowRight size={14} />
            </button>
            <Link
              to="/contact"
              className="inline-flex justify-center items-center gap-2 hover:bg-[#0A1128]/5 px-8 py-4 border border-[#0A1128]/30 hover:border-[#0A1128] font-mono text-[#0A1128] text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Have Questions? Contact Us
            </Link>
          </div>
          <p className="mt-8 font-mono text-[#0A1128]/40 text-xs">
            The Emerson Agency LLC is not a licensed financial advisor, CPA, or insurance agency.
            All services are education-centered. <Link to="/disclaimer" className="hover:text-[#0A1128]/70 underline">Read full disclaimer.</Link>
          </p>
        </div>
      </div>

      {/* â”€â”€ Modal â”€â”€ */}
      {modal && <ServiceModal modal={modal} onClose={closeModal} />}

    </div>
  );
};

export default AgencyPage;
