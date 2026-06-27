import { Mail, Phone, MapPin, Camera, BriefcaseBusiness, Users, Music2 } from 'lucide-react'
import logo from '../../assets/LogoAgency.png'

const socials = [
  { Icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/theemersonagency' },
  { Icon: BriefcaseBusiness, label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-emerson-empire/' },
  { Icon: Users, label: 'Facebook', href: 'https://www.facebook.com/share/1S3XPRXg21/?mibextid=wwXIfr' },
  { Icon: Music2, label: 'TikTok', href: 'https://www.tiktok.com/@theemersonempire' },
  { Icon: Mail, label: 'Email', href: 'mailto:admin@theemersonempire.info' },
]

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Our Values', href: '#our-values' },
  { label: 'Services', href: '#services' },
  { label: 'Individuals & Families', href: '#individuals' },
  { label: 'Small Business', href: '#small-business' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0A1128] text-white">
      <div className="mx-auto max-w-[1320px] px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4">
              <img src={logo} alt="The Emerson Agency" className="h-24 w-24 shrink-0 object-contain" />
              <div>
                <p className="font-serif text-2xl font-bold uppercase tracking-wide text-white">
                  The Emerson Agency
                </p>
                <p className="mt-1 font-serif text-lg italic text-white/80">
                  Where your financial chaos finally meets its solution.
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-md text-sm leading-7 text-slate-400">
              The Emerson Agency LLC provides high-impact tax preparation, insurance education, and business
              operations consulting. <span className="font-bold text-white">WE ARE PART OF THE EMERSON EMPIRE</span>,
              a global ecosystem focused on professional excellence. We turn administrative burdens into
              structured growth for small business owners and families.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-[#d4af37] hover:text-[#d4af37]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">Navigate</h5>
            <ul className="mt-6 space-y-4 text-lg text-white/90">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-[#d4af37]">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37]">Contact</h5>
            <div className="mt-6 space-y-4 text-base text-white/90">
              <p className="flex items-center gap-3"><Mail size={18} className="shrink-0 text-[#d4af37]" /> admin@theemersonempire.info</p>
              <p className="flex items-center gap-3"><Phone size={18} className="shrink-0 text-[#d4af37]" /> +1 (803) 479-4492</p>
              <p className="flex items-center gap-3"><MapPin size={18} className="shrink-0 text-[#d4af37]" /> Columbia, SC United States</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-xs leading-6 text-slate-500">
          Disclaimer: Pricing is provided for planning purposes and may vary based on service needs, complexity,
          eligibility, capacity, licensing, and compliance requirements. Free or reduced-cost services may be
          available for qualifying individuals. Insurance, tax, financial, business, educational, and workforce
          services are subject to applicable regulations, approvals, eligibility, and availability. Participation
          in any program or service does not guarantee employment, income, funding, tax outcomes, insurance
          approval, financial results, business success, or other specific outcomes.{' '}
          <a href="#" className="underline transition hover:text-white">Read full disclaimer.</a>
        </p>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-base text-white/80">© 2026 The Emerson Empire. All rights reserved.</p>
            <div className="flex flex-wrap gap-10 text-base text-white/80">
              <a href="#" className="transition hover:text-[#d4af37]">Privacy Policy</a>
              <a href="#" className="transition hover:text-[#d4af37]">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
