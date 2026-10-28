import { HOSTED_PRACTICE, recoveryMailbox } from './runtimeProfile';
import { useRef, useState, type FormEvent } from 'react';
import { loginAlias, passwordProblem, resolveLoginEmail } from './client';

export type AccountAction = 'login' | 'forgot' | 'reset' | 'change';
const titles = { login: 'Welcome back', forgot: 'Recover your account', reset: 'Choose a new password', change: 'Change your password' };
const labels = { login: 'Sign in', forgot: 'Send recovery instructions', reset: 'Reset password', change: 'Change password' };
export default function AccountForms({ action, onSubmit, notice, busy }: {
  action: AccountAction; onSubmit: (values: { email: string; password: string; current: string }) => Promise<void>;
  notice: string; busy: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get('email') ?? '').trim().toLowerCase();
    const password = String(fields.get('password') ?? '');
    const current = String(fields.get('current') ?? '');
    if ((action === 'login' || action === 'forgot') && !resolveLoginEmail(email)) {
      setError(HOSTED_PRACTICE ? 'Use your authorized practice account email.' : 'Use the configured local alias or an authorized synthetic account ending in .invalid.'); return;
    }
    if (action === 'reset' || action === 'change') {
      const problem = passwordProblem(password);
      if (problem) { setError(problem); return; }
      if (password !== fields.get('confirm')) { setError('The new passwords do not match.'); return; }
    }
    setError('');
    // Remove password fields before awaiting any request; React never stores their values.
    form.reset();
    await onSubmit({ email, password, current });
  }
  return <section className="sp-form-card" aria-labelledby="form-title">
    <p className="sp-eyebrow">Individual account access</p>
    <h1 id="form-title" tabIndex={-1}>{titles[action]}</h1>
    <p>{action === 'forgot' ? `Recovery instructions are captured in ${recoveryMailbox} for eligible synthetic accounts. No real email is sent.` :
      action === 'login' ? 'Use an existing synthetic account to explore the connected portal.' : 'After changing your password, sign in again. Existing sessions will end.'}</p>
    {notice ? <p className="sp-message" role="status">{notice}</p> : null}
    {error ? <p className="sp-error" role="alert">{error}</p> : null}
    <form ref={formRef} onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy}>
        {(action === 'login' || action === 'forgot') ? <><label htmlFor="account-email">Account email</label><input id="account-email" name="email" type="email" autoComplete="username" defaultValue={loginAlias?.loginEmail ?? ''} required maxLength={150} />{loginAlias ? <p className="sp-note">Your preferred email is a local alias for your existing synthetic test account. Recovery stays in the local test mailbox. The alias grants no additional permissions.</p> : null}</> : null}
        {action === 'change' ? <><label htmlFor="current-password">Current password</label><input id="current-password" name="current" type="password" autoComplete="current-password" required /></> : null}
        {action !== 'forgot' ? <><label htmlFor="account-password">{action === 'login' ? 'Password' : 'New password'}</label><input id="account-password" name="password" type="password" autoComplete={action === 'login' ? 'current-password' : 'new-password'} required aria-describedby={action === 'login' ? undefined : 'password-guidance'} /></> : null}
        {(action === 'reset' || action === 'change') ? <><p id="password-guidance" className="sp-note">At least 12 characters; at most 72 UTF-8 bytes. Spaces and password managers are welcome.</p><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirm" type="password" autoComplete="new-password" required /></> : null}
        <button className="sp-primary" type="submit">{busy ? 'Please wait…' : labels[action]}</button>
      </fieldset>
    </form>
    <nav aria-label="Account navigation" className="sp-account-links">
      {action === 'login' ? <a href="/forgot-password">Forgot your password?</a> : <a href="/login">Back to sign in</a>}
      {action === 'change' ? <a href="/dashboard">Back to dashboard</a> : null}
    </nav>
    <p className="sp-note">Invitations, registration and privileged account controls are closed.</p>
  </section>;
}
