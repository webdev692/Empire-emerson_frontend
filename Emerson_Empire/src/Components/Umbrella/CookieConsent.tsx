import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'emerson_cookie_consent';

type ConsentStatus = 'accepted' | 'denied';

interface ConsentRecord {
  status: ConsentStatus;
  timestamp: string;
}

function getStoredConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return null;
  }
}

function saveConsent(status: ConsentStatus): ConsentRecord {
  const record: ConsentRecord = {
    status,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // Slight delay so the page loads first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleConsent = (status: ConsentStatus) => {
    saveConsent(status);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="right-0 bottom-0 left-0 z-100 fixed"
          role="dialog"
          aria-label="Cookie consent"
        >
          {/* Gold top border accent */}
          <div className="bg-[#C9A84C] w-full h-px" />

          <div className="bg-[#0D0118]/95 backdrop-blur-md px-6 sm:px-10 lg:px-16 py-5">
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-5 mx-auto max-w-7xl">

              {/* Text */}
              <div className="flex-1">
                <p className="mb-1 font-semibold text-[#F5F0E8] text-sm tracking-wide heading">
                  We use cookies
                </p>
                <p className="max-w-2xl text-[#F5F0E8]/55 text-xs leading-[1.7] body">
                  The Emerson Empire uses cookies to improve your experience, remember your preferences,
                  and analyse site traffic. By clicking{' '}
                  <span className="text-[#C9A84C]">Accept</span>, you consent to our use of cookies.
                  You may{' '}
                  <span className="text-[#C9A84C]">Deny</span> non-essential cookies at any time.{' '}
                  <Link
                    to="/disclaimer"
                    className="text-[#C9A84C]/70 hover:text-[#C9A84C] underline underline-offset-2 transition-colors duration-200"
                  >
                    Learn more
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleConsent('denied')}
                  className="px-5 py-2.5 border border-white/15 hover:border-white/30 rounded-sm font-semibold text-[#F5F0E8]/60 text-xs hover:text-[#F5F0E8] uppercase tracking-[2.5px] transition-all duration-200 body"
                >
                  Deny
                </button>
                <button
                  onClick={() => handleConsent('accepted')}
                  className="px-6 py-2.5 rounded-sm font-semibold text-[#1C1336] text-xs uppercase tracking-[2.5px] transition-all duration-200 body"
                  style={{ background: '#C9A84C' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#E8C97A')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#C9A84C')}
                >
                  Accept All
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
