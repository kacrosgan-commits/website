# STEP 10D — Directus Editorial Workflow, Immutable Publishing & Astro CMS Rendering

**Project:** Vortex Digital agency website  
**Environment:** Ubuntu Linux, `/home/ubuntu/Documents/website`  
**Frontend:** existing Astro 7.3.x / TypeScript / Tailwind CSS v4, static output  
**CMS:** existing Directus 12.6.0 / PostgreSQL 16.10 in `cms/`, Studio `http://127.0.0.1:8055`  
**Execution:** Cursor **Agent** in the existing repository, with genuine code changes and testing  
**Current phase:** STEP 10D only. Do not begin 10E/10F or deployment.

> **Owner intent:** I want to manage Vortex Digital's team, portfolio, images, text, services, homepage, and future approved Insights through Directus, and have those approved changes flow into the existing Astro website. Implement a reliable local publishing workflow without putting drafts or private Directus files in public output.
>
> **This is not permission to publish all imported records.** Build and test the workflow, present a per-record reconciliation plan, and obtain separate explicit owner approval before changing the real imported content's `status`, `publication_approved`, `published_at`, or real public-release pointer. The existing source-approved content is already public via Astro's `local` mode; that does not automatically authorize promoting staged CMS copies.

---

## 0. Executive objective and definition of done

**Finish the missing real CMS functionality left open in Step 10C**, including actual data-driven pages, deliberate editorial approval, a stable published snapshot, secure approved-media delivery, a local release/build mechanism, and rollback. **Do not** report this step as complete merely because the CMS adapter can fetch rows, the shadow audit passes, or the API is reachable.

Implement:

1. Directus Studio remains the editor for **draft** team profiles, approved employee portraits, portfolio projects/screenshots, services, homepage, and other mapped page content. Insights stay drafts unless the owner individually approves an article later.
2. A **genuine separation between editable draft and public release**: editing/saving an existing published item must **not** update the public site when Astro is rebuilt until a separately authorized publish action. A simple `status=published` check on the mutable item is *insufficient*.
3. A secure **owner/publisher-only release workflow**, with private review and explicit confirmation, snapshots/versioning, integrity checks, publication audit trail, rollback, and repeatable local builds.
4. Actual Astro rendering from the chosen, approved **immutable release** in `CONTENT_SOURCE=cms`, including 9 team routes, 6 portfolio routes with 18 screenshots, 8 service routes, homepage settings/film, and mapped About/Process content. An editor's draft change must not be accidentally reflected just because a build runs.
5. Private Directus file access remains denied to anonymous visitors. Approved public files are materialized securely **at build time** and published as token-free static assets; draft media are not.
6. Local and shadow modes continue behaving as in Step 10C, with reversible, explicit CMS activation only **after** the owner approves the baseline and validates a candidate release. No public host or deploy.

If a license or API limitation prevents a safe implementation, keep `local` as the default and **fail closed** with a prominent blocker. Never weaken permissions or fake successful publishing to meet a checklist.

## 1. Mandatory project preflight (before any edits)

Inspect the **actual repo** and current runtime. Read and reconcile:

- `STEP_10C_REPORT.md`, `STEP_10C_CONTENT_PARITY_AUDIT.md`, `STEP_10C_SECURITY_MEDIA_AUDIT.md`, `STEP_10C_ARCHITECTURE.md`, `STEP_10C_RECONCILIATION_PLAN.md`, `STEP_10C_ROLLBACK_GUIDE.md` if present; prior `STEP_10A*`, `STEP_10B*`, `STEP_9E_REPORT.md`, and `HOMEPAGE_TEAM_VIDEO_REPORT.md`.
- `src/lib/content/` (source mode selector, Directus client, mappers, content gates, parity, media, local snapshot), `src/pages`, `src/components`, `src/content.config.ts`, `src/data`, `src/utils`, `src/layouts`, `astro.config.ts`, `playwright.config.ts`, unit/E2E tests, `package.json`, `.env.example`.
- `cms/compose.yaml`, `cms/schema/collections.meta.json`, `cms/docs/*`, `cms/scripts/*`, existing publication/security docs, and the actual Directus collection/field/relation schema.
- Existing approved local business content: **9** team profiles, **6** case studies and **18** original screenshots, **8** services, **12** unpublished Insights articles, homepage poster and owner-selected **30-second** video, home/About/Process content, legal and contact routes.
- `git status --short` **before modifying anything**, preserve all tracked and untracked work; never reset/clean unrelated changes. Do not print `cms/.env`, project `.env`, password, tokens or private full draft article bodies into report/logs.

