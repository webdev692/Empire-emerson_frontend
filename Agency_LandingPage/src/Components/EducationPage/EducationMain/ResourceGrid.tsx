import { integratedPreview } from '../../../../../shared/development-preview'
import { localHref } from '../../../../../shared/platform-format'
import { BookOpen, HelpCircle, Video, FileText, ArrowRight } from 'lucide-react'

const candidate = integratedPreview

const RESOURCES = [
  {
    icon: BookOpen,
    title: 'Resource Guide',
    description: '',
    href: '#',
  },
  {
    icon: HelpCircle,
    title: 'FAQs',
    description: '',
    href: '#',
  },
  {
    icon: Video,
    title: 'Video Library',
    description: '',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Helpful Articles',
    description: '',
    href: '#',
  },
]

export default function ResourceGrid() {
  const resources = candidate ? [
    { icon: BookOpen, title: 'Check a financial source', description: 'Practice comparing a claim, its evidence, country, costs, and unanswered questions in a draft learning module.', href: '/learn/financial-source-literacy' },
    { icon: HelpCircle, title: 'Explore education resources', description: 'Search the local resource preview and check each listing for eligibility, source, language, and cost uncertainty.', href: '/resources' },
    { icon: Video, title: 'Understand geographic coverage', description: 'See the South Carolina pilot focus and distinguish researched coverage from availability in other countries.', href: '/coverage' },
    { icon: FileText, title: 'Check the support route', description: 'See the current inquiry status. No message or personal financial information is collected while the destination is unverified.', href: '/inquiry' },
  ] : RESOURCES

  return (
    <section id={candidate ? 'resources' : undefined} aria-label={candidate ? 'Education pathways' : undefined} className="grid   bg-white px-5 py-8 sm:py-12 lg:px-8 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {resources.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="group flex flex-col items-center justify-between rounded-xl border border-white/10 bg-[#0A1128] p-6 text-center shadow-md transition hover:-translate-y-1 hover:border-[#c9a24c]/50"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#c9a24c]">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
              <p className={candidate ? 'mt-3 text-sm text-slate-300' : 'mt-3 text-base text-amber-700'}>
                {candidate ? item.description : 'unresolved copy text'}
              </p>
            </div>

            <a
              href={candidate ? localHref(item.href) : item.href}
              aria-label={candidate ? `Learn more about ${item.title.toLowerCase()}` : undefined}
              className="mt-6 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#c9a24c] transition group-hover:translate-x-1"
            >
              Learn more <ArrowRight size={14} />
            </a>
          </div>
        )
      })}
    </section>
  )
}
