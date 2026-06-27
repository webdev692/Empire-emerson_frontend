import servicesBackground from '../../assets/ServicesBackground.png'
import {
  FileText, ClipboardCheck, Shield, FolderOpen, BookOpen,
  Home, CreditCard, Briefcase, Rocket, GraduationCap,
} from 'lucide-react'

const serviceCards = [
  {
    number: '01',
    title: 'Tax readiness and document organization',
    description: 'Help gathering, sorting, and organizing the records needed before working with a tax professional.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Tax preparation intake support',
    description: 'Support completing intake forms, checklists, and questionnaires accurately and completely.',
    icon: ClipboardCheck,
  },
  {
    number: '03',
    title: 'Insurance education',
    description: 'Plain-language explanations of common insurance terms, coverage types, and what questions to ask.',
    icon: Shield,
  },
  {
    number: '04',
    title: 'Policy review and organization',
    description: 'Help reviewing existing policies, organizing documents, and identifying questions for your provider.',
    icon: FolderOpen,
  },
  {
    number: '05',
    title: 'Financial education',
    description: 'General education on budgeting basics, financial vocabulary, and reading common financial documents.',
    icon: BookOpen,
  },
  {
    number: '06',
    title: 'Household financial organization',
    description: 'Help building simple systems for bills, statements, deadlines, and important records at home.',
    icon: Home,
  },
  {
    number: '07',
    title: 'Credit and debt education',
    description: 'Educational sessions covering how credit reports work, how debt is structured, and how to read your statements.',
    icon: CreditCard,
  },
  {
    number: '08',
    title: 'Small business financial organization',
    description: 'Help structuring records, receipts, and basic financial workflows for small businesses.',
    icon: Briefcase,
  },
  {
    number: '09',
    title: 'Small business startup support',
    description: 'Guidance on early-stage organizational steps, document checklists, and preparing for next conversations.',
    icon: Rocket,
  },
  {
    number: '10',
    title: 'Financial literacy workshops',
    description: 'Group educational sessions on foundational financial topics for households, employees, and community groups.',
    icon: GraduationCap,
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#f4f5f8] py-20 text-[#0A1128] lg:py-24">
      <img
        src={servicesBackground}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-right-bottom"
      />

      <div className="relative mx-auto max-w-[1320px] px-5">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b08d4f]">Services</p>
          <h2 className="mt-4 font-serif! text-4xl! font-semibold! leading-[1.1]! text-[#0A1128] sm:text-5xl!">
            Educational and organizational support
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
            Every service is offered in plain language and at a calm pace. Our role is to educate, organize,
            and prepare — not to provide licensed legal, tax, financial, or insurance advice.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                className="rounded-2xl bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.07)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f1fb] text-[#5b8fd0]">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{service.number}</span>
                </div>
                <h3 className="mt-5 font-serif! text-xl! font-semibold! leading-snug! text-[#0A1128]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