Record a fresh baseline (no invented pass counts), and confirm `docker compose ps` in `cms/`. Previous Step 10C report says: 29/29 unit tests, 17/17 E2E, clean Astro check, 35 HTML pages and 31 sitemap URLs; these are historical, **not guaranteed current state**.

```bash
cd /home/ubuntu/Documents/website
(cd cms && docker compose ps)
npm test
npm run check
npm run build
npm run test:e2e
npm run cms:shadow
npm run cms:readiness  # expected NOT READY on real staged records
```

Run E2E against a fresh **production build + `astro preview`**, not `astro dev` or a preexisting unrelated server. Capture exit status and any caveat. Audit current manually added homepage lighting/exposure animation (if now present): preserve it and its reduced-motion behavior, not replace with a previous screenshot.

## 2. Non-negotiable boundaries

- **Astro source unchanged by default**: `CONTENT_SOURCE=local` must retain all existing pages, content, branding, accessibility, 30-second homepage film, poster, hero animation if present, portfolio artwork, responsive styles, SEO, sitemap, copy-only contact flow and 404 behavior.
- Exact baseline: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock; 9 approved staff, with the owner's exact portraits and roles; 8 services with their original slugs; 12 Insights never published in this step.
- Adrian Cruz's external employment must remain identified as **external**, never misattributed to Vortex Digital; Adrian's and Matheus's portraits must stay distinct. Preserve the verified contribution boundaries in the six case studies, including original URLs/technologies/scope.
- Retain `CONTENT_SOURCE=local` (default), `cms-shadow` (local HTML with private comparison), and guarded `cms` (approved release only), with no silent fallback in `cms` mode. Unknown mode must error.
- Do **not** change `PUBLIC_SITE_URL`, DNS, canonicals' placeholder host, business email, Formspree/SMTP/contact delivery, hosting config, public deployment, CI release triggers, Directus plan, or collection publication flags without separate owner approval. Do **not** enable public API or anonymous file-read permissions.
- Do **not** install a new app framework, redesign the site, reimport all 10B content, erase Docker volumes, or run `docker compose down -v`. Keep existing Directus users/collections/media. No dummy employees or sample case studies on real public pages.
- No tokens, draft private bodies, admin URLs, localhost-only private API references, or approval secrets in HTML, JS bundles, JSON data, sitemap, `robots.txt`, published CSS, Git, screenshots, or console logging.
- Site remains **static**. Approved CMS edits affect a new **local build/release** after explicit publish. They do not update already generated HTML immediately. Do not claim real-time updates, live automations, or deployed triggers.

## 3. Backup and release preconditions

Before schema migrations or new publication state:

1. Create a dated **PostgreSQL `pg_dump` + CMS uploads backup** and checksum manifest in `cms/backups/` (gitignored). Store with mode `0600` where applicable. Document how to verify integrity. Do not include credentials in backup manifest or report.
2. Capture current CMS item IDs, slugs, approved/draft fields, media UUIDs, schema version, existing build hashes, Git worktree state. Verify 9 team / 6 projects / 18 screenshots / 8 services / 12 Insights / 29 files (and singleton/section counts), or explain differences.
3. Do **not** overwrite prior backups. Document restore steps, and rehearse restore with a disposable database if resources permit; **never** rehearse restoration against real CMS volumes.
4. If a schema migration is needed, create repeatable, idempotent forward migration and a carefully described rollback. No destructive reset of custom collections.
5. Test the snapshot/publish implementation in an **isolated cloned DB or mocked/disposable fixtures** before any owner-baseline mutation. Isolate ports, credentials, media, workdir and generated `dist` from the real site.

