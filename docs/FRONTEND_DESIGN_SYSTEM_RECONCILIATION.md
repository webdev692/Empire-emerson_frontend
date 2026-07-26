# Frontend design-system reconciliation

Date: 2026-07-25
Integration branch: `founder-support/platform-stabilization-2026-07-11`

## Reconciled source of truth

All four frontend applications import `shared/emerson-design-system.css`.

- Display headings: Libertinus Serif Display
- Body copy: Inter
- Labels, navigation, buttons, tags, and legacy `font-mono` labels: Work Sans
- Controls: 12px radius
- Cards, dialogs, and major surfaces: 16px radius
- Pills and badges: 999px radius
- Standard gold: accents and dark-surface text
- Light-surface gold text: `#8A6D20`
- Shared behavior: visible focus, practical 44px controls, and reduced-motion support

EPDG's Great Vibes `.script` class is retained only as a decorative treatment. It is
not part of the heading, body, or navigation hierarchy.

## Shared class catalog

The Emerson Empire class experience and the active EPDG `/classes` route now
consume one reviewed source at `shared/class-catalog.ts`. The catalog contains
exactly three recurring sessions per day, Monday through Sunday: 10 AM/free/60
minutes, 2 PM/$10/90 minutes, and 7 PM/$20/120 minutes.

The active EPDG route no longer renders its older 5 PM/6 PM catalog or fixed
two-hour labels. Fee-waiver controls appear only on paid classes, and the public
copy states that waiver requests do not ask for sensitive documents. Contract
tests cover both application entry points and the active rendered component.

## Modal accessibility

The EPDG form modal and Agency request modal now expose dialog semantics, support
Escape, establish and restore focus, prevent background scrolling, and use 44px
close controls.

Google Forms is a cross-origin iframe, so the parent page cannot reliably capture
Escape after focus enters it or prove that a submission completed. The embedded
form remains available for pointer use, while keyboard and assistive-technology
users receive an explicit form link that opens the verified Google Form in a new
tab. The iframe is removed from the parent dialog's keyboard and accessibility
sequence, and the parent no longer infers or announces submission success.

## PR #28 disposition

PR #28 / `agent-for-headings-and-subheadings-5e83` at
`aa432ee23f56108847580a37274d2d14a27b392f` was not merged or cherry-picked.
It is a Netlify bot commit based directly on `main`, not on PR #27.

The useful concepts were ported manually: shared font variables, the
display/body/label hierarchy, and removal of component-level Cormorant and
Montserrat declarations. Its single-app scope, stale base, unverified metadata,
light-surface gold, mixed radii, and missing accessibility behavior were not
carried forward.

## Public metadata

Static metadata uses the verified Netlify project mappings and existing assets:

- `Emerson_Empire` → `https://theemerson.netlify.app/`
- `Agency_LandingPage` → `https://emersonagency.netlify.app/`
- `EPDG-Landing-Page` → `https://emersonprofessionaldevelopment.netlify.app/`
- `epdg` → `https://epdg.netlify.app/`

No placeholder poster, nonexistent logo, or unverified custom-domain reference is
used in the four application entry documents. Dedicated raster Open Graph artwork
remains deferred until an approved, factually reviewed asset is available.
Each entry document owns exactly one canonical URL and one set of homepage
description/Open Graph metadata; homepage React components do not duplicate those
static tags.

## Attribution and unavailable artifacts

The repository preserves identifiable contribution history, including Jonathan
Smith (`c4b349a`, `f718d34`, `95aebed`, `d4e5eca`), Hosea Javier (`093c3f5`),
Wiltord Netting Kamdem (`ba19ed7`), Wiltord (`5c53d1b`), and Netlify-generated
branches (`c033093`, `aa432ee`).

No separate, accessible July 20–24 submission artifacts for Javier, Shamrit, or
Khaishawn were present in this checkout. This records an evidence limitation, not
an assertion that no work was completed. No Global Summit page, specification, or
accessibility-audit deliverable was present, so Summit work is explicitly deferred
and must not be represented as complete.
