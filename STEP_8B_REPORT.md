# Step 8B report

MedaStaré is the second published portfolio case study. The public portfolio is now ScaleUp Systems and MedaStaré. Born To Rock, Gain Energy / Upstrima, GoWabi, and Daniela Diamonds stay unpublished, as do the sample studies.

## 1. MedaStaré project overview

Public URL: `/portfolio/medastare`

Document title: MedaStaré Mobile App | Vortex Digital

Visible heading: MedaStaré — AI Fashion & Lifestyle Mobile App

Subtitle: Mobile application development with Next.js, Ionic, and Capacitor.

Category: Mobile Application / AI Fashion

Live listing: `https://apps.apple.com/us/app/medastar%C3%A9/id6813994639` (HTTP 200)

The page has one `h1`. It describes MedaStaré as an AI-powered fashion and lifestyle application, then separates what the public product offers from what Vortex Digital has confirmed building. There is no results section.

Canonical URL uses the existing site setting. With no `PUBLIC_SITE_URL`, that is `https://example.com/portfolio/medastare/`. The built page has no `noindex`.

## 2. Confirmed agency contribution

The owner confirmed the complete mobile application engagement, including mobile UI/UX implementation. The page states that as the engagement, and names only the confirmed technology work underneath it.

Published contribution fields:

- Role: Complete mobile application development, including mobile UI/UX implementation
- Dates: August 2026 – Present
- Modules: mobile UI/UX implementation; Next.js web application or WebView experience; Ionic and Capacitor iOS application implementation
- Technologies: Next.js, Ionic, and Capacitor
- Permission: public showcase and the three App Store promotional screenshots are authorized
- `contributionVerified: true`
- `publicationApproved: true`
- `featured: true`
- `homeRank: 2`

`integrationsDeveloped` and `qaContribution` are empty and are omitted from the published contribution list. The schema has no separate `hostingProvider`, `backendStack`, or `appPerformanceResults` fields. Those unknowns stay in the technology note and in `PORTFOLIO_CONTENT_REQUIRED.md`. `metrics` is empty, so no outcomes block is rendered.

The page does not claim that Vortex Digital individually built MedAI, Closeté, FashionStaré, StarDay, MedArena, a Firebase backend, Stripe Connect, a recommendation engine, or the App Store release. Those product names appear only as documented product capabilities.

## 3. Technology stack

Confirmed roles:

- Next.js: web application or WebView experience
- Ionic and Capacitor: iOS application framework and wrapper

The page says the connection between those layers was not specified, and it does not claim that Next.js server rendering ran on the device. No Swift, Flutter, React Native, Firebase, Node.js, Python, or named AI provider is listed as Vortex Digital work.

## 4. Exact publication changes

| Project | publicationApproved | featured | homeRank |
| --- | --- | --- | --- |
| ScaleUp Systems | true | true | 1 |
| MedaStaré | true | true | 2 |
| Born To Rock | false | false | 4 |
| Gain Energy / Upstrima | false | false | 3 |
| GoWabi | false | false | 5 |
| Daniela Diamonds | false | false | 6 |

Sample case studies remain `sample: true` and unpublished. A project is public only when it is not a sample and `publicationApproved` is true. That rule was not loosened.

ScaleUp Systems keeps its case-study wording, “Product challenge” heading, and “Have a Similar Product in Mind?” call to action. Its card now uses the shorter line “Marketing website development using Next.js and React.”

## 5. Screenshot verification

The existing files were not regenerated or edited:

- `/assets/portfolio/medastare/meda-1.png` — MedArena fashion challenge experience. Decoded 600×1299.
- `/assets/portfolio/medastare/meda-2.png` — StarDay creator content feed. Decoded 600×1299.
- `/assets/portfolio/medastare/meda-3-wardrobe.png` — Closeté digital wardrobe. Decoded 432×936.

Alt text identifies each file as an App Store promotional screenshot, not a capture from an installed app. The gallery note says the same. Displayed frames stay portrait (about 2.17:1). At 1440px each gallery image rendered at 320×693. At 375px the frames were 320px wide and about 690px tall. They were not cropped into landscape cards.

Chrome opened the first image in the dialog, closed it with Escape, and returned focus to that enlarge control. The Close button does the same.

## 6. Files created or modified

