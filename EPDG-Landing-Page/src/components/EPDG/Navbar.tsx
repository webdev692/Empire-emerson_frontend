import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/EPDG_LOGO.webp";

type NavLink = { label: string; id: string } & (
  | { type: "home" }
  | { type: "route"; to: string }
  | { type: "section" }
);

const navLinks: NavLink[] = [
  { label: "Home", id: "home", type: "home" },
  { label: "Classes", id: "classes", type: "route", to: "/classes" },
  { label: "Services", id: "services", type: "section" },
  { label: "Internships", id: "internships", type: "section" },
  { label: "Workforce", id: "workforce", type: "section" },
  { label: "Contact", id: "contact", type: "section" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const onClasses = location.pathname === "/classes";

  useEffect(() => {
    if (onClasses) {
      setActiveId("classes");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    ["home", "services", "internships", "workforce", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onClasses, location.pathname]);

  const handleNav = (link: NavLink) => {
    setMenuOpen(false);
    if (link.type === "route") {
      navigate(link.to);
    } else if (link.type === "home") {
      if (onClasses) navigate("/");
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (onClasses) {
        navigate("/", { state: { scrollTo: link.id } });
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="top-0 sticky z-50 bg-[#03140f]/95 backdrop-blur-sm border-b border-white/10">
      <div className="mx-auto flex items-center justify-between px-4 py-4 max-w-[1114px]">
        <button
          onClick={() => handleNav(navLinks[0])}
          className="flex items-center gap-3 shrink-0"
          aria-label="Home"
        >
          <img src={logo} alt="EPDG logo" className="w-12 h-12 rounded-full border border-white/10" />
          <span className="hidden md:inline-block font-semibold text-white tracking-[0.16em] uppercase text-xs">
            EPDG
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-[0.18em] text-white/70">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNav(link)}
                className={`transition duration-200 ${
                  activeId === link.id
                    ? "text-[#C9A84C]"
                    : "hover:text-white"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://emersonproffesionaldevelopment.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white hover:border-[#C9A84C] transition-all duration-200"
          >
            Log In
          </a>
          <a
            href="https://emersonproffesionaldevelopment.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#C9A84C] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#07120f] transition-all duration-200 hover:bg-[#BDA55F]"
          >
            Create Account
          </a>
        </div>

        <button
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#03140f] text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="relative h-5 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="space-y-4 border-t border-white/10 bg-[#03140f] px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-2 pt-4 text-sm uppercase tracking-[0.18em] text-white/75">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link)}
                  className={`w-full text-left py-3 transition duration-200 ${
                    activeId === link.id ? "text-[#C9A84C]" : "hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white"
            >
              Log In
            </a>
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#C9A84C] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#07120f] hover:bg-[#BDA55F]"
            >
              Create Account
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
