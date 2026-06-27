import { Check } from 'lucide-react'
import studyImage from '../../assets/study.jpeg'
import consultingImage from '../../assets/consulting.jpeg'
import emblem from '../../assets/EmersonAgency.avif'

const individualPoints = [
  'Households organizing bills, statements, and important records',
  'Workers preparing documents for tax season or benefits decisions',
  'Parents and caregivers organizing family financial information',
  'Students and young adults learning foundational financial vocabulary',
  'Individuals preparing for meetings with licensed professionals',
]

const businessPoints = [
  'Organizing business documents, receipts, and records',
  'Understanding early-stage startup basics and checklists',
  'Preparing financial information ahead of tax season',
  'Building simple, repeatable financial workflows',
  'Identifying questions to bring to licensed professionals',
]

export default function SupportSection() {
  return (
    <section className="text-[#0A1128]">
      {/* Full-bleed light section: heading + image on left, text on right */}
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.45em] text-[#b18b4c]">Individuals & Families</p>
              <h2
                className="text-[3.75rem] font-serif font-semibold leading-tight tracking-[-0.02em] text-[#0A1128] sm:text-[4.25rem] lg:text-[4.75rem]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Support for households,<br />parents, students, and<br />workers
              </h2>

              <div className="mt-8 w-full max-w-[30rem]">
                <img src={studyImage} alt="Student at desk" className="rounded-[18px] shadow-md object-cover w-full" />
              </div>
            </div>

            <div className="pl-0 lg:pl-12 pt-8 lg:pt-8">
              <p className="max-w-xl font-body text-base leading-8 text-slate-700 lg:text-base lg:leading-8">
                We help individuals and families understand documents, organize records, and prepare for upcoming financial conversations — at a calm pace and in plain language. Whether you're getting ready for tax season, reviewing an insurance policy, or trying to put a household paper trail in order, we focus on clarity and dignity.
              </p>

              <ul className="mt-8 grid gap-3 text-sm text-slate-600">
                {individualPoints.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-sky-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed dark section: description left, eyebrow+heading+image card on right */}
      <div className="w-full bg-[#0A1128]">
        <div className="mx-auto max-w-[1320px] px-5 py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
            <div className="pr-4 lg:pr-12 pt-8 lg:pt-10">
              <p className="sr-only">Small Business</p>
              <p className="max-w-[34rem] text-lg leading-8 text-slate-200 lg:text-xl lg:leading-9">
                We help small business owners and new entrepreneurs organize business documents, understand startup basics, prepare for tax season, and put simple financial systems in place.
              </p>
              <p className="mt-4 max-w-[34rem] text-lg leading-8 text-slate-200 lg:text-xl lg:leading-9">
                Our role is educational and organizational — supporting better readiness, not promising business outcomes.
              </p>

              <ul className="mt-10 space-y-3 text-sm text-slate-300">
                {businessPoints.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-sky-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col items-start">
              <div className="text-left">
                <p className="text-sm uppercase tracking-[0.45em] text-[#d4af37]">Small Business</p>
                <h3
                  className="mt-3 !text-[1.68rem] font-normal !leading-[0.95] text-white sm:!text-[1.84rem] lg:!text-[2.16rem] xl:!text-[2.4rem]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}
                >
                  Support for small business<br />owners and early-stage<br />entrepreneurs
                </h3>
              </div>

              <div className="mt-8 w-full max-w-xl">
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0A1128] shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
                  <img src={consultingImage} alt="Business meeting" className="w-full h-[420px] object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
