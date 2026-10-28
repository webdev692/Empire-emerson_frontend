import { PreviewNotice, ExperienceLinks, LearningGateway } from '../../../../shared/InternSiteIntegration';
import React from "react";
import ProgramExperience from '../../../../shared/ThreeProgramsEntry';
import { ServicesGateway } from "../../../../shared/ServicesPricing";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ValuesSection from "./ValuesSection";
import ClassHighlight from "./ClassHighlight";
import CareerServices from "./CareerServices";
import Internship from "./Internship";
import WorkforceTraining from "./WorkforceTraining";
import CTASection from "./CTASection";
import EPDGFooter from "./EPDGFooter";

const LandingPage: React.FC<{ enhanced?: boolean }> = ({ enhanced }) => {
  return (
    <>
      <Navbar />
      {enhanced && <PreviewNotice />}
      <main id="main-content">
        <Hero />
        {enhanced && <ServicesGateway entity="EPDG" />}
        {enhanced && <ProgramExperience entity="EPDG" view="gateway" />}
        <ValuesSection />
        <ClassHighlight />
        {enhanced && <LearningGateway entity="EPDG" />}
        <CareerServices />
        <Internship />
        <WorkforceTraining />
        <CTASection />
      </main>
      {enhanced && <ProgramExperience entity="EPDG" view="footer" />}
      {enhanced && <ExperienceLinks />}
      <EPDGFooter />
    </>
  );
};

export default LandingPage;
