# Step 9E Report — Website-wide QA, accessibility, performance, and local production readiness

**Deployed:** no. No domain, DNS, `PUBLIC_SITE_URL`, business email, contact endpoint, hosting config, or `.env` value was changed. No later step was started.

**Status:** locally quality-audited. Not publicly launch-ready. The canonical host is still `https://example.com`, contact delivery is still unconfigured, and the twelve Insights drafts are still unpublished.

## 1. Executive summary

The existing Astro site was audited against a recorded baseline, then fixed where a defect was reproducible. The public page count stayed at 35 HTML files and 31 sitemap URLs.

Fixes that shipped:

- Portfolio PNG screenshots now have same-size WebP copies, and each card uses a smaller WebP. Original PNG and JPG files are unchanged and still match `PORTFOLIO_ASSET_MANIFEST.json`.
- Mobile screenshot frames reserve their aspect ratio, which removed the measured layout shift on the slow-mobile profile (Born To Rock CLS after scroll 0.5354 → 0).
- Long words and fixed grid gaps no longer force horizontal scrolling at 200% text size. The final browser audit of all 35 routes was 385 checks with 0 document overflows, 0 clipped headings, 0 broken images, and 0 console errors.
- Breadcrumb links, footer legal links, and “View Case Study” links meet a 24px target height. The 404 page no longer advertises a canonical URL. Breadcrumb JSON-LD URLs use the same trailing slash as the canonicals. JSON-LD `<` is escaped.
- The Zod schema import was moved to `astro/zod`. `npm run check` went from 91 hints to 0 hints, with no schema change.
- The mobile menu scrolls inside the viewport at 200% text on a 568px-tall screen, and Escape returns focus to the menu button.

Final commands, all exit 0: unit tests 24/24, `astro check` 0 errors / 0 warnings / 0 hints, build 35 pages, Playwright 16/16.

## 2. Architecture, versions, and files inspected

Read from the installed repo, not from the prompt’s reported figures:

| Item | Value |
| --- | --- |
| Astro | 7.3.8 (`astro` package `^7.3.8`) |
| Tailwind CSS | `^4.3.3` |
| TypeScript | `~6.0.3` |
| Playwright | `^1.58.2`, Chrome channel 155.0.8059.39 when not in CI |
| Node | 24.21.0 |
| Package name | `velora-website` (unchanged) |
| Output | static `dist/`, sitemap via `@astrojs/sitemap` |

Inspected: `astro.config.ts`, `src/content.config.ts`, `src/data/site.ts`, `src/layouts/BaseLayout.astro`, Header, Footer, Contact form, ProjectCard, CaseStudy, TeamCard, TeamProfile, Breadcrumbs, `src/styles/global.css`, portfolio and team content, `src/utils/inquiry.ts`, `src/utils/portfolio.ts`, `src/utils/insights.ts`, `public/_headers`, `tests/e2e/smoke.spec.ts`, and the Step 7, 8F, 9B, 9C, and 9D reports plus `CONTACT_PAGE_REVIEW.md`, `docs/contact-delivery.md`, and `package.json`.

## 3. Git worktree

- HEAD is `606a018` (“Initial commit”).
- At the start of Step 9E, `git status` showed 56 entries, almost all untracked, plus a modified `README.md`. Nothing was reset, discarded, or committed.
- The package name, lockfile, and `.env` were not edited. `public/_headers` was not edited.

## 4. Before baseline

Recorded before any Step 9E source edit, against the then-current production build. Preview: `http://127.0.0.1:4321`.

| Command | Result |
| --- | --- |
| `npm test` | exit 0. 20 passed, 0 failed. Duration 825 ms. |
| `npm run check` | exit 0. 73 files. 0 errors, 0 warnings, 91 hints. All 91 were `ts(6385)` on `z` imported from `astro:content` in `src/content.config.ts`. |
| `npm run build` | exit 0. 35 pages in 7.22 s. |
| `npm run test:e2e` | exit 0. 8 passed, 0 failed, 0 retries. Duration 1.1 min. |

Browser audit of that build (`scripts/site-audit.mjs`, 35 routes, 315 checks at 320/375/768/1024/1440 and at 200% root text on the first four widths):

- 0 console errors, 0 failed document requests, 0 broken images, exactly one `h1` per page.
- 75 checks had `scrollWidth > clientWidth`, all at 200% text: 31 routes at 320px, 27 at 375px, 16 at 768px, 1 at 1024px (`/about/`).
- Clipped headings at 200% text included section titles and the footer “Explore” heading.
- At 100% text, breadcrumb links, footer Privacy/Terms, and “View Case Study” were 19–20px tall.

