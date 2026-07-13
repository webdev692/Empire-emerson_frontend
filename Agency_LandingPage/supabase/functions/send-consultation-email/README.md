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

Run the focused helper regression tests with Node 20 or newer:

```text
node --test lead-store.test.mjs
```
