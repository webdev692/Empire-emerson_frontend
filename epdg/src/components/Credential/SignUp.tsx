import React, { useState } from "react";
import { API_ORIGIN } from "../../lib/apiConfig";

type UserType = "Intern" | "Company";

// Back-link resolved at build time — set VITE_EMPIRE_URL in Netlify env vars
const EMPIRE_URL = import.meta.env.VITE_EMPIRE_URL || "";

const SignUp: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("Intern");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const apiUrl = API_ORIGIN;
    if (!apiUrl) {
      setError("Account registration is unavailable because the backend is not configured.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType, userRole: userType, ...form }),
      });
      if (!res.ok) throw new Error(`Signup request failed with status ${res.status}`);
      setSuccess(true);
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center bg-[#0a011a] min-h-screen">
        <div className="w-full max-w-md p-10 text-center rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-3xl rounded-full bg-emerald-500/10">✓</div>
          <h2 className="mb-3 text-2xl font-black text-white">Account created!</h2>
          <p className="mb-8 text-slate-400 text-[14px]">Your account has been registered. You can now sign in.</p>
          <a href="/" className="inline-block bg-[#4B1E91] hover:bg-[#3a1570] px-8 py-3.5 rounded-xl font-bold text-white text-[13px] uppercase tracking-wider transition">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a011a]">

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#12022A] p-12 border-r border-white/5">
        {EMPIRE_URL && (
          <a href={EMPIRE_URL} className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-[#4B1E91] rounded-xl w-10 h-10 font-black text-white text-lg">E</div>
            <span className="font-bold text-white text-[13px] leading-tight tracking-wide uppercase">
              <span className="text-slate-400">Emerson</span><br />Professional
            </span>
          </a>
        )}

        <div>
          <p className="mb-4 text-3xl font-black leading-tight text-white">
            Join the Global<br />
            <span className="text-[#C9A84C]">Professional Network.</span>
          </p>
          <p className="text-slate-400 text-[14px] leading-relaxed">
            Whether you're an intern building your first portfolio or a company hiring verified talent — this is where global careers begin.
          </p>
        </div>

        <ul className="space-y-3">
          {["Verified portfolio building program", "Access to 50+ country network", "Remote-first career ecosystem"].map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="shrink-0 bg-[#C9A84C]/20 rounded-full w-1.5 h-1.5" />
              <span className="text-slate-400 text-[13px]">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center flex-1 px-5 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          {EMPIRE_URL && (
            <a href={EMPIRE_URL} className="flex items-center justify-center gap-3 mb-10 lg:hidden">
              <div className="flex justify-center items-center bg-[#4B1E91] rounded-xl w-10 h-10 font-black text-white text-lg">E</div>
              <span className="font-bold text-white text-[13px] leading-tight tracking-wide uppercase">
                <span className="text-slate-400">Emerson</span><br />Professional
              </span>
            </a>
          )}

          <h1 className="mb-1 text-3xl font-black tracking-tight text-white">Create account</h1>
          <p className="mb-8 text-slate-400 text-[14px]">Join the Emerson Professional platform</p>

          {/* Account type toggle */}
          <div className="flex gap-1 p-1 mb-6 border bg-white/5 border-white/10 rounded-xl">
            {(["Intern", "Company"] as UserType[]).map((t) => (
              <button key={t} type="button" onClick={() => { setUserType(t); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-[12px] uppercase tracking-wider transition-all ${
                  userType === t ? "bg-[#4B1E91] text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}>
                {t === "Intern" ? "🎓 Intern" : "🏢 Company"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === "Intern" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">First name</label>
                  <input name="firstName" type="text" required autoComplete="given-name" placeholder="Jane" onChange={handle}
                    className="bg-white/5 px-4 py-3 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
                </div>
                <div>
                  <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">Last name</label>
                  <input name="lastName" type="text" required autoComplete="family-name" placeholder="Doe" onChange={handle}
                    className="bg-white/5 px-4 py-3 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">Company name</label>
                <input name="companyName" type="text" required autoComplete="organization" placeholder="Acme Corp" onChange={handle}
                  className="bg-white/5 px-4 py-3 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
              </div>
            )}

            <div>
              <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">Email address</label>
              <input name="email" type="email" required autoComplete="email"
                placeholder={userType === "Intern" ? "intern@example.com" : "contact@company.com"}
                onChange={handle}
                className="bg-white/5 px-4 py-3 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required autoComplete="new-password"
                  placeholder="Min. 8 characters" onChange={handle}
                  className="bg-white/5 px-4 py-3 pr-16 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-sm transition -translate-y-1/2 top-1/2 right-4 text-slate-500 hover:text-slate-300">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-400 text-[12px] uppercase tracking-wider">Confirm password</label>
              <input name="confirmPassword" type={showPassword ? "text" : "password"} required autoComplete="new-password"
                placeholder="Re-enter password" onChange={handle}
                className="bg-white/5 px-4 py-3 border border-white/10 focus:border-purple-500 rounded-xl w-full text-white text-[14px] placeholder-slate-600 focus:outline-none transition" />
            </div>

            {error && (
              <div className="bg-red-500/10 px-4 py-3 border border-red-500/20 rounded-xl text-red-400 text-[13px]">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="flex justify-center items-center gap-2 bg-[#4B1E91] hover:bg-[#3a1570] disabled:opacity-60 disabled:cursor-not-allowed mt-2 py-3.5 rounded-xl w-full font-bold text-white text-[13px] uppercase tracking-wider transition">
              {loading && (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Creating account…" : `Create ${userType} Account`}
            </button>
          </form>

          <p className="mt-6 text-slate-500 text-[13px] text-center">
            Already have an account?{" "}
            <a href="/" className="font-semibold text-purple-400 transition hover:text-purple-300">Sign in</a>
          </p>

          {EMPIRE_URL && (
            <p className="mt-4 text-slate-600 text-[12px] text-center">
              ← <a href={EMPIRE_URL} className="transition text-slate-500 hover:text-white">Back to Emerson Empire</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
