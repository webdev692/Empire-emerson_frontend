# Security, Privacy, and Release Boundaries

1. **No production secrets.** Never commit passwords, tokens, API keys, private keys, service-role keys, session cookies, `.env` files containing values, or copied provider credentials.
2. **No private people data.** Do not commit applicant/intern phone numbers, emails, résumés, assessment responses, school forms, HR notes, WhatsApp content, or private support records.
3. **Synthetic data only for exercises.** Use clearly fictional people and records or approved public-source information.
4. **No production writes.** Training exercises may not write to production databases, CRMs, email systems, social accounts, or customer systems.
5. **Preview ≠ publication.** Netlify/Lovable previews are review environments, not authorization to publish or announce work.
6. **PR destination.** Intern exercise PRs target `training/fall-2026-sandbox`. Production PRs require a separate approved release process.
7. **AI use.** Review AI-generated code, disclose material AI/tool assistance in the portfolio record, and never paste secrets/private records into unapproved AI tools.
8. **Incident rule.** If a secret or private record is exposed, stop work, do not copy it further, notify the technical lead/founder, rotate/revoke affected credentials as directed, and document the incident in the restricted process.