A separate static pass of the 35 HTML files found no broken internal links, duplicate ids, missing titles or descriptions, missing alt or width/height, or `target="_blank"` without `noopener`. Six external URLs (two App Store links, danieladiamonds.com, scaleupsystems.ai, gain.energy, gowabi.com) were left unverified.

Performance baseline is in `PERFORMANCE_AUDIT.md` and `docs/step-9e/data/perf-before.json`.

## 5. Issue ledger

| ID | Sev. | Defect | Evidence | Resolution |
| --- | --- | --- | --- | --- |
| — | P0 | None found. Draft Insights titles are absent from `dist` HTML, JS, and the sitemap. Sample portfolio routes stay 404. Contact does not claim a message was sent. | Final e2e Insights and contact tests; grep of `dist` for “Planning an MVP for a Startup” returned no matches. | No code change required for a leak. |
| 1 | P1 | At 200% root text, grid and flex tracks grew past the viewport because long words set the min-content width. | Before audit: 75 overflowing route/width pairs. | `overflow-wrap: anywhere` on `body`. Removed the narrower `overflow-wrap` on `.page-title` so headings use the same rule. Column gaps on three `lg:grid-cols-12` heroes use `min()`. Timeline steps stack the number above the card inside a container under 14rem. “How the work is run” cards and team previous/next cards wrap. |
| 2 | P1 | Mobile App Store art used `width: auto; height: auto`, so the frame collapsed until the image loaded. | Slow-mobile CLS after scroll: Born To Rock 0.5354, ScaleUp 0.1801, MedaStaré 0.1714, home 0.1555. | `.shot-frame-mobile img { width: min(100%, 240px) }` and `.shot-gallery-mobile .shot-open img { width: min(100%, 320px) }`. After: those CLS values are 0. |
| 3 | P1 | Several controls were 19–20px tall (WCAG 2.5.8 asks for 24px, with an inline-text exception). | Before audit at every width. | Breadcrumb links, footer Privacy and Terms, and “View Case Study” use `inline-flex min-h-6`. The consent “Privacy Policy” stays inline text inside the consent sentence. |
| 4 | P1 | On a short screen at 200% text, the open mobile menu extended past the viewport (last link at y=1187 on a 568px screen) and the sticky header could occupy more than a quarter of the height. | `.tmp-audit/menu.mjs` before the fix. Escape and focus return already worked. | The bar becomes `position: relative` when it is taller than 25% of the viewport. The open panel scrolls inside the remaining space. After: last link bottom 519px on a 568px screen; Tab reaches “Let’s Talk”; Escape focuses “Open menu”. |
| 5 | P2 | Six PNG screenshots were 491–1,807 KB and were the card, hero, and gallery sources. | Desktop `/portfolio/` initial transfer 3,285 KB. Born To Rock initial 1,914 KB. | Same-size WebP (quality 90) plus a card WebP (quality 85, 480px or 800px wide), delivered with `<picture>`. `img src` stays the original. Desktop `/portfolio/` initial transfer 528 KB. |
| 6 | P2 | The closed enlarge dialog held an `<img>` of the hero, which requested the PNG even when the visible hero was WebP. | Audit request `net::ERR_ABORTED` for `rock-1.png` and `meda-1.png`. | The dialog image is created when the dialog opens and then loads the WebP copy. |
| 7 | P2 | Breadcrumb JSON-LD item URLs dropped the trailing slash (`/portfolio` vs canonical `/portfolio/`). | Built HTML before the edit. | `Breadcrumbs.astro` appends a slash before resolving against `site.url`. |
| 8 | P2 | `/404` was `noindex` but still emitted canonical and `og:url` for `https://example.com/404/`. | Built `dist/404.html`. | `hasCanonical={false}` on the 404 layout. Other pages still emit canonical and `og:url`. |
| 9 | P2 | JSON-LD was injected with `JSON.stringify` only. A `<` in a field could close the script element. | No such content exists today. | `jsonLd()` escapes `<` as `\u003c`. Unit test covers a `</script>` payload. |
| 10 | P2 | 91 TypeScript hints: `z` from `astro:content` is deprecated. | `npm run check` before. | Import `z` from `astro/zod`. Schema text was not rewritten. After: 0 hints. |
| 11 | P2 | Home desktop CLS 0.0486 from Space Grotesk swapping into the hero title (273px → 205px). | `docs/step-9e/data/perf-before.json`. | Left unchanged. The shift is under 0.1 and a preload was not shown to help under the load on this machine. |
| 12 | P2 | Contact H1 at 320px and 200% text can break inside a word. | Step 9D note; still true after `overflow-wrap: anywhere`. | Left as the reflow behavior. Capping the heading with `vw` would block 200% text growth (WCAG F94). Screenshot: `docs/step-9e/contact-320-200-after.png`. |

