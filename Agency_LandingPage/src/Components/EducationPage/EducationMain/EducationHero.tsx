import { integratedPreview } from '../../../../../shared/development-preview'
import { localHref } from '../../../../../shared/platform-format'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import agencyLogo from '../../../assets/LogoAgency.png'

const candidate = integratedPreview

export default function EducationHero() {
  const [searchQuery, setSearchQuery] = useState('')

  function searchResources(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams()
    if (searchQuery.trim()) query.set('q', searchQuery.trim())
    window.location.assign(localHref(`/resources${query.size ? `?${query}` : ''}`))
  }

  return (
    <section className="relative rounded-2xl bg-[#0A1128] p-8 lg:p-12 border border-white/10 shadow-xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
       
        <div>
          {/* Badge */}
          <span className="inline-block rounded-[5px] bg-[#c9a24c]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c9a24c]">
            Learn & Grow
          </span>

          {/* Titles */}
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-4xl lg:text-5xl">
            The Emerson Agency LLC (TEA)
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#c9a24c]">
            {candidate ? 'Financial understanding & source literacy' : 'Financial Trust & Education'}
          </p>
          <p className="mt-3 text-base text-slate-300">
            {candidate ? 'Build the habit of checking a financial claim, its source, and the country where it applies.' : 'Learn about TEA'}
          </p>
          <p className={candidate ? 'mt-3 text-sm text-slate-300' : 'mt-3 text-base text-amber-700'}>
            {candidate ? 'General education only. Local rules and eligibility need local review. No account details, tax returns, identity documents, or personal financial records are requested here.' : 'unresolved copy text'}
          </p>
          

          {/* Search Bar */}
          {candidate ? <form role="search" onSubmit={searchResources} className="mt-8 max-w-xl">
            <label htmlFor="education-resource-search" className="mb-2 block text-sm font-semibold text-white">Search TEA educational resources</label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input id="education-resource-search" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Topic, provider or need" className="w-full rounded-xl border border-[#c9a24c] bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400" />
            </div>
            <button type="submit" className="mt-3 rounded-xl bg-[#c9a24c] px-5 py-3 text-sm font-semibold text-[#0A1128]">Search resources</button>
          </form> : <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search resources or topics..."
               className="w-full rounded-xl border border-[#c9a24c] bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm outline-none outline-0 focus:border-[#c9a24c] focus:outline-none focus:outline-0 focus:ring-0"
            />
          </div>}
        </div>

        {/* Image Placeholder !! not the real approved image*/}
        {candidate ? <div className="flex h-56 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 p-8"><img src={agencyLogo} alt="The Emerson Agency LLC logo" className="max-h-full max-w-full object-contain" /></div> : <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5">
          <svg className="h-16 w-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>}
      </div>
    </section>
  )
}
