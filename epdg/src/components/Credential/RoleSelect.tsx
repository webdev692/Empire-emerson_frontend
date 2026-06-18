import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/epd_logo.png";

type Role = "company" | "school" | "intern" | "admin";

interface RoleCard {
  role: Role;
  title: string;
  description: string;
}

const BASE_CARDS: RoleCard[] = [
  { role: "company", title: "Company",  description: "Post internship slots and manage your interns" },
  { role: "school",  title: "Institution", description: "Register your students and track their placements" },
  { role: "intern",  title: "Intern",   description: "Apply for internships and build your career" },
];

const ADMIN_CARD: RoleCard = {
  role: "admin", title: "Admin", description: "Manage the platform, users, and global settings",
};

const REGISTER_ROUTES: Record<Role, string> = {
  company: "/register/company",
  school:  "/register/school",
  intern:  "/register/intern",
  admin:   "/register/admin",
};

const RoleSelect: React.FC = () => {
  const navigate              = useNavigate();
  const [searchParams]        = useSearchParams();
  const [selected, setSelected] = useState<Role | null>(null);

  const showAdmin = searchParams.get("admin") === "true";
  const cards     = showAdmin ? [...BASE_CARDS, ADMIN_CARD] : BASE_CARDS;

  const handleContinue = () => {
    if (selected) navigate(REGISTER_ROUTES[selected]);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#12022A] px-5 py-14 min-h-screen">

      {/* Logo */}
      <div className="flex justify-center mb-2">
        <img src={logo} alt="Emerson Professional" className="w-auto h-32 object-contain" />
      </div>

      {/* Heading */}
      <h1 className="mb-2 font-black text-white lg:text-[#12022A] text-3xl sm:text-4xl text-center tracking-tight">
        Who are you joining as?
      </h1>
      <p className="mb-10 text-[#F5F0E8]/60 text-[14px] lg:text-[#12022A]/55 text-center">
        Choose your account type to get started.
      </p>

      {/* Cards grid */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mb-10 w-full max-w-7xl">
        {cards.map((card) => {
          const isSelected = selected === card.role;
          return (
            <button
              key={card.role}
              type="button"
              onClick={() => setSelected(card.role)}
              className={`
                group relative flex flex-col items-start gap-3 p-6 rounded-2xl border-2
                text-left transition-all duration-200 outline-none
                focus-visible:ring-2 focus-visible:ring-[#4B1E91] focus-visible:ring-offset-2
                ${isSelected
                  ? "border-[#4B1E91] bg-white shadow-lg shadow-[#4B1E91]/25"
                  : "border-white/15 bg-white/90 hover:border-[#4B1E91]/50 hover:shadow-md hover:shadow-[#4B1E91]/10 lg:border-[#12022A]/10 lg:bg-white"
                }
              `}
            >
              {isSelected && (
                <span className="top-4 right-4 absolute flex justify-center items-center bg-[#4B1E91] rounded-full w-5 h-5 font-bold text-[11px] text-white">
                  ✓
                </span>
              )}
              <p className={`font-bold text-[15px] mb-0.5 transition-colors ${isSelected ? "text-[#4B1E91]" : "text-[#12022A]"}`}>
                {card.title}
              </p>
              <p className="text-[#12022A]/55 text-[13px] leading-relaxed">{card.description}</p>
            </button>
          );
        })}
      </div>

      {/* Continue button */}
      <button
        type="button"
        disabled={selected === null}
        onClick={handleContinue}
        className={`
          w-full max-w-2xl py-4 rounded-2xl font-bold text-[14px] uppercase tracking-wider
          transition-all duration-200
          ${selected !== null
            ? "bg-[#4B1E91] hover:bg-[#3d1778] text-white cursor-pointer shadow-lg shadow-[#4B1E91]/30"
            : "bg-white/5 lg:bg-[#12022A]/5 text-[#F5F0E8]/30 lg:text-[#12022A]/30 cursor-not-allowed border border-white/10 lg:border-[#12022A]/10"
          }
        `}
      >
        {selected
          ? `Continue as ${cards.find((c) => c.role === selected)?.title ?? ''}`
          : "Select a role to continue"}
      </button>

      {/* Back to login */}
      <p className="mt-6 text-[#F5F0E8]/50 text-[13px]">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default RoleSelect;
