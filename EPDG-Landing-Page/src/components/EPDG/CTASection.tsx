import React from "react";
import { useFormModal } from "./FormModalContext";
import {
  CLASS_REGISTRATION_FORM,
  CAREER_SERVICES_FORM,
  INTERNSHIP_APPLICATION_FORM,
  WORKFORCE_PARTNERSHIP_FORM,
} from "./links";

const iconProps = {
  className: "w-5 h-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const CapIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

const BriefcaseIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect width="20" height="14" x="2" y="6" rx="2" />
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UsersIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BuildingIcon: React.FC = () => (
  <svg {...iconProps}>
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

const forms = [
  { title: "Register for Classes", Icon: CapIcon, url: CLASS_REGISTRATION_FORM, subtitle: "Free & low-cost weekly classes" },
  { title: "Request Career Services", Icon: BriefcaseIcon, url: CAREER_SERVICES_FORM, subtitle: "Resume, coaching & interview prep" },
  { title: "Apply for Internship", Icon: UsersIcon, url: INTERNSHIP_APPLICATION_FORM, subtitle: "Free semester-long program" },
  { title: "Workforce Training", Icon: BuildingIcon, url: WORKFORCE_PARTNERSHIP_FORM, subtitle: "Schools, libraries & organizations" },
];

const CTASection: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="contact" className="bg-[#F1F0EB] px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-278.5">
        <p className="mb-4 font-bold text-[#B0893C] text-[13px] uppercase tracking-[0.25em]">
          Get in touch
        </p>
        <h2 className="mb-6 max-w-3xl text-[#1A1A1A] text-5xl sm:text-6xl leading-[1.05] heading">
          Reach us through the form that{" "}
          <span className="text-[#2E6B3E] italic">fits your need.</span>
        </h2>
        <p className="mb-12 max-w-xl text-[#555] text-base leading-relaxed">
          Each link opens a secure Google Form so we can route your request to the right team.
        </p>

        <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-4">
          {forms.map(({ title, Icon, url, subtitle }) => (
            <button
              key={title}
              onClick={() => openForm(url, title, subtitle)}
              className="flex flex-col items-start bg-[#FBFAF6] hover:bg-white shadow-[0_8px_24px_rgba(20,30,20,0.04)] p-6 border border-[#E6E4DC] rounded-2xl text-left transition duration-200 cursor-pointer"
            >
              <span className="flex justify-center items-center bg-[#E9F1E6] rounded-full w-11 h-11 text-[#2E6B3E]">
                <Icon />
              </span>
              <p className="mt-5 font-semibold text-[#1A1A1A] text-base">{title}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 font-medium text-[#2E6B3E] text-sm">
                Open form <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
