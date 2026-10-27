# Hosted synthetic practice frontend

The `epdg` application has a separate, explicit `hosted-practice` build. Normal
production builds retain the access hold and design previews remain disconnected.
The fixed `synthetic-local` development entry still cannot build or preview.
Owner/admin controls remain closed in the hosted practice UI.

## Profile and release boundary

`epdg/hosted-practice.config.json` contains only version, expected environment,
an exact HTTPS portal-origin allowlist and an isolated backend HTTPS origin. Its
release candidate pins the verified portal origins `https://epdg.netlify.app`
and `https://hosted-practice--epdg.netlify.app`. Its backend origin remains empty,
so the profile still fails closed. The operator must verify the isolated backend
provider origin before populating that field. The build additionally requires
`EPDG_HOSTED_PRACTICE_ENABLED=1`; no environment variable can override the pinned
browser API target. `npm run build:hosted-practice` writes `dist-hosted-practice`.

The browser calls fixed same-origin `/api/...` paths with cookies, no-store,
no redirects and the existing CSRF headers. Generated `_redirects` proxy only
those paths to the pinned backend. The backend must return
`environment: synthetic-hosted` on every successful authentication, session and
mutation envelope as well as learning/review/onboarding responses. Missing or
mismatched environments, real account addresses and privileged responses fail
client verification. Hosted login begins blank; no private local login alias,
fixture mapping, credential, automatic login or browser record persistence is
included. Recovery copy describes private synthetic capture, without claiming
real mail delivery.

Use `epdg/netlify.hosted-practice.toml` explicitly for this deployment profile.
Its no-store document headers and same-origin CSP are generated with the profile;
the default site's immutable asset headers are not copied into this configuration.
Proxy responses must set their own no-store/security headers in the backend.
The output and Netlify link state are Gitignored.

The verified `hosted-practice--epdg.netlify.app` preview currently serves the
closed normal access hold at deploy `6ae0adbbb24754f1503f3bb6`; it is origin
verification, not acceptance of the hosted practice build. Production remains
locked to its existing release. Historical local evidence below remains tied to
its recorded revision and must not be counted as actual hosted acceptance.

## Retiring an installed older portal worker

The previous normal PWA caches its document. New-document cleanup cannot run
while that older worker keeps serving the older document. Hosted output therefore
includes an audited retirement script at the exact prior root `/sw.js` path.
The script skips waiting, deletes only Workbox precaches whose encoded scope is
this exact portal root, unregisters, and refreshes known same-origin portal
windows. It has no fetch handler, network fetch, imports or cache-population code.
Unrelated caches, registrations and application paths are preserved.

The hosted page also checks worker state before requesting a session. It retires
only the known root `/sw.js` registration, removes only its scope-named precaches
and reloads a controlled page. An unexpected root worker/controller fails closed.
The build verifier accepts only the byte-exact audited retirement script; normal
worker registration, Workbox bundles, manifests and source maps remain forbidden.

`epdg/scripts/hosted-practice-worker-lab.mjs` is a separate loopback browser
mechanism test on `127.0.0.1:58085`, never a product entry or deploy artifact. It
serves the generated normal PWA, prepares an unrelated worker/cache for comparison,
then offers the audited retirement worker and observes a network-served replacement
document. Its receipt is written under workspace
`build-evidence/epdg-synthetic-2026-10-27/hosted-frontend/worker-lab/`. This tests the
browser upgrade mechanism; it does not establish hosted API, cookie, CRM or actual
published-artifact acceptance.

## Verification

Run the pinned Node 22.23.1/npm 11.17.0 toolchain, full tests, lint, TypeScript,
fresh normal and design builds, both existing artifact guards and smoke checks.
The hosted build must remain unavailable until its real profile is pinned. After
pinning, run the hosted build and `scripts/verify-hosted-practice-build.mjs`, then
verify actual HTTPS cookie/CSRF, learner/mentor scope, clearance/withdrawal,
network failure and installed-worker behavior against the reviewed backend.
Source/build evidence belongs to its current revision and working-tree hashes.
No real applicant or HR records are part of frontend acceptance.
