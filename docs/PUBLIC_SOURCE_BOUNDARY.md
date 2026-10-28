# Public company source boundary

This checkout reproduces the existing approved company websites without private
authoring inputs. It does not approve new content, activate forms, create CRM or
education accounts, or change production settings. The full private authoring and
review workflow remains recoverable on `dev/oct16-18-company-platform` at
`e2e0e9404561361407eb88b5ba322d275d70a548` in the original local checkout. That
private history must not be pushed to the public repository.

| Public application | Netlify project | Approved content revision | Existing public origin |
| --- | --- | --- | --- |
| `Emerson_Empire` | `theemerson` | `e2e0e9404561361407eb88b5ba322d275d70a548` | https://theemerson.netlify.app |
| `Agency_LandingPage` | `emersonagency` | `5bd718bbce430df59125e8ac09745c81d68c76da` | https://emersonagency.netlify.app |
| `EPDG-Landing-Page` | `emersonprofessionaldevelopment` | `5bd718bbce430df59125e8ac09745c81d68c76da` | https://emersonprofessionaldevelopment.netlify.app |

The `epdg` learner portal, its API and synthetic database have a separate release
owner and release process. This company-source change does not alter them.

Fresh provider metadata on October 28 confirms the current company publications:
TEE `6ad6b03d3012974f21713092`, TEA `6ad518bfed6792ed7e676c61`, and EPDG
marketing `6ad518cc6256cb06185234f4`. These are ready manual static uploads with
no provider build ID or commit reference. Their provider context is
`deploy-preview` despite being the current publication, and `locked` is false.
The content revisions above come from the reviewed local release manifests;
the complete published artifact hashes establish the correspondence. A provider
context label alone does not establish source provenance or database isolation.

## What belongs here

The public source retains the existing intern interfaces and attribution, the
approved catalog exports, services and pricing, three customer PDF guides, Project
Studio examples, three programs, and TEE's approved research summaries and public
links. The three large directory files named `*.local.json` are historical file
names: their exact sanitized contents already appear in the approved public
website bundles. They contain public resource/institution/course metadata, not
CRM applicants, HR records or learner accounts. Their existing review warnings
and unknown source dates remain unchanged.

Private C4/resource source notes, raw review catalogs, draft authoring inputs,
contribution review packets, source workbooks/documents, private imports and
operator evidence are absent. The small Studio/program review snapshots contain
the same approved public data as their public exports. The research review
snapshot adds only `checkedAt`, `selection` and `publicationApproved` to the same
published work list. These snapshots remain because the original validators
require their exact reviewed hashes. None of those approval validators was
relaxed or replaced.

## Reproduce and verify

Use Node.js `22.23.1` and npm `11.17.0`. Run `npm ci` at the repository root and
inside each of the three company application folders, then `npm run check:public`
at the repository root. This runs the public regression suite, shared lint, each
company's build/lint/smoke checks, and the complete published-artifact comparison.
`EMERSON_EVIDENCE_DIR` can select an evidence folder outside the repository.
Both `build` and the retained `build:platform` alias use this same frozen public
release gate; the alias cannot bypass approval or emit a separate platform build.
The narrowly scoped `.gitattributes` SVG rules preserve the CRLF bytes in the
existing published company SVG assets on both Windows and Linux checkouts.

The public build checks the pinned `shared/public-source-boundary.json`, all 23
approved payload hashes, schemas, source URL rules, public privacy fields,
biography consent, author review and the original feature approval validators.
The final check requires exactly the same 217 published files and SHA-256 values:
TEE 96, TEA 95, and EPDG marketing 26. No missing private input is treated as new
approval. There is no public export-generation command.

Only `release-build.json` is exempt from the old output hashes. It records the
actual checkout revision, dirty state, build time and pinned boundary hash. Its
`content_revision` identifies the unchanged approved public content. The visible
site build label retains that content revision so the published website assets
remain byte-identical. A fresh checkout/build receipt is required for a new
commit; an old content revision is not evidence that its new build passed.

Private authoring/review commands fail explicitly. Their TypeScript interface
modules throw if loaded and provide no substitute production records. To view
this frozen release locally, run `npm run build` and `npm run preview` in the
desired company app. Future catalog changes require the private reviewed workflow
and separate exact-version approval; editing hashes does not supply approval.

## Operating and release holds

Registration and live intake remain disabled. Email links create editable drafts
for the already published mailbox; they do not send messages. Existing public
Google Forms destinations remain in preserved intern source but are intercepted
by the release's intake hold; the CSP keeps `form-action 'none'`, `frame-src
'none'` and `connect-src 'self'`. Private document, Drive and inbox links remain
prohibited. No CRM transport, submission success message, role grant, automatic
enrollment or external email is enabled by this source handoff.

Keep the existing Netlify project mappings and provider settings. A reviewed Git
change must not silently replace the approved manual static publication or enable
automatic production deployment. Compare the candidate files against the pinned
published manifests, verify the candidate deployment/source, then use the
coordinated release process. Retain the immutable deployment receipts and assets
as evidence; recovery uses a separately reviewed fix-forward release. Production
has not been changed by local source preparation.
