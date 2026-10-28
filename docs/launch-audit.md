# Launch audit

Audit date: 26 October 2026. Framework kept: Astro static site, TypeScript, Tailwind CSS v4. Hosting target already chosen in the repo: Cloudflare Pages, output directory `dist`, headers in `public/_headers`.

## What was already in place

- Public routes for home, about, services and service details, portfolio, process, team, nine profiles, insights, contact, privacy, terms, and 404.
- Dark and purple visual system, Space Grotesk and Inter, cinematic office hero.
- Nine roles and 27 team image paths sourced from `ASSET_MANIFEST.json`.
- Contact form with validation, honeypot, and a Formspree adapter that refuses to show success when the endpoint is empty.
- Sample case studies and demonstration articles were built and labeled, but they were still reachable.

## Repairs made for this release

- Sample case studies are no longer generated as public pages. `/portfolio` explains that no client study is approved and links to the real services.
- Demonstration articles are no longer generated or listed. `/insights` stays as an empty editorial page.
- Privacy is `noindex` and omitted from the sitemap until counsel reviews it. Terms already was.
- Inquiry rules live in `src/utils/inquiry.ts` and are covered by unit tests.
- Playwright smoke tests cover routes, the 27-image gallery, profiles, the contact error state, 404, and the mobile menu.
- Dependency audit findings in `fast-uri`, `undici`, and `zod` were cleared with `npm audit fix`.
- Content-Security-Policy and a one-week asset cache were added to `public/_headers`. Those headers apply on Cloudflare Pages, not on `astro preview`.

## Not changed on purpose

- The brand name remains the configured placeholder `Velora`.
- Team names, social profiles, and project credits stay empty.
- Profiles and `/team/gallery` stay `noindex`.
- No live domain was connected and no form submission was sent to a real inbox.
