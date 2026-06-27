export default function CTASection() {
  return (
    <section className="bg-[#f7f9ff] text-[#0A1128]">
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b18b4c]">Free and reduced-cost options</p>
            <h2 className="mt-3 text-5xl font-serif font-semibold leading-tight text-[#0A1128] sm:text-6xl">
              Accessible support, where possible
            </h2>
          </div>

          <div className="mt-12 mx-auto max-w-3xl relative overflow-hidden border border-[#e9eef6] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#0b57ff] via-[#1a8dff] to-[#29c17a]" />
            <div className="relative pl-5">
              <p className="text-base leading-8 text-slate-600">
                Reduced-cost support may be available depending on service type, availability, and client need. Some educational workshops or resource sessions may be offered at low cost or no cost.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#f7f9ff]">
        <div className="mx-auto max-w-[1320px] px-5 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b18b4c]">Get in touch</p>
            <h3 className="mt-3 text-5xl font-serif font-semibold leading-tight text-[#0A1128] sm:text-6xl">
              Take the next step
            </h3>
            <p className="mt-6 text-lg leading-9 text-slate-600">
              Use the request forms below to share what you need help with. We’ll follow up to discuss next steps.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#" className="inline-flex items-center justify-center rounded-full bg-[#0b57ff] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_15px_30px_rgba(11,87,255,0.3)] transition hover:opacity-90">
              Request Services
            </a>
            <a href="#" className="inline-flex items-center justify-center rounded-full border border-[#d5d6e0] bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0A1128] transition hover:border-[#d4af37]">
              Request Business Consultation
            </a>
          </div>

          <p className="mt-12 text-xs leading-6 text-slate-500">
            Prices are listed for general planning purposes and may vary based on client needs, service complexity, document readiness, program capacity, and applicable licensing or compliance requirements. Free or reduced-cost support may be available for students, low-income individuals, community agency referrals, and clients experiencing financial hardship. Insurance services are subject to licensing, carrier availability, underwriting approval, state requirements, and product suitability standards. Tax preparation services depend on document intake, eligibility, federal and state requirements, and service capacity. Financial education services are informational and do not guarantee credit score changes, debt removal, loan approval, financial results, or income. Participation in educational, coaching, review, intake, insurance support, or operational services does not guarantee employment, income, tax outcomes, insurance approval, financial results, business success, or other specific outcomes.
          </p>
        </div>
      </div>
    </section>
  )
}
