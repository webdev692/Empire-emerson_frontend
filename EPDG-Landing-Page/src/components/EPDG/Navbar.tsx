import React, { useEffect, useState } from "react";
import logo from "../../assets/EPDG_LOGO.webp";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Classes", id: "classes" },
  { label: "Services", id: "services" },
  { label: "Internships", id: "internships" },
  { label: "Workforce", id: "workforce" },
  { label: "Contact", id: "contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="top-0 right-0 left-0 z-50 sticky bg-white border-gray-200/80 border-b">
      <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-18">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="Emerson Professional Development Group"
            className="rounded-full w-11 h-11"
          />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-9 nav font-medium text-[15px]">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`transition-colors duration-200 ${
                  activeId === id
                    ? "text-[#0B3D2B] font-bold"
                    : "text-gray-600 hover:text-[#0B3D2B]"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://emersonproffesionaldevelopment.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 border border-gray-300 hover:border-[#0B3D2B] rounded-lg font-semibold text-gray-800 text-sm transition-all duration-200 cursor-pointer"
          >
            Log In
          </a>
          <a
            href="https://emersonproffesionaldevelopment.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="bg-[#0B5C3B] hover:bg-[#094a30] px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-200 cursor-pointer"
          >
            Create an account
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-[#0B3D2B] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#0B3D2B] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#0B3D2B] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 border-gray-100 border-t">
          <ul className="flex flex-col gap-1 mt-4">
            {navLinks.map(({ label, id }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block py-3 text-[15px] font-medium border-b border-gray-100 transition-colors duration-200 ${
                    activeId === id ? "text-[#0B3D2B] font-bold" : "text-gray-600 hover:text-[#0B3D2B]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 text-sm text-center transition-all cursor-pointer"
            >
              Log In
            </a>
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0B5C3B] hover:bg-[#094a30] px-4 py-3 rounded-lg font-semibold text-white text-sm text-center transition-all cursor-pointer"
            >
              Create an account
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
