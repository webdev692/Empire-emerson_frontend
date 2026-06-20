import React from "react";

/**
 * Our Values banner.
 * The artwork lives in the public folder so it can be dropped in without a
 * build step: save the uploaded banner as
 *   EPDG-Landing-Page/public/our-values-banner.png
 */
const ValuesSection: React.FC = () => (
  <section className="bg-[#F7F2E6] px-4 py-16">
    <div className="mx-auto max-w-6xl">
      <img
        src="/our-values-banner.png"
        alt="Our Values — We value access, growth, professionalism, empowerment, lifelong learning, and community-centered support."
        className="shadow-2xl rounded-2xl w-full h-auto"
      />
    </div>
  </section>
);

export default ValuesSection;
