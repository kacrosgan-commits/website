# STEP 10A REPORT — Directus Backend Foundation

**Project:** Vortex Digital marketing website (Astro 7 + TypeScript + Tailwind CSS v4)  
**Environment:** Ubuntu Linux, Docker Engine 29.9.2, Compose v5.6.1, Node v24.21.0  
**Date:** 2026-10-29  
**Classification: STEP 10A: PASSED**

## Executive status

A real local Directus Studio + PostgreSQL stack runs under `cms/`, bound to `http://127.0.0.1:8055`. Eight custom collections were created with UUID keys, editorial fields, and a portfolio screenshot relation. Admin authentication, CRUD on a disposable test record, anonymous denial, upload, and persistence across restart were verified. No Astro frontend wiring and no live content import. Domain, DNS, email, contact delivery, and deployment remain unchanged.

## Before / after worktree

**Before (baseline inspected):** Astro site with local data (`src/data/*`, `src/content/blog` ×12 drafts, six public case studies + sample stubs, eight services, nine team profiles, homepage team MP4). No `cms/` Directus stack.

**After:**

| Area | Change |
| --- | --- |
| `cms/` | New Compose stack, scripts, docs, schema meta, gitignored secrets/uploads |
| Root `.gitignore` | Ignores `cms/.env`, uploads, dumps, `.tmp` |
| Astro `src/` | **Unmodified for CMS** |
| Live website content | **Not imported into Directus** |

Unrelated pre-existing dirty files (favicon, step-9f screenshots) were left alone.

## Stack

| Component | Version / detail |
| --- | --- |
| Directus | `directus/directus:12.6.0` |
| PostgreSQL | `postgres:16.10-alpine` |
| Studio / API | `http://127.0.0.1:8055` (loopback only) |
| DB host exposure | None (internal `database:5432`) |
| DB persistence | Docker volume `vortex_cms_pgdata` |
| Media persistence | Bind mount `cms/uploads` |
| Secrets | `cms/.env` (gitignored); placeholders in `cms/.env.example` |

## Collections created (8 / Core limit 25)

1. `team_members`  
2. `portfolio_projects`  
3. `portfolio_screenshots` (M2O → projects)  
4. `services`  
5. `insights_articles`  
6. `site_settings` (singleton)  
7. `homepage_content` (singleton)  
8. `page_sections`

Schema apply: `cms/scripts/apply-schema.mjs` (idempotent; optional `--reset-custom-collections` for empty custom-table rebuild). Meta: `cms/schema/collections.meta.json`.

## Security / permissions tests

| Test | Result |
| --- | --- |
| Studio requires sign-in (`/admin/login` rendered) | Pass |
| Admin `/users/me` via login + static token | Pass |
| Anonymous GET custom collections | Pass (403) |
| Anonymous GET `/files` and private file id | Pass (403) |
| Custom/file public read permission grants | 0 |
| Credentials committed to Git | No (`cms/.env` ignored) |

## CRUD / persistence

| Step | Result |
| --- | --- |
| Create `LOCAL TEST — NOT FOR PUBLICATION` team item | Pass |
| Update / archive test item | Pass |
| Upload 1×1 PNG | Pass |
| `docker compose restart` then re-read item + file | Pass |
| Cleanup test item + file (no volume wipe) | Pass |

## Admin workflow (owner)

1. `cd cms && cp .env.example .env` — fill strong secrets.  
2. `sg docker -c 'docker compose up -d'` (if the shell lacks the docker group).  
3. Open [http://127.0.0.1:8055](http://127.0.0.1:8055) → Sign In.  
4. `node scripts/apply-schema.mjs` then edit collections in Studio.  
5. Stop with `docker compose down` (keeps volumes).

**Bootstrap note:** `owner@localhost.local` failed Directus email validation on first boot. Corrected to `owner@example.com` and the empty volume was recreated once so admin install could succeed.

## Astro regression (no CMS reads)

| Command | Result |
| --- | --- |
| `npm run check` | Pass — 0 errors / 0 warnings / 0 hints (83 files) |
| `npm run build` | Pass — **35 pages**, static output |
| `npm test` | **24 pass / 1 fail** — see below |
| `npm run test:e2e` against running `astro dev` on :4321 | 12 pass / 5 fail (sitemap 404 + Insights DEV preview) — environment conflict |
| e2e against `astro preview` on :4377 after build | **17 pass / 0 fail** |

**Unit failure (pre-existing, not introduced by `cms/`):**  
`tests/unit/site-quality.test.ts` expects homepage film size `4718893` bytes; `public/videos/vortex-team-showcase.mp4` is `13032156` bytes. Astro still serves the film; e2e homepage video test passed on preview.

**Preservation checks (Astro tree):** 6 public portfolio slugs built; 9 team profile routes built; 12 blog drafts on disk; 8 services built; contact remains copy-only (e2e pass); Insights unpublished on static preview (e2e pass).

## Deliverables

- `cms/compose.yaml`, `.env.example`, `.gitignore`, `README.md`
- `cms/scripts/{apply-schema,verify-10a,verify-persistence,cleanup-test-data}.mjs`
- `cms/docs/{CONTENT_SCHEMA,SECURITY_AND_PERMISSIONS,PUBLICATION_ARCHITECTURE,BACKUP_AND_RESTORE,STEP_10A_LOCAL_TESTS}.md`
- `STEP_10A_ARCHITECTURE_REVIEW.md`
- This report

## Blockers resolved during 10A

1. Invalid admin email TLD → fixed + empty DB rebootstrap.  
2. Integer PK vs UUID relation → reset custom collections with UUID PKs.  
3. Transient Directus 503 under schema pressure → retries + re-apply.

## Explicit non-goals (not started)

- Step 10B content migration  
- Step 10C Astro ↔ Directus integration  
- Domain, DNS, business email, Formspree/SMTP, hosting, CI deploy  
- Fake employee/portfolio content left in the CMS  

## Next actions (owner / later steps)

1. Keep using Studio at `http://127.0.0.1:8055` for schema familiarity only.  
2. Begin **Step 10B** only when ready to migrate real content as drafts with `publication_approved=false`.  
3. Optionally align the unit test expected MP4 byte size with the current film file (frontend hygiene, not CMS).

---

**STEP 10A: PASSED**