`package.json` name `velora-website` is recorded in section 21 and was not renamed.

## 6. Route inventory

35 HTML files, same as Step 9D. 31 `<loc>` entries in `dist/sitemap-0.xml`. `dist/robots.txt` allows `/` and points at `https://example.com/sitemap-index.xml`.

Public routes: `/`, `/about/`, `/process/`, `/services/` and the eight service slugs (`web-application-development`, `mobile-app-development`, `ai-intelligent-automation`, `saas-platform-development`, `backend-api-engineering`, `cloud-devops`, `ui-ux-product-design`, `qa-software-testing`), `/portfolio/` and the six case studies, `/team/` and the nine profiles, `/insights/`, `/contact/`.

Present as HTML and excluded from the sitemap: `/privacy/`, `/terms/`, `/team/gallery/`, `/404`. The 404 page is also `noindex` and has no canonical.

## 7. Link crawl

The final site audit loaded every built route. `failed` was empty and `consoleErrors` was empty. The e2e spec walks internal links on the sitemap pages and checks they resolve. No `href="#"`, `javascript:`, or protocol-relative URL was found in the earlier static pass, and the final e2e run did not report a broken internal link.

Trailing slash: in-page links omit it; canonicals and sitemap entries include it. The local preview serves both `/about` and `/about/` as 200. Whether a host redirects is a hosting question, so links were not mass-edited.

External links were not fetched. They stay unverified, not marked broken.

## 8. Home

The home page still leads with the six approved projects in this order: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock. Cards point at `/portfolio/{slug}` and use the card WebP. The mini-team and service blocks were not rewritten. Desktop home CLS stayed 0.0486 (font swap). Home bytes after scroll fell because the featured cards no longer download the full PNGs (3,889 KB → 1,130 KB on desktop).

## 9. Services

All eight service URLs are in the sitemap and were included in the 35-route audit. The contact prefill contract is unchanged: a service CTA goes to `/contact?service={slug}`, and a `<script>`-like `service` query does not become the selected value. The e2e contact test still expects `/contact?service=web-application-development` after a safe prefill. Service copy was not rewritten.

## 10. Portfolio

Six public case studies, three screenshots each, 18 original files. `scripts/check_portfolio_assets.py` matched all 18 manifest hashes after the WebP files were added. Sample study routes stay 404 and out of the sitemap. Related cards link only to other approved studies. App art stays portrait; website shots stay landscape. The enlarge control still opens a dialog, and the no-JS path is the original file URL. The dialog image is created on open.

## 11. Team

Nine published profiles, same names, roles, slugs, and order as Step 9D. Portraits were not recropped or replaced. Adrian and Matheus still use different portrait files. Don’s portrait file was not regenerated. The gallery still shows the owner-assigned portraits plus illustrative scenes. It stays `noindex` and absent from the sitemap. Work-scene captions were not rewritten. Previous/next cards wrap at 200% text instead of widening the grid.

Carlo’s landscape source is shown in `docs/step-9e/team-carlo-card-375.png`, `team-carlo-profile-375.png`, and `team-carlo-profile-1440.png`. A screen reader was not used.

## 12. Insights

Twelve Markdown drafts remain in `src/content/blog/`. None are published. `/insights/` is the empty state and remains in the sitemap. Draft routes such as `/insights/planning-an-mvp-for-a-startup` return 404 in the e2e test. A search of `dist` for the draft title “Planning an MVP for a Startup” and the slug `planning-an-mvp` found no matches. `isPublicInsight` was not loosened.

## 13. Contact

Copy-only behavior is unchanged. The success string is still “Inquiry copied. No message has been sent.” The e2e test covers required-field validation, clipboard success, clipboard failure (no “Inquiry copied” in that path), honeypot, and a hostile `service` query. No endpoint was configured and no inquiry was sent. `PUBLIC_CONTACT_EMAIL` and `PUBLIC_FORMSPREE_ENDPOINT` were not set.

