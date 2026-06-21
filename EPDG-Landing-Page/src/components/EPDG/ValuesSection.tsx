import React from "react";
import valuesBanner from "../../assets/OurValues.png";

/** Our Values banner. */
const ValuesSection: React.FC = () => (
  <section className="bg-[#FCF5E9] px-4 pt-10 pb-10">
    {/* Same 1114px content line as every other section. The banner has ~1.6%
        transparent padding each side, so it is widened (w-[103.37%]) and pulled
        left (-1.64%) to make its visible card fill the container. */}
    <div className="mx-auto max-w-278.5">
      <img
        src={valuesBanner}
        alt="Our Values — We value access, growth, professionalism, empowerment, lifelong learning, and community-centered support."
        className="block ml-[-1.64%] w-[103.37%] max-w-none h-auto"
      />
    </div>
  </section>
);

export default ValuesSection;
