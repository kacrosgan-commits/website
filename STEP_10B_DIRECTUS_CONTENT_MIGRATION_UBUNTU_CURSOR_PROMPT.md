# STEP 10B — Vortex Digital: Controlled Existing-Content Migration into Directus

**Execution target:** Cursor Agent in the existing Ubuntu repository, `/home/ubuntu/Documents/website`  
**CMS:** Existing local Directus 12.6.0 + PostgreSQL 16.10 via Docker Compose under `cms/`  
**Frontend:** Existing Astro 7 + TypeScript + Tailwind CSS v4, static website  
**Phase:** Content migration only — **do not** connect Astro to Directus yet (Step 10C)  
**Implementation required:** working code, real migration, actual verification, clear owner-facing report. Not a plan-only response.

## A. Non-negotiable scope and invariants

1. **Use the existing repository and healthy running CMS.** Do not scaffold a new site, a new Directus instance, a second PostgreSQL database, a new `cms/` directory, or an admin frontend. Inspect current repo and status first.
2. **Do not edit Astro public pages, routes, components, approved text, images, SEO, or the current content source** for CMS integration in this phase. Source records and approved media are read-only inputs. The 35 static pages and 31 sitemap URLs should remain the same.
3. **Do not modify domain, DNS, `PUBLIC_SITE_URL`, canonical origin, business email, SMTP, contact delivery/Formspree, hosting, SSL, public CMS access, analytics, or deploy.** All work stays local. Do not change the copy-only Contact form.
4. **Preserve all previously validated content:** six publicly approved case studies, nine published staff profiles with correctly assigned original portraits, eight services, twelve *unpublished* Insights drafts, homepage/team illustrative video disclosure, and all portfolio screenshots. Preserve names, slugs, descriptions, URLs, technology names, dates and approved attribution exactly as supplied by the repo, not guessed.
5. **Never publish migrated content during Step 10B.** The CMS is currently isolated, and its records are for review and comparison. Set newly migrated CMS editorial records to `status: draft` (or the exact compatible nonpublic schema enum) and `publication_approved: false`, and leave `published_at` empty. Separately record **source publication/owner-approval status** in a **private migration manifest**. Do NOT rewrite source `publicationApproved` flags, and do not describe the six existing case studies or nine existing team records as originally unapproved. This is a staging policy, not a revocation of earlier owner approvals. The twelve Insights articles must remain unapproved in both places.
6. **Least exposure:** zero new anonymous/public read permissions on custom collections, `directus_files` or `/assets/*`. Administrator API credentials never enter Astro code, `PUBLIC_*` variables, screenshots, logs, generated JSON, or Git commits. No external media uploads or network destinations.
7. **No destructive operations:** never run `docker compose down -v`, `docker volume rm`, `apply-schema.mjs --reset-custom-collections`, drop tables, truncate, remove all files, bulk overwrite existing records, or `npm audit fix`. No mass role/permission changes. Do not delete legitimate owner content.
8. Do not silently install packages or upgrade Directus, PostgreSQL, Docker, Node, Astro, package names, or package versions. Use existing libraries and Node standard APIs where feasible.
9. Do not assume advanced versioning, preview, or approval controls are present in Directus Core; those are future workflow work (10D). Do not create publicly accessible article preview URLs.
10. Existing contact inquiries are **not** a CMS content type; do not migrate any visitor inquiry or personal data.

## B. Read first; record baseline

Inspect all relevant source files before changing anything, including at least:

- `STEP_10A_REPORT.md`, `STEP_10A_ARCHITECTURE_REVIEW.md`, `STEP_9E_REPORT.md`, `HOMEPAGE_TEAM_VIDEO_REPORT.md`, and any `STEP_10A_REGRESSION_FIX.md` if present.
- `cms/compose.yaml`, `cms/.env.example` (not secrets), `cms/README.md`, `cms/schema/collections.meta.json`, `cms/scripts/apply-schema.mjs`, `cms/docs/CONTENT_SCHEMA.md`, `cms/docs/SECURITY_AND_PERMISSIONS.md`, `cms/docs/PUBLICATION_ARCHITECTURE.md`, and `cms/docs/BACKUP_AND_RESTORE.md`.
- Actual source content under `src/data/`, `src/content/`, `src/content.config.ts`, `src/utils/portfolio.ts`, `src/utils/insights.ts`, team/gallery data files, service files, `src/pages/index.astro`, and relevant components for field names and display order.
- Existing source/owner-approved media in `public/`, the portfolio asset manifest, team portrait assignments, and supplied homepage video/poster paths. Look up paths in the repo; do not invent paths, slugs, or missing facts.
- Current `git status`, installed tools, Docker health, and current Directus schema/fields/relations through authenticated local API.

