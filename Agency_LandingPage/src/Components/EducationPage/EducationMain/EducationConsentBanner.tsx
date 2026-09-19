import { useState, useEffect } from 'react';

export type ConsentState = 'not_provided' | 'pending' | 'granted' | 'withdrawn';

export default function EducationConsentBanner() {
  const [consent, setConsent] = useState<ConsentState>('not_provided');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Load saved state on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('tea_education_consent') as ConsentState;
    if (savedConsent) {
      setConsent(savedConsent);
      console.log(`[Consent System] Loaded saved state from localStorage: ${savedConsent}`);
    } else {
      console.log('[Consent System] Initialized state: not_provided');
    }
  }, []);

  // Handler for state transitions matching David's backend system
  const handleTransition = (nextState: ConsentState, actionName: string) => {
    console.log(
      `[Consent Transition] Action: "${actionName}" | State changed from "${consent}" -> "${nextState}"`
    );
    setConsent(nextState);
    localStorage.setItem('tea_education_consent', nextState);
  };

  if (!isVisible) return null;

  return (
    <aside 
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 max-w-md w-auto sm:w-full bg-[#0A1128] text-white border border-[#c9a24c]/30 rounded-lg p-4 sm:p-5 shadow-2xl z-50 transition-all duration-300 font-sans"
      aria-label="Educational Disclaimer and Consent"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2.5 sm:mb-3 gap-2">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#c9a24c]">
          Educational Disclaimer
        </span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-sm p-1 -mr-1 -mt-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Close disclaimer banner"
        >
          ✕
        </button>
      </div>

      {/* Message Body */}
      <p className="text-xs sm:text-sm text-gray-300 mb-2 leading-relaxed">
        {consent === 'not_provided' && "Educational materials require active consent. Click below to request access."}
        {consent === 'pending' && "Resources provided on this page are for general educational purposes only and do not constitute personalized financial advice."}
        {consent === 'granted' && "Educational disclaimer active & acknowledged. You may withdraw consent at any time."}
        {consent === 'withdrawn' && "Educational consent is currently paused/withdrawn. Re-approve below to restore."}
      </p>

      {/* Compliance Badge for missing copy approval */}
      <p className="text-[11px] sm:text-xs text-amber-700 font-mono mb-3 sm:mb-4">
        [unresolved copy text - pending legal review]
      </p>

      {/* Action Buttons with responsive flex layout */}
      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        {/* State 1: not_provided */}
        {consent === 'not_provided' && (
          <button
            onClick={() => handleTransition('pending', 'request_consent')}
            className="w-full bg-[#c9a24c] hover:bg-[#b8913b] text-[#0A1128] font-medium text-xs py-2 px-3 rounded transition-colors text-center"
          >
            Request Educational Access
          </button>
        )}

        {/* State 2: pending */}
        {consent === 'pending' && (
          <>
            <button
              onClick={() => handleTransition('granted', 'approve_consent')}
              className="flex-1 bg-[#c9a24c] hover:bg-[#b8913b] text-[#0A1128] font-medium text-xs py-2.5 sm:py-2 px-3 rounded transition-colors text-center"
            >
              I Understand & Accept
            </button>
            <button
              onClick={() => handleTransition('not_provided', 'reject_consent')}
              className="flex-1 bg-transparent hover:bg-white/10 text-gray-300 border border-gray-600 text-xs py-2.5 sm:py-2 px-3 rounded transition-colors text-center"
            >
              Decline / Opt-Out
            </button>
          </>
        )}

        {/* State 3: granted */}
        {consent === 'granted' && (
          <button
            onClick={() => handleTransition('withdrawn', 'withdraw_consent')}
            className="w-full bg-transparent hover:bg-white/10 text-gray-300 border border-gray-600 text-xs py-2 px-3 rounded transition-colors text-center"
          >
            Withdraw Consent
          </button>
        )}

        {/* State 4: withdrawn */}
        {consent === 'withdrawn' && (
          <button
            onClick={() => handleTransition('granted', 'reconfirm_consent')}
            className="w-full bg-[#c9a24c] hover:bg-[#b8913b] text-[#0A1128] font-medium text-xs py-2 px-3 rounded transition-colors text-center"
          >
            Re-Approve Consent
          </button>
        )}
      </div>
    </aside>
  );
}