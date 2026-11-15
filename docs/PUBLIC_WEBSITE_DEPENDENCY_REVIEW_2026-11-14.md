# Public website dependency review — November 14, 2026

The release audit found preexisting high-severity findings in the baseline root and public application locks. These were deliberately repaired as part of the authorized website release; the runtime remains Node 22.23.1 and npm 11.17.0. No portal manifest, lockfile or application configuration changed.

Targeted direct updates: Axios 1.21.1, React Router DOM 7.18.5, Vite 8.3.8, PostCSS 8.5.33, ESLint 10.15.0, and Sharp 0.35.5 where already used. Compatible transitive refreshes include follow-redirects, nanoid, source-map-js, brace-expansion, browserslist, fast-uri, zod and fflate. The unused root vite-plugin-pwa dependency was removed; none of the three public applications uses it. The separate portal independently declares and installs its own PWA dependency, unchanged.

Candidate resolution was first tested on copied package/lock pairs, then the eight reviewed files were applied to the root and three public apps. All four deterministic npm ci installations passed without changing the reviewed locks. Sharp WebP/AVIF encode, decode and metadata smoke checks passed for TEE and Agency after the explicit pre-1.0 minor update.

Post-install audit results: root full and production audits contain zero findings. Each public production audit contains zero findings. Each public full audit contains seven moderate findings in development-only TypeScript-ESLint/minimatch chains, with zero high or critical findings. The upstream TypeScript-ESLint dependency range does not admit the patched major minimatch release. No forced major override, downgrade, audit suppression or runtime-policy relaxation was applied. Those development tooling findings remain an explicit maintenance item; they are not shipped as application runtime code or treated as zero-finding full audits.

The normal pinned public suite and fresh GitHub jobs remain required after this dependency update. Social preview images are reviewed static source assets, so TEA and EPDG provider builds do not rely on sibling Sharp installations. Current-head build and provider receipts are separate from candidate audit evidence.
