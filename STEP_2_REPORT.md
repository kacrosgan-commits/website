# Step 2 Report — Image and Visibility Defects

Date: 27 October 2026

Scope was limited to the broken profile thumbnails, the existing 27 team images, scroll-reveal visibility, and team image layout. Names, publication status, portfolio content, the contact form, and deployment configuration were not changed.

## 1. Issues fixed

- Profile previous/next navigation requested `/assets/team/{slug}/portrait-thumb.webp`, and those nine files were missing. Each thumbnail is now a 384×384 WebP downscaled from the existing 768×768 portrait with Lanczos resampling. Faces were not retouched, and the portraits were not replaced.
- Scroll-reveal could leave `.reveal` sections at `opacity: 0` when the page script failed or never observed a section. Content now stays visible unless JavaScript has successfully prepared an off-screen section for a short fade-in.

## 2. Files modified

- `src/layouts/BaseLayout.astro` — the head script that added `can-reveal` immediately was removed. The end-of-body script now marks sections already in view, hides only off-screen sections after the observer is created, and reveals every section if `IntersectionObserver` is missing or throws.
- `src/styles/global.css` — `.reveal` defaults to `opacity: 1`. The hidden state applies only to `html.can-reveal .reveal.await-reveal:not(.is-in)` inside `prefers-reduced-motion: no-preference`.
- `public/assets/team/{slug}/portrait-thumb.webp` — added for all nine roles.

`src/data/team.ts` and `src/components/team/TeamProfile.astro` already pointed previous/next images at `portrait.thumb`. No data or component edit was required once the files existed.

## 3. Team image verification results

Browser checks used the production preview at `http://127.0.0.1:4321` after the production build, at 375px, 768px, and 1440px. Every team image was scrolled into view and had to decode.

| Surface | Result |
| --- | --- |
| `/team` | 15 team images decoded: 9 `portrait.webp` files plus 6 collaboration `work-01.webp` previews. Horizontal overflow 0 at all three widths. |
| `/team/gallery` | 27 images, 27 distinct `/assets/team/` paths, all `naturalWidth > 0`. Playwright also required a non-empty alt on each. |
| Each of the 9 profiles | Portrait, `work-01.webp`, and `work-02.webp` for that role, plus the two navigation thumbnails. Five team images per profile, all decoded. |

Portrait cards render as squares with `object-fit: cover`: 411×411 at 1440px, 340×340 at 768px, and 333×333 at 375px. Source portraits are 768×768, so the square frame does not stretch them. Navigation thumbnails render at 64×64 from 384×384 sources. Work scenes keep the 1672×941 ratio (`aspect-ratio: 1672 / 941`, `object-fit: cover`).

Each profile shows two captions ending in “Illustrative scene, not a documented company event.” The team and gallery copy continues to say these scenes are not records of this company’s meetings. No image was recreated or replaced.

## 4. Thumbnail fix confirmation

All nine `portrait-thumb.webp` files are valid WebP, 384×384, produced only by downscaling the matching portrait. On every profile, at all three widths, both previous and next images returned `naturalWidth` 384, rendered at 64×64, with computed opacity 1. The navigation pairs are:

- Founder & CEO: QA & DevOps Engineer, Co-Founder & CTO
- Co-Founder & CTO: Founder & CEO, CFO
- CFO: Co-Founder & CTO, Project Manager
- Project Manager: CFO, Senior Full-Stack Developer
- Senior Full-Stack Developer: Project Manager, AI Engineer
- AI Engineer: Senior Full-Stack Developer, Mobile App Developer
- Mobile App Developer: AI Engineer, UI/UX & Product Designer
- UI/UX & Product Designer: Mobile App Developer, QA & DevOps Engineer
- QA & DevOps Engineer: UI/UX & Product Designer, Founder & CEO

## 5. Scroll animation fix confirmation

- Without JavaScript, homepage `.reveal` sections computed to opacity 1. Team, gallery, and the founder profile images still decoded. `can-reveal` was not present.
- With `prefers-reduced-motion: reduce`, the homepage’s seven reveal sections stayed at opacity 1 and `can-reveal` was not added. Team images still decoded.
- With motion allowed, off-screen homepage sections receive `await-reveal` and fade in. After scrolling the page, all seven had `is-in` and opacity 1. Sections already on screen are marked visible before `can-reveal` is added, so a failed observer cannot leave them transparent. The default stylesheet keeps them visible when that script does not run.

## 6. Tests executed and results

Commands used Node 24.21.0.

| Command | Result |
| --- | --- |
| `npm test` | 5 passed, 0 failed |
| `npm run check` | 0 errors, 0 warnings, 31 existing `zod` deprecation hints in `src/content.config.ts` |
| `npm run build` | Completed, 29 pages |
| `npm run test:e2e` | 6 passed, 0 failed, against the preview on port 4321 |

Browser automation was available. Chrome, driven through Playwright, checked image decoding, opacity, object fit, and horizontal overflow at 375px, 768px, and 1440px, including a JavaScript-disabled context and a reduced-motion context. No broken team image, stretched image, in-view hidden reveal section, or horizontal overflow was found.

## 7. Any remaining problems

No remaining defect was found in the nine thumbnails, the 27 team images, or the scroll-reveal visibility rules.

These existing site conditions were left unchanged because they are outside this step:

- Employee names are still unpublished, and profiles remain `noindex`.
- The contact form is still unconfigured and does not report a successful send.
- Brand, domain, and email remain placeholders.
- `astro check` still reports 31 hints because `z` is imported from `astro:content`.
