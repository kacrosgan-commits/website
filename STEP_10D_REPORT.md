# STEP 10D REPORT — Immutable Publishing & Astro CMS Rendering

**Date:** 2026-10-31  
**Project:** `/home/ubuntu/Documents/website`  
**CMS:** Directus 12.6.0 + PostgreSQL 16.10 (`cms/`, `http://127.0.0.1:8055`)  
**Frontend:** Astro 7.3.8 / TypeScript 6.0.3 / Node v24.21.0  
**Result:** **PASSED (fixture rehearsal + local regressions)** — real CMS baseline **not** owner-activated

---

## Executive result

Step 10D implements a **true draft vs public release separation**:

- Directus collections remain the **editable draft workspace**.
- Public `CONTENT_SOURCE=cms` builds read only an **immutable filesystem release** under `cms/releases/` via `ACTIVE.json`.
- Editing a Directus row **cannot** change public HTML until a new release is planned, verified, and **explicitly activated** (release ID + content hash + confirmation).
- Isolated fixture rehearsal (A→B→C→rollback) **passed**.
- Real staged CMS rows (9/6/18/8/12 + 29 files) remain **draft / unapproved**; real `ACTIVE` pointer is **null**.
- Default site stays `CONTENT_SOURCE=local` (35 HTML pages / 31 sitemap URLs).

This is **not** a production cutover and **not** a deployment.

---

## Architecture decision

| Concern | Choice |
| --- | --- |
| Immutable publish store | Filesystem releases in `cms/releases/<rel-*>/snapshot.json` (mode `0400`) + atomic `ACTIVE.json` |
| Why not Directus status alone | Core tier lacks reliable custom permission filters; `status=published` on mutable items is insufficient |
| Why not new Directus collections for releases | Avoid Core collection-limit pressure; filesystem snapshots are content-addressed and easy to audit/rollback locally |
| Owner activation | CLI only: `cms:release:activate` with `CMS_RELEASE_CONFIRM="<id>:<hash>"` or interactive TTY ( `--yes` alone is rejected) |
| Astro `cms` mode | `getPublishedSiteSnapshot()` / page accessors read ACTIVE release only |
| Media | Build-time materialization of release-referenced UUIDs only (`cms:media`) |

---

## Implementation files (created/updated)

### Core library (`src/lib/content/`)
- `release-types.ts`, `release-store.ts`, `release-builder.ts`
- `published-snapshot.ts` (`getPublishedSiteSnapshot`, build pin, fail-closed gates)
- `site-content.ts` (local vs cms render accessors)
- `index.ts` (cms mode → release, not draft fetch)

### Scripts
- `cms-release-plan|verify|activate|rollback.mjs`
- `cms-fixture-release.mjs`, `cms-fixture-rehearsal.mjs`
- `cms-build-media.mjs` (release-aware), `cms-build-local.mjs`
- `cms-security-probes-10d.mjs`

### Astro wiring
- Team / portfolio / services / insights / homepage / about / process pages branch on `CONTENT_SOURCE`
- `CmsCaseStudy.astro` for CMS portfolio details
- `ServiceVisual.astro` placeholder for unknown CMS-only service slugs
- `TeamProfile.astro` adjacent nav uses CMS roster in cms mode

### Package scripts
`cms:release:plan|verify|activate|rollback`, `cms:fixture:seed|rehearsal`, `cms:build-local`

---

## Backup (pre-change)

`cms/backups/step-10d-20261031-141926/` (gitignored, `0600`):

| Artifact | Notes |
| --- | --- |
| `directus-before.sql` | ~892 KB pg_dump |
| `uploads-before.tgz` | ~21.5 MB uploads |
| `BACKUP_MANIFEST.json` | sha256 checksums |
| `pre-change-inventory.json` | 9 team / 6 projects / 18 screenshots / 8 services / 12 insights / 29 files |

---

## Test results (actual)

| Check | Result |
| --- | --- |
| `npm test` | **32/32** pass (includes new release-store tests) |
| `npm run check` | **0 errors** |
| `CONTENT_SOURCE=local npm run build` | **35 pages**, sitemap **31** URLs |
| `CI=1 npm run test:e2e` (preview) | **17/17** pass |
| `npm run cms:shadow` | **ok**, 0 material issues; eligible public counts all 0 |
| `npm run cms:readiness` | **NOT READY** (expected) |
| `npm run cms:release:plan` | blocked: 0 eligible rows; 12 insights draft |
| `npm run cms:fixture:rehearsal` | **passed** |
| Fixture `CONTENT_SOURCE=cms` build | rendered Managing Director / Hero Title B / fixture-gamma / fixture insight |
| Real `CONTENT_SOURCE=cms` build (no ACTIVE) | **fail closed** |
| Security probes | anonymous items/files/assets **403**; 12 insights draft; real ACTIVE **null**; dist token scan **0 leaks** |

Private logs: `cms/.tmp/step-10d/` (gitignored).

---

## Distinctions (do not conflate)

| Claim | Status |
| --- | --- |
| CMS integration code works in isolated fixture rehearsal | **Yes** |
| Real production baseline owner-approved & activated | **No** |
| Website publicly deployed | **No** |
| 12 Insights published | **No** (still draft) |
| Real ACTIVE release pointer set | **No** (`null`) |

---

## Why editing Directus does not update the site today

1. Default `CONTENT_SOURCE=local` ignores Directus.
2. Even in `cms` mode, Astro reads **ACTIVE release snapshots**, not live items.
3. Real ACTIVE is unset → cms builds refuse.
4. Real rows lack `status=published` + `publication_approved` + `published_at` → plan cannot produce an eligible candidate without owner action.

### Exact future publish sequence (after separate owner authorization)

```bash
# 1) Edit/review in Studio (draft)
# 2) Owner sets editorial gates per record (not bulk)
npm run cms:release:plan
# 3) Persist candidate (implementation writes via fixture tooling today;
#    for real data, writeImmutableRelease from an approved plan — owner step)
npm run cms:release:verify -- --release <id> --hash <sha>
CMS_RELEASE_CONFIRM="<id>:<sha>" npm run cms:release:activate -- --release <id> --hash <sha>
CONTENT_SOURCE=cms npm run build
npm run preview
```

Rollback: `cms:release:rollback` with prior id+hash+confirm.

---

## Preserved

- 6 portfolio projects, 9 team profiles, 8 services, 18 screenshots, 29 CMS files  
- 30s homepage MP4 + poster + existing TeamShowcase behavior  
- Copy-only contact  
- Local mode default  
- No domain/DNS/email/hosting/deploy work  
- No Directus anonymous access; no tokens in HTML/JS  

---

## Open for Step 10E / 10F (not started)

- Owner per-record reconciliation of real staged baseline  
- Activate first real release (only after explicit authorization)  
- Production media materialization from real UUIDs  
- Hosting, domain, business email, contact delivery, CI deploy  

**Stop:** Step 10D complete. Do not begin 10E/10F.
