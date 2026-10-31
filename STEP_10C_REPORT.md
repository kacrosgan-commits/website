# STEP 10C REPORT — Secure Astro ↔ Directus Integration

**Project:** `/home/ubuntu/Documents/website`  
**CMS:** Directus 12.6.0 @ `http://127.0.0.1:8055`  
**Date:** 2026-10-31  
**Classification: STEP 10C: PASSED (protected integration)**

Default public site remains **local**. CMS path is implemented with strict publication gates, scoped read-only identities, shadow parity, and fail-closed `cms` builds against the current staged database. **No** Directus records were approved or published. Step 10D was not started.

## 1. Executive status

| Capability | Result |
| --- | --- |
| `CONTENT_SOURCE=local` default | Pass — 35 pages / 31 sitemap; works with Directus unreachable |
| `cms-shadow` private parity | Pass — 9/6/18/8/12; 0 publish-eligible; no dist leaks |
| `cms` against staged DB | Pass (fail closed) — exit 1 with baseline blockers |
| Scoped shadow/build tokens | Pass — read ok, write 403, no Studio app access |
| Anonymous Directus | Pass — collections/files/assets **403** |
| Admin token in Astro | Not used |
| Real CMS publish mutations | **None** |
| Owner 30s homepage MP4 | Preserved at `public/videos/vortex-team-showcase.mp4` |
| Domain/email/hosting/deploy | Untouched |

## 2. Environment

| Item | Value |
| --- | --- |
| Node | v24.x |
| Astro | 7.3.8 |
| Directus / Postgres | 12.6.0 / 16.10-alpine |
| Unit tests | **29 pass / 0 fail** (was 25; +4 content-gate tests) |
| `astro check` | 0 errors / 0 warnings / 0 hints |
| Local build | 35 HTML / 31 sitemap |
| E2E (preview :4377) | **17 pass / 0 fail** |

## 3. Implementation summary

### New / updated code

- `src/lib/content/*` — source modes, gates, client, mappers, local snapshot, parity, media, orchestration
- `src/layouts/BaseLayout.astro` — `cms` mode fail-closed hook
- `scripts/cms-setup-identities-10c.mjs`, `cms-shadow-audit.mjs`, `cms-published-readiness.mjs`, `cms-build-media.mjs`, `cms-rollback-check.mjs`
- `.env.example`, `package.json` scripts, `.gitignore`, `tsconfig.json` excludes
- Unit tests: `tests/unit/content-gates.test.ts`

### Directus identities

Created read-only users/policies/roles (no admin token for builds). Core license **blocks custom permission filter rules**; publish eligibility is enforced in Astro. See `STEP_10C_SECURITY_MEDIA_AUDIT.md`.

## 4. Mode results

```bash
CONTENT_SOURCE=local npm run build          # Pass (also with DIRECTUS_URL=http://127.0.0.1:9)
CONTENT_SOURCE=cms-shadow npm run build     # Pass — local HTML; private audit via npm run cms:shadow
CONTENT_SOURCE=cms npm run build            # Fail closed — 0/9 team, 0/6 projects, 0/8 services eligible
```

## 5. Frontend before/after

| Concern | After 10C |
| --- | --- |
| Visual design / nav / SEO | Unchanged |
| 6 portfolio + 9 team + 8 services | Unchanged in local mode |
| 12 Insights drafts | Still private / empty public Insights |
| Contact | Copy-only preserved (e2e pass) |
| Homepage film | Same 30s file, poster, disclosure; player unchanged from live site |

## 6. Media

Approved-media materializer implemented; **refused** to copy draft files into `dist/cms-media` while readiness is false. Local mode continues to use `public/` assets only.

## 7. Tests run (actual)

| Command | Result |
| --- | --- |
| `npm test` | 29/29 |
| `npm run check` | clean |
| `npm run build` (local) | 35 pages |
| `npm run test:e2e` via preview `:4377` | 17/17 |
| `npm run cms:shadow` | ok |
| `npm run cms:readiness` | exit 2 / not ready (expected) |
| `CONTENT_SOURCE=cms npm run build` | exit 1 (expected) |
| Anonymous API/asset probes | 403 |
| Dist secret/host leak scan | 0 hits |

Responsive 320–1440 and 200% text covered by existing e2e site-quality suite (passed).

## 8. Deliverables

1. `STEP_10C_REPORT.md` (this file)  
2. `STEP_10C_CONTENT_PARITY_AUDIT.md`  
3. `STEP_10C_SECURITY_MEDIA_AUDIT.md`  
4. `STEP_10C_RECONCILIATION_PLAN.md`  
5. `STEP_10C_ROLLBACK_GUIDE.md`  
6. `STEP_10C_ARCHITECTURE.md`  

Private: `cms/.tmp/step-10c-shadow-parity.json`, `cms/.tmp/step-10c-readiness.json`

## 9. Blockers / residual limits

1. **Real `cms` cutover blocked** until owner sets publish gates on baseline records (reconciliation plan).  
2. **Core custom permission filters unavailable** — app-side gates compensate; protect tokens.  
3. Full per-page CMS prop wiring for every component awaits approved baseline; local templates remain authoritative today.

## 10. Owner actions before a real CMS cutover

1. Review staged CMS content in Studio.  
2. Explicitly approve/publish baseline team/projects/services (not Insights).  
3. Re-run `npm run cms:readiness` → `cms:media` → `CONTENT_SOURCE=cms npm run build`.  
4. Keep Insights draft until individually approved.

## 11. Explicit non-goals confirmed

No Step 10D automation. No domain/DNS/`PUBLIC_SITE_URL`/email/Formspree/hosting/deploy changes. No anonymous CMS reads. No bulk publish script execution.

---

**STEP 10C: PASSED (protected integration)** — stop. Do not begin Step 10D.
