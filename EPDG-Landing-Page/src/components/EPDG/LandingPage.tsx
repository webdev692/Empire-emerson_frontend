import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ValuesSection from "./ValuesSection";
import ClassHighlight from "./ClassHighlight";
import CareerServices from "./CareerServices";
import Internship from "./Internship";
import WorkforceTraining from "./WorkforceTraining";
import CTASection from "./CTASection";
import EPDGFooter from "./EPDGFooter";

const LandingPage: React.FC = () => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-9999 focus:fixed focus:bg-[#041913] focus:px-4 focus:py-2 focus:rounded-xl focus:font-semibold focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ValuesSection />
        <ClassHighlight />
        <CareerServices />
        <Internship />
        <WorkforceTraining />
        <CTASection />
      </main>
      <EPDGFooter />
    </>
  );
};

export default LandingPage;
