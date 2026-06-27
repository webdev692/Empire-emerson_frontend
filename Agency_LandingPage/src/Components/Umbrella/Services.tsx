import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Users, BookOpen, Briefcase, Shield,
  TrendingUp, Award, Target, FileText, Building, Globe,
  Star, ChevronRight, X,
} from 'lucide-react';
import { empire, Agency1, Logo2} from '../../assets';

// ── Types ─────────────────────────────────────────────────────────────────────

type ActionType = 'services-form' | 'business-form' | 'internship-form' | 'to-classes';

type ServiceItem = {
  title: string;
  category: string;
  description: string;
  bestFor: string;
  access: string;
  buttonText: string;
  action: ActionType;
};

// ── Form URLs (embedded) ──────────────────────────────────────────────────────

const FORM_URLS: Record<string, string> = {
  'services-form':   'https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform?embedded=true',
  'business-form':   'https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform?embedded=true',
  'internship-form': 'https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform?embedded=true',
};

// ── Category → icon ───────────────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  'General Support':       Users,
  'Resource Support':      Globe,
  'Business Support':      Briefcase,
  'Education & Workshops': BookOpen,
  'Partnerships':          Building,
  'Insurance':             Shield,
  'Tax':                   FileText,
  'Financial Education':   TrendingUp,
  'Business':              Briefcase,
  'Internship':            Award,
  'Career':                Target,
  'Resume & Branding':     Star,
  'Coaching':              TrendingUp,
  'Education':             BookOpen,
  'Workforce':             Globe,
};

// ── The Emerson Empire ────────────────────────────────────────────────────────

const EMPIRE_SERVICES: ServiceItem[] = [
  {
    title: 'General Consultation and Intake',
    category: 'General Support',
    description:
      'A first conversation to understand what a person, family, student, founder, or organization needs and determine the best next step.',
    bestFor: 'Individuals, families, students, entrepreneurs, community referrals, and people unsure where to begin.',
    access: 'Free discovery call; low-cost intake options may be available.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Community Resource Navigation',
    category: 'Resource Support',
    description:
      'Support identifying local agencies, workforce resources, public programs, nonprofit services, library resources, or community-based support options.',
    bestFor: 'Individuals, families, students, unemployed clients, community referrals, and people experiencing financial hardship.',
    access: 'Free basic guidance when possible; reduced-cost support may be available.',
    buttonText: 'Find the Right Support',
    action: 'services-form',
  },
  {
    title: 'Business Direction and Brand Intake',
    category: 'Business Support',
    description:
      'A structured conversation to help entrepreneurs and small businesses clarify services, brand direction, website needs, and next operational steps.',
    bestFor: 'Entrepreneurs, independent professionals, student founders, early-stage businesses, and community organizations.',
    access: 'Low-cost consultation options may be available.',
    buttonText: 'Request a Business Consultation',
    action: 'business-form',
  },
  {
    title: 'Community Workshops and Group Education',
    category: 'Education & Workshops',
    description:
      'Public or partner-based workshops covering career readiness, financial education, small business organization, professional communication, and related topics.',
    bestFor: 'Libraries, schools, churches, nonprofits, workforce programs, community groups, and public audiences.',
    access: 'Free, low-cost, sponsored, or custom pricing depending on format.',
    buttonText: 'Register for Group Classes',
    action: 'to-classes',
  },
  {
    title: 'Partnership and Referral Coordination',
    category: 'Partnerships',
    description:
      'Partnership conversations for schools, libraries, nonprofits, workforce programs, community organizations, and agencies interested in collaboration.',
    bestFor: 'Community partners, schools, nonprofits, agencies, workforce programs, and mission-aligned organizations.',
    access: 'Initial partnership conversation may be free.',
    buttonText: 'Start a Partnership Conversation',
    action: 'business-form',
  },
];

// ── The Emerson Agency LLC ────────────────────────────────────────────────────