## 14. Responsive matrix

Tool: `node scripts/site-audit.mjs http://127.0.0.1:4321` against the final `astro preview`. Chrome. 35 routes.

Widths at default root font: 320, 375, 768, 1024, 1440. Root font-size 200% at 320, 375, 768, 1024. Browser default font 32px at 1024 and 1440 (the extra 70 checks; 35 × 11 = 385).

Final result: overflow 0, clipped headings 0, undersized non-inline targets 0, pending images 0, broken images 0, console errors 0, failed requests 0. Exactly one `h1` per page.

At 100% text, a geometry snapshot of 24,035 text boxes across 175 route/width pairs showed no unexpected size changes. The intended differences were the 24px target height and the taller mobile screenshot frames (space reserved before load).

Representative screenshots are listed in section 26. 1920px was not a separate viewport.

## 15. Contact heading at 320px and 200% text

The heading still breaks inside long words at that size. That is what `overflow-wrap: anywhere` does, and it is what stops the page from growing wider than the screen. The type scale was not capped with viewport units. Before state: Step 9D already had no document overflow on this page and the same mid-word break. After screenshot: `docs/step-9e/contact-320-200-after.png`. A 32px browser font at 1024px is `docs/step-9e/contact-1024-browser-font-32px.png`.

## 16. Accessibility

Checked with DOM measurement and Playwright keyboard tests. Axe was not installed and was not added. A screen reader was not used. This is not a WCAG certification.

| Check | Result |
| --- | --- |
| One `h1` per built page | Pass, all 385 audit rows |
| Skip link | Hidden until focused (`site-quality` e2e) |
| Mobile menu Escape and focus return | Pass. Focus moves to the first menu link on open and back to “Open menu” on Escape. |
| Menu on a short screen at 200% | Pass after the panel was made scrollable. Screenshot `docs/step-9e/menu-320x568-200-scrolled.png`. |
| Enlarge dialog | Opens from the screenshot control; image is created on open; close returns focus. |
| Contact errors | Existing `aria-invalid` and status text retained. E2e covers the visible error path. |
| Reduced motion | Existing CSS sets `scroll-behavior: auto` under `prefers-reduced-motion`. Not re-recorded on a forced media-feature run in this step. |
| Contrast | Not measured with a contrast algorithm. No color tokens were changed. |
| Target size | Breadcrumb, footer legal, and case-study card links are at least 24px tall. Inline links inside sentences stay inline. |
| 200% text reflow | Pass on all 35 routes at 320, 375, 768, and 1024. |

## 17. Images

Every content image in the static pass had alt and width/height. Lazy images below the fold use `loading="lazy"`. Home and case heroes that are the LCP image stay `loading="eager"` and `fetchpriority="high"`. The final audit, after an instant scroll (the first audit script used smooth scrolling and falsely reported pending images), found no pending and no broken images.

PNG originals and their WebP copies:

| File | PNG | Same-size WebP | Card WebP |
| --- | ---: | ---: | ---: |
| rock-1.png | 1,807 KB | 196 KB | 160 KB (480px) |
| rock-2.png | 934 KB | 102 KB | — |
| rock-3.png | 947 KB | 110 KB | — |
| meda-1.png | 849 KB | 97 KB | 72 KB (480px) |
| meda-2.png | 675 KB | 69 KB | — |
| meda-3-wardrobe.png | 491 KB | 75 KB | — |

Website JPG card copies: scaleup 34 KB, gain 47 KB, gowabi 33 KB, daniela 71 KB, each 800px wide. The JPG originals are still the hero `img src`.

Team portraits and the office visual were already WebP and were not re-encoded.

## 18. Performance

Method, environment, and the before/after tables are in `PERFORMANCE_AUDIT.md`. Short version, median of 3, local preview, cache disabled:

- Desktop `/portfolio/` initial transfer 3,285 KB → 528 KB.
- Desktop Born To Rock initial 1,914 KB → 304 KB. MedaStaré initial 956 KB → 204 KB.
- Slow-mobile load: `/portfolio/` 6,606 ms → 2,494 ms; MedaStaré 5,330 ms → 3,040 ms; Born To Rock 10,213 ms → 2,370 ms.
- Slow-mobile CLS after scroll on those case pages and the home page: 0.1555–0.5354 → 0.
- Unthrottled FCP/LCP moved around under a load average of about 7–15, including on pages whose bytes did not change. Those timing deltas are not attributed to the code.
- Lighthouse, field Core Web Vitals, and INP were not measured.

