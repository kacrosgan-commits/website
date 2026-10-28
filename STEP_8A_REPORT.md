# Step 8A report

ScaleUp Systems is the first published portfolio case study. The page describes the public marketing website only. The other five projects stay unpublished.

## Final case-study content

Public URL: `/portfolio/scaleup-systems`

Document title: ScaleUp Systems Website | Vortex Digital

Visible heading: ScaleUp Systems — Marketing Website for an AI Sales Platform

Summary: Vortex Digital developed the public marketing website for ScaleUp Systems using Next.js and React, including the homepage, product and feature sections, analytics presentation, pricing page, FAQs, and contact sections.

The page has one `h1`, the product overview, a challenge section written as the website’s communication job rather than a client brief, six website deliverables, the confirmed stack, the three screenshots, the engagement dates inside the contribution block, and the existing contact call to action. There is no results section. There are no related projects, because no other case study is approved.

Canonical URL uses the existing site setting. With no `PUBLIC_SITE_URL`, that is `https://example.com/portfolio/scaleup-systems/`.

## Confirmed contribution

- Role: Marketing website UI implementation and development
- Dates: June 2026 – Present
- Modules: homepage, product and feature sections, analytics marketing presentation, pricing page, FAQ, contact sections
- Permission: public showcase and the three screenshots are authorized
- `contributionVerified: true`
- `publicationApproved: true`
- `featured: true`
- `homeRank: 1`

Integrations and QA stay blank. The template now publishes a case study when the confirmed role, dates, modules, technologies, and permission are present. Empty optional fields are omitted instead of being filled with guesses.

## Technologies published

Next.js and React, for the public marketing website.

No hosting provider, database, or third-party service is attributed to Vortex Digital.

## Screenshot verification

The existing files are unchanged:

- `/assets/portfolio/scaleup-systems/scaleup-01-home.jpg` — ScaleUp Systems homepage and product positioning.
- `/assets/portfolio/scaleup-systems/scaleup-02-analytics.jpg` — Public analytics feature presentation. Alt text says this is not an authenticated dashboard.
- `/assets/portfolio/scaleup-systems/scaleup-03-pricing.jpg` — Public subscription pricing page.

All three decoded at 1353 pixels wide. The gallery has three enlarge controls. Opening the first one showed the homepage image in the dialog. The live site `https://scaleupsystems.ai/` returned HTTP 200.

## Publication flag changes

| Project | publicationApproved | featured |
| --- | --- | --- |
| ScaleUp Systems | true | true |
| Born To Rock | false | false |
| MedaStaré | false | false |
| Gain Energy / Upstrima | false | false |
| GoWabi | false | false |
| Daniela Diamonds | false | false |

Sample case studies remain `sample: true` and unpublished.

## Homepage integration

The homepage featured-work section shows one card: the ScaleUp title, the marketing-website summary, the homepage screenshot, and a link to `/portfolio/scaleup-systems`. It does not describe Vortex Digital as the builder of the internal SaaS product.

`/portfolio` shows that one card, hides the empty state, and hides category filters because a single entry does not need them.

## Files modified

- `src/content/case-studies/scaleup-systems.md`
- `src/content.config.ts` — optional `seoTitle` and `seoDescription`
- `src/components/portfolio/CaseStudy.astro` — required contribution fields can publish without invented integrations or QA; confirmed technology wording on published pages
- `src/pages/portfolio/index.astro` — filters hidden when only one project is visible; development review note no longer says nothing is approved
- `src/pages/index.astro` — featured-work description no longer requires a cleared outcome
- `tests/unit/portfolio.test.ts`
- `tests/e2e/smoke.spec.ts`
- `PORTFOLIO_CONTENT_REQUIRED.md`
- `STEP_8A_REPORT.md`

## Test results

- `npm test`: 10 passed
- `npm run check`: 0 errors, 76 hints (existing `z` deprecation)
- `npm run build`: 30 pages. The new page is `/portfolio/scaleup-systems`. Born To Rock, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, and the sample studies are not generated.
- `npm run test:e2e`: 7 passed. The portfolio test follows the homepage card, checks the live link and three image files, confirms the other studies 404, and checks the sitemap.

Sitemap includes `scaleup-systems` and does not include the other five slugs or `sample-brand-platform`.

Browser, production preview, no horizontal overflow:

| Page | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| `/` | clear | clear | clear | clear |
| `/portfolio` | clear | clear | clear | clear |
| `/portfolio/scaleup-systems` | clear | clear | clear | clear |
| `/contact` | clear | clear | clear | clear |

Development still serves the five unapproved review pages. Production returns 404 for them.

## Remaining unverified SaaS involvement

Not claimed, and not published as Vortex Digital work:

- Instagram messaging automation
- AI conversation orchestration
- CRM backend
- Authenticated sales dashboard
- Lead database
- Google Calendar integration
- Subscription payment processing
- SaaS infrastructure
- Internal analytics systems

The analytics screenshot is labeled as a public marketing presentation.

## Outstanding issues

- A real canonical domain is still unset, so the canonical URL remains `https://example.com` until `PUBLIC_SITE_URL` is changed.
- Contact delivery is still unconfigured. The case-study call to action reaches the honest contact form.
- The five other products, and any ScaleUp SaaS modules, stay unpublished until their own facts are confirmed. Those remaining ScaleUp questions are in `PORTFOLIO_CONTENT_REQUIRED.md`.
