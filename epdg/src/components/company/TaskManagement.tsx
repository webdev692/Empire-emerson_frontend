import { useState } from 'react';



type TaskStatus = 'pending' | 'in-progress' | 'done';
type Priority   = 'high' | 'medium' | 'low';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  assignedInitials: string;
  department: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  points: number;
  overdue: boolean;
}



const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Build Login Page UI',
    assignedTo: 'Amara Osei',
    assignedInitials: 'AO',
    department: 'Frontend',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-06-05',
    points: 20,
    overdue: false,
  },
  {
    id: 2,
    title: 'Design Dashboard Wireframes',
    assignedTo: 'Cynthia Achieng',
    assignedInitials: 'CA',
    department: 'UX',
    priority: 'high',
    status: 'done',
    dueDate: '2026-05-28',
    points: 15,
    overdue: false,
  },
  {
    id: 3,
    title: 'Set Up PostgreSQL Schema',
    assignedTo: 'Brian Mwangi',
    assignedInitials: 'BM',
    department: 'Backend',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-05-20',
    points: 25,
    overdue: true,
  },
  {
    id: 4,
    title: 'Write API Documentation',
    assignedTo: 'Brian Mwangi',
    assignedInitials: 'BM',
    department: 'Backend',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-05-18',
    points: 10,
    overdue: true,
  },
  {
    id: 5,
    title: 'Implement Notification System',
    assignedTo: 'Amara Osei',
    assignedInitials: 'AO',
    department: 'Frontend',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-06-12',
    points: 20,
    overdue: false,
  },
  {
    id: 6,
    title: 'User Research Interviews',
    assignedTo: 'Cynthia Achieng',
    assignedInitials: 'CA',
    department: 'UX',
    priority: 'medium',
    status: 'done',
    dueDate: '2026-05-30',
    points: 15,
    overdue: false,
  },
  {
    id: 7,
    title: 'Integrate Payment Gateway',
    assignedTo: 'Daniel Kipchoge',
    assignedInitials: 'DK',
    department: 'Backend',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-06-10',
    points: 30,
    overdue: false,
  },
  {
    id: 8,
    title: 'Quarterly Analytics Report',
    assignedTo: 'Daniel Kipchoge',
    assignedInitials: 'DK',
    department: 'Analytics',
    priority: 'low',
    status: 'pending',
    dueDate: '2026-06-15',
    points: 10,
    overdue: false,
  },
];

const internNames = ['All Interns', 'Amara Osei', 'Brian Mwangi', 'Cynthia Achieng', 'Daniel Kipchoge'];



const priorityStyle = (p: Priority): string => {
  switch (p) {
    case 'high':   return 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40';
    case 'medium': return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40';
    case 'low':    return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40';
  }
};

const statusStyle = (s: TaskStatus): string => {
  switch (s) {
    case 'pending':     return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40';
    case 'in-progress': return 'bg-[#7C4FC4]/20 text-[#7C4FC4] border border-[#7C4FC4]/40';
    case 'done':        return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40';
  }
};

const statusLabel: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  done: 'Done',
};

const avatarColor = (initials: string): string => {
  const colors = ['bg-[#7C4FC4]', 'bg-[#22C55E]/80', 'bg-[#F59E0B]/80', 'bg-[#EF4444]/80'];
  return colors[initials.charCodeAt(0) % colors.length];
};



