# Step 4 Report — Service Pages

Date: 27 October 2026

The eight existing service routes now have full startup-focused pages, and `/services` is a directory instead of a repeated stack of the same block. Slugs were not renamed. Team pages, About, the homepage introduction, contact delivery, portfolio flags, and deployment settings were left in place.

## A. Overview of changes

Service content lives in `src/data/services.ts`. One detail template, `ServiceDetail.astro`, renders every service. Each page has its own copy, FAQ, related links, and a code-drawn diagram. The old marketing photograph is no longer used on service pages.

Public names now match the confirmed specialties: Web Development, Mobile Apps, AI Solutions, SaaS Development, Backend & APIs, Cloud & DevOps, UI/UX Design, and QA & Testing.

## B. Services overview

`/services` now has:

1. Hero — “Our expertise” and “Software Development for Ambitious Startups.”
2. Directory — eight cards with an icon, name, introduction, three capabilities, and a link to the detail page.
3. Startup needs — seven situations, each linking to the relevant services, without client stories.
4. How the services fit — design, client, backend, cloud delivery, and QA as one product path.
5. Process preview — the six stages from `src/data/process.ts`, linked to `/process`.
6. Closing call to action — “Let's Talk About Your Product.” and “Discuss Your Project” to `/contact`.

## C. Individual service pages

Every detail page includes a hero, what we build, challenges, technical approach, capabilities, scope-dependent deliverables, a technology note, five FAQs, related services, and a service-specific contact button.

| Route | Visible title | Status |
| --- | --- | --- |
| `/services` | Software Development for Ambitious Startups. | Complete |
| `/services/web-application-development` | Web Development | Complete |
| `/services/mobile-app-development` | Mobile Apps | Complete |
| `/services/ai-intelligent-automation` | AI Solutions | Complete |
| `/services/saas-platform-development` | SaaS Development | Complete |
| `/services/backend-api-engineering` | Backend & APIs | Complete |
| `/services/cloud-devops` | Cloud & DevOps | Complete |
| `/services/ui-ux-product-design` | UI/UX Design | Complete |
| `/services/qa-software-testing` | QA & Testing | Complete |

Page-specific limits that were written into the copy:

- Web development is described as application software, not a landing page.
- Mobile does not claim any store release.
- AI does not promise autonomy or invent accuracy numbers. Cost and privacy are named as constraints.
- SaaS tenancy and billing are described as architecture options, not an existing platform.
- Cloud & DevOps does not offer 24/7 support or an uptime guarantee.
- QA states that a test pass is not zero defects.
- UI/UX does not claim a formal accessibility certificate.

## D. Technical visuals

`ServiceVisual.astro` draws a labeled SVG for each service:

- Web: browser UI, application API, database.
- Mobile: iOS and Android clients, shared behavior, API.
- AI: request, retrieval, model, human review, product record.
- SaaS: users, access, application, billing, tenant data.
- Backend: client, API route, domain service, data store, background job.
- Cloud: commit, CI, deploy, environment, logs.
- UI/UX: research, journeys, wireframes, interface, handoff.
- QA: scope, functional checks, automation, defect report, release note.

Captions say these are conceptual. `public/assets/services/marketing-analytics.webp` remains on disk and is no longer referenced by a service page. No stock photos were added.

## E. Files created or modified

Created:

- `src/components/sections/ServiceDetail.astro`
- `STEP_4_REPORT.md`

Modified:

- `src/data/services.ts`
- `src/pages/services/index.astro`
- `src/pages/services/[slug].astro`
- `src/components/visuals/ServiceVisual.astro`
- `src/components/cards/ServiceCard.astro`
- `src/styles/global.css`

Removed:

- `src/components/sections/ServiceBlock.astro` — it rendered the old short layout and the marketing photo.

## F. Links and interactions tested

In Chrome, against the production preview:

- All nine service routes returned 200.
- Each detail page had one diagram, five FAQs, a “Discuss …” link to `/contact`, and at least two related service links.
- The first FAQ on Web Development opened from the keyboard-capable summary and showed its answer. FAQs are `details` elements, so they work without JavaScript.
- With JavaScript disabled, the Backend & APIs heading stayed at opacity 1 and the FAQs were in the page.
- The services index heading, directory, and contact button were present.
- No service page referenced `marketing-analytics`.

## G. Responsive design

The same nine routes were checked at 375px, 768px, and 1440px. Horizontal overflow was 0 on each. Images that did load decoded. Diagrams reflow with the column: beside the hero from 1024px up, and below the introduction on smaller screens. Homepage service cards still link through the shared card component; their layout was not rebuilt.

## H. Tests executed and results

| Command | Result |
| --- | --- |
| `npm test` | 5 passed, 0 failed |
| `npm run check` | 0 errors, 0 warnings, 31 existing `zod` deprecation hints |
| `npm run build` | Completed, 29 pages. Re-run after the diagram routing fix, also 29 pages. |
| `npm run test:e2e` | 6 passed, 0 failed, on the final build |

## I. Information still requiring approval

Unchanged from `COMPANY_INFO_REQUIRED.md`, and relevant here:

- Which tools in `src/data/technologies.ts` the team actually uses. Pages label that list as a working catalog, not certifications or partnerships.
- Real client work, prices, and timelines. None were added.
- Legal name, domain, email, and live form delivery.

## J. Unresolved defects

No broken service route, overflow, or missing section remained in the checks above.

The marketing analytics file is still in `public/assets/services/` so it can be deleted later if nothing else should keep it. It is unused by the service templates. The npm package name is still `velora-website` and is not shown on the site.
