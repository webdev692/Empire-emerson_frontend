# Environment variables

This inventory records names and purposes only. A listed name does not prove that production is configured. Values belong in approved provider configuration and must never be committed or copied into release evidence.

## Frontend browser builds

| Name | Scope | Purpose |
|---|---|---|
| `VITE_API_URL` | EPDG platform | Required backend API origin; canonical production choice remains blocked |
| `VITE_MOCK_AUTH` | EPDG local development only | Explicit development fixture/auth opt-in |
| `VITE_EMPIRE_URL` | EPDG platform | Public umbrella-site link; canonical destination requires founder confirmation |
| `VITE_SUPABASE_URL` | Emerson and Agency | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Emerson and Agency | Legacy public browser key name pending coordinated publishable-key migration |

## Lead-intake Edge Function

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Server-side notification provider authentication |
| `SUPABASE_URL` | Server-side Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged database access |
| `LEAD_NOTIFICATION_EMAIL` | Administrative notification recipient; founder confirmation required |
| `ALLOWED_ORIGINS` | Explicit browser-origin allowlist |

## Root backend

| Name | Purpose |
|---|---|
| `NODE_ENV` | Runtime mode |
| `PORT` | HTTP listener port |
| `DATABASE_URL` | Server-side database connection |
| `CORS_ALLOWED_ORIGINS` | Explicit production CORS allowlist |
| `PUBLIC_CREDITS_ENABLED` | Public contribution-credit feature flag |
| `AGENCY_MODULE_ENABLED` | Agency API module feature flag |
| `CERTIFICATE_VERIFICATION_ENABLED` | Public certificate verification feature flag |

## EPDG backend core

| Name | Purpose |
|---|---|
| `PORT` | HTTP listener port |
| `NODE_ENV` | Runtime mode |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_SSL` | Database TLS mode |
| `JWT_SECRET` | Server-only token signing/verification secret |
| `FRONTEND_URL` | Intended frontend origin; canonical destination remains blocked |
| `CORS_ORIGINS` | Explicit browser-origin allowlist |
| `RESEND_API_KEY` | Server-side notification provider authentication |
| `SUPABASE_URL` | Server-side Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged Supabase access |
| `SMTP_FROM` | Notification sender identity; provider confirmation required |
| `CERT_SIGNING_SECRET` | Server-only certificate signature secret |
| `ALLOW_DATABASE_MIGRATIONS` | Explicit startup-migration opt-in; disabled by default |
| `SUPER_ADMIN_NAME` | Bootstrap administrator display name; founder/backend confirmation required |
| `SUPER_ADMIN_EMAIL` | Bootstrap administrator identifier; founder/backend confirmation required |
| `SUPER_ADMIN_PASSWORD` | Server-only bootstrap administrator credential |

## EPDG developer utilities

The following names are used by non-production test/seed utilities and are not runtime deployment requirements: `API_URL`, `ADMIN_EMAIL`, and `ADMIN_PASS`. They must never be populated with real credentials in repository files or release evidence.

## Release rule

Provider configuration changes must record only the variable name, target service/site/context, verification result, and rollback action. Never record the old or new value.

The canonical EPDG backend origin, production provider mappings, notification recipient, bot-protection provider, and final allowed-origin set remain unverified. No production environment variable was changed while preparing this inventory.
