# Full-stack architecture

## Repository boundaries

- Frontend repository: `webdev692/Empire-emerson_frontend`
- Backend repository: `webdev692/THE-EMERSON-EMPIRE_Backend`
- The repositories remain separate. The backend release worktree is not nested in the frontend repository.

## Frontend applications

| Application | Directory | Responsibility |
|---|---|---|
| Emerson Empire | `Emerson_Empire` | Umbrella-company public site and lead intake |
| Emerson Agency | `Agency_LandingPage` | Agency public services, contact, and intake |
| EPDG landing | `EPDG-Landing-Page` | Public workforce-development and program information |
| EPDG platform | `epdg` | Authenticated internship and workforce platform |

## Service boundaries

- Netlify hosts the four frontend applications.
- Railway hosts backend candidates; the authoritative service must be established from repository configuration, service metadata, logs, health behavior, and protected-route behavior before any frontend origin is changed.
- Supabase project `gqlyofoazfkumirhbnmc` provides Postgres and one live lead-intake Edge Function. The repository has two local source mirrors for that function.
- Browser applications must never receive a service-role or secret key.

## Backend repository inventory

- The backend repository contains a root JavaScript service with a limited registered route surface and a nested `epdg-backend-core` TypeScript service with the broader EPDG route implementation.
- The frontend expects authentication plus intern, company, school, mentor, admin, task, submission, progress, feedback, announcement, opportunity, resource, application, certificate, leaderboard, and portfolio behavior.
- Repository structure alone does not identify the production service. Railway ownership, source linkage, deployed revision, environment, and route behavior still require provider evidence.
- Until that evidence exists, no observed Railway candidate is documented as canonical and no frontend API origin should be changed.

## Request flows

### Public lead intake in PR #27 (not yet deployed to production)

1. Emerson or Agency submits a bounded JSON request to the Supabase Edge Function.
2. The function validates origin, method, fields, body size, honeypot, and rate limit.
3. The function inserts the lead with a minimal insert response.
4. Notification delivery is attempted after storage; a notification failure does not instruct the visitor to duplicate the stored request.

### EPDG platform in PR #27 (not yet deployed to production)

1. The browser accepts only a configured credential-free HTTP(S) API origin.
2. Missing or invalid configuration fails closed.
3. The backend owns authentication, authorization, database access, and privacy-safe errors.
4. Supabase/Postgres access from privileged backend paths remains server-side.

## Verified database boundary

The schema-only audit found 46 tables across `public` and `epdg`, no RLS policies, four career tables with RLS disabled, and overly broad latent browser-role grants. `docs/DATABASE_SCHEMA_AND_RLS.md` contains the evidence and the forward-only hardening sequence. No migration was applied.

The final role matrix, custom-user-to-authentication mapping, backend database role, authoritative Railway service, and certificate/public-profile boundaries remain blocked pending founder and backend confirmation.
