import AgencyImage from '../../assets/Agency.avif'
import { ChevronRight, BookOpen, BarChart3, Users, Briefcase } from 'lucide-react'

const featureItems = [
  {
    title: 'Education-First',
    description: 'No sales pressure',
    icon: BookOpen,
  },
  {
    title: 'Sliding-Scale Pricing',
    description: 'Pay what you can',
    icon: BarChart3,
  },
  {
    title: 'Household Focus',
    description: 'Families & individuals',
    icon: Users,
  },
  {
    title: 'Small Business Ready',
    description: 'Startups & entrepreneurs',
    icon: Briefcase,
  },
]

export default function MissionSection() {
  return (
    <section className="bg-[#091b34] py-20 text-white">
      <div className="mx-auto max-w-[1320px] px-5">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.45em] text-[#d4af37]">Helping individuals, families, and small business owners</p>
              <h2 className="max-w-3xl text-4xl font-serif font-semibold leading-tight text-white sm:text-5xl">
                organize, understand, and step into financial conversations with clarity.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#" className="inline-flex items-center justify-center rounded-full bg-[#0b57ff] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(11,87,255,0.28)] transition hover:opacity-90">
                Request Services
                <ChevronRight className="ml-3" size={18} />
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#d4af37]">
                Business Consultation
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1d3d] shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
            <img src={AgencyImage} alt="Team review" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#0b57ff]/10 text-[#0b57ff] mx-auto">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-sm uppercase tracking-[0.28em] text-[#d4af37]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