const AGENCY_SERVICES: ServiceItem[] = [
  {
    title: 'Insurance Needs Review',
    category: 'Insurance',
    description:
      'A conversation to help individuals, families, or small business owners understand possible insurance needs, coverage questions, and next steps.',
    bestFor: 'Individuals, families, parents, caregivers, and small business owners.',
    access: 'Initial conversation may be free; additional review may vary.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Insurance Education Session',
    category: 'Insurance',
    description:
      'A non-sales educational session covering common insurance terms, coverage basics, beneficiaries, premiums, deductibles, and questions to ask before choosing coverage.',
    bestFor: 'Individuals, families, students, parents, and community members seeking basic insurance literacy.',
    access: 'Low-cost or partner-sponsored options may be available.',
    buttonText: 'Register for a Class',
    action: 'to-classes',
  },
  {
    title: 'Policy Review and Organization',
    category: 'Insurance',
    description:
      'Support organizing existing policy documents, understanding basic coverage information, and preparing questions for current providers.',
    bestFor: 'Individuals, families, households, and small business owners with existing insurance documents.',
    access: 'Pricing varies based on scope; sliding-scale options may be available.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Tax Preparation Intake',
    category: 'Tax',
    description:
      'Initial review to identify what documents are available, what may still be needed, and whether paid support or a public/free filing pathway may be appropriate.',
    bestFor: 'Individuals, households, self-employed workers, and small business owners preparing for tax season.',
    access: 'Basic document readiness screening may be free.',
    buttonText: 'Request Tax Readiness Support',
    action: 'services-form',
  },
  {
    title: 'Individual Tax Preparation',
    category: 'Tax',
    description:
      'Tax preparation support for individuals with standard tax situations, subject to document review, eligibility, and service capacity.',
    bestFor: 'W-2 clients, dependents, and individuals with standard or moderate tax preparation needs.',
    access: 'Pricing varies by complexity; free public pathways may be recommended when appropriate.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Self-Employed / Small Business Tax Preparation',
    category: 'Tax',
    description:
      'Tax preparation and document organization support for freelancers, contractors, entrepreneurs, and small business owners.',
    bestFor: '1099 workers, freelancers, contractors, entrepreneurs, and small businesses.',
    access: 'Custom quote based on complexity and document readiness.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Financial Education Consultation',
    category: 'Financial Education',
    description:
      'Practical support for understanding budgeting, income and expenses, financial goals, credit education, insurance literacy, tax readiness, and household organization.',
    bestFor: 'Individuals, families, students, parents, caregivers, and clients seeking financial confidence.',
    access: 'Low-cost or sliding-scale options may be available.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Household Financial Organization',
    category: 'Financial Education',
    description:
      'Support organizing bills, income, expenses, financial documents, insurance documents, tax documents, and household financial goals.',
    bestFor: 'Families, parents, caregivers, individuals, and households seeking structure.',
    access: 'Pricing varies; hardship options may be reviewed when capacity allows.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Credit and Debt Education',
    category: 'Financial Education',
    description:
      'Educational support for understanding credit reports, debt organization, payment habits, interest, and questions to ask lenders. Educational support only — does not guarantee credit score changes or debt removal.',
    bestFor: 'Individuals learning how to organize credit and debt information.',
    access: 'Low-cost education options may be available.',
    buttonText: 'Request Services',
    action: 'services-form',
  },
  {
    title: 'Small Business Startup Organization',
    category: 'Business',
    description:
      'Support organizing a business idea, service list, pricing basics, startup checklist, tax readiness, insurance questions, and early operations.',
    bestFor: 'New founders, side-hustle owners, student entrepreneurs, and early-stage small businesses.',
    access: 'Consultation or package pricing may vary.',
    buttonText: 'Request a Business Consultation',
    action: 'business-form',
  },
  {
    title: 'Business Operations Support',
    category: 'Business',
    description:
      'Support organizing service menus, client intake, scheduling, document templates, workflows, CRM guidance, and administrative systems.',
    bestFor: 'Small businesses, service providers, entrepreneurs, and organizations needing operational structure.',
    access: 'Hourly, package, or monthly support options may be available.',
    buttonText: 'Request Business Support',
    action: 'business-form',
  },
];

// ── Emerson Professional Development Group ────────────────────────────────────

