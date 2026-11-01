export interface LocalLoginAlias { loginEmail: string; fixtureEmail: string }

export function resolveLocalLoginEmail(email: string, alias: LocalLoginAlias | null): string | null {
  if (/^[^\s@]+@[^\s@]+\.invalid$/.test(email)) return email;
  // This mapping is for the private local rehearsal only.
  if (alias?.fixtureEmail === 'learner-a@epdg.invalid' && email === alias.loginEmail) return alias.fixtureEmail;
  return null;
}