## 4. Design and implement a true publication model — not mutable status masquerading as release

**Crucial requirement:** Directus Core reportedly rejects custom row-level permission filters (`custom_permission_rules_enabled` / `RESOURCE_RESTRICTED`). Never assume content versioning, Flows, role-specific field rules or permission predicates are available; inspect the actual version/license and API. Implement robust publication isolation without relying on unsupported paid features.

Recommended architecture: **immutable, versioned release snapshot(s) generated from Directus drafts** and a single **active release pointer**. Use a small number of new Directus-managed collections/tables where safe (e.g. `site_releases`, `site_release_items`, `site_release_pointer`, optionally `site_publication_audit`) or a justified durable PostgreSQL-equivalent. Avoid exhausting Core collection limits (10A had 8 of a reported 25). Exact names/fields are implementation choices; document them.

Functional contract:

- Editable `team_members`, `portfolio_projects`, `services`, `homepage_content`, `page_sections`, `insights_articles`, etc. form the **working draft**. Do not overwrite the currently released payload when editing.
- A release contains a content-addressed, immutable snapshot of every eligible public page record, the related screenshots, portraits, SEO data, media manifest (UUID, verified hash, MIME, dimensions), order, slugs, and source record revisions/checksums, plus an explicit publish timestamp and owner/publisher attribution. Do not copy private unrelated drafts into a release.
- The **active pointer** can reference only a fully validated, durable release. Make switching it effectively atomic (DB transaction or persist release fully first and flip a single pointer last with optimistic concurrency). If the process fails at any point, readers continue to see the previous release. Incomplete candidates must never be activated.
- `CONTENT_SOURCE=cms` reads the currently **activated immutable release**, not the mutable `items` collections. Re-running a CMS build after an editor saves an unpublished change must yield the **same public content** as the active release. Enforce this in tests.
- Build-only credentials must have the least accessible collections allowed by the Core tier; ideally expose **only release snapshots, active pointer and necessary asset access** to the build identity. Never use full administrator token for Astro builds. If asset-read scope remains broad, record the residual risk honestly and protect/rotate tokens.
- All field/slug/media validation happens **before** candidate release creation and **again before** activation. `status=published`, `publication_approved=true`, valid `published_at`, relevant owner approval, and relationship completeness are required, but status fields alone do not activate a release. Use a separately explicit owner approval record or signed/confirmed release plan.
- Release snapshots must be deterministic and content-addressed. Preserve original content bytes/Markdown when appropriate. Use canonical JSON serialization and hashes to detect tampering; do not pretend SHA alone authenticates an untrusted actor.
- Old releases remain available for a **controlled rollback**, with sensitive data protected and a documented retention policy. Never silently delete prior approved media still referenced by an active or rollback release.
- Archive and unpublish actions must produce a **new release** that removes the affected public record and related routes/links/media from new static output, without deleting historical snapshot data accidentally. Warn about backlinks/related cards, required-baseline restrictions, and sitemap effects.
- If making `cms` builds depend on Directus at build time, define clear outage/failure handling: **build failure with previous deployed/static artifact preserved**, no partial replacement of `dist`, no stale snapshot confusion. Keep last known approved release usable with a documented, integrity-checked recovery mode only; never auto-fallback to drafts.

If the actual codebase supports a simpler solution that **proves all these invariants**, implement it and explain. **Never claim Directus Core provides built-in approval/immutable-version guarantees that testing did not establish.**

## 5. Editorial workflow and operational controls

Support these conceptual states (actual implementation may use fields plus release metadata):

**Draft → In Review → Owner Approved → Release Candidate → Published Release → Archived/Withdrawn**.

Required behaviors:

