# Vortex Digital — STEP 10A: Directus Backend Foundation (Cursor Agent)

**Project:** Existing Vortex Digital marketing website (Astro 7 + TypeScript + Tailwind CSS v4)  
**Phase:** Step 10A of 10A–10F — independently runnable local admin/CMS backend  
**Status:** Implementation prompt, not an implementation report  
**Date:** 2026-10-28

## 0. Mission and definition of done

Build a **real, locally runnable Directus CMS and PostgreSQL backend** alongside the existing Vortex Digital Astro website. Establish persistent database and media storage; a reproducible, versioned content schema; secure admin access; future-proof fields for all CMS-managed areas; read/write permission boundaries; and clear developer setup, recovery, and testing procedures. **Do not migrate real existing site content in Step 10A** and **do not switch the Astro frontend to CMS data**. These belong to Steps 10B and 10C.

When finished, a developer with Docker installed must be able to follow the documentation, start Directus, open its **actual built-in Studio**, sign in as its owner administrator, see the defined collections and edit a *clearly marked non-public test record*, then shut down and restart without losing data. Public unauthenticated requests must not be able to read private records or drafts. If a fully runnable system is impossible in the present Cursor environment, do not declare success; complete what can actually be built and document the exact blockers and manual steps.

**Strict scope boundary:** Keep domain, DNS, `PUBLIC_SITE_URL`, business email, contact delivery, `.env` for Astro, frontend hosting, public deployment, and publication approvals unchanged. Work locally. No actual domain or DNS setup. Do not create a mock admin page.

## 1. Mandatory repository inspection — before edits

1. Inspect `package.json`, `astro.config.ts`, directory layout, `.gitignore`, `src/data/site.ts`, `src/data/defaults.ts`, `src/content.config.ts`, `src/content/blog/`, portfolio and team data, media assets, the video and poster, and relevant tests. Read `STEP_9E_REPORT.md`, `FINAL_WEBSITE_QA.md`, `PERFORMANCE_AUDIT.md`, and `HOMEPAGE_TEAM_VIDEO_REPORT.md` **if present**; do not invent their presence or content.
2. Record a concise baseline: tracked/untracked state, important existing paths, Astro package scripts, and the route/content counts. Preserve user work; never reset/rebase/clean or overwrite their changes, media, or credentials.
3. Use the actual existing data models to refine the proposed schema. Do not silently rename website slugs, rewrite copy, or create fabricated staff/project details.
4. Keep the implementation in a separate `cms/` directory inside the same repository **unless a pre-existing CMS directory demands a safer location**. This creates a separately deployable application later without affecting Astro today.

## 2. Versions, licensing, and environment compatibility

- Use current official Directus documentation, not guesses. As a verified documentation reference on 2026-10-28, the official Docker Compose guide showed `directus/directus:12.0.2`. Check the image tag and its PostgreSQL compatibility at implementation time. Use an **explicit pinned Directus image version**, not `latest`; pin a compatible stable PostgreSQL image to an explicit major/minor or digest and document the choice. Never run an uncontrolled upgrade or migration.
- Directus's newer self-hosted Core licensing has feature limits (the official 2026 pricing page lists **3 Studio seats, 25 collections, and 5 Flows**). Design below these limits and **do not claim advanced permissions, approvals, content versions, or extra seats are unrestricted**. Verify any feature/role permission requirement against the installed version; document unavailable features instead of inventing workarounds. A qualifying owner can separately investigate Directus's Open Innovation Grant, but **do not apply for a key or assume eligibility**.
- Prerequisites: Docker Desktop with Compose plugin, free ports, adequate disk/memory. Use Windows-friendly PowerShell commands in the README plus portable Docker commands where practical.
- No cloud account, S3 bucket, DNS, paid service, or deployment is needed now.

Official references to consult while implementing:
- `https://directus.com/docs/getting-started/create-a-project`
- `https://directus.com/docs/configuration/database`
- `https://directus.com/docs/configuration/files`
- `https://directus.com/docs/configuration/security-limits`
- `https://directus.com/pricing`
- `https://directus.com/license`

## 3. Proposed filesystem structure

Prefer:

