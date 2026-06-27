import financialImage from '../../assets/Finacial.png'
import { ArrowRight, BookOpen, DollarSign, Home, Users } from 'lucide-react'
import { openRequestForm } from '../Umbrella/RequestFormModal'

const featureItems = [
  {
    title: 'Education-First',
    description: 'No sales pressure',
    icon: BookOpen,
  },
  {
    title: 'Sliding-Scale Pricing',
    description: 'Pay what you can',
    icon: DollarSign,
  },
  {
    title: 'Household Focus',
    description: 'Families & individuals',
    icon: Home,
  },
  {
    title: 'Small Business Ready',
    description: 'Startups & entrepreneurs',
    icon: Users,
  },
]

export default function MissionSection() {
  return (
    <section className="bg-[#0A1128] py-20 text-white">
      <div className="mx-auto max-w-[1320px] px-5">
        <div className="grid items-stretch gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-10">
            <h2 className="font-serif text-4xl! font-medium leading-tight! text-white sm:text-5xl! lg:text-6xl!">
              Helping individuals, families, and small business owners{' '}
              <span className="bg-gradient-to-r from-[#5b8def] via-[#4aa6c4] to-[#37c39b] bg-clip-text text-transparent">
                organize, understand,
              </span>{' '}
              and step into financial conversations with clarity.
            </h2>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://forms.gle/VSCGHQEJSdKhYizKA"
                onClick={(e) => { e.preventDefault(); openRequestForm() }}
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#0b57ff] px-7 py-3.5 text-base font-medium text-white shadow-[0_18px_45px_rgba(11,87,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a4fe0] hover:shadow-[0_22px_55px_rgba(11,87,255,0.45)]"
              >
                Request Services
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-3.5 text-base font-medium text-white transition hover:border-[#c9a24c]"
              >
                Business Consultation
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px]">
            <img
              src={financialImage}
              alt="Financial advisors collaborating with clients"
              className="h-full min-h-[400px] w-full object-cover sm:min-h-[480px] lg:min-h-[540px]"
            />
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {featureItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#c9a24c]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs text-white/50">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