1. Editor saves text/photo changes in the Directus Studio; those changes are **not public** until separately authorized.
2. Owner can privately inspect a proposed change (old vs new values, image previews, slugs/SEO/relationships, affected pages, media diffs), approve/reject it, and build a candidate release. Editor cannot self-authorize a release if the tier permits restricting their permissions.
3. Restricted publisher operation: only a trusted authenticated owner/publisher can activate a specific, validated plan. Do not expose a publicly reachable unauthenticated publish API or webhook; no static admin token in browser, build logs or `PUBLIC_*` variables.
4. Provide convenient CLI commands/scripts with documented names, e.g. `cms:release:plan`, `cms:release:verify`, `cms:release:activate`, `cms:release:rollback`, and `cms:build-local` (names may differ). The `plan` output is redacted and non-mutating. Activation requires an explicit **specific release ID + expected hash + interactive owner confirmation**, not just `--yes` or setting a boolean. Verify ownership/authorization using capabilities available in the actual environment.
5. If a safe owner-only in-Studio Publish button/Flow isn't feasible with Core, **do not fabricate one**. The owner can use Studio to edit/review and a secure local publisher CLI to activate. State this limitation and give exact steps.
6. Publishing existing 9 team / 6 project / 8 service baseline records is **NOT authorized merely by this Step 10D prompt**. Produce an **owner review package** that lists those records and parity; leave all **real** baseline rows and active release pointer unchanged. Test publishing with **disposable synthetic data on an isolated DB**, not with temporary real-site bulk approvals that you later undo.
7. No general blanket approval of the 12 Insights drafts. Verify each remains `draft`, `publication_approved=false`, `published_at=null` and absent from both active releases and all public artifacts. Implement individual article approval/publish support, but don't execute it on real drafts. Unknown authored content must not be publicly exposed.
8. Save an append-only audit trail of who planned, approved, activated, withdrew and rolled back, when and what was changed. Test audit cannot be casually overwritten by normal editor permissions; note limits of true tamper protection in local admin.
9. Editing while a release is active must not silently mutate its snapshot; enforce immutable release columns/items or at minimum prove checksums and deny update operations to non-admin roles. Test concurrent edits, double activation, stale plan/hash, failed media and invalid status.

## 6. Complete *real* CMS-to-Astro data wiring

Step 10C reported partial prop wiring despite a secure adapter. **This step must remove that functional gap**, not just add publishing scripts:

- Implement a typed `getPublishedSiteSnapshot()` or equivalent, used consistently by all content-backed routes when `CONTENT_SOURCE=cms`.
- Site pages: `/`, `/about/`, `/process/`, `/services/` plus 8 service details, `/portfolio/` plus 6 approved case studies and their 18 screenshots, `/team/` plus 9 member profiles and team gallery behavior, `/insights/` (empty until individually approved), `/contact/` (copy-only unchanged), legal routes/404. Model CMS-supported fields faithfully and preserve explicitly code-managed complex UI.
- Ensure Astro `getStaticPaths()` for services/projects/team/Insights derives its routes from **the active release** when in CMS mode. The index lists, featured order, related links, breadcrumbs, sitemap and route generation must agree with the same snapshot; no mismatched local route list with CMS page content. Local and shadow modes retain their existing enumerations and 35/31 baseline.
- A new **approved** team member, project or service added via CMS should gain the correct route only after release. An archive/unpublish should remove the route and sitemap listing on the new build, with no dead related links. Additional pages can change total page/sitemap counts **only for a deliberately authorized test release**; the real baseline stays 35/31.
- Source field mapping: name/title/role/biography/experience/externalExperience/responsibilities/portrait/alt/order; project descriptions/client/verified contribution/tech/services/URLs/screenshots/media layout/order/featured; service text and safe contact prefill; homepage hero, CTA, featured project selections, poster/video reference and disclosure; mapped About/Process sections; SEO and meta.
- Render safe Markdown/structured text with existing rendering facilities; sanitize or escape CMS strings. Never blindly inject rich text into `set:html`. Validate media IDs/URLs, internal links and unsafe protocols.
- Keep the original current owner-approved **30-second MP4** intact, with 16:9 native controls, no autoplay, `preload="none"`, and clear illustration disclosure. Do not restore the prior 18.5s film. If the active release uses the same approved 30s CMS media, ensure output uses the safe materialized asset without duplicate eager download.
- Do not use `fetch` from visitor browsers to get content or images; static output should contain only approved content.
- Do not silently fill a missing CMS field with a conflicting local fact. Either retain an **explicitly documented code-owned component** or fail the release/readiness gate. Flag any content-model gap with precise next steps.

