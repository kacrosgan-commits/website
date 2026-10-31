# STEP 10C — Secure Astro ↔ Directus Content Integration

**Project:** Vortex Digital agency website  
**Owner environment:** Ubuntu Linux, `/home/ubuntu/Documents/website`  
**Existing frontend:** Astro 7 + TypeScript + Tailwind CSS v4, static output  
**Existing CMS:** Directus 12.6.0 and PostgreSQL 16.10 via Docker Compose under `cms/`; Studio/API bound to `http://127.0.0.1:8055`  
**Execution:** Cursor Agent, inside the EXISTING repository  
**Status of this document:** Implementation instructions, NOT a claim that implementation has occurred.

## 0. Objective and non-negotiable outcome

Implement a **secure, typed, build-time integration path** that lets the current Astro website use approved published records from Directus **when explicitly enabled**, while preserving its exact working public site in the default mode. This is **Step 10C: integration and controlled comparison**, **not Step 10D publishing automation or public deployment**.

Do **real coding and verification**, not a research-only report. Reuse existing data structures, components, routes, images and tests wherever possible. Do not redesign Vortex Digital or rebuild it with Next.js/React. Do not reset the CMS, re-import all content, replace the current video, invent people or projects, or begin later steps.

**Required security posture:** A CMS record being present, or marked `status=published` alone, is NEVER enough for public release. The complete publication gate must be enforced on server and build sides. Draft Insights must never be written to public HTML, JavaScript, JSON, sitemap, or copied public media.

**Important migration fact:** Step 10B deliberately migrated all editorial CMS records as `status=draft`, `publication_approved=false`, `published_at=null`, **including the nine staff and six case studies that were previously approved on the static Astro website**. Therefore a strict CMS-only published query currently returns no publishable team/case/service items. **Do not silently turn them into approved/published records, do not drop public pages, and do not pretend a CMS build is ready.** Implement the CMS path and prove it with isolated fixtures, but keep the live/default website on local content until the owner has reviewed and separately authorized baseline reconciliation. This safe limitation must be prominent in the final report.

## 1. Mandatory preflight — inspect before editing

Read the actual repository, not just prior reports:

- `package.json`, `astro.config.ts`, `src/content.config.ts`, `src/data/`, `src/utils/`, `src/pages/`, `src/components/`, `src/layouts/`, `src/styles/global.css`, `tests/unit/`, `tests/e2e/`, `playwright.config.ts`, site/test scripts.
- All six portfolio case-study Markdown sources, service data, all nine team profile data sources, twelve local Insights drafts, screenshots, portraits, current homepage video and poster, manifests and publication safeguards.
- `cms/compose.yaml`, `cms/README.md`, `cms/.env.example` (**never print the private `.env` contents**), `cms/schema/collections.meta.json`, `cms/docs/{CONTENT_SCHEMA,SECURITY_AND_PERMISSIONS,PUBLICATION_ARCHITECTURE,BACKUP_AND_RESTORE,STEP_10B_MIGRATION_GUIDE}.md` if present.
- `cms/scripts/{apply-schema,migrate-content-10b}.mjs`; `STEP_10A_REPORT.md`, `STEP_10A_ARCHITECTURE_REVIEW.md`, `STEP_10B_REPORT.md`, `STEP_10B_MIGRATION_AUDIT.md`, `STEP_10B_MEDIA_AUDIT.md`, `STEP_10B_COMPLETION_REPORT.md`, `STEP_9E_REPORT.md`, `HOMEPAGE_TEAM_VIDEO_REPORT.md`.
- `git status --short` first; **do not discard or reset** any dirty or untracked work; never expose secret file content.

Record exact current versions, count baseline and schema/API shapes based on actual code. Prefer a small new content adapter layer and narrow template refactors over touching every component.

Before changes verify, if available:

```bash
cd /home/ubuntu/Documents/website
cd cms && docker compose ps && cd ..
npm test
npm run check
npm run build
npm run test:e2e
```

The reported **Step 10B completion baseline** is **25/25 unit tests, 17/17 E2E, 0 Astro check errors/warnings/hints, 35 built HTML pages and 31 sitemap URLs**. Treat these as **previously reported**, not guaranteed current results. Capture an actual fresh baseline and never fake passing numbers. Verify expected Directus counts from a scoped, private verification script: 9 team, 6 projects, 18 screenshots, 8 services, 12 Insights drafts, 1 homepage, 1 settings, 8 page sections, 29 uploaded files.