const EPDG_SERVICES: ServiceItem[] = [
  {
    title: 'Semester-Long Internship Program',
    category: 'Internship',
    description:
      'A structured internship experience with onboarding, weekly assignments, team projects, professional communication practice, portfolio-building, and completion documentation when requirements are met.',
    bestFor: 'Students, emerging professionals, career changers, international learners, and individuals seeking practical experience.',
    access: 'Internship participation is intended to remain free whenever possible.',
    buttonText: 'Apply for the Internship Program',
    action: 'internship-form',
  },
  {
    title: 'Career Readiness Consultation',
    category: 'Career',
    description:
      'A session to clarify career goals, skills, resume direction, LinkedIn direction, job search strategy, and next steps.',
    bestFor: 'Students, job seekers, career changers, recent graduates, and unemployed workers.',
    access: 'Free discovery and low-cost options may be available.',
    buttonText: 'Request Career Support',
    action: 'services-form',
  },
  {
    title: 'Resume Review',
    category: 'Resume & Branding',
    description:
      'Review of an existing resume for clarity, formatting, professionalism, skills presentation, and job readiness.',
    bestFor: 'Job seekers, students, interns, recent graduates, and career changers.',
    access: 'Low-cost or reduced-cost options may be available.',
    buttonText: 'Request Resume Support',
    action: 'services-form',
  },
  {
    title: 'Resume Writing and Redesign',
    category: 'Resume & Branding',
    description:
      'Resume creation or redesign support for students, entry-level professionals, career changers, professionals, and advanced applicants.',
    bestFor: 'Job seekers who need a new or redesigned resume.',
    access: 'Pricing varies by level and scope.',
    buttonText: 'Request Resume Support',
    action: 'services-form',
  },
  {
    title: 'LinkedIn Profile Review',
    category: 'Resume & Branding',
    description:
      'Review of LinkedIn headline, About section, experience section, skills, profile presentation, and networking strategy.',
    bestFor: 'Students, professionals, entrepreneurs, job seekers, and interns.',
    access: 'Low-cost options may be available.',
    buttonText: 'Request LinkedIn Support',
    action: 'services-form',
  },
  {
    title: 'LinkedIn Profile Rewrite',
    category: 'Resume & Branding',
    description:
      'Support creating stronger LinkedIn profile copy, including headline, About section, experience framing, skills, and featured section recommendations.',
    bestFor: 'Professionals, job seekers, students, entrepreneurs, and career changers.',
    access: 'Pricing varies by scope.',
    buttonText: 'Request LinkedIn Support',
    action: 'services-form',
  },
  {
    title: 'Cover Letter Writing',
    category: 'Career',
    description:
      'Support drafting professional cover letters aligned with specific roles, industries, or application goals.',
    bestFor: 'Job seekers, internship applicants, students, and career changers.',
    access: 'Pricing varies by scope and number of letters.',
    buttonText: 'Request Career Support',
    action: 'services-form',
  },
  {
    title: 'Interview Preparation',
    category: 'Career',
    description:
      'Practice and preparation for job, internship, scholarship, school, or professional interviews.',
    bestFor: 'Job seekers, students, internship applicants, scholarship applicants, and career changers.',
    access: 'Low-cost or reduced-cost options may be available.',
    buttonText: 'Request Interview Support',
    action: 'services-form',
  },
  {
    title: 'Education Planning Session',
    category: 'Education',
    description:
      'Support clarifying education goals, program interests, career alignment, application readiness, and financial aid questions to ask schools.',
    bestFor: 'Adult learners, first-generation students, parents returning to school, and students exploring next steps.',
    access: 'Sliding-scale options may be available.',
    buttonText: 'Request Education Planning Support',
    action: 'services-form',
  },
  {
    title: 'Professional Development Coaching',
    category: 'Coaching',
    description:
      'Coaching support for professional communication, workplace confidence, time management, leadership basics, goal setting, personal branding, and career transitions.',
    bestFor: 'Professionals, students, interns, job seekers, and emerging leaders.',
    access: 'Single-session or package options may be available.',
    buttonText: 'Request Professional Development Support',
    action: 'services-form',
  },
  {
    title: 'Job Search Support Package',
    category: 'Career',
    description:
      'Support organizing job search strategy, applications, resume materials, LinkedIn presence, weekly goals, interviews, and follow-up communication.',
    bestFor: 'Active job seekers, unemployed workers, students, and career changers.',
    access: 'Package pricing may vary; waiver options may be reviewed based on capacity.',
    buttonText: 'Request Job Search Support',
    action: 'services-form',
  },
  {
    title: 'Career Change Package',
    category: 'Career',
    description:
      'Support identifying transferable skills, repositioning resume materials, updating LinkedIn, developing a career narrative, and planning next steps.',
    bestFor: 'Career changers, professionals re-entering the workforce, and workers seeking a new field.',
    access: 'Package pricing may vary.',
    buttonText: 'Request Career Support',
    action: 'services-form',
  },
  {
    title: 'Workforce Readiness Workshop',
    category: 'Workforce',
    description:
      'Group training in resume basics, LinkedIn basics, interview preparation, workplace communication, professionalism, digital skills, and career planning.',
    bestFor: 'Schools, workforce programs, nonprofits, community groups, libraries, and organizations.',
    access: 'Free, low-cost, group, organizational, or custom options may be available.',
    buttonText: 'Register for Group Classes',
    action: 'to-classes',
  },
  {
    title: 'Internship Program Design for Small Businesses',
    category: 'Workforce',
    description:
      'Support designing ethical, educational, structured internship programs with role planning, learning objectives, onboarding materials, weekly assignments, and completion documentation.',
    bestFor: 'Small businesses, nonprofits, entrepreneurs, and organizations interested in structured internship systems.',
    access: 'Consultation, setup, or ongoing support options may be available.',
    buttonText: 'Request Business Consultation',
    action: 'business-form',
  },
  {
    title: 'Team Training and Professional Development',
    category: 'Workforce',
    description:
      'Training for teams, interns, staff, volunteers, or entry-level workers in communication, customer service, sales basics, professionalism, ethics, leadership, and collaboration.',
    bestFor: 'Businesses, nonprofits, schools, workforce programs, and organizations training teams.',
    access: 'Custom workshop or training series pricing may vary.',
    buttonText: 'Register for Classes',
    action: 'to-classes',
  },
];

