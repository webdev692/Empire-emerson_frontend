import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModal";
import missionBanner from "../../assets/HeroEPDG.webp";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const Hero: React.FC = () => {
  const { openForm } = useFormModal();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative bg-[#041913] px-4 py-20 sm:py-28 overflow-hidden">
      <div className="top-0 absolute inset-x-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_55%)] h-107 pointer-events-none" />
      <div className="items-center gap-12 grid lg:grid-cols-[1.2fr_0.8fr] mx-auto max-w-278.5">
        <div className="z-10 relative">
          <span className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 border border-[#C9A84C]/30 rounded-full font-semibold text-[#C9A84C] text-sm uppercase tracking-[0.22em]">
            <span>Now enrolling</span>
          </span>

          <h1 className="mt-8 font-black text-white text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tighter heading">
            Learn. <span className="text-[#C9A84C] italic">Grow.</span> Lead.
          </h1>

          <p className="mt-6 max-w-2xl text-white/75 text-base sm:text-lg leading-relaxed">
            EPDG delivers weekly classes, career readiness coaching, internship placement support,
            and workforce partnerships that help students and working professionals move forward.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <button
              onClick={() => navigate("/classes")}
              className="inline-flex justify-center items-center bg-[#C9A84C] hover:bg-[#bba963] px-6 py-3.5 rounded-full font-semibold text-[#07120f] text-sm uppercase tracking-[0.16em] transition duration-200"
            >
              Register for a class
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request Career Support", "Resume, coaching, interview prep & more")}
              className="inline-flex justify-center items-center bg-white/5 hover:bg-white/10 px-6 py-3.5 border border-white/20 hover:border-[#C9A84C] rounded-full font-semibold text-white text-sm uppercase tracking-[0.16em] transition duration-200"
            >
              Request career support
            </button>
          </div>

          <div className="gap-4 grid sm:grid-cols-3 mt-12">
            <div className="bg-white/5 p-5 border border-white/10 rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">21 Weekly Classes</p>
              <p className="mt-2 text-white/65">Hands-on learning, welcoming online and in-person cohorts.</p>
            </div>
            <div className="bg-white/5 p-5 border border-white/10 rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">Career Services</p>
              <p className="mt-2 text-white/65">Resume, LinkedIn, interview coaching, and job search support.</p>
            </div>
            <div className="bg-white/5 p-5 border border-white/10 rounded-3xl text-white/85 text-sm">
              <p className="font-semibold">Internship Program</p>
              <p className="mt-2 text-white/65">Real project work, mentorship, and portfolio-building experience.</p>
            </div>
          </div>
        </div>

        <div className="relative bg-[#0b2118] shadow-[0_40px_80px_rgba(0,0,0,0.35)] border border-white/10 rounded-4xl overflow-hidden">
          <img
            src={missionBanner}
            alt="Emerson Professional Development Group — Our Mission: equipping students, professionals, and emerging leaders with education, training, and development pathways."
            className="w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
