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
      {/* Workforce Training */}
      <section id="workforce" className="bg-white px-4 py-20 w-full">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.25em]">
            Workforce &amp; Organizational Training
          </p>
          <h2 className="mb-3 max-w-xl font-bold text-[#0A1F17] text-3xl md:text-4xl tracking-tight">
            Training for Teams, Schools, and Organizations
          </h2>
          <div className="bg-[#044E37] mb-5 w-12 h-0.5" />
          <p className="mb-10 max-w-7xl text-gray-500 text-sm md:text-base leading-relaxed">
            EPDG works with schools, libraries, workforce programs, staffing agencies, and community
            organizations to expand access to career readiness and professional development
            resources.
          </p>

          {/* Track cards — col on small, row on large */}
          <div className="flex lg:flex-row flex-col gap-4 mb-10 w-full">
            {tracks.map((t) => (
              <div
                key={t.title}
                className="flex flex-col bg-[#AF9056]/20 px-5 py-5 w-full"
                style={{ borderLeft: "3px solid #AF9056" }}
              >
                <h3 className="mb-1.5 font-bold text-[#0A1F17] text-xs uppercase tracking-wide">
                  {t.title}
                </h3>
                <p className="flex-1 text-[#323232] text-sm leading-relaxed">
                  {t.description}
                </p>
                <p className="mt-3 font-medium text-[#044E37] text-sm leading-relaxed">
                  {t.fee}
                </p>
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
            className="bg-[#AF9056] hover:bg-[#b8943d] px-7 py-3.5 rounded-md font-bold text-[#022B1F] text-md tracking-[0.2em] transition-all duration-200 cursor-pointer"
          >
            Request Workforce Training
          </button>
        </div>
      </section>

      {/* Partnership */}
      <section className="flex lg:flex-row flex-col gap-10 bg-white/50 px-4 py-16">
        {/* Left: text + partner cards */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <p className="font-semibold text-[#AF9056] text-sm uppercase tracking-[0.2em]">
            Partnerships
          </p>
          <h3 className="font-bold text-[#0A1F17] text-3xl md:text-4xl">
            Partner With EPDG
          </h3>
          <p className="mb-2 text-gray-500 text-sm md:text-base leading-relaxed">
            EPDG works with schools, libraries, workforce programs, staffing agencies, and community
            organizations to expand access to career readiness and professional development
            resources.
          </p>

          <div className="flex flex-col gap-3">
            {partners.map((part, index) => (
              <div
                key={index}
                className="bg-white shadow-sm p-4"
                style={{ borderLeft: "3px solid #044E37" }}
              >
                <h4 className="mb-1 font-bold text-[#0A1F17] text-sm">{part.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{part.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              openForm(FORM_WORKFORCE, "Partner with EPDG", "Partnership inquiry")
            }
            className="self-start bg-[#AF9056] mt-4 px-7 py-3.5 rounded-md font-bold text-white text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
          >
            Partner with EPDG
          </button>
        </div>

        {/* Right: image */}
        <div className="px-1.5 w-full lg:w-1/2 min-h-64">
          <img
            src={biz}
            alt="Professional partnership"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Fee waiver band */}
      <section className="bg-[#AF9056] px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          
          <h2 className="mb-5 font-bold text-black text-2xl md:text-4xl tracking-tight">
            Free &amp; Reduced-Cost Support Available
          </h2>
          <div className="bg-black/30 mx-auto mb-6 w-12 h-0.5" />
          <p className="mx-auto mb-8 max-w-7xl text-black/70 text-sm md:text-base leading-relaxed">
            Clients experiencing financial hardship may request a reduced fee, sliding-scale rate,
            or fee waiver. Free or reduced-cost support may be available for students, active
            interns, unemployed job seekers, single parents, caregivers, community agency referrals,
            and individuals experiencing hardship.
          </p>
          <button
            onClick={() =>
              openForm(FORM_SERVICES, "Request a Fee Waiver", "Reduced cost & sliding scale options")
            }
            className="bg-[#044E37] px-8 py-4 rounded-md font-bold text-white text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
          >
            Request a Fee Waiver
          </button>
        </div>
      </section>
    </>
  );
};

export default WorkforceTraining;