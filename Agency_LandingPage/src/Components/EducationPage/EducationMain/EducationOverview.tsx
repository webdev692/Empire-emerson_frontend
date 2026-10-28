import { integratedPreview } from '../../../../../shared/development-preview'
const candidate = integratedPreview

export default function EducationOverview() {
  return (
    <section className="w-full bg-white px-5 py-8 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1320px] space-y-8">
        
        {/* Block what */}
        <div className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            What is TEA?
          </h2>
          <p className={candidate ? 'mt-3 text-sm text-slate-700 sm:text-base' : 'mt-3 text-sm font-medium text-amber-700 sm:text-base'}>
            {candidate ? 'The Emerson Agency LLC is developing a financial education and resource hub. These draft learning materials help you compare information, identify uncertainty, and prepare clearer questions. Emerson learning programs are free; a third-party provider may charge separate access or credential fees.' : '(Approved TEA education copy)'}
          </p>
        </div>

        {/* Block why */}
        <div className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Why this matters
          </h2>
          <p className={candidate ? 'mt-3 text-sm text-slate-700 sm:text-base' : 'mt-3 text-sm font-medium text-amber-700 sm:text-base'}>
            {candidate ? 'An online explanation may describe a different country, date, audience, or service. Check the original source and local jurisdiction before relying on a claim. Education here does not establish individual eligibility or replace qualified financial, tax, insurance, investment, or legal advice.' : '(Approved TEA education copy)'}
          </p>
        </div>

      </div>
    </section>
  )
}
