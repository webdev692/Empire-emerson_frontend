# PR #27 stabilization guide

This document records the local, non-deploying stabilization work for PR #27. It does not authorize a merge, deployment, production configuration change, Google Form change, live database migration, or secret rotation.

## Pinned JavaScript toolchain

- Node.js: `22.23.1`
- npm: `11.17.0`
- Deno for Edge checks: `2.8.1`

Each application declares the same Node/npm versions. The repository `.nvmrc` is the local Node source of truth, and CI verifies both versions before installation.

## Deterministic application checks

Run these commands inside each of `Emerson_Empire`, `Agency_LandingPage`, `EPDG-Landing-Page`, and `epdg`:

```text
npm ci --no-audit --no-fund
npm run build
npm run lint
npm run smoke
```

`npm run smoke` verifies the built entry point plus source-level application-specific stabilization guardrails. It is not a browser end-to-end test. Image-optimization scripts are not part of verification because they rewrite tracked assets.

Edge checks are intentionally separate from browser-app ESLint:

```text
node --test Emerson_Empire/supabase/functions/send-consultation-email/lead-store.test.mjs Agency_LandingPage/supabase/functions/send-consultation-email/lead-store.test.mjs
deno lint Emerson_Empire/supabase/functions/send-consultation-email Agency_LandingPage/supabase/functions/send-consultation-email
deno check --frozen --config Emerson_Empire/supabase/functions/send-consultation-email/deno.json --lock Emerson_Empire/supabase/functions/send-consultation-email/deno.lock Emerson_Empire/supabase/functions/send-consultation-email/index.ts
deno check --frozen --config Agency_LandingPage/supabase/functions/send-consultation-email/deno.json --lock Agency_LandingPage/supabase/functions/send-consultation-email/deno.lock Agency_LandingPage/supabase/functions/send-consultation-email/index.ts
```

## Environment-variable names

Values belong only in the appropriate local or hosted environment. Never place a privileged key in a `VITE_` variable.

### Emerson Empire and Agency browser builds

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (legacy name currently used by the code; migration to a publishable key requires coordinated production work)

### EPDG platform browser build

- `VITE_API_URL`
- `VITE_MOCK_AUTH`
- `VITE_EMPIRE_URL`

Mock mode must be disabled in any production build. The canonical API origin remains a blocked backend decision; this PR must not change the production value.

The platform accepts `VITE_API_URL` only when it is a credential-free HTTP(S) origin. Missing or invalid configuration causes API requests and all active registration forms to fail closed; no fallback host is embedded in the client.

`epdg/netlify.toml` still contains a legacy production build Node pin that does not match the repository toolchain. It remains unchanged because altering production environment configuration requires deployment-owner confirmation.

### Supabase Edge Function

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (legacy hosted name currently used by the function)
- `LEAD_NOTIFICATION_EMAIL`
- `ALLOWED_ORIGINS`

The notification recipient and approved origin list require founder/backend confirmation. Do not copy any privileged Edge value into a frontend environment file.

## Completed local safeguards

- **Request-size enforcement:** the Edge Function reads the request stream with a 20,000-byte cap, returns `413` when the observed bytes exceed it, and does not trust `Content-Length` as the boundary. The focused regression test covers a misleading header.
- **Response-specific PostgREST preferences:** rate-limit RPC calls preserve their boolean response; only lead inserts request a minimal response.
- **Notification failure response:** once a lead is stored, admin-email failure is logged and returned as successful storage with `notificationStatus: unavailable`, avoiding duplicate-submission retries.
- **Dependency pinning:** all direct npm specifications are exact, npm lockfiles are used with `npm ci`, and Edge transitive dependencies are frozen with committed Deno lockfiles.

## Prepared follow-up work that remains unapplied

- **Idempotent lead intake:** introduce a client submission identifier and a unique database constraint in a new reviewed migration. Do not create or apply the live migration until the general intake workflow and schema are approved.
- **Durable notifications:** store notification state or use an outbox so failed delivery can be audited and retried after the lead is saved.
- **Workflow supply-chain pinning:** separately review pinning third-party GitHub Actions by commit SHA before changing workflow trust policy.
- **Bot protection:** verify a selected challenge provider server-side only after the provider and credentials are approved.
- **Supabase API-key migration:** support current publishable/secret keys in a coordinated change before legacy keys are retired; do not rotate or replace production keys in this PR.

## Explicitly blocked decisions

- Canonical EPDG backend origin
- Production environment-variable changes
- Deployment build-environment alignment
- General inquiry recipient and intake workflow
- Internship form URL or Google Form permissions
- Canonical company domains
- Bot-protection provider and credentials
- Final role and permissions matrix
- Live Supabase migration application
- Legal-page content and destinations

## Preview verification rule

A canceled deploy context is not a successful preview. A site is verified only when its latest PR-head deployment exposes a usable preview URL and the application checks above pass for the same commit.