## 2. Hard scope boundaries

**Must preserve:**

- All six previously approved public portfolio case studies, their exact slugs, order, 18 original screenshots, URLs, copy and verified contribution boundaries: ScaleUp Systems; MedaStaré; Gain Energy / Upstrima; GoWabi; Daniela Diamonds; Born To Rock. Six `sample-*` projects are not published.
- All nine previously published team profiles, exact names, roles, biography distinctions, slugs, display order, associated portraits: Don Tran; Joshua Mendoza; Lin Jiayi; Pongsak Rattanakul; Dmytro Melnyk; Carlo Garcia; Matheus Pereira; Adrian Cruz; Sofia Vasylivna Melnyk. Adrian's external work must not be attributed to Vortex Digital. Adrian and Matheus have DISTINCT portraits.
- Eight service routes, exact existing slugs, CTA-to-contact prefill, portfolio/gallery navigation, About, Process, home, team, privacy, terms and 404 behavior.
- All twelve Insights as **private unpublished drafts**; `/insights/` remains its honest empty state until at least one article is specifically approved and published. Do not reveal their text, titles, slugs, previews or internal routes in any public build.
- The owner's **CURRENT 30-second homepage video** at `public/videos/vortex-team-showcase.mp4` (~13,032,156 bytes), current poster, below-hero section, on-demand playback (`preload="none"`, no autoplay) and truthful illustrative-footage disclosure. **Never restore the older 18.5-second video.**
- Contact remains **copy-only**, showing “Inquiry copied. No message has been sent.”; no fake submission, no contact endpoint, no placeholder mailbox sent to visitors.
- Premium existing dark-purple UI, responsive/keyboard behavior, SEO, metadata, 404/`noindex` rules and accessible menu.

**Absolutely do not:** change domain/DNS, `PUBLIC_SITE_URL` or canonical placeholder origin, business email, contact delivery, SMTP, Formspree, hosting, production CI/CD, deployment, public CMS permissions, Directus license, or package dependencies without clear necessity. Don't introduce a browser-side admin API, token in `PUBLIC_*` variables, or a public draft-preview endpoint. Don't run `docker compose down -v`, reset database or destroy uploads. Don't edit original media or local editorial copy as part of the CMS migration.

## 3. Feature-switch contract — default remains local

Build a centralized, validated selector with **exactly** these conceptual modes (choose and document actual env names; suggested `CONTENT_SOURCE`):

| Mode | Meaning | Public artifact |
| --- | --- | --- |
| `local` (default) | Existing local content only; no Directus dependency, no CMS secrets required | Same approved Astro pages as Step 10B |
| `cms-shadow` | Fetch/read imported CMS content privately, normalize and compare with local snapshots; **render/build local public content only** | Identical to `local`, no copied draft CMS media |
| `cms` | Explicit build-time CMS source; **only `published` AND `publication_approved=true` AND valid `published_at` (or documented stricter gate)**; fail closed on missing/incomplete approved baseline | Only approved published CMS records; **not currently eligible for real cutover** |

- Missing/empty mode means `local` and must never silently select `cms`.
- Unknown mode → clear nonsecret configuration error; do not fall back silently.
- `local` must build successfully if Directus is stopped and must make **zero** outgoing requests to Directus.
- `cms-shadow` may authenticate to a restricted staging reader; it must **NOT** render, publish, log full article bodies, expose draft names/routes, write draft media into `public/` or `dist/`, or alter the visible site. A failed fetch/validation must mark shadow **failed**, never pass under a fake match. Local public build may remain available but report that comparison was incomplete.
- `cms` must require a separate explicit opt-in and **release-readiness gate**; do not allow a build to produce an empty team, portfolio or services section merely because records are staged. If eligible published baseline is incomplete, abort with clear actionable errors. Do not silently mix local and CMS data in `cms` mode: any intentionally static/unmodeled components must be individually documented.
- Never automatically upgrade staged records to published/approved based solely on source tags. Source approval and CMS approval are **distinct facts**.
- Do not enable shadow in a public deploy pipeline or inadvertently ship draft data through build artifacts.

