# Homepage redesign implementation report

**Status: PASSED**

The homepage is now a product-first editorial page. Real approved case-study screenshots lead the first viewport. Work, services, process, team film, technology, FAQ, and CTA follow in a shorter, more scannable order. The dark-purple brand, navigation, six approved projects, nine profiles, eight services, unpublished Insights drafts, 30-second team film, and copy-only contact behavior are unchanged. Directus, releases, domain, email, and deployment were not modified.

## Before

The first screen was the hall photograph. The team film came next. Portfolio proof sat mid-page. Services were an eight-card wall. “Why teams stay,” process, collaboration scenes, and the roster repeated card grids and stretched the page. Before shots: `docs/home-redesign-qa/before/`. A checkpoint of the previous homepage lives at `docs/home-redesign-qa/index.astro.before`.

## What shipped

| Section | Implementation |
| --- | --- |
| Product hero | `HomeProductHero.astro` — copy, CTAs, verified proof counts, layered CSS 3D showcase of ScaleUp, MedaStaré, and Gain Energy with keyboard tabs and pointer tilt |
| Work | `HomeWorkGrid.astro` — all approved homepage projects in a 2 featured + supporting editorial grid |
| Services | `HomeServicesBento.astro` — eight specialties in four groups |
| Process | `HomeProcessRibbon.astro` — six real stages with a one-time track reveal |
| Film + people | `TeamShowcase.astro` editorial layout + compact roster; film attributes and disclosure preserved |
| Stack | `HomeTechStrip.astro` — compact pill groups |
| FAQ / CTA | Existing accordion and contrasting CTA panel |

Removed from the homepage only (source data kept): the hall hero, separate company intro block, “Why teams stay” grid, empty stats/testimonials slots, and the second collaboration-photo section.

Secondary CTA default is now **View Our Work** → `/portfolio`. CMS homepage fields still override when present.

## Checks

- `npm test`: 40 passed
- `npx astro check`: 0 errors
- `CONTENT_SOURCE=local npm run build`: 35 pages, 31 sitemap URLs
- `E2E_PORT=4322 CI=1 npm run test:e2e`: 24 passed
- `npm run cms:shadow`: ok, 9 team / 6 projects / 18 screenshots / 8 services / 12 insights counted; no ACTIVE public eligibility expected in shadow
- Video file still 13,032,156 bytes; contact script hash `D9TLJQGD.js` unchanged

## Limits

No Lighthouse lab scores are claimed. A full `CONTENT_SOURCE=cms` production homepage with an ACTIVE release was not activated. Fixture/shadow parity was verified instead. After screenshots: `docs/home-redesign-qa/after/`.
