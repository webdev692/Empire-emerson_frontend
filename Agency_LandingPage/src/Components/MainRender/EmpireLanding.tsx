import React from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>The Emerson Agency</title>
        <meta
          name="description"
          content="The Emerson Agency provides strategic business support, tax education, and financial clarity for families and entrepreneurs."
        />
        <meta property="og:title" content="The Emerson Agency | Landing Page" />
        <meta
          property="og:description"
          content="Ethical guidance, practical services, and strategic support for families, learners, and business owners."
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
