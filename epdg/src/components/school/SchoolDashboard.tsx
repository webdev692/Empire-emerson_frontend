// src/components/school/SchoolDashboard.tsx

import { useState } from 'react';

type PipelineStage = {
  name: string;
  count: number;
  color: string;
};

type Completion = {
  student: string;
  company: string;
  date: string;
};

type PendingStudent = {
  name: string;
  status: string;
};

const SchoolDashboard = () => {
  const [pipelineFilter, setPipelineFilter] = useState<string>('all');

  const stats = [
    {
      label: 'Active Students',
      value: 12,
    },
    {
      label: 'Pending Placement',
      value: 3,
    },
    {
      label: 'Completed',
      value: 8,
    },
    {
      label: 'Total',
      value: 23,
    },
  ];

  const pipelineStages: PipelineStage[] = [
    {
      name: 'Pending',
      count: 3,
      color: 'bg-[#F59E0B]',
    },
    {
      name: 'Invited',
      count: 2,
      color: 'bg-[#7C4FC4]',
    },
    {
      name: 'Onboarding',
      count: 2,
      color: 'bg-[#A78BCC]',
    },
    {
      name: 'Active',
      count: 12,
      color: 'bg-[#22C55E]', // bright green
    },
    {
      name: 'Completed',
      count: 8,
      color: 'bg-[#16A34A]/60', // darker muted green
    },
  ];
  const recentCompletions: Completion[] = [
    {
      student: 'Brian Otieno',
      company: 'Safaricom',
      date: 'May 21, 2026',
    },
    {
      student: 'Grace Njeri',
      company: 'KCB Group',
      date: 'May 18, 2026',
    },
    {
      student: 'Kevin Mwangi',
      company: 'Andela',
      date: 'May 10, 2026',
    },
  ];

  const pendingStudents: PendingStudent[] = [
    {
      name: 'Faith Achieng',
      status: 'Awaiting admin verification',
    },
    {
      name: 'James Kariuki',
      status: 'Placement review pending',
    },
    {
      name: 'Mercy Wambui',
      status: 'Documents under review',
    },
  ];

  return (
    <div className='min-h-screen bg-[#0D0618] px-4 py-6 text-white sm:px-6 lg:px-10'>
      {/* Header */}
      <div className='mb-8 flex flex-col gap-4 rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-4'>
          <div className='h-16 w-16 rounded-xl bg-[#F59E0B]' />

          <div>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-2xl font-bold'>
                University of Nebraska
              </h1>

              <span className='rounded-full bg-[#22C55E]/20 px-3 py-1 text-sm font-medium text-[#22C55E]'>
                Verified Partner ✓
              </span>
            </div>

            <p className='mt-2 text-sm text-[#A78BCC]'>
              Coordinator: Dr. Mary Wanjiku
            </p>
          </div>
        </div>

        <div className='text-sm text-[#A78BCC]'>
          Institution Dashboard Portal
        </div>
      </div>

      {/* Stats */}
      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-5'
          >
            <p className='text-sm text-[#A78BCC]'>{stat.label}</p>

            <h2 className='mt-3 text-3xl font-bold text-white'>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="mb-8 rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Student Status Pipeline
          </h2>

          <p className="mt-1 text-sm text-[#A78BCC]">
            Track student progression across internship stages
          </p>

          <div className="mt-3 text-sm text-[#A78BCC]">
            Current Filter:
            <span className="ml-2 font-semibold text-white capitalize">
              {pipelineFilter}
            </span>
          </div>
        </div>

        {/* PIPELINE ROW */}
        <div className="flex w-full items-center justify-between gap-2">
          {pipelineStages.map((stage, index) => (
            <div key={stage.name} className="flex flex-1 items-center">

              {/* Stage Button */}
              <button
                onClick={() => setPipelineFilter(stage.name)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition hover:-translate-y-1 ${pipelineFilter === stage.name
                  ? "border-[#7C4FC4] bg-[#221041]"
                  : "border-[#3A1D73] bg-[#0D0618]"
                  }`}
              >
                {/* LEFT: dot + name inline */}
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                  <span className="text-sm text-[#A78BCC]">
                    {stage.name}
                  </span>
                </div>

                {/* RIGHT: count */}
                <span className="text-lg font-bold text-white">
                  {stage.count}
                </span>
              </button>

              {/* Arrow */}
              {index !== pipelineStages.length - 1 && (
                <span className="mx-2 text-[#6B5A8E] text-lg">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        {/* Recent Completions */}
        <div className='rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-6'>
          <h2 className='mb-6 text-xl font-semibold'>
            Recent Completions
          </h2>

          <div className='space-y-4'>
            {recentCompletions.map((completion) => (
              <div
                key={completion.student}
                className='rounded-xl border border-[#3A1D73] bg-[#0D0618] p-4'
              >
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <h3 className='font-semibold text-white'>
                      {completion.student}
                    </h3>

                    <p className='text-sm text-[#A78BCC]'>
                      {completion.company}
                    </p>

                    <p className='mt-1 text-xs text-[#A78BCC]'>
                      Completed on {completion.date}
                    </p>
                  </div>

                  <button
                    type='button'
                    className='text-sm font-medium text-[#7C4FC4] transition hover:underline'
                  >
                    View Certificate →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className='rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>
              Pending Actions
            </h2>

            <span className='rounded-full bg-[#F59E0B]/20 px-3 py-1 text-xs font-medium text-[#F59E0B]'>
              Needs Attention
            </span>
          </div>

          <div className='space-y-4'>
            {pendingStudents.map((student) => (
              <div
                key={student.name}
                className='rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/10 p-4'
              >
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <h3 className='font-semibold text-white'>
                      {student.name}
                    </h3>

                    <p className='text-sm text-[#A78BCC]'>
                      {student.status}
                    </p>
                  </div>

                  <button
                    type='button'
                    className='rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90'
                  >
                    Check Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8 rounded-2xl border border-[#3A1D73] bg-[#1A0D35] p-6'>
        <h2 className='mb-6 text-xl font-semibold'>
          Quick Actions
        </h2>

        <div className='flex flex-col gap-4 md:flex-row'>
          <button
            type='button'
            className='rounded-xl bg-[#7C4FC4] px-5 py-3 font-medium text-white transition hover:opacity-90'
          >
            + Register Student
          </button>

          <button
            type='button'
            className='rounded-xl border border-[#3A1D73] bg-[#0D0618] px-5 py-3 font-medium text-white transition hover:border-[#7C4FC4]'
          >
            👥 View All Students
          </button>

          <button
            type='button'
            className='rounded-xl border border-[#3A1D73] bg-[#0D0618] px-5 py-3 font-medium text-white transition hover:border-[#7C4FC4]'
          >
            📥 Download Report
          </button>
        </div>
      </div>
    </div>
  );

};

export default SchoolDashboard;