Document local invocation examples using Ubuntu shell:

```bash
npm run build                       # local (default)
CONTENT_SOURCE=local npm run build
CONTENT_SOURCE=cms-shadow npm run build   # local HTML plus private comparison
CONTENT_SOURCE=cms npm run build          # EXPECTED to fail closed until approved baseline is reconciled
```

If creating helper commands, do not break the standard `npm run build` / `npm run preview` workflow.

## 4. Directus API access and credentials

Implement a **server/build-only Directus client** compatible with the existing v12 API/schema. Use only exact collection fields actually present; prefer REST `fetch` with allowlisted fields or the existing available SDK if already installed; no unnecessary new dependencies.

- `DIRECTUS_URL` should be set locally to `http://127.0.0.1:8055` for Ubuntu-host build scripts, validated as a URL and not exposed in frontend output.
- Use `Authorization: Bearer <token>` **in headers**, never `?access_token=...`, never browser JS, inline scripts, page props, console logs, screenshots, or source-controlled files.
- Store example variable NAMES in `.env.example`, not values. Put actual tokens only in already-ignored local secret files (with restricted file permissions). Do not print secrets or rely on `PUBLIC_` prefixes. Account for actual Astro/Node env loading when implementing scripts; verify no secrets in `dist`, scripts shipped to browser, sourcemaps, or reports.
- **Never use the current full-power `ADMIN_TOKEN` for the normal Astro build.** Create/verify a minimal **read-only build API identity/policy** with **no Studio access, no writes** and read permission restricted to appropriate published+approved items and the minimum allowed file metadata/assets. Verify whether the installed Directus Core license permits the extra API-only identity/policy; if blocked, document it rather than bypassing least privilege.
- For `cms-shadow`, imported rows are still `draft`/unapproved; a distinct, tightly restricted **audit-only token** may be needed to read them privately. Its permissions are strictly read-only with only required fields/media metadata; do not grant public role access. Never reuse that audit token for public `cms` builds. If obtaining this role/token needs owner action, provide explicit local UI instructions and mark shadow verification blocked until it exists; **do not use the admin secret as a workaround**.
- Verify anonymous requests to `/items/team_members`, `/items/insights_articles`, `/files` and `/assets/<id>` still return `403`; also confirm anonymous can't obtain media via other exposed surfaces. Never change anonymous permissions to fix media access.
- Use short timeouts, finite retries with bounded backoff for transient 5xx, explicit authentication and schema-error handling, pagination for full result sets, minimal field projections, stable sorting, and schema validation (Zod or equivalent already present).
- Restrict CMS URL to expected backend in local mode, avoid unvalidated media URLs/redirects and server-side request forgery. If downloading files, follow a validated Directus `/assets/{UUID}` endpoint with bounded redirects or no redirects; reject arbitrary URL/user-supplied host.
- Sensitive names, IDs and unpublished bodies may be present in private audit checkpoints; keep these under gitignored `.tmp`/`cms/.tmp` with restrictive permissions. Never dump `cms/.env`.

## 5. Implement typed, testable content adapters

Create small maintainable modules; exact filenames may follow repo conventions, for example:

```text
src/lib/content/
  types.ts
  source.ts
  local.ts
  directus-client.server.ts
  directus-mappers.ts
  publication-gates.ts
  media-manifest.ts
  parity.ts
scripts/
  cms-shadow-audit.mjs
  cms-published-readiness.mjs
  cms-build-media.mjs
  cms-rollback-check.mjs
```

Do not copy this tree blindly; inspect the existing structure and implement the minimal best fit. In all modes produce **the same normalized application-facing shapes** for: `team_members`, `portfolio_projects` + screenshot gallery, `services`, `insights_articles`, `homepage_content`, `site_settings`, and supported `page_sections`.

Mapping requirements:

