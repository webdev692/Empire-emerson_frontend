import React from "react";
import { useFormModal } from "./FormModal";

const FORM_CLASSES    = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FORM_SERVICES   = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";
const FORM_WORKFORCE  = "https://docs.google.com/forms/d/e/1FAIpQLSc3j8G8Ed-9KluUeKwfcNVgoo8QR7CQWdifSwpuBeS1Bm3AMA/viewform";
const FORM_INTERNSHIP = "https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform";

const Hero: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="home" className="bg-[#022B1F] px-3 pb-3">
      <div className="relative flex justify-center items-center min-h-160 overflow-hidden">
        <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#022B1F]/72" />
        <div className="top-0 right-0 left-0 absolute bg-[#C9A84C] h-0.5" />

        <div className="z-10 relative mx-auto px-6 py-20 max-w-4xl text-center">
          <p className="inline-flex items-center mb-8 px-6 py-2.5 border border-[#C9A84C]/50 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.25em]">
            Emerson Professional Development Group
          </p>

          <h1 className="mb-6 font-bold text-white text-4xl md:text-6xl leading-tight tracking-tight">
            Classes, career readiness, internships, and professional development for{" "}
            <span className="text-[#C9A84C]">
              students, job seekers, workers, and organizations.
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-white/85 text-sm md:text-base leading-relaxed">
            EPDG supports students, job seekers, career changers, interns, schools, and workforce
            programs through structured training, coaching, workshops, and practical professional
            development services.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <button
              onClick={() => openForm(FORM_CLASSES, "Register for a Class", "Free & low-cost weekly classes")}
              className="bg-[#C9A84C] hover:bg-[#b8943d] px-8 py-3.5 font-bold text-[#022B1F] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
            >
              Register for a Class
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Get Career Support", "Resume, coaching, interview prep & more")}
              className="px-8 py-3.5 border border-white/50 hover:border-[#C9A84C]/60 font-bold text-white hover:text-[#C9A84C] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
            >
              Get Career Support
            </button>
            <button
              onClick={() => openForm(FORM_WORKFORCE, "Request Workforce Training", "For schools, libraries & organizations")}
              className="px-8 py-3.5 border border-white/50 hover:border-[#C9A84C]/60 font-bold text-white hover:text-[#C9A84C] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
            >
              Request Workforce Training
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openForm(FORM_INTERNSHIP, "Apply for Internship", "Free semester-long internship program")}
              className="px-8 py-3.5 border border-white/50 hover:border-[#C9A84C]/60 font-bold text-white hover:text-[#C9A84C] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
            >
              Apply for Internship
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request a Fee Waiver", "Reduced cost & fee waiver options")}
              className="px-8 py-3.5 border border-white/50 hover:border-[#C9A84C]/60 font-bold text-white hover:text-[#C9A84C] text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
            >
              Request a Fee Waiver
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
