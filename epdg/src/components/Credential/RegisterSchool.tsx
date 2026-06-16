import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import logo from "../../assets/epd_logo.png";

interface FormValues {
  schoolName:      string;
  email:           string;
  password:        string;
  confirmPassword: string;
  country:         string;
  city:            string;
  schoolType:      string;
  contactPerson:   string;
  phone:           string;
  website:         string;
}

interface ApiErrorResponse {
  message: string;
}

const SCHOOL_TYPES = [
  "University", "College", "Polytechnic", "Vocational Institute", "High School", "Other",
] as const;

const inputCls =
  "w-full rounded-xl px-4 py-3 text-[14px] border transition focus:outline-none " +
  "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#4B1E91] " +
  "lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:placeholder-[#12022A]/30 lg:focus:border-[#4B1E91]";

const selectCls =
  "w-full rounded-xl px-4 py-3 text-[14px] border transition appearance-none cursor-pointer focus:outline-none " +
  "bg-[#1E0A4A] border-white/10 text-white focus:border-[#4B1E91] " +
  "lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:focus:border-[#4B1E91]";

const labelCls = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[#F5F0E8]/60 lg:text-[#12022A]/60";
const errorCls = "mt-1.5 text-[12px] text-red-400";

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
    {error && <p className={errorCls}>{error}</p>}
  </div>
);

const RegisterSchool: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [loading,      setLoading]      = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm<FormValues>({ mode: "onChange" });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: FormValues) => {
    setApiError("");
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        name:           data.schoolName,
        email:          data.email,
        password:       data.password,
        role:           "school",
        country:        data.country,
        city:           data.city,
        school_type:    data.schoolType,
        contact_person: data.contactPerson,
        phone:          data.phone,
        website:        data.website || undefined,
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
    <div className="flex justify-center items-center bg-[#12022A] px-5 py-14 min-h-screen">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Emerson Professional" className="w-auto h-32 object-contain" />
        </div>

        {/* Card */}
        <div className="lg:bg-white lg:shadow-[0_8px_40px_rgba(75,30,145,0.15)] px-2 lg:px-10 py-2 lg:py-10 lg:rounded-2xl">

          <div className="mb-8">
            <h1 className="font-black text-white lg:text-[#12022A] text-2xl tracking-tight">
              Partner with Emerson Empire's Professional Development Group
            </h1>
            <p className="mt-1 text-[#F5F0E8]/60 text-[13px] lg:text-[#12022A]/55">
              Connect your students with internship opportunities. An admin will review and activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <Field label="School / Institution Name" error={errors.schoolName?.message}>
                <input type="text" placeholder="University of Nairobi" autoComplete="organization" className={inputCls}
                  {...register("schoolName", { required: "School name is required", minLength: { value: 2, message: "Must be at least 2 characters" } })} />
              </Field>
              <Field label="Official Email Address" error={errors.email?.message}>
                <input type="email" placeholder="admin@university.edu" autoComplete="email" className={inputCls}
                  {...register("email", { required: "Email address is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } })} />
              </Field>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                    autoComplete="new-password" className={`${inputCls} pr-14`}
                    {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                    autoComplete="new-password" className={`${inputCls} pr-14`}
                    {...register("confirmPassword", { required: "Please confirm your password", validate: (v) => v === passwordValue || "Passwords do not match" })} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2">
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <Field label="Country" error={errors.country?.message}>
                <input type="text" placeholder="Kenya" className={inputCls}
                  {...register("country", { required: "Country is required" })} />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input type="text" placeholder="Nairobi" className={inputCls}
                  {...register("city", { required: "City is required" })} />
              </Field>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <Field label="Institution Type" error={errors.schoolType?.message}>
                <div className="relative">
                  <select className={selectCls} defaultValue=""
                    {...register("schoolType", { required: "Please select institution type" })}>
                    <option value="" disabled>Select type…</option>
                    {SCHOOL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="top-1/2 right-4 absolute text-[#F5F0E8]/40 lg:text-[#12022A]/40 -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </Field>
              <Field label="Contact Person (Coordinator)" error={errors.contactPerson?.message}>
                <input type="text" placeholder="Dr. Jane Smith" className={inputCls}
                  {...register("contactPerson", { required: "Contact person is required" })} />
              </Field>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-6">
              <Field label="Phone Number" error={errors.phone?.message}>
                <input type="tel" placeholder="+254 700 000 000" className={inputCls}
                  {...register("phone", { required: "Phone number is required", pattern: { value: /^\+?[\d\s\-().]{7,20}$/, message: "Enter a valid phone number" } })} />
              </Field>
              <Field label="Website (optional)">
                <input type="url" placeholder="https://university.edu" className={inputCls}
                  {...register("website", { pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL" } })} />
                {errors.website && <p className={errorCls}>{errors.website.message}</p>}
              </Field>
            </div>

            <div className="bg-[#4B1E91]/10 mb-5 px-4 py-3 border border-[#4B1E91]/20 rounded-xl">
              <p className="text-[#F5F0E8]/70 text-[13px] lg:text-[#12022A]/70">
                <span className="font-semibold">Admin review required</span> — your institution will be verified before account activation (1–2 business days).
              </p>
            </div>

            {apiError && (
              <div className="bg-red-500/10 mb-5 px-4 py-3 border border-red-500/25 rounded-xl text-[13px] text-red-400">
                {apiError}
              </div>
            )}

            <button type="submit" disabled={!isValid || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
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
              {loading ? "Registering…" : "Register School"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-[#F5F0E8]/50 text-[13px] text-center">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">Sign in</a>
        </p>
        <p className="mt-2 text-[#F5F0E8]/50 text-[13px] text-center">
          Not a school?{" "}
          <a href="/register" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors ]">Change role</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterSchool;