```
<existing-astro-project>/
  cms/
    compose.yaml
    .env.example
    README.md
    docs/
      CONTENT_SCHEMA.md
      SECURITY_AND_PERMISSIONS.md
      PUBLICATION_ARCHITECTURE.md
      BACKUP_AND_RESTORE.md
      STEP_10A_LOCAL_TESTS.md
    schema/
      ...reproducible sanitized schema snapshot or idempotent migration scripts...
    scripts/
      ...safe setup/verification/export/import scripts only where justified...
    extensions/           # if required, and never silently install third-party extensions
    data/                 # local persistent database/media if using bind mounts; ignored by Git
  STEP_10A_REPORT.md
  STEP_10A_ARCHITECTURE_REVIEW.md
```

Keep secrets, persisted database state, uploads, runtime logs, backups, and temporary artifacts out of Git. If using Docker named volumes instead of `cms/data/`, document volume names and the actual backup procedure. Do not put original team portraits, original portfolio screenshots, or the optimized homepage MP4 into this CMS in Step 10A; their owner-approved files remain untouched. Do not create duplicate live sources of truth prematurely.

## 4. Docker Compose and database foundation

Implement a proper Compose stack with at least:

- `directus` app (fixed, verified tag), attached to an internal service network.
- `postgres` (fixed, compatible tag), durable volume for PostgreSQL data, a health check such as `pg_isready` (with correct Compose environment escaping), and a startup dependency/health strategy validated on the installed Compose version.
- Persistent Directus local uploads and any needed extensions volumes.
- **Directus bound to loopback only**, e.g. `127.0.0.1:8055:8055`, unless existing development environment requires documented equivalent. **Do not expose PostgreSQL host port by default.**
- `DB_CLIENT=pg`, internal `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`; `PUBLIC_URL` points ONLY to the local Directus URL (`http://127.0.0.1:8055` or appropriately working localhost form), NOT to the website's `PUBLIC_SITE_URL`.
- Directus `SECRET` is a **locally generated strong random secret**, not a placeholder; Postgres password likewise. Put them in ignored `cms/.env`. Provide `cms/.env.example` with *variable names and safe placeholders*, never actual credentials. If account onboarding is via Studio, document this and avoid default admin passwords in Compose. If secure bootstrap is automated, document the real mechanism and avoid printing secrets.
- Configure local file storage so files survive restarts. Set safe upload-size / MIME restrictions justified for intended image/media use, taking care not to break intended MP4 use in later phases. Never enable general public file access in 10A.
- Make startup and shutdown idempotent. **Never** put `docker compose down -v`, `docker volume prune`, or destructive database resets into normal instructions. Provide explicit warnings for destructive commands if they are mentioned at all.
- `docker compose config` must validate and must not display live secret values in captured report/output. Avoid dumping resolved Compose config into logs. Explain `docker compose ps`, health checks, and log inspection with redaction.

## 5. Content-model design (build the real schema, do not merely document it)

Inspect the real Astro site data and then implement Directus collections, field types, indexes, interface hints, and relations. Keep the **collection count comfortably below the Core tier's 25-collection cap**, including any custom junction tables. Prefer the following logical model, adjusted only with documented rationale:

### 5.1 Shared editorial fields / conventions

Each applicable CMS collection should support:

- `id` durable UUID or stable Directus-generated identifier; `slug` unique where routed; `sort`/`display_order` where ordered.
- Title/name, summary/description, detail/body as appropriate; explicit `created_at`, `updated_at`, creator/editor metadata if supported by Directus system fields.
- `status` with clear allowed values: `draft`, `in_review`, `approved`, `published`, `archived` **or** a documented compatible model; `publication_approved` boolean default false; `published_at` nullable; immutable/approval metadata planned where appropriate.
- Avoid making `publication_approved: true` a default for any new content. A status field by itself **does not enforce separate approved-version semantics**. Record the intended later implementation in `PUBLICATION_ARCHITECTURE.md`.
- `seo_title`, `seo_description`, and optional SEO image reference for routed content; enforce useful lengths, uniqueness, required fields, and media constraints.
- Archive rather than hard-delete by default. Restrict permanent delete to the owner administrator.
- Explicitly document trusted HTML/Markdown or rich-text sanitization at the Astro integration boundary; never assume database content can be output unescaped.

### 5.2 `team_members`

