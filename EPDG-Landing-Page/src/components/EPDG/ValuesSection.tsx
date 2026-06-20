import React from "react";
import valuesBanner from "../../assets/OurValues.png";

/** Our Values banner. */
const ValuesSection: React.FC = () => (
  <section className="bg-[#FCF5E9] px-4 pt-14 pb-10">
    <div className="mx-auto max-w-6xl">
      <img
        src={valuesBanner}
        alt="Our Values — We value access, growth, professionalism, empowerment, lifelong learning, and community-centered support."
        className="block w-full h-auto"
      />
    </div>
  </section>
);

export default ValuesSection;
