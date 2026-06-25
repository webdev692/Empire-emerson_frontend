import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../Umbrella/Hero";
import ThreeCompaniesSection from "./ThreeCompaniesSection";
import WhatWeOffer from "./WhatWeOffer";
import BuildingReal from "./BuildingReal";
import TeamSection from "./TeamSection";
import ResourceHub from "./ResourceHub";
import FeeWaiverSection from "./FeeWaiverSection";
import FormsNextSteps from "./FormsNextSteps";
import PartnerWithUs from "./PartnerWithUs";
import GetInTouch from "./GetInTouch";

const HomePage: React.FC = () => {
  return (
    <div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-9999 focus:fixed focus:bg-[#12022A] focus:px-4 focus:py-2 focus:rounded focus:font-semibold focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>
      <Helmet>
        <title>
          The Emerson Empire | Agency &amp; Professional Development
        </title>
        <meta
          name="description"
          content="The Emerson Empire — building pathways for professional growth, business development, financial education, and global opportunity."
        />
        <meta
          property="og:title"
          content="The Emerson Empire | Agency & Professional Development"
        />
        <meta
          property="og:description"
          content="Building pathways for professional growth, business development, financial education, and global opportunity."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main id="main-content">
        <Hero />
        <WhatWeOffer />
        <ThreeCompaniesSection />
        <BuildingReal />
        {/* <TeamSection /> */}
        <ResourceHub />
        <FeeWaiverSection />
        <FormsNextSteps />
        <PartnerWithUs />
        <GetInTouch />
      </main>
    </div>
  );
};

export default HomePage;
