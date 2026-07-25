import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../Umbrella/Hero";
import ThreeCompaniesSection from "./ThreeCompaniesSection";
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
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-9999 focus:fixed focus:bg-[#1C1336] focus:px-4 focus:py-2 focus:rounded focus:font-semibold focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>
      <Helmet>
        <title>The Emerson Empire | Community, Financial &amp; Career Pathways</title>
        <meta
          name="description"
          content="The Emerson Empire is the umbrella organization connecting communities with financial education and services, workforce development, internships, and career-readiness programs."
        />
        <meta
          property="og:title"
          content="The Emerson Empire | Community, Financial & Career Pathways"
        />
        <meta
          property="og:description"
          content="Explore financial education and services, workforce development, internships, and career-readiness programs across the Emerson ecosystem."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theemerson.netlify.app/" />
        <link rel="canonical" href="https://theemerson.netlify.app/" />
      </Helmet>

      <main id="main-content">
        <Hero />
        <ThreeCompaniesSection />
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
