# EPDG dependency review — phase three

The current EPDG lockfile reports 12 affected development-tooling nodes: ten
moderate and two low, with no high/critical findings. The runtime-only audit
reports zero. These counts describe the full dependency graph, not twelve
independent vulnerabilities or a clean full audit. The lockfile is unchanged in
this phase. Exact audit/registry receipts are retained with private release
evidence; no application data is used in this investigation.

| Advisory and installed chain | Reachability in this candidate | Remediation review |
| --- | --- | --- |
| [Minimatch pattern amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249): minimatch 10.2.6 below TypeScript-ESLint and glob | The advisory requires attacker-controlled patterns with optimization level at least two. The installed TypeScript-ESLint call uses `{ dot: true }`; the ESLint config does not enable its project service or `allowDefaultProject`. Workbox has a fixed source-controlled pattern. No portal request supplies a pattern to either tool. | Fixed from 11.0.1. Registry readback of latest TypeScript-ESLint 8.72.2 still requests minimatch `^10.2.2`; upgrading that direct package alone does not remove this chain. No unreviewed cross-major override was applied. |
| [Glob cancellation bypass](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): glob 11.1.0 below Workbox 7.4.1 | The affected cancellation boundary needs an aborted traversal. Installed Workbox calls `globSync` with directory/follow/ignore options and no cancellation signal. PWA generation is disabled for the release profile; the older normal profile uses the checked-in finite asset pattern. Build inputs remain a contributor/supply-chain trust boundary. | Fixed from 14.0.2. Latest Workbox remains 7.4.1 and requests glob `^11.0.1`; latest PWA plugin 2.0.0 retains this Workbox range. A major PWA upgrade would not itself fix the chain. |
| [Deepmerge object prototype poisoning](https://github.com/advisories/GHSA-gcqx-w48m-w2h4): deepmerge 4.3.1 below Rollup node-resolve 16.0.3 | The installed resolver calls deepmerge only once to copy its own literal defaults, then freezes the result. User options are spread separately. No untrusted source object enters this merge at the inspected call site. This conclusion is specific to the installed source, not a claim that deepmerge is generally safe. | The advisory and latest registry version list no patched release. Replacing the resolver's dependency would require a separately reviewed implementation change. |

The non-forced command `npm audit fix --package-lock-only --ignore-scripts
--dry-run --json` was evaluated in an isolated copy of the pinned manifest and
lockfile. It proposed zero additions, removals or changes and retained all 12
findings. The original package files and installed dependencies were untouched.
Some intermediate `fixAvailable: true` flags lead to root proposals for older
TypeScript-ESLint/PWA versions marked `isSemVerMajor: true`; those proposals are
not evidence of a compatible patch for this manifest. This does not rule out a
future upstream fix or a separately tested alternative dependency design.

## Deployment exposure and mitigations

The reviewed portal release is static browser output; none of these Node build
packages is a portal API endpoint. No reachable exploit from public portal input
was identified in the inspected release workflow. This is a scoped source review,
not a proof against malicious dependencies or arbitrary contributor changes.

Keep the lockfile deterministic, review build/config changes, and build only the
reviewed source. PR CI uses read-only repository permissions, no deployment step
and a 20-minute application job limit. Do not pass production credentials to PR
builds. Keep generated artifacts tied to exact source and hashes; do not accept
patterns or merge objects from HTTP requests. Recheck these assumptions when the
build plugins, ESLint project-service configuration or dependencies change.

## Actual release policy

Repository rules prohibit merging/deploying with failing required checks. They
do not define an npm-audit severity threshold or require zero findings; the
current workflow does not run npm audit as a required CI step. Passing CI is
therefore not security risk acceptance. The phase-two journal explicitly kept
the tooling risk gate open. This review documents the limited observed exposure
and alternatives; it does not waive that gate. Before live release, obtain the
founder's recorded disposition of the remaining findings, or implement and
verify a reviewed remediation. All other production approvals remain separate.
