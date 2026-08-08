# PR #27 stabilization guide (historical, merged July 26, 2026)

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
npm test --if-present
npm run smoke
```

`npm run smoke` verifies the built entry point plus source-level application-specific stabilization guardrails. It is not a browser end-to-end test. Image-optimization scripts are not part of verification because they rewrite tracked assets.

Edge checks are intentionally separate from browser-app ESLint:

```text
node scripts/verify-edge-mirrors.mjs
node scripts/scan-credential-patterns.mjs
node --test scripts/lead-rate-limit-migration.test.mjs scripts/lead-idempotency-migration.test.mjs scripts/database-boundary-migration.test.mjs scripts/classes-contract.test.mjs scripts/modal-accessibility.test.mjs Emerson_Empire/supabase/functions/send-consultation-email/lead-store.test.mjs Emerson_Empire/supabase/functions/send-consultation-email/notification.test.mjs Emerson_Empire/supabase/functions/send-consultation-email/request-security.test.mjs Agency_LandingPage/supabase/functions/send-consultation-email/lead-store.test.mjs Agency_LandingPage/supabase/functions/send-consultation-email/notification.test.mjs Agency_LandingPage/supabase/functions/send-consultation-email/request-security.test.mjs
deno lint Emerson_Empire/supabase/functions/send-consultation-email Agency_LandingPage/supabase/functions/send-consultation-email
deno check --frozen --config Emerson_Empire/supabase/functions/send-consultation-email/deno.json --lock Emerson_Empire/supabase/functions/send-consultation-email/deno.lock Emerson_Empire/supabase/functions/send-consultation-email/index.ts
deno check --frozen --config Agency_LandingPage/supabase/functions/send-consultation-email/deno.json --lock Agency_LandingPage/supabase/functions/send-consultation-email/deno.lock Agency_LandingPage/supabase/functions/send-consultation-email/index.ts
```

The Node test command covers 11 files and is expected to report 31 passing
tests for the current source tree.

The mirror check compares the complete two-directory file inventory and then compares every shared file byte-for-byte. Its tree digest is evidence for the checked source state, not a deployed-function digest.

## Environment-variable names

Values belong only in the appropriate local or hosted environment. Never place a privileged key in a `VITE_` variable.

### Emerson Empire and Agency browser builds

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (legacy name currently used by the code; migration to a publishable key requires coordinated production work)

### EPDG platform browser build

- `VITE_API_URL`
- `VITE_MOCK_AUTH`
- `VITE_EMPIRE_URL`

Mock mode must be disabled in any production build. The July 26 release evidence
records the canonical API origin; this repository work must not change the
production provider value.

The platform accepts `VITE_API_URL` only when it is a credential-free HTTP(S)
origin. Missing or invalid configuration causes API requests and all active
registration forms to fail closed; no fallback host is embedded in the client.
The current Netlify variable presence and deployed frontend bundle still
require an authenticated August provider check.

The tracked `epdg/netlify.toml` matches the repository Node/npm toolchain. Any
ignored app-local `.netlify/` snapshot is machine-generated local state, may be
stale, and must not be committed or treated as production evidence.

### Supabase Edge Function

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (legacy hosted name currently used by the function)
- `LEAD_NOTIFICATION_EMAIL`
- `ALLOWED_ORIGINS`

The notification recipient and approved origin list require founder/backend confirmation. Do not copy any privileged Edge value into a frontend environment file.

## Completed safeguards

- **Request-size enforcement:** the Edge Function reads the request stream with a 20,000-byte cap, returns `413` when the observed bytes exceed it, and does not trust `Content-Length` as the boundary. The focused regression test covers a misleading header.
- **Atomic rate limiting and storage:** the live `store_lead_request` RPC serializes the per-client rate-limit decision, stores the lead, and resolves idempotent retries in one database transaction. Browser roles cannot execute the service-only function.
- **Idempotent lead intake:** `public.leads.idempotency_key` has a validated optional contract and partial unique index. The Edge Function accepts `Idempotency-Key` and derives a stable daily fallback when the caller omits it.
- **Notification failure response:** once a lead is stored, admin-email failure is logged and returned as successful storage with `notificationStatus: unavailable`, avoiding duplicate-submission retries. The behavior is isolated in a focused, tested helper.
- **Dependency pinning:** all direct npm specifications are exact, npm lockfiles are used with `npm ci`, and Edge transitive dependencies are frozen with committed Deno lockfiles.
- **Live boundary hardening:** the three reviewed July 25 migrations are applied, Edge Function version 13 is active with JWT verification disabled by design for validated public intake, and transaction-only contract verification left no synthetic lead behind.

## Remaining follow-up work

- **Durable notifications:** store notification state or use an outbox so failed delivery can be audited and retried after the lead is saved.
- **Workflow supply-chain pinning:** separately review pinning third-party GitHub Actions by commit SHA before changing workflow trust policy.
- **Bot protection:** verify a selected challenge provider server-side only after the provider and credentials are approved.
- **Supabase API-key migration:** support current publishable/secret keys in a coordinated change before legacy keys are retired; do not rotate or replace production keys in this PR.

## Explicitly blocked decisions

- Current Netlify `VITE_API_URL` presence and deploy provenance
- Production environment-variable changes
- Deployment build-environment alignment
- General inquiry recipient and intake workflow
- Internship form URL or Google Form permissions
- Canonical company domains
- Bot-protection provider and credentials
- End-user identity mapping and role-specific RLS policies
- Legal-page content and destinations

## Preview verification rule

A canceled deploy context is not a successful preview. A site is verified only when its latest PR-head deployment exposes a usable preview URL and the application checks above pass for the same commit.