## 19. Metadata, canonical, robots, sitemap

Every indexed page has a title, description, canonical, and Open Graph/Twitter tags. Titles are unique. `lang` is `en`. Canonical origin is `https://example.com` because `PUBLIC_SITE_URL` is unset. That origin was not replaced.

The 404 page is `noindex` and emits neither canonical nor `og:url`. Privacy, terms, and `/team/gallery/` stay `noindex` and out of the sitemap. Six case studies and nine team profiles are in the sitemap. No BlogPosting JSON-LD is emitted, because no Insight is public. Organization JSON-LD stays `ProfessionalService` and omits the placeholder email.

Breadcrumb JSON-LD URLs now end with `/`, matching the canonicals. `<` in JSON-LD is escaped.

## 20. Security, privacy, and dependencies

- No secrets were added. Contact text is not written to `localStorage` or logged with `console.log` (none in `src`).
- External links that open a new tab use `rel="noopener noreferrer"`.
- JSON-LD is escaped before it is placed in a script element.
- `npm audit` (read-only, no `audit fix`) on 28 Oct 2026: exit 0, 0 info / 0 low / 0 moderate / 0 high / 0 critical across 385 reported dependency entries. This is an advisory snapshot, not a penetration test.
- `public/_headers` still carries nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS, and a CSP that mentions formspree.io. Those headers apply only if the host honors the file. They were not changed, and the local preview does not prove them.

## 21. Code quality

- Zod: `import { z } from "astro/zod"` replaced `import { defineCollection, z } from "astro:content"`. Hints went from 91 to 0. Collection behavior is covered by the existing content tests plus the production build.
- `velora-website` appears in `package.json` and `package-lock.json` only, plus older step reports. It is not rendered on the site. It was not renamed, because Step 9E forbids that rename.
- Playwright `workers` is 1 so the two e2e files share one preview. `retries` stays 0.
- Stylesheet `@media` breakpoints that used `px` were converted to `rem` so they follow the browser text size the way Tailwind’s do. A unit test fails if a `px` media query returns.

## 22. Files

Modified relative to the pre-step hash of tracked-and-untracked source that existed before Step 9E:

- `src/styles/global.css` — wrapping, mobile screenshot width, `picture { display: contents }`, header/menu, timeline container query, rem breakpoints.
- `src/components/cards/ProjectCard.astro` — `<picture>` and the 24px case-study link.
- `src/components/portfolio/CaseStudy.astro` — `<picture>`, dialog image created on open.
- `src/components/layout/Header.astro` — tall-bar and scrollable menu.
- `src/components/layout/Footer.astro` — 24px legal links.
- `src/components/ui/Breadcrumbs.astro` — trailing-slash JSON-LD and 24px links.
- `src/components/team/TeamProfile.astro` — previous/next cards can wrap.
- `src/layouts/BaseLayout.astro` — `hasCanonical`, `jsonLd()`.
- `src/pages/404.astro` — `hasCanonical={false}`.
- `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/services/index.astro` — grid gaps that shrink with the viewport.
- `src/content.config.ts` — `z` imported from `astro/zod`.
- `src/utils/format.ts` — `jsonLd()`.
- `playwright.config.ts` — `workers: 1`.
- `tests/e2e/smoke.spec.ts` — existing contact and publication assertions kept; file changed as the suite grew around it.
- `public/images/.gitkeep` — hash differs from the pre-step snapshot. The file is a 1-byte placeholder and is not used by a page.

Created:

- `src/utils/images.ts`
- `scripts/make_portfolio_webp.py`, `scripts/site-audit.mjs`, `scripts/perf-audit.mjs`
- `tests/unit/site-quality.test.ts`, `tests/e2e/site-quality.spec.ts`
- Twelve WebP derivatives under `public/assets/portfolio/` (six same-size, six card)
- `docs/step-9e/` screenshots and `docs/step-9e/data/`
- `PERFORMANCE_AUDIT.md`, `FINAL_WEBSITE_QA.md`, this report

Not changed on purpose: portfolio and team copy, publication flags, `src/data/site.ts`, `astro.config.ts` site URL, `public/_headers`, `package.json` dependencies and name, `package-lock.json`, `.env`.

## 23. Final `npm test`

