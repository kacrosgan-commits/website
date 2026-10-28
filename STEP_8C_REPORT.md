# Step 8C report

Gain Energy / Upstrima is the third published portfolio case study. The public set is ScaleUp Systems, MedaStaré, and Gain Energy / Upstrima. Born To Rock, GoWabi, Daniela Diamonds, and the sample studies stay unpublished.

## 1. Final public case-study content

Public URL: `/portfolio/gain-energy-upstrima`

Document title: Gain Energy Website | Vortex Digital

Visible heading: Gain Energy / Upstrima — Website for an AI-Powered Energy Platform

Card title: Gain Energy / Upstrima

Subtitle: Marketing website development for an AI-powered oil and gas engineering platform.

Category: Web Development / Energy Technology

The page has one `h1`. It explains that Gain Energy presents Upstrima, an AI platform for oil and gas engineering, and that this case study is about the public marketing website. The website-purpose section describes what visitors can see. It does not invent a client brief. There is no results section.

Meta description: Explore Vortex Digital's Gain Energy / Upstrima marketing website development using Next.js and React, showcasing the AI platform's features and use cases.

Canonical URL uses the existing site setting. With no `PUBLIC_SITE_URL`, that is `https://example.com/portfolio/gain-energy-upstrima/`. The built page has no `noindex`.

The live button reads “Visit Live Website” and points to `https://www.gain.energy/`, which returned HTTP 200. ScaleUp Systems and MedaStaré still use “View live product”.

The closing call to action is “Building a Website for Your SaaS Product?” with “Discuss Your Project” linking to `/contact`.

## 2. Verified development contribution

- Role: Public marketing website development; additional SaaS application participation
- Dates: March 2025 – Present
- Modules: public marketing website interface; product and feature presentation sections; industry use-case sections
- Technologies: Next.js and React, for the public marketing website
- Permission: agency owner approved the public showcase and all three existing website screenshots
- `contributionVerified: true`
- `publicationApproved: true`
- `featured: true`
- `homeRank: 3`

The overview states that Vortex Digital developed the public website, including the interface and the sections that introduce the platform, its features, and its use cases.

`integrationsDeveloped` and `qaContribution` are empty and are omitted. `metrics` is empty, so no outcomes block is rendered.

## 3. Marketing website technology stack

Next.js and React, scoped to the public marketing website.

The page says those two tools are not a confirmed stack for the SaaS application work. Python, FastAPI, PostgreSQL, Redis, LangChain, OpenAI, AWS, Azure, Tailwind, and TypeScript are not listed as Vortex Digital work on this engagement.

## 4. Treatment of unverified SaaS involvement

The page says the agency also participated in the wider SaaS application engagement, and that specific SaaS modules are not detailed.

It does not name AI agents, workflow engines, data connections, backend APIs, databases, authentication, dashboards, model orchestration, marketplace architecture, payments, or cloud deployment as Vortex Digital modules.

Product features on the site — engineering agents, operational use cases, engineering insights, and oil and gas workflows — are labeled as information the website presents.

## 5. Screenshot file paths and verification

Existing files, unchanged:

- `/assets/portfolio/gain-energy-upstrima/gain-01-home.jpg` — public homepage introducing Upstrima. JPEG, 1348×926.
- `/assets/portfolio/gain-energy-upstrima/gain-02-features.jpg` — features section. The marketplace graphic is labeled a public marketing presentation, not an authenticated product. JPEG, 1348×926.
- `/assets/portfolio/gain-energy-upstrima/gain-03-cases.jpg` — public industry use cases, not the private workspace. JPEG, 1348×926.

All three files decode as JPEG. The first rendered in Chrome at its native 1348×926. Gallery frames used the landscape ratio 1.456, matching 1348/926. They are not shown in the MedaStaré phone frame.

Chrome opened the features image, showed its caption, closed the dialog with Escape, and returned focus to that control.

## 6. Exact publication flag changes

| Project | publicationApproved | featured | homeRank |
| --- | --- | --- | --- |
| ScaleUp Systems | true | true | 1 |
| MedaStaré | true | true | 2 |
| Gain Energy / Upstrima | true | true | 3 |
| Born To Rock | false | false | 4 |
| GoWabi | false | false | 5 |
| Daniela Diamonds | false | false | 6 |

Sample studies remain `sample: true`. A project is public only when it is not a sample and `publicationApproved` is true.

## 7. Homepage featured-card changes

The existing “Approved client work.” section now shows three cards, in order:

