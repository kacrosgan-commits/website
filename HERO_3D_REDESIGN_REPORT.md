# Hero 3D redesign report

**Status: PASSED**

The hero graphics are no longer the shared purple orbits, spheres, and globe. Each public hero uses one scene system: a CSS 3D composition that is visible immediately, and a deferred Three.js scene where a real-time model earns its weight. The dark-purple page, the type, the office photograph, the hall photograph, the homepage film, and the copy-only contact form stay.

## Before

About, services, portfolio, process, team, insights, and contact painted a full-bleed SVG (`about-orbit`, `services-spheres`, `portfolio-portal`, `process-orbit`, `blog-panels`, `contact-globe`). Privacy, terms, and the 404 page used two radial orbs. The homepage hall used two circle overlays (`purple-glow.svg`, `purple-atmosphere.svg`) on top of the photograph. Before shots: `docs/hero-3d-qa/before/`.

## What shipped

`HeroStage.astro` is the only hero scene. `src/scripts/hero-stage.ts` builds the WebGL variants. `src/scripts/hero-parallax.ts` tilts the CSS fallback until WebGL takes over. `HallDepth.astro` is the homepage-only treatment, so the hall page does not download Three.js.

Scenes: workspace (about), architecture (services), service modules (eight detail pages), showcase (portfolio, using up to three approved screenshots), study (each case study’s own first screenshot), pipeline (process), collaboration (team), profile (nine profiles), communication (contact), editorial (insights, gallery, privacy, terms, 404). Insight articles, privacy, terms, and the 404 page stay on the CSS scene and do not load WebGL.

The service diagrams, case-study figures, portraits, and gallery images are still the readable content. The scene sits behind them.

## Preserved

- Six approved portfolio projects. Showcase textures are their existing screenshots, not drawn interfaces.
- Nine team profiles and their portraits.
- Eight services.
- Twelve unpublished Insights drafts stay out of the production HTML. The build is still 35 pages and 31 sitemap URLs.
- `public/videos/vortex-team-showcase.mp4` is still 13,032,156 bytes.
- The contact script is still `ContactForm.astro_astro_type_script_index_0_lang.D9TLJQGD.js` at 6,833 bytes. The form still copies and does not send.
- Directus, PostgreSQL, releases, publication state, domain, email, and deployment were not changed.

## Checks

- `npx astro check`: 0 errors.
- `npm test`: 37 passed, 0 failed.
- `CONTENT_SOURCE=local npm run build`: 35 pages, 31 sitemap URLs, 13.32s.
- `E2E_PORT=4322 CI=1 npm run test:e2e`: 24 passed. Port 4321 was already taken by the dev server. The long case-study walk needed a 90s budget after the heavier hero pages; the assertions are the same.
- After that run, the shared cluster was lowered so the services headline stays clear of the panels. Overflow on services, contact, process, and team was still 0.

Screenshots after the change: `docs/hero-3d-qa/after/`.

## Limits

The Three.js chunk is 540,072 bytes raw and 132,666 gzip. It is deferred and absent from the homepage, but it is still a large download on the first WebGL hero. No Lighthouse or lab CLS number is claimed. A `CONTENT_SOURCE=cms` build was not run.