Record a **pre-migration inventory**: source identifiers and slug/order, actual collections/field names and types, media counts and SHA-256 checksums, Directus existing item counts, anonymous permissions, and current test baseline. Inspect existing custom collections for user-authored records; if any already contain real records, do not overwrite them. Detect a previous interrupted migration and reconcile by source key and checksum rather than blindly creating duplicates.

Check `docker compose ps` from `cms/`. Expected running services are `directus` at `127.0.0.1:8055` and `database` on the internal Docker network. If unhealthy or API unauthorized, STOP and report the blocker—never reconstruct the database or print private secrets.

### Known Step 10A issue: homepage film / unit test mismatch

The Step 10A report showed **24 passing / 1 failing unit test** because `tests/unit/site-quality.test.ts` expected `public/videos/vortex-team-showcase.mp4` size `4,718,893` bytes but the working-tree file was `13,032,156` bytes. Step 9F's verified optimized file was 4,718,893 bytes; it was 1280×720, H.264, 18.5 seconds, no audio. **Investigate before taking action.** Determine if the original verified optimized file/package is present locally; compare checksums and metadata. Do NOT silently change the assertion, or substitute/overwrite media without verified original provenance. If a safe restoration is available and owner-approved, do a narrowly scoped restoration with checks; otherwise leave the source untouched and explicitly mark this existing test failure as unresolved. Content migration can proceed if the actual source data is intact, but do not claim all Astro tests pass. Do not import a questionable 13 MB film as if it were the verified optimized film; record a media blocker and keep the homepage video source unchanged.

The Step 10A E2E run against `astro dev` caused false failures because the sitemap was absent and development-only Insights preview is enabled. Run E2E against the **production build/preview**, on a dedicated nonconflicting port (e.g. 4377), as configured by the repo. Do not confuse a dev server with production validation.

## C. Backup before all migration writes — hard gate

Create/extend a **private, Git-ignored**, timestamped backup folder such as `cms/backups/step-10b-YYYYMMDD-HHMMSS/`, directory mode 700 / files mode 600. Respect existing repo backup/ignore convention. Before any write:

- Make a logical PostgreSQL backup with `pg_dump` via the running `database` service, using the container's existing environment. Capture the exit code, verify it is nonempty and not an error page, and include a private SHA-256. Example only: `docker compose exec -T database sh -lc 'exec pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "$BACKUP_DIR/directus-before.sql"`. Confirm actual service and variable names in Compose before executing.
- Back up the current `cms/uploads/` (with content and metadata where feasible); record file count, bytes, and hashes. If pre-existing uploads exist, ensure they are preserved.
- Save a **private** Directus pre-migration schema/collection inventory and record counts. Exclude secrets, password fields, static tokens, raw cookies and private user data.
- Verify backup restore instructions against the present compose stack without destructively restoring over the live DB. If practical, validate into a separate disposable isolated database; if not, document the limitation. Do not make unsupported "restore tested" claims.
- Ensure backup directories, manifest containing private records/media identifiers, and `.env` do not accidentally become committed or web-served.

**If backup creation or integrity verification fails, do not perform the import.**

## D. Build a deterministic source inventory and field mapping

Do not assume the data source structures from the prompt are the actual codebase. Inspect and parse them. Build a source manifest with stable keys, source file path, content hash and where appropriate media SHA-256, original approval flags, mapped Directus collection, and proposed destination fields. Include a human-readable mapping table. Keep sensitive internal storage IDs in the private manifest; safe summary may be in project reports.

### Scope and expected source counts

| Collection | Expected source | Migration requirements |
|---|---|---|
| `team_members` | **9** published, named staff profiles | Preserve exact existing name, role, slug, display order, short/full bio, expertise, social links only if verified, original assigned portrait file. Adrian Cruz and Matheus Pereira must retain distinct approved portrait mappings. Do not import external employers as Vortex Digital work. |
| `portfolio_projects` | **6** approved public case studies | Preserve actual source slugs, name/order, exact contribution scope, dates, project URLs, technologies, descriptions, approval provenance; no sample/demo projects. |
| `portfolio_screenshots` | **18** originally approved case-study screenshots: 3 per project | Preserve project relationship, image sequence, captions/alt text where actually provided, original image hashes. If derived WebP files exist, retain approved originals and optionally associate derivatives without replacing source of truth. |
| `services` | **8** public service pages | Preserve names, actual slugs, detail copy, CTAs, order, imagery/icons where they are editable assets. |
| `insights_articles` | **12** Markdown files | Preserve full body including Markdown tables, code blocks, headings and links; frontmatter; original slugs, author Vortex Digital, categories, writing/updated dates; `publicationApproved:false`, `status:review` source provenance; **no published date, no public route**. |
| `homepage_content` | Single source-backed homepage data, if compatible | Preserve exact current hero text, supporting copy, CTA labels/links, links to actual approved media, current team-video disclosure and verified asset provenance. Do not make up missing hero fields. |
| `site_settings` | Single source-backed global content, if compatible | Only legitimate content settings, site labels, navigation text where schema supports. **Do not migrate placeholder email or domain into public-facing fields as though configured; do not alter environment/configuration.** |
| `page_sections` | Existing approved About/Process/etc. sections where safely representable | Preserve order, page identity, title, body, image attribution; don't flatten rich complex components into misleading plain text. Record unsupported sections in a gap report for later, not fabricated filler. |

The counts are expectations from previous project reports, not permission to invent missing records. If actual inspected counts differ, reconcile against source and report. Do not create dummy data to hit target counts. Do not migrate sample portfolio stubs into public collections unless a separate explicitly private sample workflow exists; for 10B simply exclude them and list excluded sample IDs.

### Known case study names, for audit matching only

1. ScaleUp Systems — publicly approved marketing website only.
2. MedaStaré — mobile UI/UX and owner-reported full app, no unverified modules.
3. Gain Energy / Upstrima — publicly approved marketing website contribution, no invented app modules.
4. GoWabi — marketing website frontend only, not the platform booking backend.
5. Daniela Diamonds — storefront frontend only, no checkout or inventory system attribution.
6. Born To Rock — owner-approved complete mobile rhythm game contribution.

### Known nine team profiles, for audit matching only

Don Tran, Joshua Mendoza, Lin Jiayi, Pongsak Rattanakul, Dmytro Melnyk, Carlo Garcia, Matheus Pereira, Adrian Cruz, Sofia Vasylivna Melnyk. Copy the **actual data** and owner-assigned photographs from the existing repository. Do not generate headshots, infer employers or credentials, or use any image of another person as a substitute.

### Rich content and schema fit

- Read actual Directus field definitions and validated enum values. Do **not** guess `bio`, `portrait`, `body`, `status`, `published_at` property names or their JSON representations.
- Make an explicit source→destination mapping. Do not lose unrepresented fields silently. Preserve rich text/Markdown semantics as source, not unsanitized raw HTML. If a schema field needs an additive correction to hold vital content, document the change and implement idempotently without resetting tables; do not exceed Core constraints or add unnecessary collections. Prefer working within the eight existing collections.
- `page_sections` may represent only what the existing schema can faithfully model. Any unmatched complex Astro component should stay in the frontend and be listed in a `future-10C-gap` section, not rewritten during 10B.
- `source-approved` is migration metadata for comparing to the public Astro site; `cms-publication_approved` remains false at import. If no extra CMS field is needed, store provenance in the private manifest instead of mutating the schema.
- Use existing status enums and relations. Validate unique slugs and correct foreign keys. Dates must be preserved or null, never replaced with today's date as a fake publish date.

## E. Media inventory, upload and relationship mapping

1. Inventory exact source media used by the 9 profiles, 6 projects' 18 original screenshots, eight services, homepage content, and other approved page sections. Identify source filenames, actual usage, type, dimensions, byte size and SHA-256. Distinguish **original** approved media from derived WebPs and illustrative team scenes.
2. Upload only real files from the current repo into Directus's existing persistent local storage using its authenticated file API, correct MIME type and source-derived title/metadata. No fetching from third-party URLs for missing media. Keep source files untouched.
3. Use a stable `source file hash + source role` manifest and deduplicate existing imported files, rather than creating copies on every run. Preserve separate associations if the same binary legitimately belongs to more than one item.
4. Map Directus file UUIDs to content records. `portfolio_screenshots.project` must reference the **actual imported project UUID**, with correct order. Verify all team portrait file relationships, and that Adrian and Matheus are not assigned the same photograph.
5. Keep file/API reads private. Verify unauthenticated GET for at least one custom collection, `GET /files`, and a private asset ID remains denied, with actual observed HTTP status (typically 403; do not claim a specific code if different).
6. Handle the homepage film carefully because of the Step 10A file-size discrepancy. Prefer not to upload or map an unverified changed MP4. Record current website video as intact and deferred as necessary. Poster may migrate if authentic and verified. Preserve the visible disclosure: *Illustrative team scenes, not footage of an actual company event.*
7. Use careful batching/backoff and meaningful failure logs (minus tokens or private data); do not flood API or change upload size limits without explaining the need and verifying current configuration.
8. Compare the imported **original** media bytes against input SHA-256 where a secure authenticated original-file retrieval method permits. If exact re-download is not feasible, verify stored file UUID, metadata, size, available asset bytes and document that hash equivalence was not tested.

## F. Import script: safe, rerunnable, observable

Implement a maintainable reusable migration tool in `cms/scripts/`, e.g. `migrate-content-10b.mjs`, with scripts or flags for:

- `--inventory` (no writes): show expected source records, media hashes, field mapping, CMS state and missing/mismatched assets.
- `--dry-run` (default, no writes): enumerate creates, skips, conflicts, upload plans, missing fields, source authorization status, and publication state; return nonzero on unresolved critical blockers.
- `--apply` (controlled writes): require verified backup, backend health, private admin authentication, and schema validation; import in dependency order (files → projects → screenshots; staff/services/articles/page content in appropriate sequence). Record a structured local checkpoint after each stage to permit safe resume.
- `--verify` (read-only): query actual Directus items and relationships; compare source and destination counts/fields, exact critical content, image assignments, ordering, approved-source provenance and private CMS flags. Detect duplicate slugs/source keys and orphan screenshots.

Idempotency: running `--apply` a second time against the same source must add **zero duplicate records and zero duplicate media**. Match by stable slug/source key and the checkpoint manifest. On conflicts with existing owner-created records or manually modified previously imported records, STOP or SKIP with a detailed conflict and request owner review; **never silently overwrite**. For singletons, if existing content exists, compare before writing. No hardcoded API token; load secrets exclusively from `cms/.env` server-side or the existing secure local auth method. Never print the token.

Report each collection's: source count, create count, updated count (should generally be zero unless a safe explicit recovery), skipped count, destination count, mismatches, and source approval vs staging status. Record durable rollback metadata as IDs of **only newly created by this migration** (private, gitignored). Do not claim full ACID rollback across API and file storage without evidence.

## G. Privacy and publication gates

For each migrated content record, assert:

- CMS stage is `draft` (or equivalent nonpublic) and `publication_approved=false`, with `published_at` unset; exception only if schema cannot express a field—report as blocker, never silently create a publishable item.
- The original Astro flags are unchanged; the six case studies and nine team profiles retain their already-approved status on the **unchanged Astro** website. The eight services remain visible there.
- All 12 Insights drafts retain their own unpublished source flags; no `status:published`, no new article public route, no sitemap entry, and no unpublished title/text copied into built Astro HTML/JS.
- Directus access-control settings remain deny-by-default. Anonymous roles get no new read access to editorial items or files. If admin access succeeds, that **does not** imply public access works.
- Do not create or trigger publisher roles, Flows, webhooks, content-version publishing, auto-deploy or direct frontend reads in Step 10B.

## H. QA and regression procedure

### Before migration

- Record `docker compose ps`, current item counts, actual schema health and CMS API auth.
- Record `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` using the correct production preview for E2E. Baseline failures such as the MP4-size test must be documented without hiding them.

### After migration

1. Read-back query every imported item; verify **9 teams, 6 portfolio cases, 18 screenshots attached 3 each, 8 services, 12 Insights drafts**, and any actually supported singleton/section content. If source inventory deviates, provide exact explanation rather than guess.
2. Validate exact source↔destination slugs, ordered lists, relationships, short and full text critical fields, project URLs, technology names, original media mapping and sha256/size comparison where available. Required fields cannot contain fake filler.
3. Check every imported Insight is non-public and no article URL is emitted in the static build. Public homepage still shows the six projects in their original order and original attribution. All nine public team routes still work.
4. Validate double-run migration idempotency by re-running `--dry-run` and (only if safe) `--apply` and verifying zero net new records/files.
5. Verify backend persistence across `docker compose restart` **without deleting volumes**, then query migrated records and private media again. Coordinate with any running tests and report before/after.
6. Verify Directus Studio shows imported media and items, images load while authenticated, and UI lets an admin inspect (not necessarily submit changes to) the fields. Browser-based owner screenshot/manual review is acceptable when login cannot be automated safely.
7. Confirm no secrets in source control, `dist`, or generated public assets; backup and manifest directories excluded from Git.
8. Re-run `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` using production build/preview; record exact pass/fail counts, port, tool version and any known unrelated failures. Preserve 35 built HTML pages and 31 sitemap URLs if existing site source remains unchanged. Do not mark Step 10B fully passing if 10A unit failure remains unresolved.
9. Test anonymous reads and media exposure as described above; explicitly record observed denied behavior rather than merely inspect config.
10. No deployment or other environment change.

### Rollback plan

Provide targeted removal of **only the rows and media IDs created by this specific migration run**, in reverse relationship order, using a checkpoint; default to a dry-run rollback plan. Do **not** implement a blanket destructive command. Provide backup restore procedure as a **documented emergency path** requiring explicit owner approval, never auto-run a full restore. Warn that `portfolio_screenshots.project ON DELETE CASCADE` requires child-first logic and protection of existing owner records. Never delete anything that existed before the migration.

## I. Required files and outputs

Create the following useful production-facing engineering deliverables (do not create empty placeholders):

1. `cms/scripts/migrate-content-10b.mjs` — working inventory, dry-run, apply, verify path, plus small helpers only as needed.
2. `cms/docs/STEP_10B_MIGRATION_GUIDE.md` — Ubuntu command examples, prerequisites, backup, safe reruns, private media, likely errors and how to view records in Studio.
3. `STEP_10B_CONTENT_MANIFEST.json` — **redacted/safe summary for source record identities and migration checks only**, with no credential or private file tokens. If including Directus UUIDs, store a second private full manifest under `cms/.tmp/` or `cms/backups/` ignored by Git.
4. `STEP_10B_MIGRATION_AUDIT.md` — source-to-Directus mapping by collection, counts, schema gaps, mismatch details, image/portrait verification and original approval-state comparison.
5. `STEP_10B_MEDIA_AUDIT.md` — approved asset inventory, duplicate/content hash mapping, file-size facts, missing/unverified files, homepage MP4 discrepancy treatment, and private-access checks.
6. `STEP_10B_ROLLBACK_GUIDE.md` — targeted rollback metadata and instructions, integrity constraints, backup locations (no secrets), restore limitations.
7. **`STEP_10B_REPORT.md`** — final owner-facing summary with explicit `PASSED` / `PARTIAL` / `BLOCKED` based on actual evidence, files changed, counts, QA results, security results, blockers and remaining Step 10C decisions.

All private DB dumps, uploaded source binaries, opaque tokens, and sensitive runtime logs must remain in ignored private directories. Keep reports clear of real credentials, password values, and full sensitive API data.

### `STEP_10B_REPORT.md` minimum sections

- Executive status and exact local environment
- Before and after CMS item counts for all eight collections
- Original approved website records vs CMS draft staging distinction
- Source file inventory (9/6/18/8/12), missing/excluded records and source approval
- Schema changes (if any) and full field mapping reference
- Media checksum/size mapping; all original team portraits and three screenshots per case study
- Full imported Insights article body/format/links and privacy verification
- Homepage/other page content imported vs deferred, with reasons
- Backup integrity evidence and rollback readiness
- Migration CLI commands, results, dry-run, idempotence (second run)
- Directus authenticated/anonymous API checks and admin UI inspection
- Database/media persistence check after restart
- Astro baseline vs final unit/check/build/E2E results and environment
- Explicit current video byte mismatch outcome; any existing failure transparently stated
- Files created/modified, untouched website invariants and publication flags
- Risks and manual owner review actions before Step 10C
- Explicit confirmation no domain/email/delivery/deploy/configure-public-permissions changes

## J. Success definition, stop condition

A successful Step 10B means the **actual** existing content and authorized media are present in the existing Directus instance, accurately related, safely staged as nonpublic, idempotent, private, backed up and verifiable, **without a single change in the Astro site's content source or public output**. There is no direct CMS→Astro connection until Step 10C, and there is no publishing automation until Step 10D.

If any essential data, portrait or source attribution cannot be verified, leave the ambiguous item unimported and mark the step `PARTIAL`/`BLOCKED` with a precise issue; do not synthesize content or substitute the wrong media. If unrelated test regressions remain, report them accurately and do not call the full regression suite green.

When the work is finished, STOP. Do not start Step 10C, do not change server permissions, do not configure hosting/email/domain, and do not deploy.