## 7. Secure approved-media publication

Reuse the existing Step 10C `src/lib/content/media.ts` and `scripts/cms-build-media.mjs`, strengthening them as required:

- Only download media UUIDs **referenced by the active approved release**. The remaining privately staged portraits/screenshots/Insights assets must never be copied by default.
- Authenticated build-time fetch with `Authorization` header. Restrict Directus URL/redirect hosts, MIME sniff, allowed formats (`webp`, `jpeg`, `png`, `mp4`), max bytes, dimensions, hash checks, image alt text, and asset relationships. Reject malicious SVG/HTML/script, unsupported image, wrong UUID, mismatched checksum, path traversal, 403, redirect and unexpected content types.
- Emit hashed, deterministic public paths in a privately staged build. Publish token-free files to `dist/cms-media/` **only in a fully eligible CMS build**. Ensure failures do not leave sensitive partial files or stale files from older releases. No writes of drafts into `public/`.
- Preserve approved original poster and MP4 semantics; do not re-encode owner-selected video. Avoid changing the performance optimizations from Step 9E. `preload="none"` and poster first.
- Materialize only after validating the snapshot, and make the entire build output consistent with one pinned release ID. If release pointer changes mid-build, either finish pinned version or abort safely; do not mix two releases.
- Keep anonymous Directus endpoints returning `403` (items/files/assets), including Insights. A published CMS-generated website can serve approved media as static assets **without** making Directus media publicly readable.
- Prove through browser and file scans that no token, localhost URL, inaccessible raw Directus `/assets` link, private draft media or article content leaks into `dist`.

## 8. Private preview, review and approval UX

- Deliver a practical way for the owner to preview **draft versus current published** content before approving: ideally a `localhost` preview built into a **private, gitignored output folder** using a disposable candidate snapshot. Require no browser-reachable token or publicly accessible unauthenticated preview. If a private browser preview needs a local server, bind it to `127.0.0.1` and document how to stop it; do not deploy or link it publicly.
- Distinguish **Draft**, **Candidate**, and **Active Public Release** with meaningful CLI output or non-deceptive Studio fields; saving edits in Studio is not the same as publishing.
- Provide a private, redacted diff/review summary for each changed record, including changes to role/title, portrait media ID, case-study screenshots, sort order, featured flags and SEO.
- Never expose a password, token, unpublished article body or full private media in text reports. Public page screenshots can be saved in nonpublic `docs/` only when appropriate; confidential draft previews should remain gitignored.
- Owner must be able to identify exactly which approved change would appear on a new build.

## 9. Local release-build process (no deployment)

Provide an owner-friendly workflow such as:

```bash
cd /home/ubuntu/Documents/website
# Use the actual commands you implement, not necessarily these placeholders:
npm run cms:release:plan       # read-only, proposed diff and approval blockers
npm run cms:release:verify     # check data, assets, paths, SEO, unpublished Insights
npm run cms:release:activate   # interactive owner confirmation, explicit plan/hash
CONTENT_SOURCE=cms npm run build
npm run preview
```

- A safe `npm run cms:build-local` may combine readiness → immutable snapshot resolution → materialized media → build → tests and promote an artifact **only after** the owner activation step. Never silently publish/approve on an `npm run build` or `npm run dev` invocation.
- Local update should require a build; no claim that a static website updates the instant a CMS record is saved. Explain future hosting automation design without configuring remote CI/CD or Directus Flows/webhooks in this step.
- Preserve previous working local output on failure. If building to `dist/` has destructive behavior, use a temporary output and promote only on full success or document restoration. A simple mode switch to `CONTENT_SOURCE=local` must reliably rebuild the original 35-page public site.
- Avoid global watchers that auto-activate a release or inadvertently publish drafts. No automatic publish triggers from item save.

## 10. Real testing requirements — isolated approval rehearsal