exit 0. 24 passed, 0 failed, 0 skipped. Duration 1,090 ms.

New tests: JSON-LD cannot contain a raw `<`; six projects and 18 screenshots, with a same-size smaller WebP for every PNG; a smaller card WebP for each project’s first screenshot; no `px` media queries in `global.css`. The previous 20 tests still pass, including portfolio, team, Insights, and inquiry.

## 24. Final `npm run check` and `npm run build`

`npm run check`: exit 0. 78 files. 0 errors, 0 warnings, 0 hints.

`npm run build`: exit 0. 35 pages built in 8.25 s. Sitemap `<loc>` count 31. `dist` HTML count 35.

## 25. Final `npm run test:e2e`

exit 0. 16 passed, 0 failed, 0 retries, 0 flakes recorded. Duration 1.9 min. Chrome channel, one worker, `reuseExistingServer` off in CI and on locally.

The eight new tests cover sitemap metadata and internal links, robots and sitemap membership, 404 noindex without a canonical, reflow from 320 to 1440 and at 200% text, a 32px browser font at desktop width, reserved image space and WebP, the mobile menu at 200% on a short screen, and the skip link. The eight existing smoke tests passed in the same run, including copy-only contact, the six case studies, the nine profiles, the gallery exclusion, and unpublished Insights.

## 26. Screenshots

All under `docs/step-9e/`. These are captures of the final preview, not mockups.

| File | Page | Viewport |
| --- | --- | --- |
| `home-320.png`, `home-375.png`, `home-768.png`, `home-1024.png`, `home-1440.png` | `/` | named width, default text |
| `about-1024-200.png` | `/about/` | 1024, 200% text |
| `portfolio-375.png` | `/portfolio/` | 375 |
| `born-to-rock-375.png` | Born To Rock | 375 |
| `case-375-200.png` | case study | 375, 200% text |
| `medastare-1440.png` | MedaStaré | 1440 |
| `service-320-200.png` | a service page | 320, 200% text |
| `services-steps-320.png` | services | 320 |
| `process-timeline-320-200.png` | `/process/` | 320, 200% text |
| `team-profile-320-200.png` | a profile | 320, 200% text |
| `team-carlo-card-375.png` | team card | 375 |
| `team-carlo-profile-375.png`, `team-carlo-profile-1440.png` | Carlo Garcia | 375 and 1440 |
| `contact-320-200-after.png` | `/contact/` | 320, 200% text |
| `contact-1024-browser-font-32px.png` | `/contact/` | 1024, 32px default font |
| `menu-320x568-200-scrolled.png` | home, menu open | 320×568, 200% text |

Raw JSON: `docs/step-9e/data/perf-before.json`, `perf-after.json`, `perf-contact-recheck.json`, `site-audit-before.json`, `site-audit-final.json`.

## 27. Owner blockers

These were not acted on.

1. Domain and canonical host. `PUBLIC_SITE_URL` is unset, so every canonical, `og:url`, sitemap URL, and `robots.txt` sitemap entry uses `https://example.com`.
2. Business email and contact delivery. The form copies a draft. It does not send mail.
3. Insights. Twelve drafts need editorial approval before any one can be published.
4. Legal review of Privacy and Terms. Wording was not rewritten.
5. Hosting. Cache headers, compression, HTTP version, and real-user LCP/CLS/INP are unknown until a host is chosen. `public/_headers` is only effective where the host reads it.
6. Optional social links and any other company facts that are still placeholders in `src/data/site.ts`.
7. Screen-reader confirmation and a Lighthouse or field-data run against the real domain.

## 28. Acceptance checklist

| Criterion | Status |
| --- | --- |
| Cross-site audit with recorded before and after | Done |
| Feasible confirmed defects fixed | Done |
| Fresh unit, check, build, and e2e results | Done, all exit 0 |
| Unresolved P0 | None found |
| Unresolved P1 | None left open |
| Six case studies, nine profiles, twelve unpublished Insights, copy-only contact | Preserved |
| Sitemap and robots still hide gallery, drafts, and sample studies | Preserved |
| Canonical host still `https://example.com` | Preserved |
| Deploy, domain, email, endpoint, publication, Step 10 | Not done |

**Locally quality-audited. Not publicly launch-ready.**

Please upload `STEP_9E_REPORT.md`, `FINAL_WEBSITE_QA.md`, and `PERFORMANCE_AUDIT.md` for review.
