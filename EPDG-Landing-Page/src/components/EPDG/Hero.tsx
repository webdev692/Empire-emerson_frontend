import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModalContext";
import missionBanner from "../../assets/HeroEPDG.webp";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const Hero: React.FC = () => {
  const { openForm } = useFormModal();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative bg-[#041913] px-4 pt-6 pb-20 sm:pt-8 sm:pb-28 overflow-hidden">
      <div className="top-0 absolute inset-x-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_55%)] h-107 pointer-events-none" />
      <div className="mx-auto max-w-278.5">
        <div className="relative">
          <img
            src={missionBanner}
            alt="Emerson Professional Development Group — Our Mission: equipping students, professionals, and emerging leaders with education, training, and development pathways."
            className="w-full object-cover"
          />
        </div>

        <div className="z-10 relative mt-6">
          <span className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-1.5 border border-[#C9A84C]/30 rounded-full font-medium text-[#C9A84C] text-sm">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            <span>Now enrolling for weekly classes</span>
          </span>

          <h1 className="mt-8 font-black text-white text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tighter heading">
            Learn. <span className="text-[#C9A84C] italic">Grow.</span> Lead.
          </h1>

          <p className="mt-6 max-w-2xl text-white/75 text-base sm:text-lg leading-relaxed">
            Classes, career readiness, internships, and professional development
            for students, job seekers, workers, and organizations.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <button
              onClick={() => navigate("/classes")}
              className="inline-flex justify-center items-center gap-2 bg-[#C9A84C] hover:bg-[#bba963] px-6 py-3.5 rounded-full font-semibold text-[#07120f] text-sm uppercase tracking-[0.16em] transition duration-200 cursor-pointer"
            >
              Register for a class
              <span aria-hidden="true">&rarr;</span>
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request Career Support", "Resume, coaching, interview prep & more")}
              className="inline-flex justify-center items-center bg-white/5 hover:bg-white/10 px-6 py-3.5 border border-[#C9A84C] hover:border-[#C9A84C] rounded-full font-semibold text-white text-sm uppercase tracking-[0.16em] transition duration-200 cursor-pointer"
            >
              Request career support
            </button>
          </div>

          <div className="gap-4 grid sm:grid-cols-3 mt-12">
            <div className="bg-white/5 p-5 border border-[#C9A84C] rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">21 Weekly Classes</p>
              <p className="mt-2 text-white/65">Hands-on learning, welcoming online and in-person cohorts.</p>
            </div>
            <div className="bg-white/5 p-5 border border-[#C9A84C] rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">Career Services</p>
              <p className="mt-2 text-white/65">Resume, LinkedIn, interview coaching, and job search support.</p>
            </div>
            <div className="bg-white/5 p-5 border border-[#C9A84C] rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">Internship Program</p>
              <p className="mt-2 text-white/65">Real project work, mentorship, and portfolio-building experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
