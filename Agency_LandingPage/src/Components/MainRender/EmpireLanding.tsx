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
        <title>The Emerson Agency LLC | Financial Services &amp; Education</title>
        <meta
          name="description"
          content="The Emerson Agency LLC provides tax preparation, insurance education, financial education, and community-centered financial support."
        />
        <meta property="og:title" content="The Emerson Agency LLC | Financial Services & Education" />
        <meta
          property="og:description"
          content="Tax preparation, insurance education, financial education, and community-centered pathways toward financial stability."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emersonagency.netlify.app/" />
        <link rel="canonical" href="https://emersonagency.netlify.app/" />
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