Must support: real name, role/title, role slug (existing routes preserved), biography, responsibilities/skills if site actually uses them, image reference, image alt, display order, featured flag, privacy/publication approval fields, optional verified external links. Do not coerce one employee portrait to another or claim external employment belongs to Vortex Digital. Do not insert invented member records in 10A.

### 5.3 `portfolio_projects`

Must support: project name, immutable existing public slug, approved contribution summary/scope, detailed sections as used on current pages, technologies, external website/App Store link, start/end timeframe if verified, featured flag and order, SEO fields, status/approval fields, and relation to multiple ordered screenshots. **Do not introduce business achievements, development scope, or software modules not confirmed by the owner**.

### 5.4 `portfolio_images` or equivalent explicit screenshot junction

Relate portfolio project to ordered asset with caption/alt/portrait-or-landscape indication/source provenance and optional original asset checksum. A project can have many ordered screenshots; preserve exact historical originals and attribution. Use normal Directus file relationships; don't create arbitrary public file URLs or broad public read permissions.

### 5.5 `services`

Must support the current eight service slugs and content: title, eyebrow/subtitle, summary, detail sections, benefits/process/deliverables where actually present, visual/icon token only from a safe existing design mapping, CTA labels/targets, ordering, SEO, status. Do not let CMS content supply arbitrary JavaScript, component names, or unvalidated external links.

### 5.6 `insights_articles`

Must support: title, slug, excerpt, Markdown or safe rich text body, author reference if authorized, category/tags where useful, cover image, SEO, status, owner approval flag, published_at and reviewed metadata. **All 12 current articles are unpublished, not to be imported or exposed in 10A.** During 10B they must default to `draft`/`in_review`, approval false, no public routes, no anonymous access.

### 5.7 `site_settings` (singleton)

Content-only information such as public-facing site name, public tagline, optional verified social links, SEO defaults, content CTA labels, branding image references. **Do not expose or manage secrets, SMTP creds, domain, `PUBLIC_SITE_URL`, hosting, or backend credentials** through this collection. Their existing deferred site configuration remains unchanged.

### 5.8 `homepage_content` (singleton) and `page_sections` / `site_pages` if warranted

Use enough structured fields to edit the hero title/description, section headlines, selected approved imagery, featured references, and the illustrative team video caption/media reference. Preserve existing homepage video behavior: 18.5-second H.264 MP4, 16:9, silent, poster-first, no autoplay; the film is illustrative, not documentary footage of real staff. `page_sections` may represent About/Process and limited reusable content blocks, with a fixed schema and whitelisted section types rather than arbitrary executable HTML. Avoid excessive collection proliferation.

### 5.9 `media_metadata` (optional)

Only if necessary to track file review/approval, owner permission/provenance, description, alt, intended usage, and visibility independently of Directus system files. If a simpler relationship suffices, omit it. For public assets later, use an approved-media export or selectively authorized retrieval rather than blanket anonymous access to all `directus_files`.

**Important:** Implement the real collections and relations in the local Directus instance, preferably using a reproducible supported schema snapshot/apply method or idempotent API scripts for the pinned Directus version. A README-only conceptual schema is not enough. If Docker or credentials are unavailable, produce accurate declarative schema and setup scripts but mark actual Directus creation as **BLOCKED / NOT TESTED**, never 'done'.

## 6. Schema reproducibility and version control

1. Choose a documented method for exporting and applying Directus schema under the pinned version. Verify actual commands/API syntax rather than guessing. Keep schema artifacts sanitized of IDs/tokens/credentials and environmental host URLs where possible.
2. If schema application or administrative API calls require an owner token, require it from a secure local environment and never echo it into terminal transcript, report, source control or frontend build.
3. Include safe re-run behavior and drift inspection. Do not destructively reapply the schema to an existing database without backup and explicit warning.
4. Document how a fresh developer machine can create an identical schema under the same pinned image version. Test if feasible.
5. Distinguish schema export from data backup and uploaded-media backup. None replaces all the others.

## 7. Security and permissions: deny by default

