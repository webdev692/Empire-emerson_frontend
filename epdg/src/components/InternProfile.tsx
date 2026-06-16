import { useState, useEffect } from "react";
import api from "../lib/axios";
// import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";

interface Profile {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  bio: string | null;
  course: string | null;
  year_of_study: number | null;
  contact_phone: string | null;
  skills: string[] | null;
  track: string | null;
  department: string | null;
  mentor_name: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  country: string | null;
  city: string | null;
  nda_signed: boolean;
  disclaimer_accepted: boolean;
  onboarding_complete: boolean;
  is_approved: boolean;
  profile_photo: string | null;
}

const TRACKS = [
  "Web Design",
  "Sales & Marketing",
  "Social Media",
  "Digital Marketing",
];

const inputCls = "w-full bg-[#1E0A4A] border border-[#4B1E91] rounded-2xl px-4 py-3 text-[14px] text-white placeholder-[#5D4A7D] focus:outline-none focus:border-[#4B1E91] transition";
const labelCls = "block text-[11px] font-semibold uppercase tracking-wider text-[#F5F0E8] mb-1.5";

export default function InternProfile() {
  // const user                   = useAuthStore((s) => s.user);
  const [profile, setProfile]  = useState<Profile | null>(null);
  const [form, setForm]        = useState<Partial<Profile & { skillInput: string }>>({});
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);
  const [success, setSuccess]  = useState("");
  const [error, setError]      = useState("");
  const [editMode, setEditMode]= useState(false);

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; data: Profile }>("/api/intern/profile");
      setProfile(data.data);
      setForm(data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message ?? "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = {
        name:          form.name,
        bio:           form.bio,
        course:        form.course,
        year_of_study: form.year_of_study,
        contact_phone: form.contact_phone,
        skills:        form.skills,
        track:         form.track,
        linkedin_url:  form.linkedin_url,
        github_url:    form.github_url,
        portfolio_url: form.portfolio_url,
        country:       form.country,
        city:          form.city,
        nda_signed:          form.nda_signed,
        disclaimer_accepted: form.disclaimer_accepted,
      };
      const { data } = await api.patch<{ success: boolean; data: Profile }>("/api/intern/profile", payload);
      setProfile(data.data);
      setForm(data.data);
      setSuccess("Profile updated successfully.");
      setEditMode(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function addSkill(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (form.skillInput ?? "").trim()) {
      e.preventDefault();
      setForm((f) => ({
        ...f,
        skills: [...(f.skills ?? []), (f.skillInput ?? "").trim()],
        skillInput: "",
      }));
    }
  }

  function removeSkill(s: string) {
    setForm((f) => ({ ...f, skills: (f.skills ?? []).filter((x) => x !== s) }));
  }

  const initials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="border-[#4B1E91] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl text-white">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
          <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-3xl w-20 h-20 font-black text-white text-3xl">
            {profile?.name ? initials(profile.name) : "?"}
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight">{profile?.name}</h1>
            <p className="mt-0.5 text-[#F5F0E8] text-[14px]">{profile?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.department && (
                <span className="bg-[#4B1E91]/20 px-2.5 py-0.5 rounded-full font-medium text-[#D8B9FF] text-[11px]">
                  {profile.department}
                </span>
              )}
              {profile?.track && (
                <span className="bg-[#22C55E]/15 px-2.5 py-0.5 rounded-full font-medium text-[#22C55E] text-[11px]">
                  {profile.track}
                </span>
              )}
              {profile?.is_approved ? (
                <span className="bg-green-500/15 px-2.5 py-0.5 rounded-full font-medium text-[11px] text-green-300">✓ Approved</span>
              ) : (
                <span className="bg-amber-500/15 px-2.5 py-0.5 rounded-full font-medium text-[11px] text-amber-300">Pending Review</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setEditMode((v) => !v)}
          className={`px-5 py-2.5 rounded-2xl font-semibold text-[13px] transition ${editMode ? "bg-white/10 text-[#F5F0E8]" : "bg-[#4B1E91] hover:bg-[#3d1778] text-white"}`}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error   && <div className="bg-red-500/10 mb-4 px-4 py-3 border border-red-500/20 rounded-xl text-[13px] text-red-400">{error}</div>}
      {success && <div className="bg-green-500/10 mb-4 px-4 py-3 border border-green-500/20 rounded-xl text-[13px] text-green-400">{success}</div>}

      {/* Mentor card */}
      {(profile?.mentor_name || profile?.department) && (
        <div className="flex items-center gap-4 bg-[#1E0A4A] mb-6 p-5 border border-[#4B1E91] rounded-3xl">
          <div className="flex justify-center items-center bg-[#4B1E91]/20 rounded-2xl w-12 h-12 font-bold text-[#4B1E91] text-lg">
            {profile.mentor_name ? initials(profile.mentor_name) : "?"}
          </div>
          <div>
            <p className="text-[#F5F0E8] text-[11px] uppercase tracking-widest">Assigned Mentor</p>
            <p className="font-bold text-white">{profile.mentor_name ?? "Not yet assigned"}</p>
            {profile.department && <p className="text-[#F5F0E8] text-[13px]">{profile.department} Department</p>}
          </div>
        </div>
      )}

      {/* Form / view */}
      <div className="space-y-6">

        {/* About */}
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <h2 className="mb-5 font-bold text-[15px] text-white">About</h2>
          <div className="space-y-4">
            {editMode && (
              <div>
                <label className={labelCls}>Full Name</label>
                <input className={inputCls} value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label className={labelCls}>Bio</label>
              {editMode
                ? <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Tell us about yourself…"
                    value={form.bio ?? ""} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
                : <p className="text-[#ffffff] text-[14px] leading-relaxed">{profile?.bio || <span className="text-[#5D4A7D] italic">Not set</span>}</p>
              }
            </div>
          </div>
        </div>

        {/* Academic + Track */}
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <h2 className="mb-5 font-bold text-[15px] text-white">Academic & Track</h2>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Course / Degree</label>
              {editMode
                ? <input className={inputCls} placeholder="e.g. Computer Science" value={form.course ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} />
                : <p className="text-[#ffffff] text-[14px]">{profile?.course || "—"}</p>
              }
            </div>
            <div>
              <label className={labelCls}>Year of Study</label>
              {editMode
                ? <input type="number" min={1} max={6} className={inputCls} value={form.year_of_study ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, year_of_study: Number(e.target.value) }))} />
                : <p className="text-[#ffffff] text-[14px]">{profile?.year_of_study ?? "—"}</p>
              }
            </div>
            <div>
              <label className={labelCls}>Internship Track</label>
              {editMode
                ? <select className={`${inputCls} bg-[#0D0118] appearance-none`} value={form.track ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, track: e.target.value }))}>
                    <option value="">Select track…</option>
                    {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                : <p className="text-[#ffffff] text-[14px]">{profile?.track || "—"}</p>
              }
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              {editMode
                ? <input type="tel" className={inputCls} placeholder="+254 700 000 000" value={form.contact_phone ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))} />
                : <p className="text-[#ffffff] text-[14px]">{profile?.contact_phone || "—"}</p>
              }
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <h2 className="mb-5 font-bold text-[15px] text-white">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(form.skills ?? []).map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-[#4B1E91]/20 px-3 py-1 rounded-full font-medium text-[#D8B9FF] text-[12px]">
                {s}
                {editMode && <button type="button" onClick={() => removeSkill(s)} className="ml-0.5 hover:text-red-400">×</button>}
              </span>
            ))}
            {(!form.skills || form.skills.length === 0) && !editMode && (
              <span className="text-[#5D4A7D] text-[14px] italic">No skills added yet</span>
            )}
          </div>
          {editMode && (
            <input className={inputCls} placeholder="Type a skill and press Enter…"
              value={form.skillInput ?? ""} onChange={(e) => setForm((f) => ({ ...f, skillInput: e.target.value }))}
              onKeyDown={addSkill} />
          )}
        </div>

        {/* Links */}
        <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
          <h2 className="mb-5 font-bold text-[15px] text-white">Links</h2>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            {[
              { key: "linkedin_url",  label: "LinkedIn",  ph: "https://linkedin.com/in/you" },
              { key: "github_url",    label: "GitHub",    ph: "https://github.com/you"       },
              { key: "portfolio_url", label: "Portfolio", ph: "https://yourportfolio.com"    },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                {editMode
                  ? <input type="url" className={inputCls} placeholder={ph}
                      value={(form as Record<string, string>)[key] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  : (profile as unknown as Record<string, string | null>)[key]
  ? <a href={(profile as unknown as Record<string, string | null>)[key]!} target="_blank" rel="noreferrer"
      className="block text-[#4B1E91] text-[14px] hover:underline truncate">{(profile as unknown as Record<string, string | null>)[key]}</a>
  : <p className="text-[#5D4A7D] text-[14px] italic">Not set</p>
                }
              </div>
            ))}
            <div>
              <label className={labelCls}>Location</label>
              {editMode
                ? <input className={inputCls} placeholder="City, Country"
                    value={[form.city, form.country].filter(Boolean).join(", ")}
                    onChange={(e) => {
                      const [city, ...rest] = e.target.value.split(",");
                      setForm((f) => ({ ...f, city: city.trim(), country: rest.join(",").trim() }));
                    }} />
                : <p className="text-[#ffffff] text-[14px]">{[profile?.city, profile?.country].filter(Boolean).join(", ") || "—"}</p>
              }
            </div>
          </div>
        </div>

        {/* Agreements */}
        {editMode && (
          <div className="bg-[#1E0A4A] p-6 border border-[#4B1E91] rounded-3xl">
            <h2 className="mb-4 font-bold text-[15px] text-white">Agreements</h2>
            <div className="space-y-3">
              {[
                { key: "nda_signed",          label: "I have read and agree to the Non-Disclosure Agreement (NDA)" },
                { key: "disclaimer_accepted",  label: "I accept the platform terms and disclaimer" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox"
                    checked={!!(form as Record<string, boolean>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-[#4B1E91]" />
                  <span className="text-[#F5F0E8] text-[13px] leading-relaxed">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {editMode && (
          <button onClick={handleSave} disabled={saving}
            className="bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-60 py-3.5 rounded-2xl w-full font-bold text-[13px] text-white uppercase tracking-wider transition">
            {saving ? "Saving…" : "Save Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
