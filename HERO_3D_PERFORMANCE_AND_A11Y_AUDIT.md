# Hero 3D performance and accessibility audit

No Lighthouse score was invented. Numbers below are from the local production build (`CONTENT_SOURCE=local npm run build`) and from Playwright against that build.

## Weight

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| `dist/_astro/BaseLayout.C7QN2D-N.css` | 62,962 | 13,667 |
| `dist/_astro/hero-stage.B_LbnYZD.js` | 540,072 | 132,666 |
| Contact script `…D9TLJQGD.js` | 6,833 | unchanged hash |

The previous motion CSS was 56,861 bytes raw and 12,415 gzip. The hero rules added about 6 KB raw.

The Three.js chunk is the cost of the real-time scenes. It is a separate file. The homepage HTML does not reference it. Stages that do use it wait for `requestIdleCallback` (timeout 1.6s) before the import, so the heading and the CSS scene paint first. Privacy, terms, insight articles, the 404 page, and the homepage never request it.

Inside the renderer:

- Pixel ratio capped at 1.25, or 1 when the stage is under 768 CSS pixels or the machine reports four or fewer cores.
- Frame spacing about 48fps, or about 24fps in that lower-power case.
- One shadow map (512) on the higher-power path only.
- Screenshot textures are drawn into a 512×320 canvas, not uploaded at full photo size.
- The loop stops when the stage is off screen or the tab is hidden.
- `pagehide` disposes the renderer, geometries, materials, and textures and cancels the frame.

## Build baseline

35 pages. 31 sitemap URLs. Same local baseline as the previous production build. Contact script bytes and the 13,032,156-byte homepage MP4 are unchanged.

## Accessibility

- Scene roots are `aria-hidden`. They add no headings and no links.
- Headings, breadcrumbs, buttons, and the skip link stay in the document flow above the canvas (`z-index`).
- The canvas is masked on the left (and from the top under 48rem) so panels do not sit in the type.
- `prefers-reduced-motion: reduce` skips both the parallax module and Three.js. The CSS scene remains, with no loop.
- Without JavaScript the canvas stays at opacity 0 and the CSS scene is the hero.
- Keyboard order is unchanged. The canvas is not focusable. Pointer handlers are passive and do not call `preventDefault`.
- Portraits, the office photograph, case-study screenshots, and service diagrams keep their existing alt text. Panel textures are decorative.

## What was not measured

No lab CLS trace and no Lighthouse run. The stage is `position: absolute` inside a hero that already had its height, so it does not add document flow. Playwright overflow checks cover the hero routes at 320 and 1440 CSS pixels, and the existing suite still covers 375, 768, 1024, and 200% text.

`cms-shadow` and a real `CONTENT_SOURCE=cms` build were not run.
