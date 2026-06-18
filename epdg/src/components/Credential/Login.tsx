import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/epd_logo.png";
import learningImg from "../../assets/epds-learning.png";
import { mockLogin, logMockCredentials, isRealAccount } from "../../lib/mockAuth";

const MOCK_MODE = import.meta.env.VITE_MOCK_AUTH === "true";

type UserType = "Intern" | "Company" | "School" | "Admin";

// Set VITE_EMPIRE_URL in Netlify env vars — no localhost fallback
const EMPIRE_URL = import.meta.env.VITE_EMPIRE_URL || "";

const USER_TYPES: { value: UserType; label: string;  }[] = [
  { value: "Intern",  label: "Intern" },
  { value: "Company", label: "Company"},
  { value: "School",  label: "School",    },
  { value: "Admin",   label: "Admin" },
];

interface LoginResponse {
  user: { id: number; name: string; email: string; role: string };
  token: string;
}

interface ApiErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("Intern");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (MOCK_MODE) logMockCredentials();
  }, []);

  const HOME: Record<string, string> = {
    admin:   "/admin",
    company: "/company",
    intern:  "/dashboard",
    school:  "/dashboard",
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (MOCK_MODE && !isRealAccount(email)) {
        // Bypass backend — use mock credentials (real accounts always hit the API)
        const { user, token } = mockLogin({ email, password, role: userType.toLowerCase() });
        setAuth(user, token);
        navigate(HOME[user.role] ?? "/dashboard");
        return;
      }

      const { data } = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
        role: userType.toLowerCase(),
      });
      const user = data.user as Parameters<typeof setAuth>[0];
      setAuth(user, data.token);
      if (user.status === "pending") {
        navigate("/pending-approval");
      } else if (user.status === "rejected") {
        setError("Your account has been rejected. Contact support@theemersonempire.info for help.");
      } else {
        navigate(HOME[user.role] ?? "/dashboard");
      }
    } catch (err) {
      if (MOCK_MODE) {
        setError((err as Error).message);
      } else {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        setError(axiosErr.response?.data?.message ?? "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In | Emerson Professional</title>
        <meta name="description" content="Sign in to your Emerson Professional account as an Intern, Company, or Admin." />
      </Helmet>

      <div className="flex bg-[#0a011a] min-h-screen">

        {/* Left branding panel — desktop only */}
        <div className="hidden lg:flex flex-col justify-between bg-[#12022A] shadow-md shadow-white p-12 border-white/5 border-r w-[45%]">
          <div className="flex flex-col gap-6">
            {EMPIRE_URL ? (
              <a href={EMPIRE_URL} className="group flex items-center gap-3">
                <img src={logo} alt="Emerson Professional" className="w-auto h-10 object-contain" />
              </a>
            ) : (
              <div className="flex items-center gap-3">
                <img src={logo} alt="Emerson Professional" className="w-auto h-96 sm:h-60 object-contain" />
              </div>
            )}
            <img src={learningImg} alt="EPDG Learning" className="w-full rounded-xl object-cover" />
          </div>

          <div>
            <blockquote className="mb-6 font-medium text-slate-300 text-xl leading-relaxed">
              "The platform that turns ambition into a<br />
              <span className="font-bold text-[#C9A84C]">verifiable global career.</span>"
            </blockquote>
            <p className="text-slate-500 text-sm">— The Emerson Empire, EPDG</p>
          </div>

          <ul className="space-y-3">
            {["Remote internships with portfolio building", "Leadership development for professionals", "Global network across 50+ countries"].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="bg-purple-500/20 rounded-full w-1.5 h-1.5 shrink-0" />
                <span className="text-[13px] text-slate-400">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right form panel */}
        <div className="flex flex-1 justify-center items-center bg-[#12022A] px-5 py-12">
          <div className="w-full max-w-md lg:bg-white lg:rounded-2xl lg:shadow-[0_8px_40px_rgba(75,30,145,0.15)] lg:px-10 lg:py-10 px-2 py-4">

            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center items-center mb-8">
              <img src={logo} alt="Emerson Professional" className="w-auto h-36 object-contain" />
            </div>

            <h1 className="mb-1 font-black text-white lg:text-[#12022A] text-3xl tracking-tight">Welcome back</h1>
            <p className="mb-8 text-[14px] text-[#F5F0E8]/70 lg:text-[#12022A]/60">Sign in to continue to your professional development account</p>

            {/* Mock mode credentials banner */}
            {MOCK_MODE && (
              <div className="bg-amber-500/10 mb-6 p-4 border border-amber-500/30 rounded-xl">
                <p className="mb-3 font-bold text-[11px] text-amber-400 uppercase tracking-wider">
                  🧪 Test Mode — Backend Bypassed
                </p>
                <div className="space-y-2">
                  {[
                    { role: "Admin",   email: "admin@test.com",   icon: "🔑" },
                    { role: "Intern",  email: "intern@test.com",  icon: "🎓" },
                    { role: "Company", email: "company@test.com", icon: "🏢" },
                    { role: "School",  email: "school@test.com",  icon: "🏫" },
                  ].map((c) => (
                    <button
                      key={c.role}
                      type="button"
                      onClick={() => {
                        setUserType(c.role as UserType);
                        setEmail(c.email);
                        setPassword("password");
                        setError("");
                      }}
                      className="group flex justify-between items-center bg-white/5 hover:bg-amber-500/10 px-3 py-2 border border-white/5 hover:border-amber-500/30 rounded-lg w-full transition"
                    >
                      <span className="text-[12px] text-slate-300 group-hover:text-white">
                        {c.icon} {c.role} — <span className="font-mono text-amber-400">{c.email}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-amber-400">click to fill ↗</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Password: <span className="font-mono text-amber-400">password</span></p>
              </div>
            )}

            {/* User type selector */}
            <div className="flex gap-1 mb-6 p-1 border rounded-xl bg-white/5 border-white/10 lg:bg-[#12022A]/5 lg:border-[#12022A]/15">
              {USER_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setUserType(t.value); setError(""); }}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg font-semibold text-[12px] uppercase tracking-wider transition-all ${
                    userType === t.value
                      ? "bg-[#4B1E91] text-white shadow-lg"
                      : "text-[#F5F0E8]/60 hover:text-white lg:text-[#12022A]/50 lg:hover:text-[#12022A]"
                  }`}
                >
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1.5 font-medium text-[12px] uppercase tracking-wider text-[#F5F0E8]/60 lg:text-[#12022A]/50">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={userType === "School" ? "admin@university.edu" : `${userType.toLowerCase()}@example.com`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-[14px] transition focus:outline-none
                    bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#4B1E91]
                    lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:placeholder-[#12022A]/30 lg:focus:border-[#4B1E91]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-medium text-[12px] uppercase tracking-wider text-[#F5F0E8]/60 lg:text-[#12022A]/50">Password</label>
                  <a href="/forgot-password" className="text-[12px] text-[#C9A84C] hover:text-[#E8C97A] lg:text-[#4B1E91] lg:hover:text-[#3d1778] transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-14 rounded-xl border text-[14px] transition focus:outline-none
                      bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#4B1E91]
                      lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:placeholder-[#12022A]/30 lg:focus:border-[#4B1E91]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-sm transition text-[#F5F0E8]/50 hover:text-white lg:text-[#12022A]/40 lg:hover:text-[#12022A]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 px-4 py-3 border border-red-500/20 rounded-xl text-[13px] text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-60 mt-2 py-3.5 rounded-xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition disabled:cursor-not-allowed"
              >
                {loading && (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {loading ? "Signing in…" : `Sign In as ${userType === "School" ? "School / University" : userType}`}
              </button>
            </form>

            {userType === "School" ? (
              <div className="mt-6 px-5 py-4 border rounded-xl text-center bg-white/5 border-white/10 lg:bg-[#12022A]/5 lg:border-[#12022A]/10">
                <p className="mb-2 text-[13px] text-[#F5F0E8]/60 lg:text-[#12022A]/60">
                  New school or university?
                </p>
                <p className="mb-3 text-[12px] text-[#F5F0E8]/40 lg:text-[#12022A]/40 leading-relaxed">
                  Register your institution to connect students with internship opportunities and track their progress.
                </p>
                <a
                  href="/register/school"
                  className="inline-block font-semibold text-[12px] text-[#C9A84C] hover:text-[#E8C97A] lg:text-[#4B1E91] lg:hover:text-[#3d1778] uppercase tracking-wider transition"
                >
                  Register Your School →
                </a>
              </div>
            ) : (
              <p className="mt-6 text-[13px] text-center text-[#F5F0E8]/50 lg:text-[#12022A]/50">
                Don't have an account?{" "}
                <a href="/register" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] lg:text-[#4B1E91] lg:hover:text-[#3d1778] transition">
                  Create one free
                </a>
              </p>
            )}

            {EMPIRE_URL && (
              <p className="mt-4 text-[12px] text-center text-[#F5F0E8]/30 lg:text-[#12022A]/30">
                ←{" "}
                <a href={EMPIRE_URL} className="hover:text-white lg:hover:text-[#12022A] transition">
                  Back to Emerson Empire
                </a>
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
