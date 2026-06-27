import heroImage from '../../assets/hero.avif'
import { CheckCircle2, BarChart3, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#081224] py-20 text-white">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_35%)]" />
      <div className="mx-auto max-w-[1320px] px-5">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#0b172f] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden bg-[#081224] px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
              <div className="absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#1b325b]/20 blur-3xl" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37] bg-[#081224] text-lg font-semibold tracking-[0.35em] text-[#d4af37]">
                      EA
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">The Emerson Agency</p>
                      <p className="text-xs uppercase tracking-[0.45em] text-white/60">Our mission</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h1 className="text-4xl font-serif font-semibold leading-tight text-white sm:text-5xl">
                      The Emerson Agency empowers individuals, families, and entrepreneurs with ethical financial guidance, strategic business support, and practical services that help build stability, confidence, and long-term growth.
                    </h1>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#d4af37]">
                        <CheckCircle2 size={20} />
                      </div>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/80">Ethical Guidance</p>
                    </div>
                    <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#d4af37]">
                        <BarChart3 size={20} />
                      </div>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/80">Strategic Support</p>
                    </div>
                    <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#d4af37]">
                        <TrendingUp size={20} />
                      </div>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/80">Sustainable Growth</p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#d4af37]/15 bg-[#061224] px-6 py-5">
                    <p className="text-xs uppercase tracking-[0.55em] text-[#d4af37]">Financial clarity. Strategic support. Sustainable growth.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[580px] overflow-hidden bg-[#0c1932] sm:h-[640px] lg:h-auto">
              <img src={heroImage} alt="Emerson Agency hero" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#081224]/90 via-transparent to-[#081224]/95" />
              <div className="pointer-events-none absolute right-6 top-6 h-1 w-20 rounded-full bg-[#d4af37]/70" />
              <div className="pointer-events-none absolute right-8 top-20 h-1 w-14 rounded-full bg-[#d4af37]/70" />
              <div className="pointer-events-none absolute right-8 bottom-12 h-1 w-28 rounded-full bg-[#d4af37]/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
