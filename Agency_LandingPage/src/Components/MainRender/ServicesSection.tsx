import { FileText, Shield, ClipboardList, BookOpen, Home, Briefcase, CreditCard, Sparkles, Layers, LifeBuoy } from 'lucide-react'

const serviceCards = [
  {
    number: '01',
    title: 'Tax readiness and document organization',
    description: 'Gather, sort, and organize the records needed before working with a tax professional.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Tax preparation intake support',
    description: 'Complete intake forms, checklists, and questionnaires accurately and completely.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'Insurance education',
    description: 'Plain-language explanations of common insurance terms and coverage types.',
    icon: ClipboardList,
  },
  {
    number: '04',
    title: 'Policy review and organization',
    description: 'Review existing policies, organize documents, and identify questions for your provider.',
    icon: BookOpen,
  },
  {
    number: '05',
    title: 'Financial education',
    description: 'Budgeting basics, financial vocabulary, and reading common financial documents.',
    icon: Home,
  },
  {
    number: '06',
    title: 'Household financial organization',
    description: 'Build simple systems for bills, statements, deadlines, and important records at home.',
    icon: Briefcase,
  },
  {
    number: '07',
    title: 'Credit and debt education',
    description: 'Educational sessions covering credit reports, debt structure, and statements.',
    icon: CreditCard,
  },
  {
    number: '08',
    title: 'Small business startup support',
    description: 'Guidance on early-stage organization, document checklists, and next conversations.',
    icon: Sparkles,
  },
  {
    number: '09',
    title: 'Benefit and enrollment preparation',
    description: 'Help gathering the details and documents needed for public benefits and program enrollment.',
    icon: Layers,
  },
  {
    number: '10',
    title: 'Trusted financial navigation',
    description: 'Support reviewing options, identifying questions, and preparing for trusted conversations.',
    icon: LifeBuoy,
  },
]

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-[#eef3fb] text-[#081224] py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522204506139-0a40867aed1b?auto=format&fit=crop&w=1400&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white" />

      <div className="relative mx-auto max-w-[1320px] px-5">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.45em] text-[#b18b4c]">Services</p>
          <h2 
            className="text-4xl font-serif font-semibold leading-tight text-[#081224] sm:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Educational and organizational<br />support
          </h2>
          <p className="text-base leading-8 text-slate-600">
            Every service is offered in plain language and at a calm pace. Our role is to educate, organize, and prepare — not to provide licensed legal, tax, financial, or insurance advice.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.number} className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#ecf4ff] text-[#0b57ff] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-[#8b97ad]">{service.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#081224]">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#64748b]">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
