import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import type { AxiosError } from "axios";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
}

// Fallback steps shown while loading or if backend has no data yet
const DEFAULT_STEPS: OnboardingStep[] = [
  { id: 1, title: "Profile Setup",              description: "Complete your profile so companies and mentors can find you.",                          status: "current"   },
  { id: 2, title: "Security & Credentials",     description: "Verify your email and set up account security.",                                       status: "locked"    },
  { id: 3, title: "Track Selection",            description: "Choose your internship track: Web Design, Sales, Social Media, or Digital Marketing.", status: "locked"    },
  { id: 4, title: "Workspace Setup",            description: "Set up your development or work environment for your chosen track.",                   status: "locked"    },
  { id: 5, title: "First Task Submission",      description: "Complete and submit your first portfolio task to show you're ready.",                  status: "locked"    },
  { id: 6, title: "Onboarding Sign-off",        description: "Your mentor reviews your progress and signs you off to begin your internship.",        status: "locked"    },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [steps, setSteps]         = useState<OnboardingStep[]>(DEFAULT_STEPS);
  const [allDone, setAllDone]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState<number | null>(null);
  const [error, setError]         = useState("");

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const { data } = await api.get<OnboardingStep[]>("/api/intern/onboarding");
        if (!active) return;
        setSteps(data);
        setAllDone(data.every((s) => s.status === "completed"));
      } catch (err) {
        if (!active) return;
        const requestError = err as AxiosError<{ message: string }>;
        // If endpoint not yet built, fall back to default steps silently
        if ((requestError.response?.status ?? 0) !== 404) {
          setError(requestError.response?.data?.message ?? "");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProgress();
    return () => { active = false; };
  }, []);

  async function handleCompleteStep(id: number) {
    setSaving(id);
    setError("");
    try {
      const { data } = await api.patch<OnboardingStep[]>(`/api/intern/onboarding/${id}/complete`);
      setSteps(data);
      setAllDone(data.every((s) => s.status === "completed"));
    } catch {
      // Optimistic fallback — update locally if backend not ready
      setSteps((prev) => {
        const updated = prev.map((step) => {
          if (step.id === id)     return { ...step, status: "completed" as const };
          if (step.id === id + 1) return { ...step, status: "current"   as const };
          return step;
        });
        if (updated.every((s) => s.status === "completed")) setAllDone(true);
        return updated;
      });
    } finally {
      setSaving(null);
    }
  }

  const completedCount     = steps.filter((s) => s.status === "completed").length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="bg-[#0D0118] min-h-screen text-white font-sans antialiased p-2">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-white tracking-tight">Complete Your Onboarding</h1>
        <p className="text-xs text-[#F5F0E8] mt-1">
          Complete each step to unlock your full internship dashboard.
        </p>

        <div className="mt-6 bg-[#1E0A4A] border border-[#4B1E91] p-4 rounded-2xl space-y-2">
          <div className="bg-[#4B1E91] rounded-full h-3 w-full overflow-hidden">
            <div
              className="bg-[#4B1E91] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-[#F5F0E8]">
            <span>Onboarding Progress</span>
            <span>{completedCount} of {steps.length} steps completed</span>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#4B1E91] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-3xl space-y-1 relative">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent   = step.status === "current";
            const isSaving    = saving === step.id;

            let circleStyle = "bg-[#4B1E91] text-[#F5F0E8] border-[#4B1E91]";
            let cardStyle   = "border-[#4B1E91] opacity-50";
            let badgeStyle  = "bg-neutral-800 text-neutral-500";

            if (isCompleted) {
              circleStyle = "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]";
              cardStyle   = "border-[#4B1E91]/40 opacity-70";
              badgeStyle  = "bg-[#22C55E]/20 text-[#22C55E]";
            } else if (isCurrent) {
              circleStyle = "bg-[#4B1E91] text-white border-[#4B1E91] shadow-md shadow-[#4B1E91]/30 animate-pulse";
              cardStyle   = "border-[#4B1E91] bg-[#1E0A4A]";
              badgeStyle  = "bg-[#4B1E91]/20 text-[#F5F0E8]";
            }

            return (
              <div key={step.id} className="flex flex-col items-start">
                <div className="flex items-start gap-4 w-full">
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${circleStyle}`}>
                      {isCompleted ? "✓" : step.status === "locked" ? "🔒" : step.id}
                    </div>
                  </div>

                  <div className={`flex-1 bg-[#1E0A4A] border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${cardStyle}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">{step.title}</h3>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${badgeStyle}`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#F5F0E8] leading-relaxed max-w-xl">{step.description}</p>

                      {isCurrent && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleCompleteStep(step.id)}
                            disabled={isSaving}
                            className="bg-[#4B1E91] text-white font-mono text-[10px] uppercase tracking-wider py-1.5 px-3.5 rounded-lg hover:bg-[#683cb0] transition-colors disabled:opacity-60"
                          >
                            {isSaving ? "Saving…" : "Complete Now →"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="w-0.5 h-6 bg-[#4B1E91] ml-3.75 my-1" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {allDone && (
        <div className="max-w-3xl mt-6 bg-[#22C55E]/10 border border-[#22C55E] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Onboarding Complete!</h2>
            <p className="text-sm text-[#F5F0E8] mt-1">You're all set. Your dashboard is fully unlocked.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#4B1E91] text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-[#683cb0] transition-colors whitespace-nowrap"
          >
            Go to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
