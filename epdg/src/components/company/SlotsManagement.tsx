import { useState } from 'react';

interface Slot {
    id: number;
    title: string;
    department: string;
    duration: number; 
    stipend: number;
    deadline: string;
    status: 'Open' | 'Filled' | 'Closed';
    applicantCount: number;
    description: string;
    isRemote: boolean;
    maxSlots: number;
}

const mockSlots: Slot[] = [
    {
        id: 1,
        title: 'Frontend Developer Intern',
        department: 'Frontend',
        duration: 12,
        stipend: 15000,
        deadline: '2026-06-30',
        status: 'Open',
        applicantCount: 8,
        description: 'Work on React/TypeScript UI components for our main product.',
        isRemote: true,
        maxSlots: 2,

    },
    {
    id: 2,
    title: 'Backend Engineering Intern',
    department: 'Backend',
    duration: 16,
    stipend: 18000,
    deadline: '2026-07-15',
    status: 'Open',
    applicantCount: 5,
    description: 'Build and maintain REST APIs using Node.js and PostgreSQL.',
    isRemote: false,
    maxSlots: 1,
  },
  {
    id: 3,
    title: 'UX Research Intern',
    department: 'UX',
    duration: 8,
    stipend: 0,
    deadline: '2026-05-31',
    status: 'Filled',
    applicantCount: 12,
    description: 'Conduct user interviews and usability testing sessions.',
    isRemote: true,
    maxSlots: 1,
  },
  {
    id: 4,
    title: 'Data Analytics Intern',
    department: 'Analytics',
    duration: 10,
    stipend: 12000,
    deadline: '2026-06-01',
    status: 'Closed',
    applicantCount: 3,
    description: 'Analyse programme metrics and generate weekly reports.',
    isRemote: false,
    maxSlots: 1,
  },

];

const statusStyle = (status: Slot['status']): string => {
  switch (status) {
    case 'Open':
      return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40';
    case 'Filled':
      return 'bg-[#7C4FC4]/20 text-[#7C4FC4] border border-[#7C4FC4]/40';
    case 'Closed':
      return 'bg-[#A78BCC]/10 text-[#A78BCC] border border-[#A78BCC]/30';
  }
};

