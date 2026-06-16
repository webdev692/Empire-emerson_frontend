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
    <section id="contact" className="bg-[#F3F0E8] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-2">
          Get Started
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F17] mb-3 tracking-tight">
          Ready to Take the Next Step?
        </h2>
        <div className="w-12 h-0.5 bg-[#044E37] mb-5" />
        <p className="text-gray-500 text-sm md:text-base max-w-xl mb-12 leading-relaxed">
          Use the right form below to register, apply, or request services. Each form goes directly
          to our team for review.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {forms.map((f) => (
            <div
              key={f.title}
              className="bg-white shadow-sm flex flex-col"
              style={{ borderTop: "3px solid #044E37" }}
            >
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[#044E37] font-bold leading-snug mb-3 uppercase tracking-wide text-sm">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                  {f.description}
                </p>
                <button
                  onClick={() => openForm(f.formUrl, f.title, f.subtitle)}
                  className="cursor-pointer bg-[#C9A84C] hover:bg-[#b8943d] text-[#022B1F] text-sm font-bold uppercase tracking-wider px-4 py-3 transition-all duration-200 self-start"
                >
                  {f.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
          Do not submit sensitive personal documents, private financial information, Social Security
          numbers, government ID copies, or insurance documents through general inquiry forms.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