- The Directus Studio must require authentication. Configure the owner's initial administrator account securely; no generic published password.
- **Anonymous/Public access:** no read to team, portfolio, services, articles, settings, or files during Step 10A. Validate with anonymous HTTP requests expecting authorization failure (response code may vary with Directus version). Do not share an unrestricted admin token with Astro.
- Document an eventual least-privilege build-time reader role/policy with only *approved published records* and approved assets; implementation belongs to Step 10C when the publish filters and versions are validated. Never expose a privileged token in a `PUBLIC_` env var or client-side JS.
- Inspect the actual Core tier support for multiple roles/policies. Set up Owner/Admin and a restricted Editor/Reviewer only if supported by current tier and verified; otherwise document the planned permission matrix and explicitly avoid falsely claiming enforcement.
- Editors must not be able to approve and publish their own unreviewed drafts in the eventual workflow. Restrict permanent deletion and permission changes to the owner. In Step 10A, demonstrate only permissions supported and actually tested.
- Default all created content to draft and owner-unapproved. Never add anonymous access purely to make browser demos work.
- Validate input types, slug uniqueness, URL protocols, optional media access, HTML safety boundaries, upload formats, and file size limits.
- No third-party tracking, open registrations, broad CORS wildcard, unsafe demo accounts, or hardcoded secrets. Keep service local and password protected.

## 8. Publication and website integration architecture (design now, implement later)

Write `cms/docs/PUBLICATION_ARCHITECTURE.md` with the contract to be implemented in Steps 10C/10D:

1. **Editorial data is not automatically public.** Draft → Review → Approved → Published; publish action must preserve previous approved live version until the new version passes owner approval. An editable `status` field alone does not ensure this; design a supported Directus content-versioning, separate published snapshot, or explicit approval snapshot workflow and verify actual license availability.
2. **Static Astro recommended:** approved CMS records fetched at build time via server-only credentials; Astro outputs static pages, navigation, metadata and sitemap. No CMS token or private drafts in browser bundle, public HTML or sitemap. When CMS is down, keep the last valid deployed build; for local builds define explicit failure/rollback behavior rather than silently leaking drafts or emptying pages.
3. **Media:** approved images should be handled by a controlled asset pipeline; private drafts must not be accessible anonymously. Specify image resizing, cache considerations and image accessibility. Original local images and approved team portraits preserved until verified migration.
4. **Publishing events:** future securely authenticated webhook or CI trigger to rebuild the static frontend *after* publish. Do not configure a hosting provider, webhook secret, or external CI trigger in 10A.
5. **Deletion:** archive/unpublish records, remove public routes and sitemap links on next approved build, and prevent broken internal links. Prevent accidental media cascades.
6. **Rollback:** previous published snapshot and deploy artifact recoverable; database and uploads backed up. Test later.
7. **Contact form:** current copy-only flow stays independent; CMS must not pretend it accepts messages or silently enable sends.
8. **Site URL:** canonical, sitemap and robots remain governed by the existing deferred Astro `PUBLIC_SITE_URL`; keep `https://example.com` placeholder untouched for now.

## 9. Backups, recovery and data protection

Implement and document at least:

- PostgreSQL dump/restore plan using secure local credentials and appropriate `pg_dump` / `pg_restore` or `psql` commands for the actual images and dump format, not guessed syntax.
- Local upload backup/restore procedure and preservation of permissions and file metadata.
- Sanitized schema snapshot reproducibility.
- Never check in backup dumps, authentication tokens, user credentials, or uploaded private media.
- Test a non-destructive local persistence smoke test: restart containers without deleting volumes, verify an authorized test record and uploaded test asset persist. Do not destroy the primary data store to "prove" restore.
- Record restore rehearsal as tested / not tested explicitly.

## 10. Verification — prove it works

With Docker available, **actually execute** and report:

1. `docker compose version` and validated Compose config (never paste expanded secrets).
2. Start PostgreSQL and Directus; confirm both healthy/running, API/Studio HTTP access on loopback.
3. Complete secure admin bootstrap using the supported installed flow.
4. Verify intended collections and required fields/relations exist in the running CMS (API/schema inspection or Studio) and record collection count.
5. As authorized admin, create, read, update, and archive one **obviously fictional local test item** (e.g. `LOCAL TEST — NOT FOR PUBLICATION`) and optionally upload a tiny innocuous test image, then verify persistence across a restart. Clean up test data safely, not the volumes.
6. Anonymous API attempts to query `insights_articles`, `team_members`, `portfolio_projects` and a private file must not return private content. No public read grants in 10A.
7. Confirm `127.0.0.1:8055` binds locally and PostgreSQL is not mapped to an external host port.
8. Run existing Astro commands **without switching Astro to CMS**: `npm test`, `npm run check`, `npm run build`, `npm run test:e2e`. Compare to the Step 9F reported baseline (25 unit passed; 17 e2e passed; 35 pages; 0 Astro errors/warnings/hints) while reporting the **actual** counts, not demanding an invented result if tests changed.
9. Check all existing pages and publication safeguards: six published portfolio cases, nine team profiles and assigned portraits, twelve unpublished Insights, copy-only Contact, homepage video. No deletions, invented content, or regressions.
10. Show exact commands and results, including blockers such as Docker unavailable, license feature not available, incomplete login/role configuration, or an image pull failing. Never claim you tested an environment you could not run.

