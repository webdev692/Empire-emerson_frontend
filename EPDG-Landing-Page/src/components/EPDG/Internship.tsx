import React from "react";
import { useFormModal } from "./FormModal";

const FORM_INTERNSHIP = "https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform";

const cards = [
  {
    title: "Semester-Long Internship Program",
    items: [
      "Structured onboarding and team assignments",
      "Weekly assignments and real project work",
      "Portfolio-ready project opportunities",
      "Completion documentation and certificates",
      "Academic credit support where applicable",
      "Free participation — no cost to apply or join",
    ],
  },
  {
    title: "Internship Leadership Track",
    items: [
      "Selected for high-performing interns",
      "Team lead responsibilities and peer support",
      "Meeting facilitation and project oversight",
      "Leadership feedback and recognition",
      "Strengthens future professional eligibility",
      "Free for selected participants",
    ],
  },
  {
    title: "Enhanced Portfolio Review",
    items: [
      "Portfolio review for active interns and alumni",
      "Project narrative development",
      "LinkedIn showcase suggestions",
      "$25–$50 · May be waived for active interns",
    ],
  },
  {
    title: "Available Internship Tracks",
    items: [
      "Web Development & UX/UI",
      "Marketing & Content Strategy",
      "Sales & Business Development",
      "Operations & Administration",
      "Podcast & Media",
      "Social Media & Digital Presence",
    ],
  },
];

const Internship: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="internships" className="bg-[#044E37] px-4 py-20 text-white">
      <div className="mx-auto max-w-[1114px]">
        <p className="mb-2 font-bold text-[#AF9056] text-xs uppercase tracking-[0.25em]">
          Global Internship Program
        </p>
        <h2 className="mb-3 font-bold text-3xl md:text-4xl tracking-tight">
          Build Real Skills. Contribute to Real Projects.
        </h2>
        <div className="bg-[#C9A84C] mb-5 w-12 h-0.5" />
        <p className="mb-12 max-w-7xl text-white/65 text-sm md:text-base leading-relaxed">
          The EPDG Internship Program is founder-led and built with the support of interns
          contributing to real public-facing systems, documentation, strategy, and digital
          infrastructure. Participation is free whenever possible.
        </p>

        <div className="gap-5 grid grid-cols-1 md:grid-cols-2 mb-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-left bg-white/30 p-5 border-2 border-white/50 rounded-md"
          
            >
              <h3 className="mb-2 font-bold text-[#AF9056] text-[17px] tracking-wide">
                {card.title}
              </h3>
              <ul className="space-y-0.1">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-white/95">
                    <span className="bg-[#C9A84C] mt-1 rounded-full w-1 h-1 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={() => openForm(FORM_INTERNSHIP, "Apply for the Internship Program", "Free semester-long program")}
          className="bg-[#AF9056] hover:bg-[#b8943d] px-7 py-3.5 rounded-md font-bold text-[#022B1F] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
        >
          Apply for the Internship Program
        </button>

        <p className="mt-12 pt-6 border-white/15 border-t max-w-7xl text-white/45 text-sm leading-relaxed">
          Participation in the internship program does not guarantee employment, academic credit,
          compensation, paid project work, contract work, or future placement. Future paid,
          project-based, or permanent opportunities may be considered for strong contributors as the
          company grows, but employment is not guaranteed. Leadership track selection is based on
          performance and program capacity.
        </p>
      </div>
    </section>
  );
};

export default Internship;
