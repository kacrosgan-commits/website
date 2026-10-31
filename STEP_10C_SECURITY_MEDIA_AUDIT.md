# STEP 10C — Security & media audit

## Tokens and least privilege

| Identity | Purpose | Studio/app | Writes | Notes |
| --- | --- | --- | --- | --- |
| Astro Shadow Auditor | `cms-shadow` reads | `app_access=false` | **403** | Read custom collections + files metadata |
| Astro Build Reader | `cms` builds | `app_access=false` | denied | Same Core read scope; app enforces publish gates |
| Administrator | CMS ops only | yes | yes | **Never** used by Astro builds |

Setup: `npm run cms:setup-identities` writes `DIRECTUS_SHADOW_TOKEN` / `DIRECTUS_BUILD_TOKEN` into gitignored project `.env`.

### Core license limitation (documented)

Directus Core rejected **custom permission filter rules** (`custom_permission_rules_enabled` / `RESOURCE_RESTRICTED`). Therefore publish filters cannot be enforced inside Directus policies on this tier. Astro **application gates** enforce `published + publication_approved + published_at` before any public CMS output. Shadow and build tokens must never be shipped to browsers.

## Anonymous Directus surface (retained)

| Request | Observed |
| --- | --- |
| `GET /items/team_members` | **403** |
| `GET /items/insights_articles` | **403** |
| `GET /files` | **403** |
| `GET /assets/<id>` | **403** |

No anonymous permissions were widened in 10C.

## Build-time media strategy

Implemented in `src/lib/content/media.ts` + `scripts/cms-build-media.mjs`:

1. Allowlist UUIDs only from **eligible** published content (not all 29 files).
2. Authenticated download with `Authorization` header (no query token).
3. MIME sniff + size caps; reject SVG/HTML/script-like payloads.
4. Emit `/cms-media/{sha256}.{ext}` into staging → `dist` only on approved CMS builds.
5. Refuse materialization when readiness is false (current state).

### Negative / safety behaviors tested or enforced in code

| Case | Behavior |
| --- | --- |
| Staged baseline media build | Skipped — no draft files written to `dist/cms-media` |
| Disallowed host in `DIRECTUS_URL` | Client rejects non-loopback |
| `access_token` in URL | Client refuses |
| Local build leak scan | No tokens / Bearer / Directus host in `dist` HTML/JS/CSS |
| Owner 30s MP4 | Remains `public/videos/...`; not replaced by CMS fetch in local mode |

## Artifact leakage scan (local build)

Scan of `dist` for `ADMIN_TOKEN`, `DIRECTUS_*_TOKEN`, `access_token=`, and `127.0.0.1:8055` in page assets: **0 hits**.

## Remaining residual risk

Because Core cannot attach row filters to reader policies, a stolen build/shadow token could read drafts via API. Mitigations: tokens stay local/gitignored, `cms` mode never renders ineligible rows, shadow never materializes draft media, anonymous access stays denied.