1. Slugs validated as URL-safe, unique and stable. Preserve existing exact paths: `/team/{slug}`, `/portfolio/{slug}`, `/services/{slug}`. Reject collisions and unexpected duplicates before build. Maintain sort order and featured project order; no unrelated reordering.
2. Team: name/role/intro/biography/responsibilities/expertise/external experience, portrait image/alt, related profiles, optional socials; preserve distinctions such as external experience vs company employment.
3. Portfolio: approved projects only; screenshot order 1–3 per project; preserve contribution scope, technologies, URLs, category/industry, alt text, featured sort, mobile/website media layout; reject orphan screenshot rows.
4. Services: all 8; map icon tokens and structured sections to existing UI without new unsupported claims; keep service → `/contact?service=...` behavior.
5. Insights: full Markdown bodies imported faithfully but **never render private drafts** in default or CMS public static output; new routes should only derive from fully approved published items in a later authorized state. Render content safely; avoid unsanitized HTML/script injection, preserve working Markdown rendering semantics.
6. Homepage/settings: headings, CTA copy/link, featured projects, team-film label and disclosure, static vs CMS media references. Do not replace the current MP4 for a file fetched from an unapproved record.
7. Page sections: the eight modeled sections can be CMS-backed; where the current complex Astro interface has **no corresponding CMS field**, leave that UI unchanged and explicitly document that it's still code-managed. Do not invent filler content to fake a fully editable page.
8. Metadata: preserve unique titles/descriptions, canonical/trailing slash conventions, JSON-LD escaping, sitemap inclusion/exclusion, robots, 404 noindex, correct fallback/blank handling.

Validate *both* collections and relationships server-side, including required media metadata, referential integrity, allowed URLs and safe publication gating. Make mapping/parity unit-testable without running Directus.

Astro implementation: use a centralized **build-time snapshot/adapter or Astro content-loader integration** that actually works with Astro 7 static `getStaticPaths()` and existing components. Reuse existing templates. Do not add on-demand server rendering or require Directus for every page request. Make sure local build mode does not import a module that eagerly fetches CMS data.

## 6. Safe published-baseline reconciliation — NO automatic approval

Create a deterministic, reviewable **reconciliation plan**, not a silent bulk-publish operation:

- Inventory imported CMS source states vs current Astro source-approved/public states. Compare mapped values and content hashes without dumping all private values into public reports.
- Prepare `STEP_10C_RECONCILIATION_PLAN.md` and optionally a JSON machine-readable private manifest (`cms/.tmp/step-10c-reconciliation.json`), listing **what would need owner review/approval** to reproduce the present public site: 9 staff profiles, 6 approved case studies, 8 service records, as well as applicable singleton/homepage/section/screenshot dependencies. Keep the 12 Insights draft/unapproved. Also review media relationships, contribution verification, and authorizations.
- Provide per-record status (source publicly approved? imported CMS draft? checksum/parity? CMS ready?) and publication gate decision, but **do not automatically flip `status`, `publication_approved` or `published_at`**.
- If published flags currently differ, keep `CONTENT_SOURCE=local` and block actual real-data `cms` builds until an owner-approved reconciliation is performed in a future explicit action (normally Step 10D). Specify exactly what authorized owner action is required.
- You may implement a **readiness validator** checking these gates and a non-mutating preview of what would be published. Do not run a publication mutation, don't leave a destructive or one-click bulk-approval script enabled, and never write staged items to the real public artifact.
- Unit/integration tests for CMS mode should use **isolated mock API responses or a disposable test database populated with synthetic approved fixtures**, never permanently update the real migrated drafts for testing. Include negative tests where one approval flag, status, date or related image is missing.
- A CMS-mode build using current real Directus staged data should **fail with a clear 'baseline not approved' error** rather than silently generating fewer pages. This expected guard failure is not a broken test; document it.

## 7. Private Directus media: secure build-time handling

This is a CRITICAL engineering area. Currently anonymous `GET /assets/<id>` returns `403`, and it **must continue to**.

**Do not** output Directus `/assets/{uuid}?access_token=...`, static tokens, signed credentials, privileged headers, data URLs containing private content, runtime proxy endpoints without authentication, or CMS drafts in `dist`. Do not grant public File Library access. Do not reference a Directus media URL directly from browser HTML if it would require the token to render.

Design and implement **build-time materialization for approved/public media only**:

