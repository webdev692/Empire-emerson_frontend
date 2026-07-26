import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import WeeklyClasses from "./WeeklyClasses";
import EPDGFooter from "./EPDGFooter";

const ClassesPage: React.FC = () => {
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
        <div className="bg-white px-4 pt-8">
          <div className="mx-auto max-w-278">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-medium text-[#0B5C3B] hover:text-[#094a30] text-sm transition-colors"
            >
              <span aria-hidden>←</span> Back to home
            </Link>
          </div>
        </div>
        <WeeklyClasses />
      </main>
      <EPDGFooter />
    </>
  );
};

export default ClassesPage;
