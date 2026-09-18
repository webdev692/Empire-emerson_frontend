import { BookOpen, HelpCircle, Video, FileText, ArrowRight } from 'lucide-react'

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
  return (
    <section className="grid   bg-white px-5 py-8 sm:py-12 lg:px-8 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {RESOURCES.map((item) => {
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
              <p className="mt-3 text-base text-amber-700">
                unresolved copy text
              </p>
            </div>

            <a
              href={item.href}
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