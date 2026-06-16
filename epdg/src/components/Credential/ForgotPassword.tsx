import React, { useState } from "react";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import logo from "../../assets/epd_logo.png";

interface ApiErrorResponse {
  message: string;
}

const ForgotPassword: React.FC = () => {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setError(axiosErr.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col justify-center items-center bg-[#12022A] px-5 py-16 min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-[#12022A]/10 shadow-[0_8px_40px_rgba(75,30,145,0.2)] p-8 text-center">
            <div className="flex justify-center items-center bg-emerald-500/10 mx-auto mb-6 border border-emerald-500/20 rounded-full w-20 h-20 text-4xl">
              📬
            </div>
            <h1 className="mb-3 font-black text-[#12022A] text-2xl tracking-tight">Check your inbox</h1>
            <p className="mb-2 text-[14px] text-[#12022A]/60 leading-relaxed">
              We sent a password reset link to{" "}
              <span className="font-semibold text-[#12022A]">{email}</span>.
            </p>
            <p className="mb-6 text-[13px] text-[#12022A]/45 leading-relaxed">
              The link expires in 30 minutes. If you don't see it, check your spam or junk folder.
            </p>
            <p className="text-[13px] text-[#12022A]/50">
              Didn't receive it?{" "}
              <button
                onClick={() => setSent(false)}
                className="font-semibold text-[#4B1E91] hover:text-[#3d1778] transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
          <div className="mt-6 text-center">
            <a href="/login" className="text-[13px] text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors">
              ← Back to sign in
            </a>
          </div>
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
          <h1 className="font-black text-[#12022A] text-2xl tracking-tight">Forgot your password?</h1>
          <p className="mt-1 text-[13px] text-[#12022A]/55 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block mb-1.5 font-semibold text-[11px] uppercase tracking-wider text-[#12022A]/60">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#12022A]/15 rounded-xl px-4 py-3 text-[14px] text-[#12022A] placeholder-[#12022A]/30 focus:outline-none focus:border-[#4B1E91] transition"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 px-4 py-3 border border-red-500/25 rounded-xl text-[13px] text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
              !loading && email
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
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-[13px] text-[#F5F0E8]/50">
        Remember your password?{" "}
        <a href="/login" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default ForgotPassword;