- After server-side approved content filtering, compute the exact allowlist of referenced file UUIDs (team portraits, approved project screenshots, relevant homepage poster/video, other approved media). Include only files referenced by valid approved content; **not all 29 CMS files**.
- Authenticated fetch with header at BUILD TIME only; validate Directus file UUID, MIME sniff/signature where appropriate, max size, allowed types (WebP/JPEG/PNG/MP4 as actually needed), dimensions when available, length and hash; reject SVG/HTML or arbitrary script-bearing files unless carefully supported and sanitized. Do not re-encode, overwrite or alter the owner's current 30-second MP4.
- Choose a deterministic, content-hashed path such as `/cms-media/{sha256}.{ext}` and emit that into final HTML. Preserve width/height/alt, WebP delivery rules, image lazy/eager priorities, and video poster/on-demand loading.
- **Never store a secret in the output.** No anonymous HTTP call to Directus is required at viewer time. Any derived media URL served by the static site is intentionally public **only after approval**.
- Use **private temporary staging** (gitignored `.tmp`), then copy just the approved materialized media into `dist/cms-media/` during an explicit CMS build. Avoid writing draft media into `public/` or an untracked public folder that can accidentally leak into subsequent default/local builds. Clean stale generated media from previous builds and on failed builds. Build orchestrator should preserve `npm run build` and not publish stale unapproved files in either mode.
- CMS shadow parity may verify file IDs/metadata/checksums privately but must never materialize draft media into `dist` or into publicly copyable folders.
- If an approved file is missing/403, fail CMS build without replacing it with a photo from another employee or an unrelated fallback. Keep original Astro local assets only in explicitly local mode, not as a silent CMS fallback.
- Directus data can contain a media ID that points to another unapproved record's file; independently validate relationships and content eligibility before materializing it.
- Scope and time-limit authenticated file retrieval; avoid loading 13 MB into unnecessarily duplicated memory. Asset URLs must never include tokens even in logs.

**If secure media materialization cannot be implemented and tested in this step, DO NOT turn on CMS mode.** Mark it blocked and keep local output intact; don't solve this by opening `/assets` to everyone.

## 8. Reuse frontend without visual rewrites

Connect existing page data reads and route enumeration through the normalized adapter:

- Home; About; Process; Services index and 8 dynamic pages; Portfolio index and 6 dynamic approved studies; Team index and 9 dynamic profiles; gallery (still noindex); Insights index (still empty); Contact (copy-only); Privacy/Terms/404 unchanged except existing data plumbing if absolutely necessary.
- No new framework, route names, slug rewrites, empty placeholders, or fake portfolio data. Keep page components, original screenshots and portraits in default mode.
- Preserve “People Behind the Code”/team-film section placement or the actual current Step 9F title; owner's 30s film and disclosure must not change.
- Preserve existing `astro/zod` import fix, responsive typography, heading/layout reflow, touch targets, accessible mobile menu, no-JS behavior, SEO and sitemap conditions.
- When possible, adapt data at a narrow entrypoint; avoid replacing HTML with client-side fetching. Don't expose preview credentials in the page HTML or cause an API call from visitors' browsers.
- Don't assume CMS source includes all complex layouts. Mark any code-managed portions explicitly in the parity report.

## 9. Comparison and acceptance tests

Implement **real testable proof** for each of the following. Separate actual tests from untested assumptions:

### 9A. Baseline, local independence, same-site regression

- Run an actual full local build and all existing tests with Directus running.
- Stop only Directus temporarily if safe (`docker compose stop directus`, not database and never `down -v`); verify `CONTENT_SOURCE=local` build still passes and creates **35 HTML pages / 31 sitemap URLs**, then restart Directus (`docker compose start directus`). If touching running container state could disrupt someone else, use a mock unreachable `DIRECTUS_URL` in local mode instead and explain why.
- Hash/compare representative HTML structures and internal links before/after, not just page count: home, About, Process, 8 services, 6 case studies, 9 profiles, Insights, Contact, 404. Existing visual design and 30s video source unchanged in local mode.
- All six portfolio cases and nine people still visible exactly as before. Twelve Insights still absent from `dist` (including titles, draft slugs and Markdown bodies), and drafts return 404; contact no-send behavior passes; gallery, legal and 404 inclusion rules preserved.

### 9B. Shadow mode and mapping/parity