// ── Form Modal ────────────────────────────────────────────────────────────────

type ModalState = { title: string; formUrl: string } | null;

const FormModal: React.FC<{ modal: ModalState; onClose: () => void }> = ({ modal, onClose }) => {
  const [loadCount, setLoadCount] = useState(0);
  const submitted = loadCount >= 2;

  useEffect(() => {
    if (modal) setLoadCount(0);
  }, [modal]);

  const handleLoad = () =>
    setLoadCount((n) => {
      const next = n + 1;
      return next;
    });

  if (!modal) return null;

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
          {/* Modal header */}
          <div className="flex justify-between items-center px-6 py-4 border-neutral-100 border-b shrink-0">
            <div>
              <p className="mb-0.5 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">
                Service Request
              </p>
              <h3 className="font-bold text-[#0A1128] text-sm leading-snug">{modal.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="flex justify-center items-center w-8 h-8 text-neutral-400 hover:text-[#0A1128] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form or success */}
          <div className="flex-1 overflow-hidden">
            {submitted ? (
              <div className="flex flex-col justify-center items-center px-8 py-16 h-full text-center">
                <div className="flex justify-center items-center bg-[#C9A84C] mb-6 w-16 h-16 font-bold text-[#0A1128] text-2xl">
                  ✓
                </div>
                <h4 className="mb-3 font-bold text-[#0A1128] text-xl uppercase">Request Submitted!</h4>
                <p className="mb-8 max-w-xs text-neutral-500 text-sm leading-relaxed">
                  We received your request and will follow up within 24–48 business hours.
                </p>
                <button
                  onClick={onClose}
                  className="hover:bg-[#4B1E91] px-8 py-3 border border-[#4B1E91] font-mono text-[#4B1E91] hover:text-white text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            ) : (
              <iframe
                src={modal.formUrl}
                title="Service Request Form"
                onLoad={handleLoad}
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

// ── ServiceCard ───────────────────────────────────────────────────────────────

type CardProps = ServiceItem & { onOpenModal: (title: string, formUrl: string) => void };

const ServiceCard: React.FC<CardProps> = ({
  title, category, description, bestFor, access, buttonText, action, onOpenModal,
}) => {
  const Icon = ICONS[category] ?? Briefcase;
  const isClasses = action === 'to-classes';
  const isInternship = action === 'internship-form';

  const handleClick = () => {
    if (!isClasses) onOpenModal(title, FORM_URLS[action]);
  };

  const buttonCls = isClasses || isInternship
    ? 'bg-[#C9A84C] text-[#0A1128] hover:bg-[#b8933e]'
    : 'bg-[#4B1E91] text-white hover:bg-[#3d1778]';

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="flex flex-col bg-white hover:shadow-sm border border-neutral-100 hover:border-[#4B1E91]/25 transition-all duration-200"
    >
      <div className="flex flex-col flex-1 p-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex justify-center items-center bg-[#4B1E91]/8 w-7 h-7 shrink-0">
            <Icon size={13} className="text-[#4B1E91]" />
          </div>
          <span className="font-mono text-[#C9A84C] text-xs uppercase tracking-widest">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-bold text-[#0A1128] text-xl leading-snug">{title}</h3>

        {/* Description */}
        <p className="flex-1 mb-4 text-[#4B1E91] text-base leading-relaxed text">{description}</p>

        {/* Best For */}
        <div className="mb-4 pl-3 border-[#4B1E91]/25 border-l-2">
          <p className="mb-0.5 font-mono text-[#4B1E91]/70 text-sm uppercase tracking-wider">
            Best For
          </p>
          <p className="text-[#4B1E91] text-base leading-relaxed">{bestFor}</p>
        </div>

        {/* Access */}
        <div className="flex items-start gap-1.5 mb-5">
          <span className="inline-block bg-[#C9A84C] mt-1.5 rounded-full w-1.5 h-1.5 shrink-0" />
          <p className="font-mono text-neutral-900 text-sm">{access}</p>
        </div>

        {/* CTA */}
        {isClasses ? (
          <Link
            to="/classes"
            className={`mt-auto flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${buttonCls}`}
          >
            {buttonText}
            <ChevronRight size={12} />
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className={`mt-auto flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${buttonCls}`}
          >
            {buttonText}
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── CompanySection ────────────────────────────────────────────────────────────

type CompanySectionProps = {
  id: string;
  tagline: string;
  company: string;
  role: string;
  services: ServiceItem[];
  accentHex: string;
  image: string;
  onOpenModal: (title: string, formUrl: string) => void;
};

const CompanySection: React.FC<CompanySectionProps> = ({
  id, tagline, company, role, services, accentHex, image, onOpenModal,
}) => {
  const uniqueCategories = Array.from(new Set(services.map((s) => s.category)));
  const hasMultiple = services.length > uniqueCategories.length;
  const tabs = ['All', ...uniqueCategories];
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? services : services.filter((s) => s.category === active);

  return (
    <section id={id} className="py-20 border-neutral-100 border-b scroll-mt-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Company header */}
        <div className="flex lg:flex-row flex-col lg:items-end gap-8 mb-12">
          <div className="flex-1">
            <div className="mb-4 pl-3" style={{ borderLeft: `3px solid ${accentHex}` }}>
              <span className="font-mono text-xs uppercase tracking-[4px]" style={{ color: accentHex }}>
                {tagline}
              </span>
            </div>
            <h2 className="mb-3 font-black text-[#0A1128] text-2xl sm:text-3xl uppercase leading-tight">
              {company}
            </h2>
            <p className="max-w-2xl text-neutral-500 text-sm leading-relaxed">{role}</p>
          </div>
          <img src={image} alt={company} className="rounded-md w-full lg:w-64 h-36 object-contain shrink-0" />
        </div>

        {/* Category filter */}
        {hasMultiple && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-150"
                style={
                  active === cat
                    ? { backgroundColor: accentHex, color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                }
              >
                {cat}
                {cat !== 'All' && (
                  <span className="opacity-60 ml-1.5">
                    ({services.filter((s) => s.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <p className="mb-6 font-mono text-neutral-400 text-xs">
          Showing {filtered.length} of {services.length} services
        </p>

        {/* Grid */}
        <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard key={service.title} {...service} onOpenModal={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const COMPANIES = [
  { label: 'The Emerson Empire',               href: '#emerson-empire', count: EMPIRE_SERVICES.length },
  { label: 'The Emerson Agency LLC',           href: '#emerson-agency', count: AGENCY_SERVICES.length },
  { label: 'Emerson Professional Development', href: '#epdg',           count: EPDG_SERVICES.length   },
];

const Services: React.FC = () => {
  const [modal, setModal] = useState<ModalState>(null);

  const openModal = (title: string, formUrl: string) => setModal({ title, formUrl });
  const closeModal = () => setModal(null);

  return (
    <div className="bg-[#FAFAF9] pt-16 sm:pt-20 min-h-screen font-sans antialiased">

      {/* ── Hero ── */}
      <div className="bg-[#0A1128] px-4 sm:px-6 lg:px-16 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <motion.span
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="inline-block mb-4 font-mono text-[#C9A84C] text-xs uppercase tracking-[4px]"
          >
            Services &amp; Packages
          </motion.span>
          <motion.h1
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mb-6 font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-none tracking-tight"
          >
            Everything We<br />
            <span className="text-[#C9A84C]">Offer.</span>
          </motion.h1>
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mb-12 max-w-2xl text-white/60 text-sm leading-relaxed"
          >
            Three companies, one mission. Browse all services across The Emerson Empire, The Emerson
            Agency, and Emerson Professional Development Group — or jump straight to what you need.
          </motion.p>

          <div className="flex sm:flex-row flex-col gap-3">
            {COMPANIES.map(({ label, href, count }) => (
              <a
                key={label}
                href={href}
                className="flex flex-1 justify-between items-center gap-4 hover:bg-white/5 px-5 py-4 border border-white/15 hover:border-[#C9A84C]/50 transition-colors duration-200"
              >
                <span className="font-mono text-white text-xs uppercase tracking-wider">{label}</span>
                <span className="font-mono text-white/40 text-xs shrink-0">{count} services ↓</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Company sections ── */}
      <CompanySection
        id="emerson-empire"
        tagline="Umbrella Company"
        company="The Emerson Empire"
        role="The public front door for general intake, community resource navigation, business direction, partnerships, and operations support."
        services={EMPIRE_SERVICES}
        accentHex="#C9A84C"
        image={empire}
        onOpenModal={openModal}
      />
      <CompanySection
        id="emerson-agency"
        tagline="Financial & Insurance Services"
        company="The Emerson Agency LLC"
        role="Education-centered support in insurance education, tax readiness, tax preparation, financial education, household financial organization, and small-business support."
        services={AGENCY_SERVICES}
        accentHex="#4B1E91"
        image={Agency1}
        onOpenModal={openModal}
      />
      <CompanySection
        id="epdg"
        tagline="Professional Development"
        company="Emerson Professional Development Group"
        role="Professional development, internship programming, career readiness, resume and LinkedIn support, interview preparation, coaching, workforce development, and training."
        services={EPDG_SERVICES}
        accentHex="#4B1E91"
        image={Logo2}
        onOpenModal={openModal}
      />

      {/* ── Bottom CTA ── */}
      <div className="bg-[#4B1E91] py-20 text-white">
        <div className="mx-auto px-6 max-w-4xl text-center">
          <p className="mb-4 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">
            Not Sure Where to Start?
          </p>
          <h2 className="mb-4 font-black text-3xl sm:text-4xl uppercase leading-tight">
            Start with a Free Conversation.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/65 text-sm leading-relaxed">
            We'll help you figure out exactly what you need, which company fits best, and what the right next step looks like for you.
          </p>
          <button
            onClick={() => openModal('Free Consultation', FORM_URLS['services-form'])}
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-4 font-mono font-bold text-[#0A1128] text-xs uppercase tracking-wider transition-colors duration-200"
          >
            Request a Free Consultation
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      <FormModal modal={modal} onClose={closeModal} />

    </div>
  );
};

export default Services;
