import React from "react";
import { useFormModal } from "./FormModal";

const forms = [
  {
    title: "Register for a Weekly Class",
    description:
      "Sign up for free or low-cost weekly classes in career readiness, financial literacy, business development, and professional development.",
    button: "Register for Classes",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform",
    subtitle: "Free & low-cost weekly classes",
  },
  {
    title: "Request Career or Professional Services",
    description:
      "Submit a services request for resume support, career coaching, interview preparation, job search guidance, or other EPDG services.",
    button: "Request Services",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform",
    subtitle: "Resume, coaching, interview prep & more",
  },
  {
    title: "Apply for the Internship Program",
    description:
      "Apply to join the EPDG Global Internship Program. Participation is free. Open to students, emerging professionals, and career changers.",
    button: "Apply Now",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform",
    subtitle: "Free semester-long internship program",
  },
  {
    title: "Request Workforce Training or Partnership",
    description:
      "Schools, libraries, workforce programs, and organizations can request training, workshops, or explore a partnership with EPDG.",
    button: "Contact & Inquire",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform",
    subtitle: "For schools, libraries & organizations",
  },
];

const CTASection: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="contact" className="bg-[#07120f] px-4 py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-[1114px]">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#C9A84C]">
          Get Started
        </p>
        <h2 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to take the next step?
        </h2>
        <div className="mb-10 h-1 w-20 rounded-full bg-[#C9A84C]" />
        <p className="mb-12 max-w-xl text-base leading-relaxed text-white/70">
          Use the right form below to register, apply, or request services. Each form goes directly to our team for review.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {forms.map((f) => (
            <div
              key={f.title}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(255,255,255,0.05)]"
            >
              <div className="flex flex-1 flex-col gap-5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#C9A84C]">{f.subtitle}</p>
                  <h3 className="mt-3 text-lg font-bold text-white">{f.title}</h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-white/70">{f.description}</p>
                <button
                  onClick={() => openForm(f.formUrl, f.title, f.subtitle)}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#07120f] transition duration-200 hover:bg-[#bda55f]"
                >
                  {f.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-white/50">
          Do not submit sensitive personal documents, private financial information, Social Security numbers, government ID copies, or insurance documents through general inquiry forms.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