- Authenticated `cms-shadow` fetch of all staged records with a constrained audit-only token. Compare 9/6/18/8/12 plus singleton/section relationships; compare exact slugs, names, alt text, order and core content. Report all mismatches (don't silently fix editorial copy). Confirm no changes to visible `dist` HTML or sitemap vs `local` (compare hashes after normalization only for genuinely non-content build variations).
- Assert **zero draft CMS media copied to public output**, zero draft titles/slug/body leaks, zero Directus auth tokens/localhost API references in JS/HTML/CSS/sitemap. Record a redacted parity summary and any mapped/unmapped fields.

### 9C. CMS eligible-content gate

- Unit tests for fully approved/published synthetic records (including related screenshot, portrait, metadata and singletons), and for each missing gate: `status!=published`, `publication_approved=false`, `published_at=null`, missing/invalid media, duplicate/invalid slugs, incomplete public baseline.
- Actual `CONTENT_SOURCE=cms` attempt against the current staged database must **fail closed** with a documented missing-approval report; do not call that a successful public cutover, and do not mutate the actual CMS items to force it green.
- An isolated synthetic approved fixture must produce expected static paths/sitemap and never expose draft fixture records. Do not let fixture content leak into normal `dist`, `public`, or Git history.

### 9D. Media security / request integrity

- Anonymous Directus API/media 403 retained.
- Server-side authorized media download works **for an approved synthetic asset** or test-scoped fixture without leaking token, and final static path is token-free.
- Probe wrong UUID, missing asset, 403, malicious MIME, over-limit size, redirect to disallowed host, duplicate asset reference, and an asset attached only to draft content. Fail safely; ensure temporary files are cleaned.
- Verify video has no autoplay and isn't downloaded on initial page load in `local`; gated `cms` behavior should also preserve this contract in fixture tests.

### 9E. Site-wide quality

- `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` (run E2E against a **production `astro preview`**, not an existing `astro dev` process). Report **actual** pass/fail counts and any environmental limitations.
- Browser test 320, 375, 768, 1024, 1440 CSS px; 200% root text; no horizontal overflow, broken images or console errors. Keep the current 35-page baseline for local.
- Re-run metadata/sitemap assertions, slug relationships, team/portfolio images, alt text, original approved case-study hashes, publication guards and copy-only contact.
- If adding tests increases total counts, report both old and new. Never rewrite assertions merely to hide failures.

## 10. Failure, rollback and recovery

Document a one-command rollback for default local mode. It must NOT require any DB restore:

```bash
cd /home/ubuntu/Documents/website
CONTENT_SOURCE=local npm run build
npm run preview
```

- On any missing CMS secret, permission error, unreachable DB, malformed schema, broken relationship, unapproved baseline, missing media, or partial download, `cms` should fail with a clear error and leave **no misleading partial CMS output**. Rebuild `local` cleanly to restore an authorized public artifact.
- Don't set a CMS default on the project globally. Do not commit secrets or use unreviewed `.env` changes.
- Store private audit artifacts in ignored files; keep owner backups from Step 10B untouched. If changing schema or permissions is necessary, first create a verified fresh backup, document the exact least-privilege change, and test rollback. Avoid schema changes where possible.
- A previous CMS build must not leave orphaned media in a subsequent local `dist`; add a test for this.
- Document CMS/Directus outage behavior: existing deployed static build (when there eventually is one) continues serving; *new CMS builds* fail closed; local mode remains independent. No live hosting work now.

## 11. Documentation / deliverables (required)

Create these in the project root (or an obviously documented `docs/step-10c/` folder) with **actual results**, not future-tense promises:

1. **`STEP_10C_REPORT.md`** — exact implementation scope, changed/new files, architecture, full test commands/output summary, frontend before/after, mode results, any blocked pieces, owner actions, explicit Step 10D boundary.
2. **`STEP_10C_CONTENT_PARITY_AUDIT.md`** — per-content-type counts and mapping/parity outcome; six case slugs, nine person names/portraits, eight services, 12 private Insights and missing fields; status of shadow comparison, no body dumps.
3. **`STEP_10C_SECURITY_MEDIA_AUDIT.md`** — how server-only tokens/least-privilege policies and file staging work, 403 checks, unsafe-media negative tests, artifact leakage scan, MIME/size/redirect restrictions.
4. **`STEP_10C_RECONCILIATION_PLAN.md`** — owner-review plan for originally public content, clear staged CMS vs source approval distinction, exact gates and anything still blocking a real CMS-mode build. **Do not mark any CMS item approved/published without owner action.**
5. **`STEP_10C_ROLLBACK_GUIDE.md`** — exact Ubuntu local commands and expected checks for reverting to local, verifying build, preserving Directus data and media.
6. **`STEP_10C_ARCHITECTURE.md`** — short readable explanation of data flow, feature switches, where to edit future pages, incomplete CMS coverage, `npm run build` coordination, and the intended Step 10D publication workflow.
7. Optional: private JSON parity/asset manifest under gitignored `cms/.tmp/` with only the minimum identifying data and no secrets; do not make it downloadable from a live route.

Every deliverable must distinguish **implemented and tested**, **partially implemented**, **blocked**, and **not in scope**. Document counts of each backend collection, generated public pages and sitemap entries, tests, and owner actions. Do not claim a real approved CMS cutover occurred when all real CMS records are staged.

## 12. Explicit acceptance criteria

Step 10C is **PASSED for a protected integration** if ALL applicable claims are evidenced:

- A typed Directus adapter is implemented, tested, and reachable privately with least privilege for the applicable modes; no admin token in public artifacts.
- Three source modes behave correctly; `local` is the safe default and remains fully independent of Directus; `cms-shadow` really compares data when a scoped audit token is available and **never leaks** drafts; `cms` enforces all publication gates and refuses an unapproved baseline.
- Static media strategy is implemented and tested or `cms` explicitly remains blocked until the strategy is safely completed. Never weaken anonymous Directus privacy.
- Existing local 35 pages/31 sitemap entries and the Step 10B baseline content pass regressions, including owner's 30-second MP4, 6 projects, 9 people, 8 services, 12 unpublished drafts and copy-only contact.
- Owner-facing reconciliation plan exists; **zero real CMS approval/publication mutations** were performed.
- Local rollback works; no domains, emails, delivery, hosting, deployment or Step 10D automation were touched.

If a required security or integration control could not be implemented safely, classify Step 10C as **PARTIAL**, explain precisely, and stop before exposing anything. Do not compensate by publishing drafts or opening public read permissions.

## 13. Suggested execution order in Cursor

1. Preflight, read reports and source, checkpoint status and local baseline.
2. Verify Directus schema, collection counts and private API readiness; document required scoped tokens/policies.
3. Add selector and normalized local adapter; assert unchanged local build first.
4. Add server-only Directus fetching/mappers and strict Zod validation; add isolated unit tests.
5. Add private `cms-shadow` comparison; ensure local artifact byte/content equivalence and no leaks.
6. Add CMS publication gate/readiness validator; build fixture-only CMS route tests and explicit real staged-data fail-closed check.
7. Add allowlist-based build-time private media processing with no `public/` draft writes; test adversarial failures.
8. Connect static templates/`getStaticPaths` to the adapter in a carefully scoped way; preserve SEO and prior content.
9. Run local/offline/shadow/CMS-gate tests, full Astro QA, media/privacy scans and rollback drill.
10. Generate all six reports with evidence, restore default `local` mode, verify Directus containers healthy, and STOP.

**DO NOT START STEP 10D. DO NOT CONFIGURE DOMAIN, EMAIL, CONTACT DELIVERY, HOSTING, OR DEPLOYMENT.**

## 14. Official references (for implementation, not a substitute for repo inspection)

- Astro content collections and build-time loaders: https://docs.astro.build/en/guides/content-collections/
- Astro static dynamic routes: https://docs.astro.build/en/guides/routing/
- Astro build-time fetching: https://docs.astro.build/en/guides/data-fetching/
- Directus permissions and policies: https://directus.com/docs/guides/auth/access-control
- Directus static tokens and auth: https://directus.com/docs/guides/auth/tokens-cookies
- Directus API filtering: https://directus.com/docs/guides/connect/filter-rules
- Directus file metadata API: https://directus.com/docs/api/files

These URLs are background documentation. **The actual installed Directus v12 schema and existing Astro repository take precedence over illustrative snippets.**
