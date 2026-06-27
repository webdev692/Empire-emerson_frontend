import valuesImage from '../../assets/EmersonAgency.avif'
import { CheckCircle2, Lightbulb, Briefcase, Users, Handshake, TrendingUp } from 'lucide-react'

const values = [
  { icon: CheckCircle2, title: 'Integrity' },
  { icon: Lightbulb, title: 'Clarity' },
  { icon: Briefcase, title: 'Professionalism' },
  { icon: Users, title: 'Empowerment' },
  { icon: Handshake, title: 'Trust' },
  { icon: TrendingUp, title: 'Results' },
]

export default function ValuesSection() {
  return (
    <section className="bg-[#f3f5fb] py-20 text-[#081224]">
      <div className="mx-auto max-w-[1320px] px-5">
        <div className="overflow-hidden rounded-[36px] bg-white shadow-[0_40px_130px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden rounded-[36px] bg-[#081224] px-8 py-10 lg:px-12 lg:py-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.14),_transparent_30%)]" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.45em] text-[#d4af37]">Our values</p>
                  <h2 className="text-5xl font-serif font-semibold uppercase tracking-[0.01em] text-white">Our Values</h2>
                </div>
                <p className="max-w-2xl text-base leading-8 text-white/80">
                  We value integrity, clarity, professionalism, empowerment, trust, and results-driven service.
                </p>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  {values.map((value) => {
                    const Icon = value.icon
                    return (
                      <div key={value.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                          <Icon size={22} />
                        </div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/80">{value.title}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] bg-slate-950">
              <img src={valuesImage} alt="Agency values" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#081224]/85 via-transparent to-[#081224]/95" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
