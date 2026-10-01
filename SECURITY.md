# Security policy

## Supported source

Security fixes are prepared against the current `main` branch. Older commits,
deploy previews, and provider snapshots are not treated as supported releases.

## Report a vulnerability privately

Do not disclose a suspected vulnerability, credential, private record, or
production configuration value in a public issue, discussion, pull request, or
log. Use this repository's GitHub **Security** tab and its private vulnerability
reporting flow when that option is available. If it is unavailable, contact the
repository owner through an already established private channel and ask for a
private reporting path; do not guess an email address or recipient.

Include only the minimum information needed to reproduce the problem:

- the affected application or repository path;
- the commit or public deployment involved;
- synthetic, non-sensitive reproduction steps;
- the observed and expected security boundary; and
- a concise impact assessment.

Never include tokens, passwords, connection strings, service-role keys, private
keys, production records, intern information, applications, evaluations, or
private messages. If a credential may have been exposed, identify it by variable
name only and rotate it through the owning provider after authorization.

## Repository security boundaries

- The browser applications may use only intentionally public configuration.
- Supabase service-role or secret keys are server-side only.
- `VITE_MOCK_AUTH` must never be enabled in a production build.
- Provider mappings, environment values, deployments, and database policy
  changes require authenticated owner review.
- Reproduction must not submit public forms, send email, write production data,
  run live migrations, or expose private records.

Non-sensitive correctness and accessibility defects may still be reported in a
normal GitHub issue.
