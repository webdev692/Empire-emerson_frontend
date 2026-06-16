import React, { createContext, useContext, useState, useEffect } from "react";

interface FormModalContextValue {
  openForm: (url: string, title?: string, subtitle?: string) => void;
}

const FormModalContext = createContext<FormModalContextValue>({ openForm: () => {} });

export const useFormModal = () => useContext(FormModalContext);

export const FormModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formUrl, setFormUrl]       = useState<string | null>(null);
  const [title, setTitle]           = useState("");
  const [subtitle, setSubtitle]     = useState("");
  const [loadCount, setLoadCount]   = useState(0);

  const submitted = loadCount >= 2;

  const openForm = (url: string, t = "", s = "") => {
    setFormUrl(url);
    setTitle(t);
    setSubtitle(s);
    setLoadCount(0);
  };

  const close = () => setFormUrl(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (formUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [formUrl]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <FormModalContext.Provider value={{ openForm }}>
      {children}

      {formUrl && (
        <div
          className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-[#022B1F]/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={close}
        >
          <div
            className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden sm:rounded-sm"
            style={{ borderTop: "4px solid #C9A84C" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#044E37] mb-0.5">
                  {submitted ? "Submitted Successfully" : "Emerson Professional Development Group"}
                </p>
                {title && (
                  <h3 className="text-sm font-bold text-[#0A1F17]">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-400 mt-0.5 tracking-wide">{subtitle}</p>
                )}
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="text-gray-300 hover:text-[#0A1F17] text-xl ml-4 shrink-0 leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Submitted state */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 text-center">
                <div
                  className="w-14 h-14 flex items-center justify-center text-white text-2xl font-bold mb-5 bg-[#044E37]"
                >
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0A1F17] mb-3">Submitted!</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-8">
                  Thank you for reaching out to EPDG. A member of our team will follow up with you
                  shortly at the contact information you provided.
                </p>
                <button
                  onClick={close}
                  className="border border-[#044E37] text-[#044E37] font-bold text-sm uppercase tracking-wider py-3 px-8 hover:bg-[#044E37] hover:text-white transition-all duration-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <iframe
                src={`${formUrl}?embedded=true`}
                onLoad={() => setLoadCount((n) => n + 1)}
                title={title || "EPDG Form"}
                className="flex-1 w-full border-none"
                allow="camera; microphone"
              />
            )}
          </div>
        </div>
      )}
    </FormModalContext.Provider>
  );
};
