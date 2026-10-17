import React, { useState } from 'react';

export default function IntakeStatusForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    serviceType: 'Project Studio Intake',
    notes: '',
  });

  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());  
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
    console.log('[Intake Component] Local UI validation complete:', formData);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      serviceType: 'Project Studio Intake',
      notes: '',
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-[#0A1128] text-white rounded-xl border border-[#c9a24c]/40 shadow-xl font-sans">
      <h2 className="text-xl font-bold text-[#c9a24c] mb-2">Project Studio Intake</h2>
      <p className="text-xs text-slate-300 mb-6">
        Submit your project details. Requests are validated locally via the manual operating route.
      </p>

      {submitted ? (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm space-y-2">
          <p className="font-semibold text-emerald-400">✓ Request Verified (UI-Only Simulation)</p>
          <p className="text-xs text-slate-200">
            Thank you, <strong>{formData.fullName}</strong>. Your intake request for <strong>{formData.serviceType}</strong> has passed frontend validation checks.
          </p>
          
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="text-xs underline text-emerald-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-950 rounded px-1"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Full Name <span className="text-[#c9a24c]">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full bg-slate-900 border rounded p-2 text-sm text-white outline-none transition-colors ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-slate-500 focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c] focus:ring-offset-2 focus:ring-offset-[#0A1128]'
              }`}
              placeholder="e.g., Alex Johnson"
            />
            {errors.fullName && <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Email Address <span className="text-[#c9a24c]">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full bg-slate-900 border rounded p-2 text-sm text-white outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-slate-500 focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c] focus:ring-offset-2 focus:ring-offset-[#0A1128]'
              }`}
              placeholder="e.g., alex@example.com"
            />
            {errors.email && <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Service Requested */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Service Requested <span className="text-[#c9a24c]">*</span>
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-500 rounded p-2 text-sm text-white outline-none focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c] focus:ring-offset-2 focus:ring-offset-[#0A1128] transition-colors"
            >
              <option value="Project Studio Intake">Project Studio Intake</option>
              <option value="Educational Access">Educational Access</option>
              <option value="General Technical Consultation">General Technical Consultation</option>
            </select>
          </div>

          {/* Project Notes / Details */}
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">
              Project Notes / Details <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 border border-slate-500 rounded p-2 text-sm text-white outline-none focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c] focus:ring-offset-2 focus:ring-offset-[#0A1128] transition-colors"
              placeholder="Brief description of your request..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="bg-[#c9a24c] hover:bg-[#b8913b] text-[#0A1128] font-bold text-xs py-2.5 px-5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A1128]"
            >
              Submit Intake Request
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 underline focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
            >
              Reset Form
            </button>
          </div>
        </form>
      )}
    </div>
  );
}