1. ScaleUp Systems — Marketing website development using Next.js and React. Tags: Next.js, React.
2. MedaStaré — Mobile application development with Next.js, Ionic, and Capacitor. Tags: Next.js, Ionic, Capacitor.
3. Gain Energy / Upstrima — Marketing website development using Next.js and React. Tags: Next.js, React.

Each card uses that project’s first approved screenshot and links to its case study. Wide screens use three columns. Narrower screens use the existing two-column reflow, then a single column.

## 8. Portfolio overview changes

`/portfolio` shows the same three cards and no empty placeholders. Category filters stay hidden. ScaleUp Systems has no filter tag, so a Mobile or AI & SaaS filter would hide it. Filters return when more than three projects are visible, which still happens in development review.

## 9. Related-project behavior

Gain Energy links to ScaleUp Systems and MedaStaré. ScaleUp Systems and MedaStaré now also link to Gain Energy, because related projects are the other approved public studies. No related section links to Born To Rock, GoWabi, Daniela Diamonds, or a sample.

## 10. Files modified

- `src/content/case-studies/gain-energy-upstrima.md`
- `src/content.config.ts` — optional `cardTitle` and `projectUrlLabel`
- `src/components/portfolio/CaseStudy.astro` — live-link label
- `src/components/cards/ProjectCard.astro` — short card title and confirmed technology tags
- `src/pages/portfolio/index.astro` — filters hidden until more than three projects are visible
- `tests/unit/portfolio.test.ts`
- `tests/e2e/smoke.spec.ts`
- `PORTFOLIO_CONTENT_REQUIRED.md`
- `STEP_8C_REPORT.md`

ScaleUp Systems and MedaStaré case-study copy was not rewritten.

## 11. Unit tests

`npm test`: 10 passed, 0 failed.

## 12. TypeScript/Astro checks

`npm run check`: 0 errors, 0 warnings, 86 hints. The hints are the existing Zod `z` deprecation.

## 13. Production build result

`npm run build`: 32 pages. The added page is `/portfolio/gain-energy-upstrima`.

Production HTTP 200: `/portfolio/gain-energy-upstrima`, `/portfolio/scaleup-systems`, `/portfolio/medastare`.

Production HTTP 404, covered by the smoke test: `/portfolio/born-to-rock`, `/portfolio/gowabi`, `/portfolio/daniela-diamonds`, and the sample slug `sample-brand-platform`.

## 14. Browser/E2E test results

`npm run test:e2e`: 7 passed.

The portfolio test checks three cards in order, the Gain Energy heading, the live website link, Next.js and React scoped to the marketing site, three screenshot paths, related links to ScaleUp Systems and MedaStaré, the absence of FastAPI, WITSML, and LangChain, 404s for the three unpublished projects, and the sitemap.

## 15. Responsive layout results

Chrome compared `scrollWidth` with `clientWidth` on the production preview. No horizontal overflow:

| Page | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| `/` | clear | clear | clear | clear |
| `/portfolio` | clear | clear | clear | clear |
| `/portfolio/gain-energy-upstrima` | clear | clear | clear | clear |
| `/portfolio/scaleup-systems` | clear | clear | clear | clear |
| `/portfolio/medastare` | clear | clear | clear | clear |
| `/contact` | clear | clear | clear | clear |

At 1440px the Gain Energy gallery images rendered at 1280×879, ratio 1.456.

## 16. Sitemap verification

`dist/sitemap-0.xml` includes `scaleup-systems`, `medastare`, and `gain-energy-upstrima`. It does not include `born-to-rock`, `gowabi`, `daniela-diamonds`, or `sample-brand-platform`.

## 17. Remaining content gaps

Still unknown for Gain Energy, and not claimed as individual modules:

- Exact SaaS application modules and responsibilities
- SaaS technology stack
- AI agent implementation ownership
- Backend, API, and data-integration ownership
- Deployment and infrastructure responsibilities
- QA or release work
- Performance or business metrics

`PORTFOLIO_CONTENT_REQUIRED.md` still lists the open items for Born To Rock, GoWabi, Daniela Diamonds, MedaStaré’s unverified modules, and ScaleUp Systems’ unverified product work.

## 18. Outstanding website-wide blockers

- A real canonical domain is still unset, so canonical URLs remain on `https://example.com` until `PUBLIC_SITE_URL` is changed.
- Contact delivery is still unconfigured. The case-study button reaches that form.
- Born To Rock, GoWabi, and Daniela Diamonds stay unpublished until their own contribution and image rights are confirmed.
