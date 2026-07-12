import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { API_ORIGIN } from "../../lib/apiConfig";
import type { AxiosError } from "axios";
import logo from "../../assets/epd_logo.png";

interface FormValues {
  name:            string;
  email:           string;
  password:        string;
  confirmPassword: string;
  phone:           string;
  cover_letter:    string;
}

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
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}

const STRENGTH_META: Record<Exclude<Strength, "empty">, { label: string; color: string; width: string }> = {
  weak:   { label: "Weak",   color: "bg-red-500",   width: "w-1/3"  },
  medium: { label: "Medium", color: "bg-orange-400", width: "w-2/3"  },
  strong: { label: "Strong", color: "bg-green-500",  width: "w-full" },
};

const inputCls =
  "w-full rounded-xl px-4 py-3 pr-14 text-[14px] border transition focus:outline-none " +
  "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#4B1E91] " +
  "lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:placeholder-[#12022A]/30 lg:focus:border-[#4B1E91]";

const labelCls = "block mb-1.5 font-semibold text-[11px] uppercase tracking-wider text-[#F5F0E8]/60 lg:text-[#12022A]/60";
const errorCls = "mt-1.5 text-[12px] text-red-400";

const RegisterIntern: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [loading,      setLoading]      = useState(false);

  // CV file upload state (outside react-hook-form)
  const [cvFile,       setCvFile]       = useState<File | null>(null);
  const [cvError,      setCvError]      = useState("");
  const [uploadStep,   setUploadStep]   = useState<"idle" | "uploading" | "done">("idle");

  const { register, handleSubmit, control, formState: { errors, isValid } } =
    useForm<FormValues>({ mode: "onChange" });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const strength      = getStrength(passwordValue);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setCvError("");
    if (!file) { setCvFile(null); return; }

    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setCvError("Only PDF, DOC or DOCX files are accepted.");
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("File must be under 5 MB.");
      setCvFile(null);
      return;
    }
    setCvFile(file);
    setUploadStep("idle");
  }

  const onSubmit = async (data: FormValues) => {
    setApiError(""); setCvError("");

    if (!API_ORIGIN) {
      setApiError("Account registration is unavailable because the backend is not configured.");
      return;
    }

    setLoading(true);

    let cv_url: string | undefined;

    // Upload CV if a file was selected
    if (cvFile) {
      setUploadStep("uploading");
      try {
        const form = new FormData();
        form.append("file", cvFile);
        const { data: uploadData } = await api.post<{ success: boolean; url: string }>(
          "/api/upload/cv", form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        cv_url = uploadData.url;
        setUploadStep("done");
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        setCvError(axiosErr.response?.data?.message ?? "CV upload failed. Please try again.");
        setUploadStep("idle");
        setLoading(false);
        return;
      }
    }

    try {
      await api.post("/api/auth/register", {
        name:          data.name,
        email:         data.email,
        password:      data.password,
        contact_phone: data.phone,
        cv_url,
        cover_letter:  data.cover_letter || undefined,
        role:          "intern",
      });
      navigate("/pending-approval");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setApiError(axiosErr.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-[#12022A] focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main id="main-content" tabIndex={-1} className="flex justify-center items-center bg-[#12022A] px-5 py-14 min-h-screen">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Emerson Professional" className="w-auto h-32 object-contain" />
        </div>

        {/* Card */}
        <div className="lg:bg-white lg:shadow-[0_8px_40px_rgba(75,30,145,0.15)] px-2 lg:px-10 py-2 lg:py-10 lg:rounded-2xl">

          <div className="mb-7">
            <h1 className="font-black text-white lg:text-[#12022A] text-2xl tracking-tight">Create Intern Account</h1>
            <p className="mt-1 text-[#F5F0E8]/60 text-[13px] lg:text-[#12022A]/55">
              Apply for internships and build your career.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <div>
              <label htmlFor="intern-name" className={labelCls}>Full Name</label>
              <input id="intern-name" type="text" placeholder="Jane Doe" autoComplete="name" className={inputCls}
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })} />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="intern-email" className={labelCls}>Email Address</label>
              <input id="intern-email" type="email" placeholder="jane@example.com" autoComplete="email" className={inputCls}
                {...register("email", {
                  required: "Email address is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })} />
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="intern-phone" className={labelCls}>Phone Number</label>
              <input id="intern-phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" className={inputCls}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^\+?[\d\s\-().]{7,20}$/, message: "Enter a valid phone number" },
                })} />
              {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="intern-cv" className={labelCls}>
                CV / Resume <span className="normal-case font-normal">(PDF, DOC or DOCX — max 5 MB)</span>
              </label>
              <label htmlFor="intern-cv" className={`flex items-center gap-3 cursor-pointer rounded-xl border transition px-4 py-3
                ${cvFile ? "border-[#4B1E91] bg-[#4B1E91]/10 lg:bg-[#4B1E91]/5" : "border-white/10 bg-white/5 lg:bg-white lg:border-[#12022A]/15"}
              `}>
                <span className="text-[13px] shrink-0">
                  {uploadStep === "uploading" ? "⏳ Uploading…" : uploadStep === "done" ? "✅ Uploaded" : "📎 Choose file"}
                </span>
                <span className="text-[13px] truncate text-[#F5F0E8]/60 lg:text-[#12022A]/50">
                  {cvFile ? cvFile.name : "No file chosen"}
                </span>
                <input
                  id="intern-cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {cvError && <p className={errorCls}>{cvError}</p>}
            </div>

            <div>
              <label htmlFor="intern-cover-letter" className={labelCls}>Cover Letter <span className="normal-case font-normal">(optional but recommended)</span></label>
              <textarea
                id="intern-cover-letter"
                rows={5}
                placeholder="Tell us why you want to join the EPDG program, your goals, and what you bring to the table…"
                className={inputCls + " resize-none"}
                {...register("cover_letter", {
                  maxLength: { value: 2000, message: "Cover letter must be under 2000 characters" },
                })}
              />
              {errors.cover_letter && <p className={errorCls}>{errors.cover_letter.message}</p>}
            </div>

            <div>
              <label htmlFor="intern-password" className={labelCls}>Password</label>
              <div className="relative">
                <input id="intern-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  autoComplete="new-password" className={inputCls}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })} />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-controls="intern-password"
                  aria-pressed={showPassword}
                  className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordValue && (
                <div className="mt-2">
                  <div className="bg-white/10 lg:bg-[#12022A]/10 rounded-full w-full h-1 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength !== "empty" ? STRENGTH_META[strength].color : ""} ${strength !== "empty" ? STRENGTH_META[strength].width : "w-0"}`} />
                  </div>
                  {strength !== "empty" && (
                    <p className={`text-[11px] mt-1 font-medium ${strength === "weak" ? "text-red-400" : strength === "medium" ? "text-orange-400" : "text-green-400"}`}>
                      {STRENGTH_META[strength].label} password
                    </p>
                  )}
                </div>
              )}
              {errors.password && <p className={errorCls}>{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="intern-confirm-password" className={labelCls}>Confirm Password</label>
              <div className="relative">
                <input id="intern-confirm-password" type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  autoComplete="new-password" className={inputCls}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === passwordValue || "Passwords do not match",
                  })} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password confirmation" : "Show password confirmation"}
                  aria-controls="intern-confirm-password"
                  aria-pressed={showConfirm}
                  className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2">
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <p className={errorCls}>{errors.confirmPassword.message}</p>}
            </div>

            {apiError && (
              <div className="bg-red-500/10 px-4 py-3 border border-red-500/25 rounded-xl text-[13px] text-red-400">
                {apiError}
              </div>
            )}

            <button type="submit" disabled={!isValid || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                isValid && !loading
                  ? "bg-[#4B1E91] hover:bg-[#3d1778] text-white cursor-pointer"
                  : "bg-white/5 lg:bg-[#12022A]/5 text-[#F5F0E8]/30 lg:text-[#12022A]/30 cursor-not-allowed border border-white/10 lg:border-[#12022A]/10"
              }`}>
              {loading && (
                <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Creating account…" : "Create Intern Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-[#F5F0E8]/50 text-[13px] text-center">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-[#C9A84C] lg:hover:text-[#3d1778] hover:text-[#E8C97A] transition-colors">Sign in</a>
        </p>
        <p className="mt-2 text-[#F5F0E8]/50 text-[13px] text-center">
          Not an intern?{" "}
          <a href="/register" className="font-semibold text-[#C9A84C] lg:hover:text-[#3d1778] hover:text-[#E8C97A] transition-colors">Change role</a>
        </p>
      </div>
      </main>
    </>
  );
};

export default RegisterIntern;
