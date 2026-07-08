import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import logo from "../../assets/epd_logo.png";

interface FormValues {
  name:            string;
  email:           string;
  password:        string;
  confirmPassword: string;
  organization:    string;
  phone:           string;
}

interface ApiErrorResponse {
  message: string;
}

const inputCls =
  "w-full rounded-xl px-4 py-3 text-[14px] border transition focus:outline-none " +
  "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#4B1E91] " +
  "lg:bg-white lg:border-[#12022A]/15 lg:text-[#12022A] lg:placeholder-[#12022A]/30 lg:focus:border-[#4B1E91]";

const labelCls = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[#F5F0E8]/60 lg:text-[#12022A]/60";
const errorCls = "mt-1.5 text-[12px] text-red-400";

const RegisterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: FormValues) => {
    setApiError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "admin",
        organization: data.organization,
        phone: data.phone,
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
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Emerson Professional" className="w-auto h-32 object-contain" />
        </div>

        <div className="lg:bg-white lg:shadow-[0_8px_40px_rgba(75,30,145,0.15)] px-2 lg:px-10 py-2 lg:py-10 lg:rounded-2xl">
          <div className="mb-8">
            <h1 className="font-black text-white lg:text-[#12022A] text-2xl tracking-tight">
              Create Admin Account
            </h1>
            <p className="mt-1 text-[#F5F0E8]/60 text-[13px] lg:text-[#12022A]/55">
              Request access to manage the Emerson Empire platform. An admin must review and approve your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className={inputCls}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "Must be at least 2 characters" },
                  })}
                />
                {errors.name && <p className={errorCls}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className={inputCls}
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && <p className={errorCls}>{errors.email.message}</p>}
              </div>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <div>
                <label className={labelCls}>Organization</label>
                <input
                  type="text"
                  placeholder="Emerson Empire"
                  className={inputCls}
                  {...register("organization", {
                    required: "Organization is required",
                    minLength: { value: 2, message: "Must be at least 2 characters" },
                  })}
                />
                {errors.organization && <p className={errorCls}>{errors.organization.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={inputCls}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[\d\s\-().]{7,20}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                />
                {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
              </div>
            </div>

            <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 mb-5">
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`${inputCls} pr-14`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Minimum 8 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className={errorCls}>{errors.password.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`${inputCls} pr-14`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === passwordValue || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="top-1/2 right-4 absolute text-[#F5F0E8]/50 text-[12px] lg:hover:text-[#12022A] lg:text-[#12022A]/40 hover:text-white transition -translate-y-1/2"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && <p className={errorCls}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {apiError && (
              <div className="bg-red-500/10 mb-5 px-4 py-3 border border-red-500/25 rounded-xl text-[13px] text-red-400">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                isValid && !loading
                  ? "bg-[#4B1E91] hover:bg-[#3d1778] text-white cursor-pointer"
                  : "bg-white/5 lg:bg-[#12022A]/5 text-[#F5F0E8]/30 lg:text-[#12022A]/30 cursor-not-allowed border border-white/10 lg:border-[#12022A]/10"
              }`}
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Submitting…" : "Register Admin"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-[#F5F0E8]/50 text-[13px] text-center">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterAdmin;