**Do real end-to-end verification**, not just unit mocks. If unable to run a safe disposable CMS clone, clearly mark the release activation rehearsal **blocked**, do not mutate real owner records, and leave default local mode.

### A. Directus / authorization tests

- Verify current real 9/6/18/8/12 + 29 media retained; anonymous 403 on items/files/assets; build token cannot write; editor cannot activate release; owner action requires auth and explicit confirmation.
- Missing/stale plan ID/hash, duplicate/racing activations, altered release item, invalid record/slug, incomplete relation, missing media, unauthorized caller, Directus/DB outage → fail closed.
- An attempted change to `status=published` or `publication_approved=true` **without** active snapshot activation must have no effect on public output. Test if possible under isolated fixture.
- No blanket mass-approval of twelve Insights drafts. No private leaks under any mode or partial failed build.

### B. Actual draft → release workflow in isolated environment

On a **separate test DB/Compose project/fixture clone**, simulate:

1. Start with approved fixture release A containing safe synthetic records and assets.
2. Edit a team member title and replace one image in a *draft*; also change a portfolio description, or add one new safe fixture case. Save draft; re-run `cms` build pinned to A: published HTML and media URLs/hashes **unchanged**.
3. Propose release B; preview diffs. Without confirmation and approval, attempt activation → denied.
4. Approve B in the **test environment** and activate; rebuild: title/photo/project changes appear, new authorized route created, sitemap consistent, no draft data outside approved release.
5. Start a new edit after B; verify rebuild still uses B unchanged.
6. Withdraw/unpublish a fixture project and release C; route removed, related links and sitemap updated, old assets not accidentally exposed by new output.
7. Roll back to release A (or B as appropriate); rebuild outputs and media match its recorded hashes.
8. Test a draft Insight article: unpublished → absent; a **separate synthetic** article may become visible only with an individually approved test release; avoid real 12 drafts.
9. Crash/failure simulations during candidate creation, activation, media fetch and Astro render must leave previous active release usable. Record exactly what was executed vs simulated.

### C. Full frontend coverage

- Run `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` in **local** mode; expected historical minimum was 29 unit / 17 E2E, 35 pages / 31 sitemap URLs. If counts change legitimately, report them.
- `cms-shadow` parity remains 0 material mismatches (or report each real mismatch). No private CMS content in generated HTML; no draft media materialization.
- `cms` against *real* staged DB must remain **blocked** until owner-approved baseline; do not call this a failed implementation if it correctly fails closed. In isolated approved fixtures, CMS mode must **actually render CMS field edits**; no shadow-only false positives.
- Responsive check at 320/375/768/1024/1440 and at 200% text; keyboard focus, mobile menu, homepage player/hero glow reduced-motion behavior, image loading, and no overflow. Ensure front-end regressions preserve all six case studies, nine profiles and the contact no-send string.
- Tests for duplicate slug, untrusted rich text/XSS, invalid external URL schemes, blank hero, missing portrait, invalid screenshot reference, secrets/localhost leakage, 404/noindex and sitemap, draft routes 404, and rollback.
- Avoid test order dependence; cleanup isolated fixture data and private media; never leave synthetic records in real CMS or public `dist`.

### D. Performance and publication reliability

- Check release build query counts, cache, network failures and large media handling. Maintain Step 9E lazy WebP optimizations and layout shift fixes. Don't re-encode owner-selected 30s MP4.
- Verify routes, metadata and image dimensions on representative CMS fixture output. Use real measured transfer/bundle sizes and report limitations; do not invent Lighthouse scores.

## 11. Permissions and licensing caveats

- Prior Step 10C report states Directus Core cannot enforce custom permission filters. Re-check actual behavior but do not change to admin or public read tokens to work around it. A build token that can read private drafts is a **residual risk**; keep it host-local and restricted, and document further mitigation.
- If additional release collections are created, restrict their writes to owner/publisher path, and restrict build reads to released snapshots where possible. Verify behavior by actual unauthenticated, editor and build-reader API probes.
- If a robust Directus-native approval button/Flow/version cannot be implemented in the installed plan, **fallback to a secure owner-only CLI**; keep Directus Studio for actual content authoring. No fake Studio controls.
- Directus can have a legitimate admin user who manages all content; do not claim fine-grained separation of duties if the owner admin can bypass restrictions. Document trusted-operator assumption.
- Keep loopback-only `127.0.0.1:8055`; never expose CMS to the LAN or internet as part of this phase.

