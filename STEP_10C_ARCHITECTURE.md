# STEP 10C — Architecture

## Data flow

```text
CONTENT_SOURCE
├── local (default)
│     └─ Astro pages/components read src/data + src/content only
│        Zero Directus requests. Works if Directus is stopped.
├── cms-shadow
│     └─ Private audit scripts (and optional ensureContentMode) fetch staged CMS
│        with DIRECTUS_SHADOW_TOKEN, write cms/.tmp parity JSON
│        Public HTML still comes from local sources
└── cms
      └─ BaseLayout → ensureContentMode() → DIRECTUS_BUILD_TOKEN
         Publication gate: status=published AND publication_approved=true
         AND published_at set. Current staged DB → fail closed.
         Approved media would materialize to /cms-media/{sha}.{ext} at build time.
```

## Feature switch

| Env | Meaning |
| --- | --- |
| `CONTENT_SOURCE` | `local` \| `cms-shadow` \| `cms` (empty → `local`) |
| `DIRECTUS_URL` | `http://127.0.0.1:8055` (loopback only for builds) |
| `DIRECTUS_SHADOW_TOKEN` | Read-only audit identity (server-only) |
| `DIRECTUS_BUILD_TOKEN` | Read-only build identity (server-only) |

Never use `PUBLIC_*` for tokens. Never put `access_token` in URLs.

## Module map

| Path | Role |
| --- | --- |
| `src/lib/content/source.ts` | Mode validation |
| `src/lib/content/publication-gates.ts` | Strict publish eligibility |
| `src/lib/content/directus-client.server.ts` | Authenticated REST client |
| `src/lib/content/directus-mappers.ts` | CMS row → normalized shapes |
| `src/lib/content/local.ts` | Local snapshot helpers |
| `src/lib/content/cms-load.ts` | Fetch + readiness evaluation |
| `src/lib/content/media.ts` | Build-time approved asset materialization |
| `src/lib/content/parity.ts` | Local↔CMS comparison |
| `src/layouts/BaseLayout.astro` | `cms` mode fail-closed gate |

## Scripts

```bash
npm run cms:setup-identities   # one-time scoped readers → project .env
npm run cms:shadow             # private parity audit
npm run cms:readiness          # non-mutating publish gate report (expect fail today)
npm run cms:media              # materialize only if readiness ok
npm run cms:rollback-check     # local build with Directus unreachable
```

## Incomplete CMS coverage (still code-managed)

Stats, testimonials, technology grids, FAQ accordion, collaboration preview scenes, and other complex Astro UI without faithful CMS fields remain **code-managed**. Do not invent filler CMS content for them.

## Homepage video

Owner-approved **30s** file at `public/videos/vortex-team-showcase.mp4` (13,032,156 bytes) remains the site source. Player contract matches the live Step 9F/10B site (muted autoplay + poster + disclosure). CMS holds a copy on `homepage_content.team_film_video` for future approved builds; local mode does not fetch it.

## Step 10D boundary

Publication mutations, bulk approve/publish, webhooks, hosting, and deploy automation are **out of scope**. Owner reconciliation is documented in `STEP_10C_RECONCILIATION_PLAN.md` but not executed.
