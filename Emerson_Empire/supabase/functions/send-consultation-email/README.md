# Lead inquiry Edge Function

This function requires these server-side environment variable names:

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

It also recognizes these optional environment variable names:

- `LEAD_NOTIFICATION_EMAIL`
- `ALLOWED_ORIGINS`

Values belong in Supabase project secrets or the approved local development
environment. Never place secret values in this directory or in client-side
environment variables.

No live secrets, database migrations, recipient settings, or origin settings
are changed by this function's repository tests.

The handler enforces a 20,000-byte limit against bytes read from the request
stream and returns `413` when that boundary is exceeded. It does not rely on
the caller-provided `Content-Length` header.

Lead storage uses the service-role-only `store_lead_request` RPC installed by
`20260725230658_add_lead_idempotency_contract.sql`. The RPC serializes
identical requests, checks duplicates before consuming another rate-limit
slot, and writes the request key and lead in one transaction. Callers may send
an `Idempotency-Key` header; otherwise the function derives a privacy-safe
daily key from the normalized payload. Neither raw key nor service credential
is returned.

Requests without an exact configured `Origin` are rejected. User-controlled
labels are stripped of email-header control characters before notification
subjects are created.

Run the focused helper regression tests with the repository-pinned Node:

```text
node --test lead-store.test.mjs notification.test.mjs request-security.test.mjs
```
