# STEP 10B — Migration audit

**CMS:** Directus 12.6.0 @ `http://127.0.0.1:8055`  
**Source:** Astro local data / Markdown (unchanged)  
**Staging policy:** every imported editorial row → `status: draft`, `publication_approved: false`, `published_at: null`

## Counts

| Collection | Source | CMS after | Notes |
| --- | ---: | ---: | --- |
| `team_members` | 9 | 9 | Named profiles; portraits linked |
| `portfolio_projects` | 6 approved | 6 | Sample stubs excluded |
| `portfolio_screenshots` | 18 (3×6) | 18 | FK + sort 1..3 each |
| `services` | 8 | 8 | Existing slugs preserved |
| `insights_articles` | 12 drafts | 12 | Bodies byte-equal to Markdown |
| `site_settings` | 1 singleton | 1 | Content labels only |
| `homepage_content` | 1 singleton | 1 | Poster + owner-accepted 30s video linked |
| `page_sections` | 8 modeled | 8 | About + process |
| `directus_files` (migration) | 29 | 29 | Portraits + screenshots + poster + owner-accepted homepage MP4 |

Excluded samples: `sample-brand-platform`, `sample-launch-campaign`, `sample-lead-journey`, `sample-lifecycle-notes`, `sample-search-program`, `sample-social-system`.

## Source approval vs CMS staging

| Content | Source / Astro | CMS after 10B |
| --- | --- | --- |
| 9 team profiles | Published on static site | Draft / not `publication_approved` (staging only) |
| 6 case studies | `publicationApproved: true` in Markdown | Draft / not approved in CMS |
| 8 services | Public site pages | Draft / not approved in CMS |
| 12 Insights | Unpublished drafts (`publicationApproved: false`) | Draft / not approved; `published_at` null |
| Astro flags / routes | **Unchanged** | N/A |

This staging does **not** revoke prior owner approvals on the live Astro site.

## Field mapping (summary)

### `team_members`

`slug`, `name`, `role`, `intro`, `biography`, `responsibilities`, `expertise`, `experience`, `external_experience` ← `externalExperience`, `startup_support` ← `startupSupport`, `related_roles` ← `related`, `portrait` file, `portrait_alt`, `display_order`, optional `linkedin`/`github`/`portfolio_url`.

### `portfolio_projects`

Frontmatter → title/card/subtitle/description/summaries, client/industry/category, services, overview/challenge/features, technologies + `technology_notes`, URLs, contribution fields, `media_layout`, filters, `featured`, `home_rank`, `contribution_verified`, SEO fields.

### `portfolio_screenshots`

`project` M2O UUID, `image` file, `alt`/`caption`/`kind`/dimensions/`orientation`, `checksum_sha256`, `sort`, `status=draft`.

### `services`

Slug/title/summary/hero, `icon_token`/`visual_token`, tags, JSON section groups, FAQ, CTA to `/contact?service=…`, order, SEO.

### `insights_articles`

Slug/title/excerpt/`body` (full Markdown), author (Vortex Digital), category, featured, `reviewed_at` from source updated date when present. No cover images in source.

### Singletons / sections

- `site_settings`: name, tagline, summary/description, location, filtered `https` social links, default SEO, CTA.
- `homepage_content`: hero + CTAs + team-film copy/disclosure + `featured_project_slugs` + poster + owner-accepted `team_film_video` (30s MP4).
- `page_sections`: about hero/who/audiences/mission/vision/philosophy/home_intro + process steps.

## Portrait verification

| Person | Source path | CMS portrait distinct |
| --- | --- | --- |
| Adrian Cruz | `/assets/team/uiux-product-designer/portrait.webp` | Yes (`ae44b015-…`) |
| Matheus Pereira | `/assets/team/mobile-app-developer/portrait.webp` | Yes (`14d86ac8-…`) |

All nine display-order names match source: Don Tran → … → Sofia Vasylivna Melnyk.

## Homepage MP4 (owner-accepted)

Working-tree `public/videos/vortex-team-showcase.mp4` (**13,032,156** bytes, ~30 s) is the owner-chosen film. Step 9F’s 4,718,893-byte optimized copy remains absent from git and was not restored. The current file **was imported** as Directus file #29 and linked on `homepage_content`. Astro public path/layout unchanged. Unit suite **25/25**. See `STEP_10B_MEDIA_AUDIT.md` and `STEP_10B_COMPLETION_REPORT.md`.

## Project relationship verification

Each of the six project UUIDs has exactly three screenshots with sorts `1,2,3`. Slugs: `scaleup-systems`, `medastare`, `gain-energy-upstrima`, `gowabi`, `daniela-diamonds`, `born-to-rock`.

## Insights body verification

All 12 article `body` fields match source Markdown bodies exactly (no mismatch list). Flags remain draft / unapproved / no `published_at`.

## Schema changes in 10B

**None.** Used existing Step 10A collections/fields. No `--reset-custom-collections`.

## Schema / modeling gaps (future 10C)

- Complex Astro-only UI (stats, testimonials, technology grids, FAQ accordion, collaboration preview) not flattened into CMS filler.
- Service icons remain token names, not uploaded SVG binaries.
- Homepage film not in CMS until a verified optimized MP4 is restored by the owner.
- No CMS→Astro read path yet.

## Idempotency

Second `BACKUP_OK=1 node scripts/migrate-content-10b.mjs --apply`: **0** new files, **0** new items; counts unchanged (files stayed at 28).

## Privacy

Anonymous HTTP: custom collections **403**, `/files` **403**, sample `/assets/<id>` **403**.
