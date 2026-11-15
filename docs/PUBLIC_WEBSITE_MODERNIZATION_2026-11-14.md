# Three public website modernization — November 14, 2026

This revision implements the founder’s November 14 authorization for The Emerson Empire, The Emerson Agency LLC, and Emerson Professional Development Group. The authorization record is `PUBLIC_WEBSITE_MODERNIZATION_2026-11-14.json`. It supersedes the public interface while retaining the earlier catalog exports, legal wording, contributor history, approval records, and publication receipts.

## Baseline and isolation

Current main and all three public publications were verified at `9951c490a59c98412e855d5f125d649d8f4c41e7` before editing. Baseline public deployments: TEE `6af257dbf6eae68c45b1093d`, Agency `6af257db777b134364af03e1`, EPDG marketing `6af257dbf6eae68c45b10941`; each ready and published November 9. The existing clean public-site checkout was reused on `codex/three-public-websites-20261114`.

The authenticated `epdg` application, its backend, invitations, database and accounts are excluded. No portal source, CRM or Creative Studio application files are changed. The separate portal remains at locked deployment `6af0ddc0208d400c348cdccd` with team SSO. Public PRs can trigger portal Netlify builds, so the website PR and merge use `[skip netlify]`. Reviewed builds must target only the three existing public site IDs and the exact reviewed commit through the current Netlify API. No portal build, protection change, replacement project, or paid resource is authorized.

## Public interface and content

One editorial design system supplies the full company header, accessible mobile disclosure navigation, serif headings, readable body text, portraits, sections, cards, inquiry panels, FAQs, breadcrumbs and footer. The brands retain their purple, blue and green palettes. Founder identity and the Columbia, South Carolina location appear naturally across all three sites. Original intern components and source history remain available; shared catalogs and directories continue to serve approved public records.

TEE: redesigned home, about, founder, start-here, South Carolina community resources, programs, partnerships, selected scholarship and contact pages. Preserved the resource library, guided learning, class catalog, career-readiness pathway, Project Studio and platform information. The old overlapping homepage sections, unsupported historical timeline/impact metrics and placeholder profile destinations are no longer active.

Agency: redesigned home, about, founder, tax preparation, insurance education, financial coaching, small-business services, financial resources, community education, partnerships, scholarship and contact pages. Four service families replace the overlapping homepage cards. The important hero and value statements are HTML. Existing catalog estimates, conditions and public customer guides remain available. No active insurance license or precise IRS certification designation is asserted without current evidence; insurance catalog references carry a visible scope caveat. No sensitive information is requested through public inquiry links.

EPDG: redesigned home, about, founder/scholar, academic biography, academic CV summary, research, conferences, programs, global internship program, internship tracks, classes, career readiness, professional training, certificates, partnerships, portal information and contact. Nineteen class descriptions and two retained curriculum topics are distinguished from the daily 10 AM/2 PM/7 PM Eastern sessions. The verified internship application is labeled 2027; the retained Fall 2026 framework is identified as historical. No employment, academic credit, reference, paid position or certificate outcome is guaranteed.

## Academic reconciliation

The live PhilPeople publications inventory contained 50 entries across two pages, representing 49 unique titles. Every eligible work has a directory entry and individual page with the publicly posted author abstract and canonical record URL. Two identical-title records for “Genealogy, Recognition, and the State” are consolidated while preserving the alternate record. Repository indexing is described as public manuscript availability, never automatic peer review or journal publication. Unsupported years, DOIs and version numbers remain absent. Six observed public PDF/archive links retain their verification caveats. Research categories are editorial classifications grounded in the abstracts; source categories remain separately recorded.

Primary public sources: https://philpeople.org/profiles/lyric-helena-emerson/publications and https://orcid.org/0009-0001-5355-6489. The November 8 academic CV was used for verification; the private document is not published or linked. The B.A. in Political Science at Southern New Hampshire University is in progress, expected 2027. Volunteer participation is attributed personally and does not imply partnerships.

Ten conference entries preserve two delivered presentations, one accepted but not delivered, six accepted forthcoming, and one CV-reported Spring 2027 acceptance with date pending. The Collective’s public call describes a later decision timeline than the CV-reported acceptance; the entry states the discrepancy. Passing an event date never changes a delivered status automatically. Unsupported presentation abstracts are omitted. Two existing approved research summaries and the historical archive note for “Reciprocity Without Justice” are retained. That manuscript is distinct from the undelivered “Reciprocity Without Standing” presentation.

## Rendering, discovery and safeguards

The existing Vite/React applications now emit complete static HTML for every meaningful public route and hydrate their interactive controls. Large community, learning and institution collections load separately from the homepages. Each route has a unique title/description, canonical URL, Open Graph/Twitter preview and structured Organization, Person, WebSite/WebPage and breadcrumb data; manuscript pages add ScholarlyArticle data without unsupported publication claims. Reviewed local social preview PNGs avoid build-time sibling dependency assumptions.

The generated sitemap includes only published routes. Legacy aliases redirect to canonical destinations; unknown addresses return a real 404 with noindex. The three old TEE research links redirect to the matching EPDG record while preserving the distinction between the two Reciprocity works. Existing privacy-safe CSP and external-only forms remain in force. The content hashes for frozen catalogs and approved legal wording are unchanged.

Google Search Console tools were available but no existing connected property was found. No indexing, sitemap submission, ranking or search result claim is made.

## Verification and recovery

Use pinned Node 22.23.1/npm 11.17.0, deterministic installs, then `npm run check:public`. This includes existing privacy/approval regressions, new semantic and mutation tests, shared/application lint, TypeScript builds, targeted smoke, static-page/navigation/structured-data checks and artifact hashing/privacy scans. Browser review covers desktop, tablet, mobile, menus, filtering and direct reloads. Current-head evidence and deployment receipts are recorded separately; earlier working-tree checks are not final release receipts.

A failed candidate must not replace a working publication. A published defect requires a reviewed fix-forward commit and targeted rebuild of the affected public projects. Preserve all earlier receipts and the portal lock/SSO boundary.

## Publication result

PR #48 is merged and all three existing public projects are published from merge `bce7ad2aacacc248a8c9ed5cf48ba82e685d492b`, whose tree matches checked head `99c7504c16d28e99469d9330c7a4b08fd8d19c28`. All seven GitHub jobs, thirteen local verification groups, 209 live pages and 39 redirects passed. See the November 14 release section in `OVERNIGHT_FULL_STACK_RELEASE.md` for exact deployment identifiers, UTC publication timestamps, browser coverage, residual limitations and the unchanged portal lock/SSO receipt.
