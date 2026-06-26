import React from "react";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/epd_logo.png";

const ROLE_MESSAGES: Record<string, { heading: string; body: string }> = {
  intern: {
    heading: "Registration submitted!",
    body: "Check your email inbox and click the verification link we sent you. Once verified, an admin will review your application — you'll be notified when approved.",
  },
  company: {
    heading: "Company registration is pending approval",
    body: "Check your inbox for a verification link, then an admin will verify your company details. This usually takes 1–2 business days.",
  },
  school: {
    heading: "Institution registration is pending approval",
    body: "Check your inbox for a verification link, then an admin will confirm your institution. This typically takes 1–2 business days.",
  },
};

const STEPS = [
  { label: "Registration submitted", done: true  },
  { label: "Verify email",           done: false },
  { label: "Admin review",           done: false },
  { label: "Account activated",      done: false },
];

const PendingApproval: React.FC = () => {
  const user      = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const meta = ROLE_MESSAGES[user?.role ?? "intern"];

  return (
    <div className="flex flex-col justify-center items-center bg-[#12022A] px-5 py-16 min-h-screen">

      {/* Logo */}
      <div className="flex justify-center mb-10">
        <img src={logo} alt="Emerson Professional" className="w-auto h-24 object-contain" />
      </div>

      {/* Card */}
      <div className="bg-white shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 border border-[#12022A]/10 rounded-2xl w-full max-w-lg text-center">

        <h1 className="mb-3 font-black text-[#12022A] text-2xl tracking-tight">{meta.heading}</h1>
        <p className="mb-8 text-[#12022A]/60 text-[14px] leading-relaxed">{meta.body}</p>

        {/* Progress steps */}
        <div className="flex justify-center items-center mb-8">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                  step.done
                    ? "bg-[#4B1E91] border-[#4B1E91] text-white"
                    : i === 1
                    ? "border-[#C9A84C] text-[#C9A84C] bg-transparent animate-pulse"
                    : "border-[#12022A]/20 text-[#12022A]/30 bg-transparent"
                }`}>
                  {step.done ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] font-medium text-center leading-tight w-18 ${
                  step.done
                    ? "text-[#4B1E91]"
                    : i === 1
                    ? "text-[#C9A84C]"
                    : "text-[#12022A]/35"
                }`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 mx-1 mb-5 rounded-full shrink-0 ${step.done ? "bg-[#4B1E91]" : "bg-[#12022A]/15"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Info banner */}
        <div className="bg-[#C9A84C]/8 mb-6 px-5 py-4 border border-[#C9A84C]/30 rounded-xl text-left">
          <p className="text-[#12022A]/70 text-[13px] leading-relaxed">
            <span className="font-semibold text-[#12022A]">Step 2 — Check your email now.</span><br />
            We sent a verification link to your inbox. Click it to confirm your email, then wait for admin approval (1–2 business days). Check your spam folder if you don't see it.
          </p>
        </div>

        {/* Signed in as */}
        {user && (
          <p className="mb-6 text-[#12022A]/40 text-[12px]">
            Signed in as <span className="font-medium text-[#12022A]/70">{user.email}</span>
          </p>
        )}

        <button
          onClick={clearAuth}
          className="hover:bg-[#4B1E91]/5 py-3 border border-[#12022A]/15 hover:border-[#4B1E91]/50 rounded-xl w-full font-semibold text-[#12022A]/50 text-[13px] hover:text-[#4B1E91] uppercase tracking-wider transition-all duration-200"
        >
          Sign Out
        </button>
      </div>

      <p className="mt-6 text-[#F5F0E8]/40 text-[12px] text-center">
        Questions? Contact{" "}
        <a href="mailto:support@theemersonempire.info" className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
          support@theemersonempire.info
        </a>
      </p>
    </div>
  );
};

export default PendingApproval;