export default function TaskManagement() {

  
  const [tasks, setTasks]                 = useState<Task[]>(mockTasks);
  const [showModal, setShowModal]         = useState(false);
  const [internFilter, setInternFilter]   = useState('all');
  const [statusFilter2, setStatusFilter2] = useState<'all' | TaskStatus>('all');

  
  const [formTitle, setFormTitle]             = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAssignTo, setFormAssignTo]       = useState('');
  const [formPriority, setFormPriority]       = useState<Priority>('medium');
  const [formDueDate, setFormDueDate]         = useState('');
  const [formPoints, setFormPoints]           = useState<number>(10);
  const [formError, setFormError]             = useState('');

 
  const filteredTasks = tasks.filter((t) => {
    const internMatch = internFilter === 'all' || t.assignedTo === internFilter;
    const statusMatch = statusFilter2 === 'all' || t.status === statusFilter2;
    return internMatch && statusMatch;
  });

  
  const statTotal    = 24;
  const statPending  = 8;
  const statProgress = 6;
  const statDone     = 8;
  const statOverdue  = 2;

  
  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormAssignTo('');
    setFormPriority('medium');
    setFormDueDate('');
    setFormPoints(10);
    setFormError('');
  };

  const handleOpenModal  = () => { resetForm(); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); resetForm(); };

  const handleSubmit = () => {
    if (!formTitle.trim()) { setFormError('Task title is required.'); return; }
    if (!formAssignTo)     { setFormError('Please assign this task to an intern.'); return; }

    const newTask: Task = {
      id:               Date.now(),
      title:            formTitle.trim(),
      assignedTo:       formAssignTo,
      assignedInitials: formAssignTo.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      department:       'General',
      priority:         formPriority,
      status:           'pending',
      dueDate:          formDueDate,
      points:           formPoints,
      overdue:          false,
    };

    setTasks((prev) => [...prev, newTask]);
    handleCloseModal();
  };

  const statusFilters: Array<'all' | TaskStatus> = ['all', 'pending', 'in-progress', 'done'];
  const statusFilterLabel: Record<'all' | TaskStatus, string> = {
    all: 'All', pending: 'Pending', 'in-progress': 'In Progress', done: 'Done',
  };

  return (
    <div
      className="min-h-screen bg-[#0D0618] text-white p-4 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
   
      <div className="flex flex-col gap-3 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Management</h1>
          <p className="text-[#A78BCC] text-sm mt-1">Assign, track and manage intern tasks</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap self-start lg:self-auto"
        >
          + Create New Task
        </button>
      </div>

    
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-white text-2xl font-bold">{statTotal}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Total</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#F59E0B] text-2xl font-bold">{statPending}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Pending</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#7C4FC4] text-2xl font-bold">{statProgress}</p>
          <p className="text-[#A78BCC] text-xs mt-1">In Progress</p>
        </div>
        <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-4 text-center">
          <p className="text-[#22C55E] text-2xl font-bold">{statDone}</p>
          <p className="text-[#A78BCC] text-xs mt-1">Done</p>
        </div>
        <div className="bg-red-900/30 border border-[#EF4444] rounded-2xl p-4 text-center col-span-2 lg:col-span-1">
          <p className="text-[#EF4444] text-2xl font-bold">{statOverdue}</p>
          <p className="text-[#EF4444]/70 text-xs mt-1">Overdue</p>
        </div>
      </div>

      
      <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-[#A78BCC] text-sm whitespace-nowrap">Intern:</label>
          <select
            value={internFilter}
            onChange={(e) => setInternFilter(e.target.value)}
            className="bg-[#1A0D35] border border-[#3A1D73] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
          >
            {internNames.map((name) => (
              <option key={name} value={name === 'All Interns' ? 'all' : name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter2(s)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter2 === s
                  ? 'bg-[#7C4FC4] text-white'
                  : 'bg-[#1A0D35] border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4]'
              }`}
            >
              {statusFilterLabel[s]}
            </button>
          ))}
        </div>
      </div>

     
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 && (
          <div className="bg-[#1A0D35] border border-[#3A1D73] rounded-2xl p-8 text-center">
            <p className="text-[#A78BCC]">No tasks match the selected filters.</p>
          </div>
        )}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-[#1A0D35] rounded-2xl p-5 border-l-4 ${
              task.overdue
                ? 'border-l-[#EF4444] border-t border-r border-b border-[#EF4444]/40'
                : 'border-l-[#3A1D73] border-t border-r border-b border-[#3A1D73]'
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${avatarColor(task.assignedInitials)}`}>
                  {task.assignedInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{task.title}</h3>
                    {task.overdue && (
                      <span className="text-xs bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 px-2 py-0.5 rounded-full font-medium">
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-[#A78BCC]">
                    <span className="text-white">{task.assignedTo}</span>
                    <span>·</span>
                    <span>{task.department}</span>
                    <span>·</span>
                    <span className={task.overdue ? 'text-[#EF4444] font-medium' : 'text-[#A78BCC]'}>
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                    <span>·</span>
                    <span className="text-[#F59E0B]">⭐ {task.points} pts</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${priorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle(task.status)}`}>
                  {statusLabel[task.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

     
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
              <h2 className="text-xl font-bold text-white">Create New Task</h2>
              <button
                onClick={handleCloseModal}
                className="text-[#A78BCC] hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-xl"
              >×</button>
            </div>

            {formError && (
              <div className="bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-sm px-4 py-2.5 rounded-xl mb-4">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">
                  Task Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => { setFormTitle(e.target.value); setFormError(''); }}
                  placeholder="e.g. Build Login Page UI"
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe what the intern needs to do..."
                  rows={3}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white placeholder-[#A78BCC]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">
                  Assign To <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formAssignTo}
                  onChange={(e) => { setFormAssignTo(e.target.value); setFormError(''); }}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                >
                  <option value="">Select intern</option>
                  {internNames.filter((n) => n !== 'All Interns').map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#A78BCC] mb-1">Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as Priority)}
                  className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A78BCC] mb-1">Points</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    className="w-full bg-[#0D0618] border border-[#3A1D73] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C4FC4] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 border border-[#3A1D73] text-[#A78BCC] hover:text-white hover:border-[#7C4FC4] font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#7C4FC4] hover:bg-[#6a3db0] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}