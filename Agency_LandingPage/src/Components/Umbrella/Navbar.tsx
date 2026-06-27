import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#061224] shadow-lg">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#061224] text-sm font-semibold tracking-[0.25em] text-[#d4af37]">
            EA
          </div>
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4af37] leading-tight">The Emerson<br />Agency</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-12 text-[12px] uppercase tracking-[0.25em] text-white/85 lg:flex">
          <a href="#" className="transition hover:text-[#d4af37]">Home</a>
          <a href="#" className="transition hover:text-[#d4af37]">Classes</a>
          <a href="#" className="transition hover:text-[#d4af37]">Services and Packages</a>
          <a href="#" className="transition hover:text-[#d4af37]">Global Internship</a>
          <a href="#" className="transition hover:text-[#d4af37]">About Us</a>
        </nav>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden rounded-full bg-[#d4af37] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-[#061224] transition hover:opacity-90 lg:inline-flex shadow-md"
          >
            Contact Us
          </a>
          <button className="lg:hidden p-2 text-[#d4af37]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-[#061224] px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/80">
          <a href="#" className="block py-3 transition hover:text-[#d4af37]">Home</a>
          <a href="#" className="block py-3 transition hover:text-[#d4af37]">Classes</a>
          <a href="#" className="block py-3 transition hover:text-[#d4af37]">Services and Packages</a>
          <a href="#" className="block py-3 transition hover:text-[#d4af37]">Global Internship</a>
          <a href="#" className="block py-3 transition hover:text-[#d4af37]">About Us</a>
          <a href="#" className="block py-3 font-bold text-[#d4af37]">Contact Us</a>
        </nav>
      )}
    </header>
  )
}
