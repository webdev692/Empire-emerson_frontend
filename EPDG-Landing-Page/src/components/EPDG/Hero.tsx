import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormModal } from "./FormModal";
import missionBanner from "../../assets/HeroEPDG.webp";

const FORM_SERVICES = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform";

const Hero: React.FC = () => {
  const { openForm } = useFormModal();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-[#041913] px-4 py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.16),_transparent_55%)] pointer-events-none" />
      <div className="mx-auto grid max-w-[1114px] gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
            <span>Now enrolling</span>
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl heading">
            Learn. <span className="text-[#C9A84C] italic">Grow.</span> Lead.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            EPDG delivers weekly classes, career readiness coaching, internship placement support,
            and workforce partnerships that help students and working professionals move forward.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/classes")}
              className="inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#07120f] transition duration-200 hover:bg-[#bba963]"
            >
              Register for a class
            </button>
            <button
              onClick={() => openForm(FORM_SERVICES, "Request Career Support", "Resume, coaching, interview prep & more")}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition duration-200 hover:border-[#C9A84C] hover:bg-white/10"
            >
              Request career support
            </button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/85">
              <p className="font-semibold">21 Weekly Classes</p>
              <p className="mt-2 text-white/65">Hands-on learning, welcoming online and in-person cohorts.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/85">
              <p className="font-semibold">Career Services</p>
              <p className="mt-2 text-white/65">Resume, LinkedIn, interview coaching, and job search support.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/85">
              <p className="font-semibold">Internship Program</p>
              <p className="mt-2 text-white/65">Real project work, mentorship, and portfolio-building experience.</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b2118] shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
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
