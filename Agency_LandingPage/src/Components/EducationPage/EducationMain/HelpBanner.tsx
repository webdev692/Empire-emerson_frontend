import { integratedPreview } from '../../../../../shared/development-preview'
import { ShieldCheck } from 'lucide-react'

const candidate = integratedPreview

export default function HelpBanner() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-8 sm:py-12 lg:px-8 bg-white">
    <section id={candidate ? 'support' : undefined} className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#0A1128] p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
      
      {/* Icon + Content */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#c9a24c]">
          <ShieldCheck size={28} className="stroke-[1.75]" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white sm:text-lg">
            {candidate ? 'A clear boundary for your next step' : 'Need Qualified Help?'}
          </h4>
          <p className={candidate ? 'mt-1 text-xs text-slate-300 sm:text-sm' : 'mt-1 text-xs text-amber-700 sm:text-sm'}>
            {candidate ? 'Use these materials for general learning. Qualified help and service availability require current jurisdiction-specific review. The inquiry destination is not connected; no message has been sent.' : 'unresolved copy text'}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href={candidate ? '/inquiry' : '#'}
        onClick={candidate ? undefined : (e) => e.preventDefault()}
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#c9a24c] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A1128] transition hover:bg-[#b8923f] sm:w-auto"
      >
        {candidate ? 'View inquiry status' : 'Request Help'} &rarr;
      </a>

    </section>
    </div>
  )
}
