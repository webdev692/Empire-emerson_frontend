import React from "react";
import { useFormModal } from "./FormModalContext";

const FORM_WORKFORCE =
  "https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform";
const FORM_SERVICES =
  "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const HeartIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </svg>
);

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

      <section className="bg-[#F3F3F1] px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div
            className="shadow-[0_30px_70px_rgba(20,30,20,0.12)] p-8 sm:p-10 border border-white/70 rounded-3xl"
            style={{
              background:
                "radial-gradient(130% 120% at 88% 10%, #e8ddb4 0%, #f2eed9 32%, #eef2ea 68%, #e9f0e6 100%)",
            }}
          >
            <div className="flex gap-5">
              <span className="flex justify-center items-center bg-white shadow-sm rounded-full w-12 h-12 text-[#2E6B3E] shrink-0">
                <HeartIcon />
              </span>
              <div>
                <h3 className="mb-3 text-[#1A1A1A] text-3xl sm:text-4xl heading">
                  Fee Waiver &amp; Access
                </h3>
                <p className="mb-6 text-[#555] text-base leading-relaxed">
                  We believe professional development should be accessible. Fee waiver and
                  reduced-cost options may be available for participants who cannot afford the full
                  class or service fee.
                </p>
                <button
                  onClick={() =>
                    openForm(FORM_SERVICES, "Ask About a Fee Waiver", "Reduced cost & fee waiver options")
                  }
                  className="inline-flex items-center bg-white hover:bg-[#f7f6f0] shadow-sm px-5 py-2.5 border border-[#dcdad2] rounded-full font-semibold text-[#1A1A1A] text-sm transition duration-200 cursor-pointer"
                >
                  Ask About a Fee Waiver
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkforceTraining;
