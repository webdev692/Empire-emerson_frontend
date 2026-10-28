import React from "react";
import ProgramExperience from '../../../../shared/ThreeProgramsEntry';
import { StudioGateway } from "../../../../shared/ProjectStudioEntry";
import { ServicesGateway } from "../../../../shared/ServicesPricing";
import { integratedPreview } from "../../../../shared/development-preview";
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
      <main id="main-content">
        <Hero />
        {integratedPreview && <StudioGateway entity="TEE" />}
        {integratedPreview && <ServicesGateway entity="TEE" />}
        {integratedPreview && <ProgramExperience entity="TEE" view="gateway" />}
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
