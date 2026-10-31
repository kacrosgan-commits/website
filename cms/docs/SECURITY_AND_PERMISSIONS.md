# Security and permissions — Step 10A

## Local binding

- Directus listens on `127.0.0.1:8055` only.
- PostgreSQL has **no host port**. It is reachable only on the Compose network as `database:5432`.
- `PUBLIC_URL` for Directus is `http://127.0.0.1:8055`. It is not the Astro `PUBLIC_SITE_URL`.

## Secrets

| Secret | Storage |
| --- | --- |
| `SECRET`, `DB_PASSWORD`, `ADMIN_PASSWORD`, `ADMIN_TOKEN` | `cms/.env` (mode 600, gitignored) |
| Placeholders | `cms/.env.example` only |

Never put Directus tokens in Astro `PUBLIC_*` variables or client JavaScript.

## Authentication

- Studio requires login.
- First admin is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` on first boot.
- `ADMIN_TOKEN` is a static token for local schema/verification scripts only.

## Anonymous access (Step 10A)

Default deny. Custom collections and files must not return private content to unauthenticated callers.

Verification script: `node scripts/verify-10a.mjs` (records HTTP statuses for anonymous GETs against team, portfolio, insights, services, settings, homepage, page sections, and files).

Acceptable anonymous outcomes: `401`, `403`, or `404`. A `200` with private item payloads is a failure.

## Planned editorial matrix (later steps)

Directus Core licensing (public pricing reference, 2026) lists limited Studio seats, collections, and Flows. Advanced multi-role approval tooling may be limited on Core. Step 10A therefore:

1. Uses the Administrator account for schema and verification.
2. Documents, but does not falsely claim, a fully enforced Editor≠Publisher workflow until the installed tier’s policy features are confirmed in Step 10C.

Intended eventual matrix:

| Role | Read drafts | Edit drafts | Approve / publish | Delete permanently | Change permissions |
| --- | --- | --- | --- | --- | --- |
| Owner / Admin | yes | yes | yes | yes | yes |
| Editor / Reviewer | yes | yes | no | no | no |
| Build-time reader (server only) | published+approved only | no | no | no | no |
| Anonymous / Public | no (10A); later only published public projections | no | no | no | no |

Editors must not be able to approve their own unreviewed drafts in the eventual workflow.

## Upload policy

Compose sets:

- `FILES_MAX_UPLOAD_SIZE=25mb`
- MIME allow list: images, `video/mp4`, PDF, plain text, markdown

No general public file access is enabled in 10A.

## License / feature notes

- Keep custom collections well under 25 (this project uses 8).
- Do not assume content versioning, unlimited seats, or advanced Flows are available without verifying the installed Core build.
- Open Innovation Grant eligibility is an owner decision; this repo does not apply for or embed a license key.
