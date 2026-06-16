import React from "react";
import { useFormModal } from "./FormModal";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const services = [
  {
    title: "Career Readiness Consultation",
    description:
      "Discovery calls, planning sessions, and career strategy consultations for students, job seekers, and career changers.",
    price: "Free – $75 · Sliding scale available",
  },
  {
    title: "Resume Services",
    description:
      "Resume review, rewriting, and coaching sessions to help you present your experience clearly and professionally.",
    price: "From  $50 · Reduced cost options available",
  },
  {
    title: "LinkedIn Profile Support",
    description:
      "Profile audits, content guidance, and LinkedIn strategy for job seekers, career changers, and early-career professionals.",
    price: "From $50 · Sliding scale available",
  },
  {
    title: "Cover Letter Services",
    description:
      "Cover letter review, drafting support, and targeted letter writing for job applications, internships, and professional opportunities.",
    price: "From $25 · Reduced cost options available",
  },
  {
    title: "Interview Preparation",
    description:
      "Mock interview practice, response coaching, and preparation support for interviews across industries and experience levels.",
    price: "From $50 · Group sessions from $15",
  },
  {
    title: "Job Search Support",
    description:
      "Job search strategy, application systems, follow-up guidance, and accountability support for active job seekers.",
    price: "From $75 · Sliding scale available",
  },
  {
    title: "Career Change Package",
    description:
      "Structured support for career changers navigating new industries, updated materials, and job search repositioning.",
    price: "$200 – $500 · Sliding scale when possible",
  },
  {
    title: "Professional Development Coaching",
    description:
      "Coaching sessions focused on professional goals, skills development, and building momentum toward career advancement.",
    price: "From $50/session · Packages available",
  },
];

const CareerServices: React.FC = () => {
  const { openForm } = useFormModal();

  return (
    <section id="services" className="bg-[#F3F0E8] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.25em]">
          Career &amp; Professional Services
        </p>
        <h2 className="mb-3 font-bold text-[#0A1F17] text-3xl md:text-4xl tracking-tight">
          Practical Support for Every Stage
        </h2>
        <div className="bg-[#044E37] mb-5 w-12 h-0.5" />
        <p className="mb-12 max-w-7xl text-gray-500 text-sm md:text-base leading-relaxed">
          EPDG focuses on internships, career readiness, professional development, resume and
          LinkedIn support, interview preparation, workforce training, and leadership development.
        </p>

        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex flex-col bg-white shadow-md"
             
            >
              <div className="flex flex-col flex-1 items-center bg-white p-2 border-2 border-black/50 rounded-xl">
                <h3 className="mb-3 font-bold text-[15px] text-black leading-snug">{s.title}</h3>
                <p className="flex-1 mb-4 text-gray-800 text-sm leading-relaxed">{s.description}</p>
                <p className="font-medium text-[#044E37] text-sm text-center tracking-wide">{s.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => openForm(FORM_SERVICES, "Request a Service", "Career & professional support services")}
            className="bg-[#AF9056] hover:bg-[#b8943d] px-7 py-3.5 rounded-md font-bold text-[#022B1F] text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            Request a Service
          </button>
          <button
            onClick={() => openForm(FORM_SERVICES, "Reduced Cost Options", "Sliding scale & fee waiver inquiry")}
            className="hover:bg-[#044E37] px-7 py-3.5 border border-[#044E37] rounded-md font-bold text-[#044E37] hover:text-white text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            Ask about Reduced Cost Options
          </button>
        </div>

        <p className="max-w-7xl text-gray-600 text-sm leading-relaxed">
          Services are subject to availability, scope review, and program capacity. No employment,
          income, or career outcome is guaranteed.
        </p>
      </div>
    </section>
  );
};

export default CareerServices;
