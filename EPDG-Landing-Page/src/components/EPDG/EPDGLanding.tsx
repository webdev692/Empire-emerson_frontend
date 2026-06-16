import React from "react";
import { FormModalProvider } from "./FormModal";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import WeeklyClasses from "./WeeklyClasses";
import CareerServices from "./CareerServices";
import Internship from "./Internship";
import WorkforceTraining from "./WorkforceTraining";
// import BlogsNews from "./BlogsNews";
// import FAQAndPortfolio from "./FAQAndPortfolio";
import CTASection from "./CTASection";
import EPDGFooter from "./EPDGFooter";

const EPDGLanding: React.FC = () => {
  return (
    <FormModalProvider>
      <div className="font-sans">
        <Navbar />
        <Hero />
        <Features />
        <WeeklyClasses />
        <CareerServices />
        <Internship />
        <WorkforceTraining />
        {/* <BlogsNews /> */}
        {/* <FAQAndPortfolio /> */}
        <CTASection />
        <EPDGFooter />
      </div>
    </FormModalProvider>
  );
};

export default EPDGLanding;
