import React from "react";
import { useFormModal } from "./FormModal";
import experienceImg from "../../assets/Experience.png";

const FORM_INTERNSHIP = "https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform";

const iconProps = {
  className: "w-5 h-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

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

const CapIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

const FileIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const features = [
  { title: "Hands-on experience", subtitle: "Apply skills to real, meaningful work.", Icon: BriefcaseIcon },
  { title: "Leadership opportunities", subtitle: "Step into responsibility and collaboration.", Icon: UsersIcon },
  { title: "Project-based learning", subtitle: "Build through structured, guided projects.", Icon: CapIcon },
  { title: "Portfolio development", subtitle: "Leave with tangible work to showcase.", Icon: FileIcon },
];

const Internship: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="internships" className="bg-[#F3F3F1] px-4 py-20 sm:py-24">
      <div className="items-stretch gap-12 lg:gap-16 grid lg:grid-cols-2 mx-auto max-w-278.5">
        <div className="flex flex-col">
          <p className="mb-4 font-bold text-[#B0893C] text-[13px] uppercase tracking-[0.22em]">
            Global Internship Program
          </p>
          <h2 className="mb-6 max-w-xl text-[#1A1A1A] text-5xl sm:text-6xl leading-[1.05] heading">
            Real experience for students and{" "}
            <span className="text-[#2E6B3E] italic">emerging professionals.</span>
          </h2>
          <p className="mb-10 max-w-md text-[#555] text-base leading-relaxed">
            The Global Internship Program supports students and emerging professionals with
            hands-on experience, leadership opportunities, project-based learning, and portfolio
            development.
          </p>

          <div className="space-y-3.5">
            {features.map(({ title, subtitle, Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 bg-white shadow-[0_10px_30px_rgba(20,30,20,0.05)] p-4 border border-[#EAE8E2] rounded-2xl"
              >
                <span className="flex justify-center items-center bg-[#E9F1E6] rounded-xl w-11 h-11 text-[#2E6B3E] shrink-0">
                  <Icon />
                </span>
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-base">{title}</p>
                  <p className="text-[#6B6B6B] text-sm">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => openForm(FORM_INTERNSHIP, "Apply for the Internship Program", "Free semester-long program")}
            className="inline-flex justify-center items-center bg-[#1C4A2B] hover:bg-[#163C22] mt-10 px-7 py-3.5 rounded-lg w-fit font-semibold text-white text-base transition duration-200 cursor-pointer"
          >
            Apply for the Internship Program
          </button>
        </div>

        <div className="rounded-3xl overflow-hidden">
          <img
            src={experienceImg}
            alt="EPDG interns and emerging professionals collaborating around a table"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Internship;
