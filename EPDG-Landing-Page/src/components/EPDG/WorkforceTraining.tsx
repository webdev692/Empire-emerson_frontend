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

const audiences = [
  "Organizations",
  "Schools",
  "Libraries",
  "Staffing agencies",
  "Community groups",
];

const BuildingIcon: React.FC = () => (
  <svg
    className="w-4 h-4 text-[#2E6B3E] shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const WorkforceTraining: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <>
      <section id="workforce" className="bg-[#E8E5DE] px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-278.5">
          <p className="mb-4 font-bold text-[#B0893C] text-lg uppercase tracking-[0.22em]">
            Workforce &amp; Organizational Training
          </p>
          <h2 className="mb-6 max-w-3xl text-[#1A1A1A] text-5xl sm:text-6xl leading-[1.05] heading">
            Partner with us for <span className="text-[#2E6B3E] italic">workshops</span> and professional development.
          </h2>
          <p className="mb-10 max-w-2xl text-[#555] text-base leading-relaxed">
            EPDG can support organizations, schools, libraries, staffing agencies, and community
            groups with workshops and professional development training tailored to your audience.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {audiences.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-2 bg-white shadow-[0_6px_18px_rgba(20,30,20,0.07)] px-4 py-2.5 rounded-full font-medium text-[#1A1A1A] text-sm"
              >
                <BuildingIcon />
                {a}
              </span>
            ))}
          </div>

          <button
            onClick={() =>
              openForm(
                FORM_WORKFORCE,
                "Request Workforce Training or Partnership",
                "Workforce training & organizational partnerships"
              )
            }
            className="inline-flex justify-center items-center bg-[#13431C] hover:bg-[#0d2e14] px-7 py-3.5 rounded-lg font-semibold text-white text-base transition duration-200 cursor-pointer"
          >
            Request Workforce Training or Partnership
          </button>
        </div>
      </section>

      <section className="bg-[#041914] px-4 py-20 sm:py-24 text-white">
        <div className="items-center gap-10 grid lg:grid-cols-[0.95fr_1.05fr] mx-auto max-w-278.5">
          <div className="space-y-6">
            <p className="text-[#C9A84C] text-xs uppercase tracking-[0.28em]">Partnerships</p>
            <h3 className="max-w-2xl font-bold text-4xl sm:text-5xl tracking-tight">
              Partner with EPDG to expand training, support, and career opportunity access.
            </h3>
            <p className="max-w-xl text-white/70 text-sm leading-relaxed">
              EPDG works with schools, libraries, workforce programs, staffing agencies, and community organizations to extend career readiness and professional development resources.
            </p>

            <div className="gap-4 grid">
              {partners.map((part) => (
                <div key={part.title} className="bg-white/5 p-6 border border-white/10 rounded-[1.75rem]">
                  <h4 className="mb-2 font-semibold text-white text-base">{part.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{part.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => openForm(FORM_WORKFORCE, "Partner with EPDG", "Partnership inquiry")}
              className="bg-[#C9A84C] hover:bg-[#bda55f] mt-6 px-8 py-3.5 rounded-full font-semibold text-[#07120f] text-sm uppercase tracking-[0.18em] transition duration-200"
            >
              Partner with EPDG
            </button>
          </div>

          <div className="bg-[#0b2119] shadow-[0_40px_100px_rgba(0,0,0,0.35)] border border-white/10 rounded-4xl overflow-hidden">
            <img src={biz} alt="Professional partnership" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#C9A84C] px-4 py-20 text-[#07120f]">
        <div className="mx-auto max-w-278.5 text-center">
          <h2 className="mb-5 font-bold text-3xl sm:text-4xl tracking-tight">
            Free & reduced-cost support available.
          </h2>
          <div className="bg-[#07120f]/40 mx-auto mb-8 rounded-full w-20 h-1" />
          <p className="mx-auto max-w-3xl text-[#07120f]/80 text-sm leading-relaxed">
            Clients experiencing financial hardship may request a reduced fee, sliding-scale rate, or fee waiver. Free or reduced-cost support may be available for students, interns, job seekers, caregivers, and community partners.
          </p>
          <button
            onClick={() =>
              openForm(FORM_SERVICES, "Request a Fee Waiver", "Reduced cost & sliding scale options")
            }
            className="bg-[#07120f] hover:bg-[#000a05] mt-8 px-8 py-4 rounded-full font-semibold text-white text-sm uppercase tracking-[0.18em] transition duration-200"
          >
            Request a fee waiver
          </button>
        </div>
      </section>
    </>
  );
};

export default WorkforceTraining;