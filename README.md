# The Emerson Empire Frontend Monorepo

This repository contains the public frontend applications for The Emerson Empire ecosystem.

Frontend PR #27 was merged to `main` on July 26, 2026 (`bc93411`, reviewed
release head `11cc79e`). A read-only August 8 audit found that the public
Netlify identities do not consistently match this source, including a
cross-site Agency/Empire mismatch. Treat production provenance as unverified
until the authenticated Netlify mapping and deploy SHAs are checked. See
[`docs/PLATFORM_AUDIT_2026-08-08.md`](docs/PLATFORM_AUDIT_2026-08-08.md).

## Deployment Map

| Organization / Site | Local Folder | Netlify Project | Public URL |
|---|---|---|---|
| The Emerson Empire | `Emerson_Empire` | `theemerson` | https://theemerson.netlify.app/ |
| The Emerson Agency LLC | `Agency_LandingPage` | `emersonagency` | https://emersonagency.netlify.app/ |
| Emerson Professional Development Group Landing Page | `EPDG-Landing-Page` | `emersonprofessionaldevelopment` | https://emersonprofessionaldevelopment.netlify.app/ |
| EPDG Dashboard / Platform | `epdg` | `epdg` | https://epdg.netlify.app/ |

## Deployment Rules

1. Each Netlify project must point to the correct folder listed above.
2. Production deployments should come from reviewed and merged work, preferably `main`.
3. Do not treat deploy previews as final production unless leadership has approved that temporary workflow.
4. Do not place private credentials, API secrets, personal intern data, WhatsApp messages, contracts, or sensitive client information in this repository.
5. Public-facing copy should reflect The Emerson Empire standard language: founder-led, built by interns, and credited wherever credit is due.

## Environment Notes

Environment values are deployment-specific and must not be committed. The `epdg` dashboard uses these variable names:

```text
VITE_API_URL
VITE_MOCK_AUTH
VITE_EMPIRE_URL
```

The July 26 backend release evidence records a canonical production API and the
`epdg-backend-core` Railway entrypoint. The current Netlify `VITE_API_URL`
presence and deployed frontend-to-backend connection still require an
authenticated provider check. A read-only August 8 probe reached that API but
received HTTP `503` from `/health` three times, so current readiness diagnosis
is urgent and dashboard-owned. Registration fails closed when API
configuration is absent or invalid. Production builds must not enable mock
authentication, and environment examples remain names-only.

See [`docs/STABILIZATION.md`](docs/STABILIZATION.md) for the pinned local toolchain, names-only environment inventory, deterministic checks, and blocked decisions.

## Deployment Identity Checks

The machine-readable four-site contract is
[`config/site-identities.json`](config/site-identities.json). After locked
installs, `node scripts/verify-site-identity.mjs` builds and validates every
site. `node scripts/verify-site-identity.mjs --remote --report-only` performs an
optional read-only public drift audit; it never submits forms or changes a
provider. See
[`docs/DEPLOYMENT_SOURCE_OF_TRUTH.md`](docs/DEPLOYMENT_SOURCE_OF_TRUTH.md) and
[`SECURITY.md`](SECURITY.md).

## Current Stabilization Notes

- The EPDG public class registration form is: https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform
- The EPDG fee waiver request form is: https://forms.gle/fWm9gHownQeorkNn7
- The fee waiver form should not request sensitive documents, Social Security numbers, government IDs, private financial records, or medical information.

## Recommended Team Workflow

1. Create a branch for each focused repair.
2. Submit a pull request into `main`.
3. Review the Netlify deploy preview before merging.
4. Merge only after the correct site, folder, form links, and routing have been checked.
5. Confirm the matching Netlify production site after merge.
