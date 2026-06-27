import { Check, CheckCircle2 } from 'lucide-react'
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
            <div className="flex flex-col">
              <p className="text-sm uppercase tracking-[0.45em] text-[#b18b4c]">Individuals & Families</p>
              <h2
                className="mt-5 text-[2.25rem]! font-semibold leading-[1.08]! tracking-[-0.01em] text-[#0A1128] sm:text-[2.5rem]! lg:text-[2.75rem]!"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Support for households,<br />parents, students, and<br />workers
              </h2>

              <div className="mt-8 w-full max-w-[20rem]">
                <img src={studyImage} alt="Student at desk" className="h-[260px] w-full rounded-[18px] object-cover shadow-md sm:h-[300px] lg:h-[217px]" />
              </div>
            </div>

            <div className="pl-0 lg:pl-12 pt-8 lg:pt-8">
              <p className="max-w-xl font-body text-lg leading-9 text-slate-700">
                We help individuals and families understand documents, organize records, and prepare for upcoming financial conversations — at a calm pace and in plain language. Whether you're getting ready for tax season, reviewing an insurance policy, or trying to put a household paper trail in order, we focus on clarity and dignity.
              </p>

              <ul className="mt-9 grid gap-4 text-base text-slate-600">
                {individualPoints.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e1ecfb] text-[#2f6bdf]">
                      <Check size={15} strokeWidth={3} />
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
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div className="pr-4 lg:pr-12 pt-8 lg:pt-12">
              <p className="max-w-[34rem] font-body text-lg leading-9 text-slate-200">
                We help small business owners and new entrepreneurs organize business documents, understand startup basics, prepare for tax season, and put simple financial systems in place. Our role is educational and organizational — supporting better readiness, not promising business outcomes.
              </p>

              <ul className="mt-9 grid gap-4 text-base text-slate-200">
                {businessPoints.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={22} strokeWidth={2} className="shrink-0 text-[#3b82f6]" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-sm uppercase tracking-[0.45em] text-[#b18b4c]">Small Business</p>
              <h3
                className="mt-4 text-[2.25rem]! font-semibold leading-[1.08]! tracking-[-0.01em] text-white sm:text-[2.5rem]! lg:text-[2.75rem]!"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Support for small business<br />owners and early-stage<br />entrepreneurs
              </h3>

              <div className="mt-8 w-full max-w-[30rem]">
                <img src={consultingImage} alt="Business meeting" className="h-[320px] w-full rounded-[18px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
