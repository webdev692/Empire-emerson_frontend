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
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#E0CF8D]">
          Global Internship Program
        </p>
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Build real skills. Contribute to real projects.
        </h2>
        <div className="mb-10 h-1 w-20 rounded-full bg-[#C9A84C]" />
        <p className="mb-12 max-w-3xl text-white/70 text-base leading-relaxed">
          The EPDG Internship Program is founder-led and built with the support of interns contributing to real public-facing systems, documentation, strategy, and digital infrastructure.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-14">
          {cards.map((card) => (
            <div key={card.title} className="rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-[0_24px_65px_rgba(0,0,0,0.15)]">
              <h3 className="mb-4 text-lg font-bold text-[#F8E8B5]">{card.title}</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-white/85">
                {card.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#C9A84C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={() => openForm(FORM_INTERNSHIP, "Apply for the Internship Program", "Free semester-long program")}
          className="rounded-full bg-[#C9A84C] px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#07120f] transition duration-200 hover:bg-[#bda55f]"
        >
          Apply for the internship program
        </button>

        <p className="mt-12 border-t border-white/10 pt-8 text-sm leading-relaxed text-white/60">
          Participation in the internship program does not guarantee employment, academic credit, compensation, or future placement. Leadership track selection is based on performance and program capacity.
        </p>
      </div>
    </section>
  );
};

export default Internship;
