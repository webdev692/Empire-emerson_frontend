import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import logo from "../../assets/epd_logo.png";

type State = "verifying" | "success" | "error";

const VerifyEmail: React.FC = () => {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token");
  const [state, setState]     = useState<State>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No verification token found in this link.");
      return;
    }
    api.get(`/api/auth/verify-email?token=${token}`)
      .then(() => setState("success"))
      .catch((err) => {
        setState("error");
        setMessage(err.response?.data?.message ?? "This link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center bg-[#12022A] px-5 py-16 min-h-screen">

      <div className="flex justify-center mb-8">
        <img src={logo} alt="Emerson Professional" className="w-auto h-24 object-contain" />
      </div>

      <div className="bg-white rounded-2xl border border-[#12022A]/10 shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 w-full max-w-md text-center">

        {state === "verifying" && (
          <>
            <div className="mx-auto mb-6 border-[#4B1E91] border-2 border-t-transparent rounded-full w-16 h-16 animate-spin" />
            <h1 className="mb-2 font-black text-[#12022A] text-2xl">Verifying your email…</h1>
            <p className="text-[#12022A]/55 text-[14px]">Please wait a moment.</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="flex justify-center items-center bg-emerald-500/10 mx-auto mb-6 border border-emerald-500/20 rounded-full w-20 h-20 text-4xl">✓</div>
            <h1 className="mb-3 font-black text-[#12022A] text-2xl">Email verified!</h1>
            <p className="mb-4 text-[#12022A]/60 text-[14px] leading-relaxed">
              Your email has been confirmed.
            </p>
            <div className="bg-[#4B1E91]/8 rounded-xl border border-[#4B1E91]/20 px-5 py-4 mb-6 text-left">
              <p className="text-[13px] text-[#12022A]/70 leading-relaxed">
                <span className="font-semibold text-[#12022A]">What's next?</span><br />
                Your account is now pending admin review. Once approved you'll be able to sign in and access your dashboard. This usually takes 1–2 business days.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#4B1E91] hover:bg-[#3d1778] py-3.5 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition"
            >
              Go to Sign In
            </button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="flex justify-center items-center bg-red-500/10 mx-auto mb-6 border border-red-500/20 rounded-full w-20 h-20 text-4xl">✕</div>
            <h1 className="mb-3 font-black text-[#12022A] text-2xl">Verification failed</h1>
            <p className="mb-8 text-[#12022A]/60 text-[14px]">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/register")}
                className="bg-[#4B1E91] hover:bg-[#3d1778] py-3 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition"
              >
                Register Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="py-3 border border-[#12022A]/15 rounded-xl w-full text-[#12022A]/50 text-[13px] hover:text-[#12022A] transition"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