export default function SlotsManagement() {
  const [slots, setSlots] = useState<Slot[]>(mockSlots);
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState<number>(8);
  const [formStipend, setFormStipend] = useState<number>(0);
  const [formDeadline, setFormDeadline] = useState('');
  const [formIsRemote, setFormIsRemote] = useState(false);
  const [formMaxSlots, setFormMaxSlots] = useState<number>(1);
  const [formError, setFormError] = useState('');

  const openCount = slots.filter((s) => s.status === 'Open').length;
  const filledCount = slots.filter((s) => s.status === 'Filled').length;
  const totalApplied = slots.reduce((sum, s) => sum + s.applicantCount, 0);

  const resetForm = () => {
    setFormTitle('');
    setFormDepartment('');
    setFormDescription('');
    setFormDuration(8);
    setFormStipend(0);
    setFormDeadline('');
    setFormIsRemote(false);
    setFormMaxSlots(1);
    setFormError('');
  };

  const handleOpenModal = () => { resetForm(); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); resetForm(); };

  const handleSubmit = () => {
    if (!formTitle.trim()) { setFormError('Slot title is required.'); return; }
    if (!formDepartment.trim()) { setFormError('Department is required.'); return; }

    const newSlot: Slot = {
      id: Date.now(),
      title: formTitle.trim(),
      department: formDepartment.trim(),
      duration: formDuration,
      stipend: formStipend,
      deadline: formDeadline,
      status: 'Open',
      applicantCount: 0,
      description: formDescription.trim(),
      isRemote: formIsRemote,
      maxSlots: formMaxSlots,
    };

    setSlots([...slots, newSlot]);
    handleCloseModal();
  };

  const handleCloseSlot = (id: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Closed' as const } : s))
    );
    setOpenMenuId(null);
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      onClick={() => setOpenMenuId(null)}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Internship Slots</h1>
          <p className="text-[#A78BCC] text-sm mt-1">
            Manage your open, filled and closed internship positions
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-xl px-4 py-2 text-center">
            <p className="text-[#22C55E] text-lg font-bold">{openCount}</p>
            <p className="text-[#A78BCC] text-xs">Open</p>
          </div>
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-xl px-4 py-2 text-center">
            <p className="text-[#7C4FC4] text-lg font-bold">{filledCount}</p>
            <p className="text-[#A78BCC] text-xs">Filled</p>
          </div>
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-xl px-4 py-2 text-center">
            <p className="text-white text-lg font-bold">{totalApplied}</p>
            <p className="text-[#A78BCC] text-xs">Total Applied</p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          + Post New Slot
        </button>
      </div>

      {/* Slots List */}
      <div className="flex flex-col gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-white font-bold text-lg">{slot.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle(slot.status)}`}>
                    {slot.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-[#7C4FC4]/20 text-[#A78BCC] border border-[#7C4FC4]/30 text-xs px-2.5 py-0.5 rounded-full">
                    {slot.department}
                  </span>
                  <span className="bg-[#A78BCC]/10 text-[#A78BCC] text-xs px-2.5 py-0.5 rounded-full">
                    {slot.duration} weeks
                  </span>
                  {slot.isRemote && (
                    <span className="bg-[#7C4FC4]/20 text-[#A78BCC] border border-[#7C4FC4]/30 text-xs px-2.5 py-0.5 rounded-full">
                      Remote
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-[#A78BCC]">
                  <span>💰 {slot.stipend === 0 ? 'Unpaid' : `KES ${slot.stipend.toLocaleString()}/mo`}</span>
                  <span>📅 Deadline: {slot.deadline ? new Date(slot.deadline).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                  <span>👥 {slot.applicantCount} applicant{slot.applicantCount !== 1 ? 's' : ''}</span>
                  <span>🪑 {slot.maxSlots} slot{slot.maxSlots !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                <button className="text-[#7C4FC4] border border-[#7C4FC4]/50 hover:bg-[#7C4FC4]/10 text-sm font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                  View Applications →
                </button>

                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === slot.id ? null : slot.id); }}
                    className="text-[#A78BCC] hover:text-white hover:bg-white/10 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors"
                  >
                    ⋯
                  </button>

                  {openMenuId === slot.id && (
                    <div
                      className="absolute right-0 top-10 bg-[#1A0D35] border border-[#3A1D73] rounded-xl shadow-xl z-30 min-w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setOpenMenuId(null)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-t-xl transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleCloseSlot(slot.id)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-b-xl transition-colors"
                      >
                        🔒 Close Slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Post New Slot</h2>
              <button
                onClick={handleCloseModal}
                className="text-[#A78BCC] hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-sm px-4 py-2.5 rounded-xl mb-4">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">
                  Slot Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => { setFormTitle(e.target.value); setFormError(''); }}
                  placeholder="e.g. Frontend Development Intern"
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">
                  Department <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formDepartment}
                  onChange={(e) => { setFormDepartment(e.target.value); setFormError(''); }}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                >
                  <option value="">Select department</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="UX">UX</option>
                  <option value="UI">UI</option>
                  <option value="Analytics">Analytics</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the role and responsibilities..."
                  rows={3}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Duration (weeks)</label>
                  <input type="number" min={1} value={formDuration} onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Stipend (KES/mo, 0=unpaid)</label>
                  <input type="number" min={0} value={formStipend} onChange={(e) => setFormStipend(Number(e.target.value))}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Application Deadline</label>
                  <input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Max Slots</label>
                  <input type="number" min={1} value={formMaxSlots} onChange={(e) => setFormMaxSlots(Number(e.target.value))}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#0D0618] border border-[#3A1D73] rounded-xl px-4 py-3">
                <span className="text-sm text-white">Remote position</span>
                <button
                  type="button"
                  onClick={() => setFormIsRemote(!formIsRemote)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${formIsRemote ? 'bg-[#7C4FC4]' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formIsRemote ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={handleCloseModal}
                  className="flex-1 border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] font-medium py-2.5 rounded-xl transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  Post Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}