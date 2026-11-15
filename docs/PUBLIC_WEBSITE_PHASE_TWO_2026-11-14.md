# Public website media and leadership release

The founder authorized phase two for the three existing public company websites, continuing from `6f9aa03da8b3cb3f6c4f8dd608bf60bd9cef7147` after PRs #48 and #49. This release adds coordinated leadership directories and profiles, reviewed branding, editorial artwork, and the subsequently approved portraits while retaining the existing visual system.

## Content and media decisions

All 152 source images were visually reviewed. The collection contains 121 distinct byte hashes, 120 distinct decoded images, and 110 extension-normalized filename groups. The initial selection comprised 16 emblems and editorial illustrations: two for TEE, five for the Agency, and nine for EPDG. The founder confirmed sufficient publication rights for that displayed selection. Three separately reviewed portraits were then approved by the founder’s latest instruction, without visible captions. This supersedes the earlier request to withhold those portraits. The final release uses 19 source images. Original files and the personal Drive folder remain unchanged and private.

The Executive portrait is used for Lyric Helena Emerson on TEE and EPDG; the Plum portrait is used on the Agency. The joint portrait is shown in full for Darin Latrelle James’s profile and directory entry, with alternative text identifying both Lyric and Darin. No standalone headshot is inferred or fabricated from it. The approved founder portraits also replace the previously published founder image in the modern home/founder presentations. No new portrait is described as an authentic documentary photograph, and no setting is described as an Emerson facility.

All five profiles display full names and the founder-approved company titles. Shamrit Phagura, Godwin-Iwatan Kehinde (Kenny), and Todor Tomic retain decorative initials because approved portraits are unavailable. Roles describe company responsibilities, separately from individual internship assignments. Only the founder’s previously approved PhilPeople and ORCID links are shown; no additional credentials, licensure, outcomes, profile links, or personal locations are inferred.

The public asset registry is `shared/public-media.json`; its reviewed checksum, asset allowlist and authorization scope are in `PUBLIC_MEDIA_PHASE_TWO_APPROVAL.json`. The detailed source/permission manifest, original filenames and Drive IDs, provenance observations, earlier permission history, exclusion decisions, raw images and contact sheets are restricted workspace evidence outside Git and public bundles. Further biographies, professional links and remaining headshots require verified material.

## Implementation

- Three leadership directories and 15 individual profile pages add 18 routes: 74 TEE, 42 Agency and 111 EPDG, totaling 227. All 209 prior routes remain. The old `/leadership` redirect becomes a real directory; five short leadership aliases per company redirect to full-name paths, resulting in 51 redirects.
- Shared components retain purple, blue and green identities, adapt departmental ordering and copy, and link the directory from navigation, footer, About and Founder pages. Existing scholarly, catalog and legal source records remain unchanged.
- Nineteen approved source images produce 124 unique responsive variants. Each public variant is below 200,000 bytes. Local WebP/AVIF sources and JPEG fallbacks retain composition and dimensions, use accurate alternative text, and lazy-load below the fold. Portraits have no visible captions. Essential hero portraits load eagerly. Meaningful editorial headlines and explanatory text also appear in HTML.
- Stable Person identifiers join company-specific ProfilePage and CollectionPage/ItemList graphs. Reviewed local media have ImageObject metadata and organization logo references. No private Drive hotlinks or public sharing changes are used.

## Verification and release boundary

`npm run check:public` runs existing tests, focused leadership regression tests, three application builds/lint/smoke, compiled HTML/route checks, the media permission/hash/dimension/metadata scan, and the artifact privacy scanner. Six source-file hashes protect the phase-one scholarly/catalog/legal baseline. Browser review covers desktop, tablet and mobile layouts, full names, portrait loading/caption policy, navigation, and accessibility. Final commit/provider results are recorded in the release log after they are observed.

Every commit, PR title and merge message uses `[skip netlify]`. Explicit Git builds are pinned to the reviewed commit and only the three existing public site IDs. Required CI must pass before merging and production publication. The separate `epdg` portal remains locked at its previous deployment; authentication, users, databases, backend, CRM, Creative Studio data, service configuration and privileges are outside this release. No new sites, plans, credits or subscriptions are purchased.

For a regression, create a reviewed fix-forward source change, run the affected checks, and rebuild only the affected public projects at the reviewed SHA. Preserve the portal lock, contributor history, original media, and prior release evidence. Do not restore a previous Netlify deploy through a provider rollback action.
