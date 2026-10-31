# Step 10A architecture review — Vortex Digital CMS foundation

**Date:** 2026-10-29  
**Scope:** Local Directus + PostgreSQL beside the existing Astro 7 site  
**Status:** Implemented and verified locally; content migration deferred

## Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Placement | Separate `cms/` directory in the same repo | Keeps Astro untouched; later deployable independently |
| CMS | Directus `12.6.0` (pinned) | Current stable line compatible with official Compose guidance; not `latest` |
| Database | PostgreSQL `16.10-alpine` (pinned) | Compatible with Directus 12; healthchecked; no host port |
| Binding | `127.0.0.1:8055` only | Local Studio/API; no accidental LAN exposure |
| Persistence | Named volume `vortex_cms_pgdata` + `cms/uploads` bind | Survive `compose down` / restart without `-v` |
| Secrets | `cms/.env` (gitignored, mode 600) | Strong random `SECRET`, DB password, admin password, static admin token |
| Schema apply | Idempotent REST script `apply-schema.mjs` | Reproducible under Core limits; UUID PKs for relations |
| Collections | 8 custom collections | Fits under Core’s 25-collection reference limit (headroom 17) |
| Public access | Deny-by-default | Anonymous reads return 403 for custom items and files |
| Astro integration | None in 10A | Frontend still reads local data; CMS is admin foundation only |

## Content model summary

Custom collections: `team_members`, `portfolio_projects`, `portfolio_screenshots`, `services`, `insights_articles`, `site_settings`, `homepage_content`, `page_sections`.

Shared editorial fields where applicable: `status` (draft → archived), `publication_approved` (default `false`), `published_at`, slug/SEO on routed types.

Relation: `portfolio_screenshots.project` → `portfolio_projects.id` (`ON DELETE CASCADE`).

Primary keys are UUID. An earlier integer-default PK conflicted with UUID M2O fields; collections were reset once on the empty CMS and recreated with explicit UUID ids.

## Licensing / feature constraints

Directus Core (public 2026 pricing reference): limited Studio seats, **25 collections**, limited Flows. This project uses **8** custom collections and does not assume:

- unrestricted multi-role approval products,
- content versioning availability,
- extra seats, or
- paid Cloud features.

Editor≠Publisher enforcement and build-time reader roles are designed in `cms/docs/PUBLICATION_ARCHITECTURE.md` and `SECURITY_AND_PERMISSIONS.md` for Steps 10C/10D, not falsely claimed as fully enforced in 10A.

No Open Innovation Grant key was applied for or embedded.

## Security posture

- Studio requires authentication.
- `ADMIN_TOKEN` is for local schema/verification scripts only — never in Astro `PUBLIC_*` or browser bundles.
- CORS disabled; telemetry off; websockets off for the local stack.
- Upload MIME allow list includes images and `video/mp4` for later homepage film migration, without opening arbitrary binaries.
- Contact delivery, SMTP, domain, and `PUBLIC_SITE_URL` remain outside CMS.

## Risks

| Risk | Mitigation / follow-up |
| --- | --- |
| Treating `status=published` as a live site publish | Documented; requires approved snapshot / dual-flag contract in 10C |
| Accidental volume wipe (`down -v`) | Documented warnings; normal stop is `compose down` |
| Docker group = root-equivalent | README explains; uses `sg docker` when the shell lacks the group |
| Schema drift vs Astro copy | 10B migration must map real slugs/fields; no invented staff/projects |
| Large homepage MP4 size vs unit assertion | Pre-existing frontend test mismatch (`13032156` vs expected `4718893`); unrelated to CMS |

## Intentionally postponed (10B–10F)

| Step | Work |
| --- | --- |
| 10B | Import real team, portfolio, services, Insights drafts, media — still unpublished/unapproved as required |
| 10C | Astro build-time reads; least-privilege reader; publish filters |
| 10D | Approval workflow / snapshot enforcement; rebuild triggers (design only now) |
| 10E+ | Domain, DNS, business email, contact delivery, hosting, production deploy |

## What was not changed

- Astro routes, components, and public content sources
- Six published portfolio cases, nine team profiles/portraits, twelve Insights drafts, eight services
- Homepage team film asset path and copy-only contact behavior
- `PUBLIC_SITE_URL` / `https://example.com` placeholder
- No fake employee or portfolio records persisted after verification cleanup
