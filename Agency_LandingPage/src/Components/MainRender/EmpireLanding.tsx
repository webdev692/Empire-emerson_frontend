import React from "react";
import Hero from "../Umbrella/Hero";
import MissionSection from "./MissionSection";
import ValuesSection from "./ValuesSection";
import ServicesSection from "./ServicesSection";
import SupportSection from "./SupportSection";
import CTASection from "./CTASection";
import GetInTouch from "./GetInTouch";

const HomePage: React.FC = () => {
  return (
    <div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-9999 focus:fixed focus:bg-[#0A1128] focus:px-4 focus:py-2 focus:rounded focus:font-semibold focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>
      <main id="main-content">
        <Hero />
        <MissionSection />
        <ValuesSection />
        <ServicesSection />
        <SupportSection />
        <CTASection />
        <GetInTouch />
      </main>
    </div>
  );
};

export default HomePage;
