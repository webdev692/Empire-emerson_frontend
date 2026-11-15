export type ProjectBrief = { goal: string; responsibility: string; materials: string; outcome: string; constraints: string; questions: string };

export const briefQuestions: { key: keyof ProjectBrief; label: string }[] = [
  { key: 'goal', label: 'What is your business trying to accomplish?' },
  { key: 'responsibility', label: 'What project or responsibility would you like help with?' },
  { key: 'materials', label: 'What systems or materials do you already use?' },
  { key: 'outcome', label: 'What would a successful result look like?' },
  { key: 'constraints', label: 'Is there a deadline or important business constraint?' },
  { key: 'questions', label: 'What questions should be discussed during scoping?' },
];

export function projectBriefText(brief: ProjectBrief) {
  const section = (value: string) => value.trim() || '(To be completed)';
  return `PROJECT STUDIO — PERSONAL PLANNING BRIEF\n\n${briefQuestions.map(({ key, label }) => `${label}\n${section(brief[key])}`).join('\n\n')}\n\nThis file is a personal draft. It has not been submitted to TEE or TEA.\nSaving a brief does not send a request, reserve project capacity or create a contract.\nDo not include passwords, identity documents, financial accounts, tax records, personnel files or other sensitive information.\n`;
}
