import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { AxiosError } from "axios";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/epd_logo.png";

const ChangePassword: React.FC = () => {
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);
  const setAuth   = useAuthStore((s) => s.setAuth);
  const token     = useAuthStore((s) => s.token);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.patch("/api/auth/change-password", {
        current_password: current,
        new_password:     next,
      });
      // Update the stored user to clear the force_password_change flag
      if (user && token) {
        setAuth({ ...user, force_password_change: false }, token);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(user?.is_mentor ? "/mentor" : "/admin");
      }, 1500);
    } catch (err) {
      setError(
        (err as AxiosError<{ message: string }>).response?.data?.message ??
        "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center bg-[#0D0118] min-h-screen p-4">
      <div className="bg-[#1E0A4A] p-8 border border-[#4B1E91] rounded-3xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Emerson Professional" className="h-16 object-contain" />
        </div>

        <h1 className="mb-1 font-semibold text-white text-2xl text-center">Set Your Password</h1>
        <p className="mb-8 text-[#F5F0E8]/60 text-sm text-center">
          You're logging in for the first time. Please set a new password to continue.
        </p>

        {success ? (
          <div className="bg-green-500/15 p-4 border border-green-500/30 rounded-2xl text-center text-green-300 text-sm">
            Password changed! Redirecting…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/15 p-3 border border-red-500/30 rounded-2xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <label className="block text-[#F5F0E8] text-sm">
              Temporary Password (given by admin)
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                placeholder="Enter temporary password"
              />
            </label>

            <label className="block text-[#F5F0E8] text-sm">
              New Password
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
                minLength={8}
                className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="block text-[#F5F0E8] text-sm">
              Confirm New Password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="bg-[#0D0118] mt-1.5 px-4 py-3 border border-[#4B1E91] rounded-2xl outline-none w-full text-white"
                placeholder="Repeat new password"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !current || !next || !confirm}
              className="bg-[#4B1E91] disabled:opacity-50 mt-2 py-3 rounded-2xl w-full font-semibold text-white transition"
            >
              {loading ? "Saving…" : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
