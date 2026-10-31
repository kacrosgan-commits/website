# STEP 10B REPORT — Controlled Content Migration into Directus

**Project:** `/home/ubuntu/Documents/website`  
**CMS:** existing `cms/` stack — Directus `12.6.0` @ `http://127.0.0.1:8055`, PostgreSQL `16.10-alpine`  
**Date:** 2026-10-29  
**Classification: STEP 10B: PASSED** (see also `STEP_10B_COMPLETION_REPORT.md`)

Content and approved media were migrated into Directus as non-public drafts, with backups, idempotent reruns, privacy checks, and Astro regression green. Owner correction imported the current **30s** homepage MP4 as Directus file **#29** without changing the Astro public path or homepage layout.

## 1. Executive status

| Area | Result |
| --- | --- |
| Pre-migration backup | Pass — `cms/backups/step-10b-20261029-111409/` (SHA verified) |
| Inventory / dry-run | Pass |
| Import (9 / 6 / 18 / 8 / 12 + singletons/sections) | Pass |
| CMS staging (`draft`, `publication_approved=false`) | Pass |
| Insights unpublished | Pass (12/12) |
| Portraits / screenshot relations / slugs | Pass |
| Idempotent second `--apply` | Pass (0 new files, 0 new items) |
| Persistence after `compose restart` | Pass |
| Anonymous denial | Pass (403) |
| Astro sources / public output unchanged | Pass (35 pages, 31 sitemap URLs) |
| Homepage owner-accepted 30s MP4 in CMS | **Pass** (file #29 linked) |
| Full unit suite green | **Yes** — 25/25 |

## 2. Environment

| Item | Value |
| --- | --- |
| Host | Ubuntu Linux |
| Docker / Compose | Engine 29.x / Compose V2 (`sg docker` when needed) |
| Node | v24.21.0 |
| Directus | `directus/directus:12.6.0` |
| PostgreSQL | `postgres:16.10-alpine` |
| Studio | `http://127.0.0.1:8055` |
| DB host port | not published |

## 3. CMS counts — before → after

Pre-migration inventory (`cms/backups/step-10b-20261029-111409/pre-migration-inventory.json`): all eight custom collections at **0** items (empty schema from 10A).

| Collection | Before | After |
| --- | ---: | ---: |
| `team_members` | 0 | **9** |
| `portfolio_projects` | 0 | **6** |
| `portfolio_screenshots` | 0 | **18** |
| `services` | 0 | **8** |
| `insights_articles` | 0 | **12** |
| `site_settings` | 0 | **1** |
| `homepage_content` | 0 | **1** |
| `page_sections` | 0 | **8** |
| `directus_files` (migration uploads) | 0 | **29** |

## 4. Source approval vs CMS staging

| Content | Astro / source | CMS after 10B |
| --- | --- | --- |
| 9 team profiles | Published on static site | `draft`, `publication_approved=false` |
| 6 case studies | `publicationApproved: true` | same CMS staging |
| 8 services | Public pages | same CMS staging |
| 12 Insights | Unpublished drafts | `draft`, unapproved, `published_at=null` |
| Astro flags / routes / sitemap | **Unchanged** | N/A |

Staging does **not** revoke owner approvals on the live Astro site.

## 5. Source inventory

| Kind | Count | Notes |
| --- | ---: | --- |
| Team | 9 | Don Tran → Sofia Vasylivna Melnyk; portraits mapped |
| Projects | 6 | Approved slugs only |
| Screenshots | 18 | 3 each |
| Services | 8 | Existing slugs |
| Insights | 12 | Full Markdown bodies |
| Excluded samples | 6 | `sample-*` stubs listed in manifest |

## 6. Schema changes

**None.** Used Step 10A collections/fields. No `--reset-custom-collections`, no volume wipe.

## 7. Media

See `STEP_10B_MEDIA_AUDIT.md`.

- 9 portraits + 18 screenshots + homepage poster uploaded.  
- Homepage MP4 **uploaded** (owner-accepted current film): **13,032,156** bytes / ~**30 s**. Step 9F’s 4,718,893-byte copy remains absent from git and was not restored. Astro public file + layout untouched; unit assertion aligned to owner-chosen size.

## 8. Insights privacy

All 12 CMS articles: draft, not publication-approved, no `published_at`. Anonymous `GET /items/insights_articles` → **403**. Static build still has no public article routes; Insights empty-state e2e passed on preview.

## 9. Homepage / page content

| Item | Imported | Deferred |
| --- | --- | --- |
| Hero + CTAs + team-film copy/disclosure | Yes | — |
| Featured project slug list | Yes | — |
| Team film poster | Yes | — |
| Team film video file | Yes (owner-accepted 30s MP4) | — |
| About / process `page_sections` (8) | Yes | Complex Astro-only UI left in frontend |

## 10. Backup and rollback

| Artifact | Path | Integrity |
| --- | --- | --- |
| `pg_dump` | `cms/backups/step-10b-20261029-111409/directus-before.sql` | 305,912 bytes; SHA-256 matches `BACKUP_MANIFEST.json` |
| Uploads tar | `uploads-before.tgz` | Present (near-empty pre-import) |
| Checkpoint / private manifest | `cms/.tmp/step-10b-*.json` | mode 600; gitignored |

Rollback: `STEP_10B_ROLLBACK_GUIDE.md` (targeted ID delete; emergency restore owner-only, not auto-run). Full restore rehearsal into a disposable DB: **not executed**.

## 11. Migration CLI (actual)

```bash
cd cms
node scripts/migrate-content-10b.mjs --inventory
node scripts/migrate-content-10b.mjs --dry-run
BACKUP_OK=1 node scripts/migrate-content-10b.mjs --apply   # initial import (prior run)
BACKUP_OK=1 node scripts/migrate-content-10b.mjs --apply   # second run → 0 creates
node scripts/migrate-content-10b.mjs --verify              # after restart as well
```

Guide: `cms/docs/STEP_10B_MIGRATION_GUIDE.md`.

## 12. Security

| Check | Result |
| --- | --- |
| Anonymous custom collections | 403 |
| Anonymous `/files` and `/assets/<id>` | 403 |
| No new public permissions | Confirmed |
| Secrets in Git / reports | No (`cms/.env`, backups, `.tmp` ignored) |
| Domain / email / delivery / deploy / public CMS | Unchanged |

## 13. Persistence

`docker compose restart` (no `-v`) → Directus healthy → `--verify` still reports 9/6/18/12, `all_draft=true`, distinct Adrian/Matheus portraits, 3 screenshots per project.

## 14. Astro regression

| Command | Result |
| --- | --- |
| `npm run check` | Pass — 0 errors / warnings / hints |
| `npm run build` | Pass — **35** HTML pages; sitemap **31** URLs |
| `npm test` | **25 pass / 0 fail** (after owner-accepted MP4 size assertion) |
| `npm run test:e2e` via preview `:4377` | **17 pass / 0 fail** |

Astro `src/` content sources were **not** modified for CMS integration.

## 15. Files created / modified (10B deliverables)

**Created / maintained under CMS migration work:**

- `cms/scripts/migrate-content-10b.mjs`
- `cms/docs/STEP_10B_MIGRATION_GUIDE.md`
- `cms/backups/step-10b-20261029-111409/` (gitignored)
- `cms/.tmp/step-10b-checkpoint.json`, `step-10b-private-manifest.json` (gitignored)
- `STEP_10B_CONTENT_MANIFEST.json`
- `STEP_10B_MIGRATION_AUDIT.md`
- `STEP_10B_MEDIA_AUDIT.md`
- `STEP_10B_ROLLBACK_GUIDE.md`
- `STEP_10B_COMPLETION_REPORT.md`
- This report

**Untouched invariants:** public Astro pages/components/routes; six case studies; nine portraits; twelve Insights drafts on disk; eight services; copy-only contact; `PUBLIC_SITE_URL`; credentials; DB volumes.

## 16. Risks and owner actions before 10C

1. Review CMS drafts in Studio for copy fidelity before any publish workflow.  
2. Step **10C** (Astro reads) must use a least-privilege server-only reader and published+approved filters only — not started here.  
3. Optional: if the historical Step 9F 4.7 MB optimized film is recovered later, treat replacement as an explicit media change with owner approval.

## 17. Explicit exclusions confirmed

No domain, DNS, business email, SMTP/Formspree, hosting, SSL, public CMS permissions, analytics, or deployment configuration. No Step 10C wiring. No fake employees or portfolio content.

---

**STEP 10B: PASSED** — migration, privacy, owner-accepted homepage film import, and regression suite confirmed. See `STEP_10B_COMPLETION_REPORT.md`.