## 12. Required deliverables (create real files)

Write all these in the project root unless a different name already exists for the same purpose:

1. **`STEP_10D_REPORT.md`** — executive result, decisions, implementation files, tests, actual local and fixture mode behavior, active pointer status, blockers, explicit non-changes, success/failure.
2. **`STEP_10D_PUBLISHING_WORKFLOW.md`** — exact editor/owner actions in Directus Studio, secure plan/preview/approve/activate/build/unpublish/rollback commands, real UX limitations, who can do what, and how to verify visible changes.
3. **`STEP_10D_ASTRO_CMS_RENDER_AUDIT.md`** — page-by-page proof of CMS field changes rendered (in fixture), `getStaticPaths`, sitemap, SEO, team/portfolio/media, code-owned UI, Insights gates.
4. **`STEP_10D_SECURITY_AND_APPROVAL_AUDIT.md`** — actual API permission tests, tokens, snapshot immutability, draft isolation, media handling, scan results and Core residual risks.
5. **`STEP_10D_BASELINE_RECONCILIATION.md`** — per-record review checklist for real 9 team / 6 cases / 8 services, homepage/sections and source approvals, integrity hashes, exact owner authorization necessary, *without actually publishing real staged rows*.
6. **`STEP_10D_RELEASE_AND_ROLLBACK.md`** — snapshot schema, activation atomicity, release history, DB/media backup integrity, precise recovery actions, isolated restore rehearsal results.

Private artifacts (redacted metadata, hashes, fixture builds, preview HTML, backups) must live in appropriately **gitignored** paths like `cms/.tmp/step-10d/`, `cms/backups/`, not accidentally in deployable `public/` or `dist/`.

Final report must include:

- Current package/Directus versions and Git status; all modified/created files.
- Before/after count of CMS collections, items, media; confirm real content and the current 30-second video were preserved.
- Whether an actual **immutable-release** architecture exists, whether it was exercised on fixture DB, and exact owner-only activation method.
- **Explicitly distinguish** “CMS integration code working in isolated rehearsal” from “real production baseline owner-approved” and “website publicly deployed.” No inflated statuses.
- Local/shadow/CMS fixture/real staged statuses, with exit codes and route counts. Mark expected fail-closed results.
- `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` outputs; browser, permission, media, vulnerability/security tests actually run.
- Why editing a Directus record does or does not currently update the local site, and the **exact click/command sequence** to make an authorized future change public in a new build.
- Remaining open tasks for Step 10E/10F, but **do not perform them**.

## 13. Definition of success and stopping rules

**Pass only if:**

- Default `local` site remains fully operational, with the real 35-page/31-sitemap baseline (unless prior intentional updates changed counts, which you document).
- `cms-shadow` is private and accurate; real 12 Insights drafts still unpublished; Directus anonymous collection/files/assets remain 403.
- CMS-backed Astro pages **actually render release data** and routes in a safe isolated rehearsal; tests prove that changing drafts does not alter already published output.
- Explicit owner approval + activation is distinct from editing; activation/release storage is durable and rollback can retrieve the previous release; an unauthorized or invalid publish fails closed.
- Approved media is served as static token-free assets and private media never leak; 30-second film is preserved; no Directus token in the client.
- Real imported CMS items, publication flags and active pointer were **not mass-changed** without a separate owner authorization.
- All relevant local regression, security and fixture tests pass; genuine blockers are reported, not hidden.

If full release/isolation/fixture acceptance cannot be achieved, classify **STEP 10D: PARTIAL / BLOCKED** truthfully, leave the production/default site on local, and provide specific unblock actions. A working local website is more important than a premature cutover.

**Stop after writing all Step 10D reports. Do not start Step 10E, Step 10F, hosting, domain, business email, contact delivery, Insights publication, or deployment.**
