export const roleLayouts = {
  learner: {
    label: 'Learner', title: 'Your learning workspace', description: 'A place for your programs, work, and next steps.',
    sections: ['Active programs', 'Upcoming work', 'Feedback', 'Progress', 'Resources'],
    table: 'Active programs', columns: ['Program', 'Next step', 'Status'],
  },
  mentor: {
    label: 'Instructor / Mentor', title: 'Guide the next step', description: 'A focused view of assigned learning and review work.',
    sections: ['Assigned cohorts', 'Review queue', 'Upcoming deadlines'],
    table: 'Assigned cohorts', columns: ['Cohort', 'Assignment', 'Status'],
  },
  operations: {
    label: 'Operations', title: 'Program delivery workspace', description: 'An overview of delivery coordination and operational work.',
    sections: ['Program delivery overview', 'Pending operational work'],
    table: 'Delivery overview', columns: ['Program', 'Delivery stage', 'Status'],
  },
  school: {
    label: 'School Partner', title: 'Institution workspace', description: 'A scoped place for institution information and authorized reporting.',
    sections: ['Institution overview', 'Authorized-student reporting'],
    table: 'Authorized-student reporting', columns: ['Report', 'Authorized scope', 'Availability'],
  },
} as const;
export type RoleView = keyof typeof roleLayouts;
export type PageView = 'overview' | 'profile' | 'support';
export type StateView = 'empty' | 'loading' | 'unavailable' | 'error';
export const previewNotice = 'Design preview — authentication and participant data are not connected.';
