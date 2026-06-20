import React from "react";
import valuesBanner from "../../assets/OurValues.webp";

/**
 * Our Values banner.
 * Replace src/assets/OurValues.webp with the real "Our Values" artwork and it
 * will update automatically.
 */
const ValuesSection: React.FC = () => (
  <section className="bg-[#F7F2E6] px-4 pt-14 pb-10">
    <div className="mx-auto max-w-6xl">
      <img
        src={valuesBanner}
        alt="Our Values — We value access, growth, professionalism, empowerment, lifelong learning, and community-centered support."
        className="shadow-2xl rounded-2xl w-full h-auto"
      />
    </div>
  </section>
);

export default ValuesSection;
