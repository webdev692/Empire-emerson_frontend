import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModal";
import missionBanner from "../../assets/HeroEPDG.webp";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const Hero: React.FC = () => {
  const { openForm } = useFormModal();
  const navigate = useNavigate();

  return (
    <section id="home" className="bg-[#052012] px-4 pt-6 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Our Mission banner */}
        <img
          src={missionBanner}
          alt="Emerson Professional Development Group — Our Mission: equipping students, professionals, and emerging leaders with education, training, and development pathways. Learn. Grow. Lead."
          className="block w-full h-auto"
        />

        {/* Hero copy — left edge aligned with the banner box */}
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 mb-6 bg-[#0B5C3B]/25 px-4 py-1.5 border border-[#C9A84C]/45 rounded-full font-medium text-[#C9A84C] text-[13px] tracking-wide">
            <span className="text-xs">🌿</span> Now enrolling for weekly classes
          </span>

          <h1 className="mb-4 font-bold text-white text-6xl sm:text-7xl leading-none tracking-tight heading">
            Learn. <span className="text-[#C9A84C] italic">Grow.</span> Lead.
          </h1>

          <p className="mb-9 max-w-xl text-white/80 text-lg leading-relaxed">
            Classes, career readiness, internships, and professional development for students,
            job seekers, workers, and organizations.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/classes")}
              className="flex items-center gap-2 bg-[#A98B5C] hover:bg-[#98794d] px-7 py-3.5 rounded-md font-semibold text-[#231b0e] text-[15px] transition-all duration-200 cursor-pointer"
            >
              Register for a Class <span aria-hidden>→</span>
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request Career Support", "Resume, coaching, interview prep & more")}
              className="bg-transparent hover:bg-white/5 px-7 py-3.5 border border-white/40 hover:border-[#C9A84C]/70 rounded-md font-semibold text-white text-[15px] transition-all duration-200 cursor-pointer"
            >
              Request Career Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
