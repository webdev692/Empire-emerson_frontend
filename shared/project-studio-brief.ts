export function projectBriefText(goal: string, process: string, outcome: string) {
  const section = (value: string) => value.trim() || '(To be completed)';
  return `PROJECT STUDIO — PERSONAL PLANNING BRIEF\n\nMy goal\n${section(goal)}\n\nMy current process or materials\n${section(process)}\n\nThe outcome I want to discuss\n${section(outcome)}\n\nThis file is a personal draft. It has not been submitted to TEE or TEA.\nIt does not reserve capacity, accept a project or create a contract.\nDo not include identity documents, financial accounts, tax records, personnel files or other sensitive information.\n`;
}
