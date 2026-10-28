# Final website QA — Step 9E

Local production build (`npm run build`, preview on `http://127.0.0.1:4321`). Chrome via Playwright. This is a local technical check. It is not a public launch sign-off.

**Launch conclusion:** the built site is locally quality-audited. It is not publicly launch-ready until the owner sets a real domain, a real contact channel, Insights approvals, and a legal review, then deploys. None of that was done in this step.

Legend: **Pass** = checked and already fine. **Fixed** = a defect was found and the final check passed. **Deferred** = left for the owner. **Not tested** = not exercised. **Fail** = still broken. No row below is Fail.

## Commands

| Check | Result |
| --- | --- |
| `npm test` | Pass. 24/24, exit 0. |
| `npm run check` | Pass. 0 errors, 0 warnings, 0 hints, exit 0. |
| `npm run build` | Pass. 35 HTML pages, 31 sitemap URLs, exit 0. |
| `npm run test:e2e` | Pass. 16/16, 0 retries, exit 0. |
| `npm audit` (no fix) | Pass. 0 known vulnerabilities on 28 Oct 2026. |
| Lighthouse, field CWV, INP, screen reader | Not tested. |

## Route and device matrix

Automated pass: all 35 built routes at 320, 375, 768, 1024, and 1440 CSS pixels, plus 200% root text at 320, 375, 768, and 1024, plus a 32px browser font at 1024 and 1440. 385 checks, 0 overflows, 0 clipped headings, 0 broken images, 0 console errors. Evidence: `docs/step-9e/data/site-audit-final.json`.

| Route | 320 | 375 | 768 | 1024 | 1440 | 200% text | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Fixed | Fixed | Pass | Fixed | Pass | Fixed | 200% overflow came from long words and a 12-column gap. Card images now reserve height. |
| `/about/` | Fixed | Fixed | Fixed | Fixed | Pass | Fixed | The 1024px / 200% overflow was the work-photo column gap. Screenshot `about-1024-200.png`. |
| `/process/` | Fixed | Pass | Pass | Pass | Pass | Fixed | Timeline number moves above the card when the column is under 14rem. Screenshot `process-timeline-320-200.png`. |
| `/services/` | Fixed | Pass | Pass | Fixed | Pass | Fixed | Same 12-column gap. Screenshot `services-steps-320.png`. |
| Eight service pages | Fixed | Fixed | Pass | Pass | Pass | Fixed | All eight were in the 35-route audit. One detail captured at 320 / 200% (`service-320-200.png`). Prefill behavior covered by e2e for web development. |
| `/portfolio/` | Pass | Pass | Pass | Pass | Pass | Pass | Order unchanged. Initial transfer 3,285 KB → 528 KB on desktop. Screenshot `portfolio-375.png`. |
| Six case studies | Fixed | Fixed | Pass | Pass | Pass | Fixed | Mobile art no longer collapses before load. Screenshots: `born-to-rock-375.png`, `case-375-200.png`, `medastare-1440.png`. |
| `/team/` | Pass | Pass | Pass | Pass | Pass | Pass | Nine names and portraits unchanged. Carlo card: `team-carlo-card-375.png`. |
| Nine profiles | Fixed | Fixed | Pass | Pass | Pass | Fixed | Previous/next row wrapped instead of overflowing. Screenshots: `team-profile-320-200.png`, Carlo at 375 and 1440. |
| `/team/gallery/` | Pass | Pass | Pass | Pass | Pass | Pass | `noindex`, absent from sitemap. |
| `/insights/` | Fixed | Fixed | Pass | Pass | Pass | Fixed | Empty state. Draft titles are not in `dist`. Draft URLs 404. |
| `/contact/` | Pass | Pass | Fixed | Pass | Pass | Pass | Copy-only. Heading can still break inside a word at 320 / 200%; the page does not scroll sideways. Screenshots `contact-320-200-after.png`, `contact-1024-browser-font-32px.png`. |
| `/privacy/`, `/terms/` | Pass | Pass | Pass | Pass | Pass | Pass | Legal substance Deferred (counsel). |
| `/404` | Pass | Pass | Pass | Pass | Pass | Pass | `noindex`, no canonical. |

## Behavior

| Area | Result | Evidence |
| --- | --- | --- |
| Six public case studies, sample studies absent | Pass | Unit test and e2e. Manifest hashes still match. |
| Nine named profiles, distinct Adrian and Matheus portraits | Pass | Unit test and e2e. |
| Twelve Insights unpublished | Pass | E2e 404s and a `dist` leak search. |
| Contact copies a draft and does not send | Pass | E2e expects “Inquiry copied. No message has been sent.” Clipboard failure does not show that string. |
| Mobile menu, Escape, focus return, short screen at 200% | Fixed | E2e plus `menu-320x568-200-scrolled.png`. |
| Skip link hidden until focus | Pass | E2e. |
| Internal links on sitemap pages | Pass | E2e crawl. |
| External project and App Store URLs | Not tested | Left as supplied. Not fetched. |
| Screen reader | Not tested | Keyboard and DOM checks only. |
| Real mailbox, domain, DNS, hosting headers | Deferred | Out of scope. `public/_headers` was not changed. |

## What changed the quality bar

- WebP copies for the six PNGs and card-size copies for the six featured shots, with the original file kept as the `img` source.
- Reserved width on mobile screenshot frames.
- Text wrapping, a few shrinking grid gaps, a scrollable mobile menu, and 24px targets on breadcrumb, footer legal, and “View Case Study” links.
- 404 without a canonical; breadcrumb JSON-LD aligned with canonical trailing slashes; JSON-LD `<` escaped.
- Zod hints cleared by importing `z` from `astro/zod` (91 hints → 0).

## Owner actions before a public launch

1. Set `PUBLIC_SITE_URL` to the real origin and rebuild. Today every canonical and sitemap URL is `https://example.com`.
2. Choose a business email and a delivery endpoint. Until then the form only copies text.
3. Approve any Insights article individually. All twelve stay drafts.
4. Have counsel review Privacy and Terms.
5. Deploy, then measure Lighthouse and field Core Web Vitals on the real host. Local lab numbers are in `PERFORMANCE_AUDIT.md`.
