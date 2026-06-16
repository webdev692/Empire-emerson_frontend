import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import logo from "../../assets/epd_logo.png";

interface ApiErrorResponse {
  message: string;
}

type Strength = "empty" | "weak" | "medium" | "strong";

function getStrength(pwd: string): Strength {
  if (!pwd) return "empty";
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}

const STRENGTH_META = {
  weak:   { label: "Weak",   color: "bg-red-500",   width: "w-1/3"  },
  medium: { label: "Medium", color: "bg-orange-400", width: "w-2/3"  },
  strong: { label: "Strong", color: "bg-green-500",  width: "w-full" },
};

const inputCls =
  "w-full bg-white border border-[#12022A]/15 rounded-xl px-4 py-3 pr-14 text-[14px] " +
  "text-[#12022A] placeholder-[#12022A]/30 focus:outline-none focus:border-[#4B1E91] transition";

const labelCls = "block mb-1.5 font-semibold text-[11px] uppercase tracking-wider text-[#12022A]/60";

const ResetPassword: React.FC = () => {
  const [searchParams]         = useSearchParams();
  const navigate               = useNavigate();
  const token                  = searchParams.get("token") ?? "";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [countdown, setCountdown] = useState(5);

  const strength = getStrength(password);

  // Auto-redirect to login 5 seconds after success
  useEffect(() => {
    if (!done) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); navigate("/login"); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [done, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (strength === "weak")  { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setError(axiosErr.response?.data?.message ?? "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div className="flex justify-center items-center bg-[#12022A] px-5 min-h-screen">
        <div className="bg-white rounded-2xl border border-[#12022A]/10 shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 w-full max-w-md text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="mb-2 font-black text-[#12022A] text-xl">Invalid reset link</h1>
          <p className="mb-6 text-[14px] text-[#12022A]/55">This link is missing or has expired.</p>
          <a href="/forgot-password"
            className="inline-block bg-[#4B1E91] hover:bg-[#3d1778] text-white font-bold text-[13px] uppercase tracking-wider px-6 py-3 rounded-xl transition">
            Request a new link
          </a>
        </div>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <div className="flex justify-center items-center bg-[#12022A] px-5 min-h-screen">
        <div className="bg-white rounded-2xl border border-[#12022A]/10 shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 w-full max-w-md text-center">
          <div className="flex justify-center items-center bg-emerald-500/10 mx-auto mb-6 border border-emerald-500/20 rounded-full w-20 h-20 text-3xl">
            ✓
          </div>
          <h1 className="mb-3 font-black text-[#12022A] text-2xl tracking-tight">Password updated!</h1>
          <p className="mb-2 text-[14px] text-[#12022A]/60">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <p className="mb-6 text-[13px] text-[#12022A]/40">
            Redirecting to sign in in <span className="font-bold text-[#4B1E91]">{countdown}s</span>…
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#4B1E91] hover:bg-[#3d1778] py-3.5 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition-all"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[#12022A] px-5 py-16 min-h-screen">

      {/* Logo */}
      <div className="flex justify-center mb-10">
        <img src={logo} alt="Emerson Professional" className="w-auto h-24 object-contain" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#12022A]/10 shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 w-full max-w-md">
        <div className="mb-7">
          <h1 className="font-black text-[#12022A] text-2xl tracking-tight">Set new password</h1>
          <p className="mt-1 text-[13px] text-[#12022A]/55">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[12px] text-[#12022A]/40 hover:text-[#12022A] transition">
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="w-full h-1 rounded-full bg-[#12022A]/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    strength !== "empty" ? `${STRENGTH_META[strength].color} ${STRENGTH_META[strength].width}` : "w-0"
                  }`} />
                </div>
                {strength !== "empty" && (
                  <p className={`text-[11px] mt-1 font-medium ${
                    strength === "weak" ? "text-red-500" : strength === "medium" ? "text-orange-400" : "text-green-500"
                  }`}>
                    {STRENGTH_META[strength].label} password
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Confirm Password</label>
            <input
              type={showPwd ? "text" : "password"}
              required
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-[14px] text-[#12022A] placeholder-[#12022A]/30 focus:outline-none transition ${
                confirm && confirm !== password
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#12022A]/15 focus:border-[#4B1E91]"
              }`}
            />
            {confirm && confirm !== password && (
              <p className="mt-1.5 text-[12px] text-red-500">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 px-4 py-3 border border-red-500/25 rounded-xl text-[13px] text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password || !confirm || password !== confirm}
            className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
              !loading && password && confirm && password === confirm
                ? "bg-[#4B1E91] hover:bg-[#3d1778] text-white cursor-pointer"
                : "bg-[#12022A]/5 text-[#12022A]/25 cursor-not-allowed border border-[#12022A]/10"
            }`}
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-[13px] text-[#F5F0E8]/40 text-center">
        Link expired?{" "}
        <a href="/forgot-password" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
          Request a new one
        </a>
      </p>
    </div>
  );
};

export default ResetPassword;