## 11. Scope exclusions and non-negotiable guardrails

**DO NOT**:

- Convert Astro to Next.js, redesign the website, add an admin tab to the public nav, rewrite homepage/team/portfolio components, or create a separate fake admin frontend.
- Import the existing 9 employees, 6 case studies, 8 services, 12 articles, images or MP4 into CMS in 10A — that is Step 10B. A disposable demo/test item is allowed but must never be publicly published or mistaken for actual agency content.
- Switch frontend reads to Directus — that is Step 10C.
- Enable public access or approve any Insights drafts.
- Modify existing public portfolio claims, team records, slugs, photo assignments or existing video disclosure.
- Set domain, business email, contact provider, `PUBLIC_SITE_URL`, DNS, hosting, CI, production deployment, cloud accounts, or external webhook.
- Add new payment dependencies, paid CMS plan, license key, provider tokens, or third-party extensions without owner direction.
- Introduce S3/R2 as a requirement yet; persistent local files are enough for Step 10A and provider migration is later.
- Commit live credentials; paste secrets into the report; modify source control history; remove existing user files; assume the backend exists simply because Compose files exist.

## 12. Deliverables

Create, with factual content and test evidence:

- `cms/compose.yaml` + secure `.env.example`, `.gitignore` adjustments, README and relevant schema/scripts.
- `cms/docs/CONTENT_SCHEMA.md` — actual collection/field/relationship table, constraints, key naming, count against Core limits, and future migration mapping.
- `cms/docs/SECURITY_AND_PERMISSIONS.md` — verified permission configuration, anonymous denial checks, license-tier limits, and planned editorial matrix.
- `cms/docs/PUBLICATION_ARCHITECTURE.md` — enforceable draft/approval/published-snapshot strategy for later steps, static Astro build contract, media visibility, and rollback.
- `cms/docs/BACKUP_AND_RESTORE.md` — DB + uploads + schema backups, restoration procedure, and safety warnings.
- `cms/docs/STEP_10A_LOCAL_TESTS.md` — real command outputs and failures, with credentials removed.
- `STEP_10A_ARCHITECTURE_REVIEW.md` — decisions, risks, version choice, feature/licensing constraints, and work postponed to 10B–10F.
- **`STEP_10A_REPORT.md`** — executive status; before/after worktree; files changed; actual Directus/Postgres versions; Studio local URL; DB/media persistence method; created collections/fields and counts; security/role tests; user-facing admin workflow; existing Astro regression results; blockers; exact next actions. End with an explicit `STEP 10A: PASSED / PARTIAL / BLOCKED` classification and do **not** mark PASSED unless the real instance and schemas were tested.

After the report: stop. **Do not begin Step 10B.**

## 13. Final acceptance checklist

- [ ] Real separate Directus Studio, not a mock admin page.
- [ ] Pinned compatible Directus and PostgreSQL images, local Compose, persistent database/upload storage.
- [ ] Strong ignored secrets; no host-exposed database and no public data leakage.
- [ ] Reproducible documented content schemas matching existing Astro data and staying within license/collection limits.
- [ ] Actual local admin authentication, schema CRUD, and persistence if Docker was available.
- [ ] Anonymous API and private-asset access restricted.
- [ ] Clear future approval/versioning and static Astro integration contract; no unsafe "publish simply changes status" assumption.
- [ ] Astro remains untouched in behavior; existing site tests still pass.
- [ ] Domain, email, contact delivery, hosting and deployment all remain unconfigured.
- [ ] Reports present, accurate, and explicit about any unavailable verification.

**End of Step 10A prompt.**
