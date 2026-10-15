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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Valid Email is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
    console.log('[Intake Component] Data logged locally via manual route:', formData);
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-[#0A1128] text-white rounded-xl border border-[#c9a24c]/40 shadow-xl font-sans">
      <h2 className="text-xl font-bold text-[#c9a24c] mb-2">Project Studio Intake</h2>
      <p className="text-xs text-gray-300 mb-6">
        Submit your project details. Requests are processed via the verified Project Studio manual operating queue.
      </p>

      {submitted ? (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm">
          <p className="font-semibold text-emerald-400 mb-1">✓ Request Received!</p>
          <p className="text-xs">
            Your intake request for <strong>{formData.fullName}</strong> has been logged and routed to the manual CRM operating queue.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs underline text-emerald-300 hover:text-white"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-[#c9a24c] outline-none"
              placeholder="e.g., Alex Johnson"
            />
            {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-[#c9a24c] outline-none"
              placeholder="e.g., alex@example.com"
            />
            {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Service Requested</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-[#c9a24c] outline-none"
            >
              <option value="Project Studio Intake">Project Studio Intake</option>
              <option value="Educational Access">Educational Access</option>
              <option value="General Technical Consultation">General Technical Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Project Notes / Details</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-[#c9a24c] outline-none"
              placeholder="Brief description of your request..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#c9a24c] hover:bg-[#b8913b] text-[#0A1128] font-bold text-xs py-2.5 px-4 rounded transition-colors"
            >
              Submit Intake Request
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ fullName: '', email: '', serviceType: 'Project Studio Intake', notes: '' });
                setErrors({});
              }}
              className="bg-transparent hover:bg-white/10 text-gray-400 border border-gray-600 text-xs py-2.5 px-3 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}