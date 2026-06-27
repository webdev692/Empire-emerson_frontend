import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0A1128] text-white">
      <div className="mx-auto max-w-[1320px] px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37] text-lg font-semibold tracking-[0.35em] text-[#d4af37]">
                EA
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37]">The Emerson Agency</p>
                <p className="text-sm text-white/70">Where your financial chaos finally meets its solution.</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              The Emerson Agency LLC provides high-impact tax preparation, insurance education, and business operations consulting. We are part of The Emerson Empire, a global ecosystem focused on professional excellence. We turn administrative burdens into structured growth for small business owners and families.
            </p>
            <div className="flex items-center gap-4 text-[#d4af37]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]">in</span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]">tw</span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]">fb</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">Navigate</h5>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              {['Home', 'Classes', 'Services', 'Internship', 'About Us'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-[0.35em] text-[#d4af37]">Contact</h5>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-2"><Mail size={16} /> admin@theemersonempire.info</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +1 (803) 479-4492</p>
              <p className="flex items-center gap-2"><MapPin size={16} /> Columbia, SC United States</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© 2026 The Emerson Empire. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
