# Content schema — Step 10A

Implemented in the local Directus instance via `cms/scripts/apply-schema.mjs`. No live Vortex website content is imported in this step.

## Versions and limits

| Item | Value |
| --- | --- |
| Directus image | `directus/directus:12.6.0` |
| PostgreSQL image | `postgres:16.10-alpine` |
| Custom collections | 8 |
| Primary keys | UUID on all custom collections |
| Directus Core collection limit (reference) | 25 |
| Headroom | 17 collections |

## Shared editorial conventions

Applicable content collections include:

| Field | Type | Default / rule |
| --- | --- | --- |
| `status` | string | `draft` \| `in_review` \| `approved` \| `published` \| `archived`. Default `draft`. |
| `publication_approved` | boolean | Default `false`. Owner approval is separate from a casual status change. |
| `published_at` | timestamp | Nullable. Set only for truly public records later. |
| `slug` | string | Unique where the site routes by slug. |
| `seo_title` / `seo_description` / `seo_image` | string/text/file | Optional for routed collections. |

Archive uses `status = archived` rather than hard delete for normal editorial work.

Markdown/rich text is stored as text. **Sanitization belongs at the Astro integration boundary in later steps.** Never render CMS HTML unescaped.

## Collections

### 1. `team_members`

| Field | Purpose |
| --- | --- |
| `slug` | Existing route segment (`founder-ceo`, …) |
| `name` | Real name when confirmed; may be empty |
| `role`, `intro`, `biography`, `responsibilities`, `expertise` | Profile copy (JSON for structured lists) |
| `experience`, `external_experience`, `startup_support`, `related_roles` | Verified biography support fields |
| `portrait`, `portrait_alt` | Owner-assigned portrait file + alt |
| `display_order`, `featured` | Ordering / homepage emphasis |
| `linkedin`, `github`, `portfolio_url` | Optional verified links |

Do not invent employees or reassign portraits.

### 2. `portfolio_projects`

Supports titles, summaries, contribution fields, technologies, external links, featured/`home_rank`, SEO, and approval flags. Relation: one project → many `portfolio_screenshots`.

Do not invent metrics, modules, or client claims.

### 3. `portfolio_screenshots`

| Field | Purpose |
| --- | --- |
| `project` | M2O → `portfolio_projects` |
| `image` | File |
| `alt`, `caption`, `kind`, `width`, `height`, `orientation` | Display metadata |
| `provenance_note`, `checksum_sha256` | Source / integrity |
| `sort`, `status` | Order and editorial state |

### 4. `services`

Eight specialty pages. Fields cover title, summary, hero, icon/visual tokens (design-system names only), tags, JSON sections (`applications`, `challenges`, `approach`, `capabilities`, `deliverables`, `faqs`), CTA label/href, featured, `display_order`, SEO, approval.

### 5. `insights_articles`

Title, slug, excerpt, Markdown body, author, category, cover, featured, reviewed_at, SEO, status, `publication_approved`, `published_at`.

**All twelve current articles stay unpublished and are not imported in 10A.**

### 6. `site_settings` (singleton)

Public name, tagline, summary/description, optional location, social links JSON, default SEO, branding image, CTA labels/hrefs.

**Forbidden here:** secrets, SMTP, domain, `PUBLIC_SITE_URL`, hosting credentials.

### 7. `homepage_content` (singleton)

Hero copy/CTAs/image, team-film eyebrow/heading/description/disclosure, video + poster file refs, featured project slug list, status + approval.

Team film remains illustrative, not documentary footage of a real event. Media files are not imported in 10A.

### 8. `page_sections`

Whitelisted `page_key` (`about`, `process`, `contact`, `services_index`, `team_index`) and `section_type` (`hero`, `copy`, `list`, `cta`, `faq`, `media`). Holds eyebrow/title/body/items/image/sort/status/approval.

## Relations

| Many | Field | One |
| --- | --- | --- |
| `portfolio_screenshots` | `project` | `portfolio_projects` (`screenshots` alias) |

File fields use Directus `directus_files` through the standard file interfaces.

## Future migration mapping (Step 10B)

| Astro source | CMS collection |
| --- | --- |
| `src/data/team.ts` | `team_members` |
| `src/content/case-studies/*.md` | `portfolio_projects` + `portfolio_screenshots` |
| `src/data/services.ts` | `services` |
| `src/content/blog/*.md` | `insights_articles` (still draft/unapproved) |
| `src/data/site.ts` public fields | `site_settings` |
| Homepage hero + team film section | `homepage_content` |
| About / process blocks | `page_sections` |

## Reproducibility

```bash
cd cms
node scripts/apply-schema.mjs
```

Re-running is safe: existing collections/fields are left in place. Metadata summary is written to `schema/collections.meta.json` after a successful apply.

Destructive schema reset (custom collections only; no Astro content is in CMS during 10A):

```bash
node scripts/apply-schema.mjs --reset-custom-collections
```

Use only when intentionally recreating empty custom tables (for example after a primary-key type correction).
