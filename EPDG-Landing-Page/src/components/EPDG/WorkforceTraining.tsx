import React from "react";
import { useFormModal } from "./FormModal";
import { biz } from "../../assets";

const FORM_WORKFORCE =
  "https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform";
const FORM_SERVICES =
  "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const partners = [
  {
    title: "Schools & Educational Programs",
    description:
      "Career readiness workshops, class integrations, and student professional development programs designed for school partners.",
  },
  {
    title: "Libraries & Community Organizations",
    description:
      "Public-facing workshops and career support programming for libraries, community centers, and nonprofit partners.",
  },
  {
    title: "Workforce Programs",
    description:
      "Collaboration with WIOA, SC Works, SNAP E&T, Vocational Rehabilitation, and other workforce programs.",
  },
  {
    title: "Staffing Agency Partnerships",
    description:
      "Referral and preparation partnerships to connect clients with staffing opportunities and professional placement pathways.",
  },
];

const tracks = [
  {
    title: "Workforce Readiness Workshops",
    description:
      "Community, small group, and organizational sessions covering career skills, professional development, and workforce preparation.",
    fee: "Free–$25/person (community). $150–$1,500+ (org). Free/reduced through community partners.",
  },
  {
    title: "Organizational Team Training",
    description:
      "Professional development training for staff, interns, and volunteers. Available in 60-min, 90-min, half-day, and custom series formats.",
    fee: "$150–$1,000+. Mission-aligned nonprofit rates by agreement.",
  },
  {
    title: "Internship Program Design for Small Businesses",
    description:
      "Support for small businesses wanting to build ethical, structured internship systems with proper onboarding and project frameworks.",
    fee: "$150 (consultation). $500–$1,500 (full setup). Reduced for community partners.",
  },
  {
    title: "School & Library Workshops",
    description:
      "Career readiness and professional development workshops designed for school programs, public libraries, and community learning spaces.",
    fee: "Pricing by scope. Reduced community rates available.",
  },
];

const WorkforceTraining: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <>
      <section id="workforce" className="bg-[#F3F0E8] px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-[1114px]">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#9f8745]">
            Workforce & Organizational Training
          </p>
          <h2 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-[#0A1F17] sm:text-5xl">
            Training for teams, schools, and organizations.
          </h2>
          <div className="mb-10 h-1 w-20 rounded-full bg-[#044E37]" />
          <p className="mb-12 max-w-3xl text-base leading-relaxed text-[#5a5a4f]">
            EPDG works with schools, libraries, workforce programs, staffing agencies, and community organizations to expand access to career readiness and professional development resources.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {tracks.map((t) => (
              <div key={t.title} className="rounded-[2rem] border border-[#dbd3b9] bg-white p-8 shadow-[0_24px_60px_rgba(22,25,16,0.08)]">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#6d5f33]">{t.title}</h3>
                <p className="text-sm leading-relaxed text-[#4b4a40]">{t.description}</p>
                <p className="mt-5 text-sm font-semibold text-[#044E37]">{t.fee}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              openForm(
                FORM_WORKFORCE,
                "Partner with EPDG",
                "Workforce training & organizational partnerships"
              )
            }
            className="mt-10 rounded-full bg-[#044E37] px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-200 hover:bg-[#032819]"
          >
            Request workforce training
          </button>
        </div>
      </section>

      <section className="bg-[#041914] px-4 py-20 sm:py-24 text-white">
        <div className="mx-auto grid max-w-[1114px] gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A84C]">Partnerships</p>
            <h3 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Partner with EPDG to expand training, support, and career opportunity access.
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              EPDG works with schools, libraries, workforce programs, staffing agencies, and community organizations to extend career readiness and professional development resources.
            </p>

            <div className="grid gap-4">
              {partners.map((part) => (
                <div key={part.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <h4 className="mb-2 text-base font-semibold text-white">{part.title}</h4>
                  <p className="text-sm leading-relaxed text-white/70">{part.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => openForm(FORM_WORKFORCE, "Partner with EPDG", "Partnership inquiry")}
              className="mt-6 rounded-full bg-[#C9A84C] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#07120f] transition duration-200 hover:bg-[#bda55f]"
            >
              Partner with EPDG
            </button>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b2119] shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
            <img src={biz} alt="Professional partnership" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#C9A84C] px-4 py-20 text-[#07120f]">
        <div className="mx-auto max-w-[1114px] text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Free & reduced-cost support available.
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-[#07120f]/40" />
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#07120f]/80">
            Clients experiencing financial hardship may request a reduced fee, sliding-scale rate, or fee waiver. Free or reduced-cost support may be available for students, interns, job seekers, caregivers, and community partners.
          </p>
          <button
            onClick={() =>
              openForm(FORM_SERVICES, "Request a Fee Waiver", "Reduced cost & sliding scale options")
            }
            className="mt-8 rounded-full bg-[#07120f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-200 hover:bg-[#000a05]"
          >
            Request a fee waiver
          </button>
        </div>
      </section>
    </>
  );
};

export default WorkforceTraining;