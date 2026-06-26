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
      <Navbar />
      <Hero />
      <ValuesSection />
      <ClassHighlight />
      <CareerServices />
      <Internship />
      <WorkforceTraining />
      <CTASection />
      <EPDGFooter />
    </>
  );
};

export default LandingPage;
