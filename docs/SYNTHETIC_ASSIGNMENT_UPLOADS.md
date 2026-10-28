# Local synthetic assignment files

Learners can attach harmless practice files to an explicitly saved text draft,
remove or restore files before submission, review the saved set, and download
the files from a final read-only receipt. Use the local portal at
`http://127.0.0.1:58080`; this feature does not enable uploads in production or
in the disconnected design preview. Owner/admin controls, invitations, grading,
credit and certificates stay closed.

## Working with practice files

The browser is left on **SYNTHETIC Upload Practice** in Career Readiness, a fresh
empty exercise added within the existing learner enrollment. Save a fictional
text draft there before selecting and uploading a harmless practice file. No
account, enrollment or permission was created or changed for this handoff.

Save the text answer before choosing a file. Supported extensions are TXT, PDF,
PNG, JPG and JPEG. Each file must contain between 1 and 1,048,576 bytes (1 MiB).
An assignment can include three active files and retain six uploaded files in
total. Removed files count toward the total and can be restored to an available
active slot until final submission. Removal is reversible; there is no purge API.

Filenames must start with an ASCII letter or digit, use only ASCII letters,
digits, spaces, underscores, hyphens and periods, and be at most 100 characters.
Repeated periods and trailing periods/spaces are rejected. The server checks the
extension, declared media type and bounded content/signature. TXT files require
valid UTF-8 without disallowed control characters; active HTML/XML signatures
are rejected. Archives, office documents, SVG and executables are unsupported.
These checks are not malware scanning. Use only harmless synthetic files.

Choosing a file does not upload it. Inspect its name and size, then choose
**Upload selected file**. Pending selections lock text editing and review until
uploaded or cleared. Reloading loses the selection, so choose the file again.
Successfully uploaded files are durable and visible after reload. File changes
increment the saved draft revision; stale requests cannot overwrite newer work.
An uncertain upload requires reloading saved status before another attempt.

The review screen lists the exact saved files. Final submission freezes the text
and active file set into one receipt. Existing text-only receipts retain an empty
file set. Final files can be downloaded, but their contents and metadata cannot
be changed. Assignments still require a nonblank saved text answer and do not
alter lesson progress or award qualifications.

## Private storage and download boundary

File bytes are stored as bounded BYTEA values in the local synthetic database,
outside any static or public file directory. There are no cloud buckets, public
links, signed URLs, external scans or inline previews. The new additive table
has RLS with no browser policies/grants; the server retains explicit enrollment
and membership checks with its existing private runtime role.

Only the exact assignment upload route accepts multipart data. It authenticates
the cookie session, validates Origin, custom request header and CSRF, and checks
synthetic learner scope before buffering one bounded file and one revision field.
All other mutations retain their JSON contract. File IDs, hashes, size and upload
time are generated or derived by the database. Transaction locks coordinate text,
file changes and final submissions. The database creates the receipt manifest
and prevents modifications to final files, metadata or receipts.

Downloads require the current learner's active enrollment and membership on each
request, including after submission. Removed and foreign files are unavailable.
Responses use `application/octet-stream`, attachment disposition, `nosniff`, a
sandbox policy and `no-store`. The frontend verifies the downloaded size and
SHA-256 against saved metadata before creating a temporary download URL. It
revokes that URL promptly and on unmount. Tokens and answers stay out of browser
storage and application logs.

## Review and compensation

The sibling backend guide records the forward migration checksum, minimal column
grants, parser version and live HTTP/SQL checks. The original learning migrations
and previous immutable receipts are preserved. Startup never runs migrations.
The explicit local operator verifies the database, instance, directory and ledger
before applying reviewed forward changes. Stop the managed local services to
suspend review; retain bytes and receipts and use forward corrections rather
than deleting final records.

Current results and working-tree fingerprints are recorded in
`ASSIGNMENT_UPLOADS_EVIDENCE_2026-10-24.json` and workspace
`build-evidence/epdg-synthetic-2026-10-24/assignment-uploads`. Earlier milestone
receipts remain historical. Local acceptance does not establish a production
storage, malware scanning, HTTPS, retention or deployment policy. Production
publishing remains locked; no push, PR mutation or deployment is authorized.

Final local checks passed: 147 automated tests and 43 live API scenario groups.
Browser checks covered invalid-file rejection, TXT/PDF upload, removal/restoration,
offline recovery, byte-identical download, persistence, mobile/keyboard review
and a final receipt containing two files. The older text-only receipt was
preserved and lesson progress remained 3/5 (60%). The upload parser is pinned to
Multer 2.5.0 after a focused security update. Backend lint has 161 existing
warnings and its install reports 19 dependency audit findings; these remain
follow-up work. File signatures are checked, but files are not malware-scanned.

Implementation review used the [official Multer documentation](https://expressjs.com/en/resources/middleware/multer/),
[maintainer changelog](https://github.com/expressjs/multer/blob/main/CHANGELOG.md)
and [OWASP file upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).