- `src/content/case-studies/medastare.md` — published case study
- `src/content/case-studies/scaleup-systems.md` — card summary only
- `src/content.config.ts` — optional card summary and per-page section headings
- `src/components/portfolio/CaseStudy.astro` — subtitle, custom call to action, and heading fields
- `src/components/cards/ProjectCard.astro` — card summary when one is set
- `src/pages/index.astro` — two-column featured grid when exactly two projects are featured
- `src/pages/portfolio/index.astro` — filters hidden unless more than two projects are visible; two-up grid at wide widths
- `src/styles/global.css` — two-column portfolio grid when a pair is published
- `tests/unit/portfolio.test.ts` — MedaStaré is an approved exception
- `tests/e2e/smoke.spec.ts` — public set is ScaleUp Systems and MedaStaré
- `PORTFOLIO_CONTENT_REQUIRED.md` — confirmed MedaStaré facts removed from the open list
- `STEP_8B_REPORT.md`

## 7. Homepage integration

`/` uses the existing “Approved client work.” section. It shows two cards, in this order:

1. ScaleUp Systems — Marketing website development using Next.js and React.
2. MedaStaré — Mobile application development with Next.js, Ionic, and Capacitor.

Each card uses that project’s first approved screenshot and links to its case study. The other four projects are absent.

## 8. Portfolio overview

`/portfolio` shows the same two cards and no empty placeholders. Category filters are hidden because two projects do not need them. At 1280px and above the pair stays in two columns. The MedaStaré card keeps the portrait frame; the ScaleUp card keeps the landscape frame. Card text starts at the same point in each column.

## 9. Navigation and related-project tests

- MedaStaré links to ScaleUp Systems under Related projects, and nowhere else.
- ScaleUp Systems links to MedaStaré under Related projects.
- The MedaStaré call to action is “Have a Mobile App Idea?” with “Discuss Your Project” pointing at `/contact`.
- `/contact` still shows the unconfigured form and the “Open in email” button. It does not claim delivery.
- Production HTTP: `/`, `/portfolio`, `/portfolio/medastare`, `/portfolio/scaleup-systems`, and `/contact` return 200.
- Production HTTP 404: `/portfolio/born-to-rock`, `/portfolio/gain-energy-upstrima`, `/portfolio/gowabi`, `/portfolio/daniela-diamonds`, `/portfolio/sample-brand-platform`.
- `dist/sitemap-0.xml` includes `portfolio/medastare/` and `portfolio/scaleup-systems/` and does not include the four unpublished slugs or `sample-brand-platform`.

## 10. Responsive design results

Chrome measured `documentElement.scrollWidth` against `clientWidth` on the production preview. No horizontal overflow:

| Page | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| `/` | clear | clear | clear | clear |
| `/portfolio` | clear | clear | clear | clear |
| `/portfolio/medastare` | clear | clear | clear | clear |
| `/portfolio/scaleup-systems` | clear | clear | clear | clear |
| `/contact` | clear | clear | clear | clear |

Primary navigation, the portrait gallery, technology notes, the related card, and the contact form were all readable at those widths.

## 11. Automated test results

- `npm test`: 10 passed
- `npm run check`: 0 errors, 0 warnings, 84 hints (existing `z` deprecation)
- `npm run build`: 31 pages. The added page is `/portfolio/medastare`.
- `npm run test:e2e`: 7 passed

The first end-to-end run failed because the related-project assertion matched both the image link and the title link. The assertion now uses the title link. The rerun passed, and the run after the final rebuild also passed: 7 passed.

## 12. Remaining unverified technical details

Still unknown, and not claimed as individual Vortex Digital modules:

- MedAI, Closeté, FashionStaré, StarDay, and MedArena as separately verified builds
- Backend language, database, and hosting
- Next.js deployment configuration and the exact link between Next.js and the iOS wrapper
- Additional UI libraries
- Specific AI APIs, models, and authentication providers
- Subscription and creator-payout implementation
- Testing and App Store release work
- Results such as downloads, revenue, retention, or rankings

`PORTFOLIO_CONTENT_REQUIRED.md` still lists the open items for Born To Rock, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, and the unpublished ScaleUp Systems product work.

## 13. Unresolved issues

- A real canonical domain is still unset, so the canonical URL remains `https://example.com` until `PUBLIC_SITE_URL` is changed.
- Contact delivery is still unconfigured. The case-study button reaches that honest form.
- The four other products stay unpublished until their own contribution and image rights are confirmed.
