import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import WeeklyClasses from "./WeeklyClasses";
import EPDGFooter from "./EPDGFooter";

const ClassesPage: React.FC = () => {
  return (
    <>
      <Navbar />
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
      <EPDGFooter />
    </>
  );
};

export default ClassesPage;
