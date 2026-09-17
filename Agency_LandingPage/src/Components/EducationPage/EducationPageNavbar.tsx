import { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import logo from '../../assets/LogoAgency.png'

const NAV_LINKS = [
  { label: 'Home', href: '/educationPage', active: true  },
  { label: 'Education', href: '/education'},
  { label: 'Resources', href: '#resources' },
  { label: 'Support', href: '#support' },
]

export default function EducationNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0A1128] shadow-lg">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-2.5 lg:px-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
        <a href="/" className="flex items-center" aria-label="The Emerson Agency home">
          <img src={logo} alt="The Emerson Agency" className="h-14 w-14 object-contain" />
        </a>
        <p className="text-2l font-bold text-white">TEA</p>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition hover:text-[#c9a24c] ${
                link.active ? 'text-[#c9a24c] border-b-2 border-[#c9a24c] pb-1' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA, User Icon, and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/*User Icon */}
          <div className="text-white/80 flex items-center justify-center p-1">
            <User size={20} />
          </div>

          {/* CTA Button */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden rounded-md bg-[#c9a24c] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A1128] shadow-md transition hover:bg-[#b8923f] lg:inline-flex"
          >
            Request qualified help &rarr;
          </a>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-[#c9a24c] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-[#0A1128] px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/80 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 transition hover:text-[#c9a24c] ${
                link.active ? 'text-[#c9a24c] font-bold' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
            }}
            className="mt-2 block py-3 font-bold text-[#c9a24c]"
          >
            Request qualified help &rarr;
          </a>
        </nav>
      )}
    </header>
  )
}