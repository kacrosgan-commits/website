# Homepage performance report

No invented Lighthouse or field Core Web Vitals scores.

## Build assets (local production)

| Asset | Size |
| --- | --- |
| `BaseLayout.*.css` | 71,895 bytes raw / 15,138 gzip |
| Contact form script `…D9TLJQGD.js` | 6,833 bytes (unchanged hash) |
| Homepage film | 13,032,156 bytes (unchanged) |
| Pages / sitemap | 35 HTML pages / 31 URLs |

## Loading strategy

- Hero LCP candidates are the headline and the first showcase screenshot (`fetchpriority="high"` on the active panel image).
- The hall photograph is no longer the homepage LCP image.
- The film still uses `preload="auto"` because existing playback tests require the current attributes. It is no longer the first section.
- Showcase secondary panels and work/service media use lazy loading.
- Homepage does not import Three.js. Product depth is CSS 3D plus a small deferred script in `HomeProductHero.astro`.
- Pointer tilt uses one `requestAnimationFrame` loop and stops when the pointer leaves or the document is hidden.

## Verified checks

- `CONTENT_SOURCE=local npm run build` succeeded.
- Playwright overflow suite at 320–1440 and 200% text passed after the service-bento wrap fix.
- `npm run cms:shadow` succeeded against local Directus shadow counts without activating public CMS content.

## Not measured here

Lab LCP / INP / CLS on throttled mobile, and a live ACTIVE CMS homepage render. Shadow parity was used instead of activating a release.
