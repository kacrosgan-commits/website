# Site-wide motion implementation report

**Status: PASSED**

The public site now uses one motion system for entrances, staggers, and small interaction feedback. The dark-purple layout, approved content, homepage film, and copy-only contact form are unchanged. No CMS phase was started and nothing was deployed.

## Before

Sections on the home, about, and services pages already faded up through `.reveal` and a small `IntersectionObserver` in `BaseLayout.astro`. Hero copy had a `hero-in` animation whose keyframes did not define a start state, so the sequence did little. The hall’s white exposure and specular layers were present and set to opacity 0. Cards lifted on hover only. Portfolio, team profiles, case studies, the gallery, contact, legal pages, and the 404 page had little or no entrance motion. The homepage header overlay from the previous uncommitted work was left in place.

## What changed

Tokens and classes are documented in `SITEWIDE_MOTION_DESIGN_SYSTEM.md`. Route coverage is in `SITEWIDE_MOTION_PAGE_MATRIX.md`. Weight and accessibility evidence is in `SITEWIDE_MOTION_PERFORMANCE_AND_A11Y_AUDIT.md`.

The observer still reveals each node once. It now also covers the new classes, skips reduced motion, reveals on focus and hash navigation, and does not set a resting opacity of 0. Off-screen blocks rise 12px. They stay fully readable if JavaScript is off or motion is reduced.

Hero copy on shared and custom heroes uses a short staggered rise that begins at opacity 0.55. On large screens the existing purple aura and white exposure ease between low opacities. They do not flash, and they stop under reduced motion.

Interactive pieces: button press, nav and footer link color, filter chips, card hover and keyboard focus, a light dialog entrance, and the process line drawing in when that list is reached. The line is already visible without JavaScript.

## Files

Styles and the shared observer: `src/styles/global.css`, `src/layouts/BaseLayout.astro`.

Shared UI: `PageHero`, `GradientButton`, `OutlineButton`, `CtaSection`, `ProcessTimeline`, `Footer`, `ContactForm`, `ServiceCard`, `ProjectCard`, `TeamCard`, `BlogCard`, `Stats`, `CollaborationPreview`, `ServiceDetail`, `ServiceVisual`, `CaseStudy`, `CmsCaseStudy`, `TeamProfile`.

Pages: `index`, `about`, `services/index`, `portfolio/index`, `team/index`, `team/gallery`, `insights/index`, `insights/[slug]`, `contact`, `404`.

Tests: `tests/unit/motion.test.ts`, `tests/e2e/motion.spec.ts`. `playwright.config.ts` reads `E2E_PORT` and still defaults to 4321.

Screenshots: `docs/sitewide-motion-qa/`.

## Preserved

- Six approved portfolio projects and their screenshots.
- Nine team profiles, including distinct portraits for Adrian Cruz and Matheus Pereira.
- Eight services and `?service=` contact links.
- Twelve unpublished Insights drafts stay out of the production HTML and sitemap.
- `public/videos/vortex-team-showcase.mp4` was not replaced. Poster, muted autoplay, loop, controls, and the illustrative-scenes caption remain. The contact script bundle is byte-for-byte the same.
- Local content mode remains the default. Directus, PostgreSQL, releases, domain, email, and deployment were not touched.
- Build result: 35 pages, 31 sitemap URLs.

## Tests

| Command | Result |
| --- | --- |
| `npm test` | 35 passed |
| `npm run check` | 0 errors, 0 warnings |
| `CONTENT_SOURCE=local npm run build` | 35 pages in 22.26s, then a rebuild in 12.85s after the observer fix |
| `CI=1 npm run test:e2e` | Failed at startup: `http://127.0.0.1:4321 is already used` by the running dev server |
| `E2E_PORT=4322 CI=1 npm run test:e2e` | 21 passed in 5.5m against production `astro preview` |

The second command is the production run. It includes the new motion checks plus the existing smoke and site-quality suites (overflow, 200% text, menu, dialog, contact copy, film, insights, and portfolio).

## Limitations

- No Lighthouse or lab CLS trace. Motion is transform and opacity, and the overflow tests passed.
- Legal pages only get the hero entrance.
- The homepage film still autoplays because the existing production test requires it. This task did not switch it to user-initiated playback.
- `cms-shadow` and a real `cms` build were not run. No approved release was activated.
