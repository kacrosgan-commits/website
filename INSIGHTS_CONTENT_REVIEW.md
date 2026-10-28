# Insights content review

This file is the owner’s queue. Editorial readiness is not publication approval. Every article below is private. Nothing in this file grants permission to publish.

## How an article becomes public later

Approval is a decision on one file at a time. There is no switch that publishes the set.

For a single article the owner has actually approved, set all of these in that file’s frontmatter:

- `publicationApproved: true`
- `status: published`
- `draft: false`
- `demonstration: false`
- `publishedAt:` the date of that approval

Leave `publishedAt` unset until then. `pubDate` is only the day the draft was written. The public site ignores it.

A post is public only when `publicationApproved` is true, `status` is `published`, and it is not a draft, demonstration, or sample. The Insights index, the homepage strip, related notes, navigation, and the sitemap all use that rule. An unapproved URL is not generated.

## What the owner is being asked to decide

For each article: is the explanation accurate, is the service link fair, and should this draft be published at all? No article names a Vortex Digital employee as its author. The byline is the organization. No article claims a personal credit on a portfolio project.

External employer details, client metrics, and staff authorship were not added because they were not supplied.

## Queue

Publication is blocked for every row. “Ready for review” means the draft is written for an owner to read. It does not mean it is approved.

| Title | Slug | Area | Status | Public | Approval evidence | Editorial | Blocked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Planning an MVP for a Startup | `planning-an-mvp-for-a-startup` | SaaS Development | review | no | none | ready for review | yes |
| Choosing Between Native and Cross-Platform Apps | `native-vs-cross-platform-apps` | Mobile Apps | review | no | none | ready for review | yes |
| What Startups Should Know About AI Integration | `what-startups-should-know-about-ai-integration` | AI Solutions | review | no | none | ready for review | yes |
| Building Maintainable SaaS Applications | `building-maintainable-saas-applications` | SaaS Development | review | no | none | ready for review | yes |
| Architecture for an Early-Stage SaaS Product | `choosing-architecture-for-a-saas-product` | SaaS Development | review | no | none | ready for review | yes |
| Building Scalable Web Applications | `building-scalable-web-applications` | Web Development | review | no | none | ready for review | yes |
| A Lean Release Setup for a Startup | `deploying-applications-with-confidence` | Cloud & DevOps | review | no | none | ready for review | yes |
| How to Plan a Custom Software Project | `how-to-plan-a-custom-software-project` | SaaS Development | review | no | none | ready for review | yes |
| Improving Mobile Application Performance | `improving-mobile-application-performance` | Mobile Apps | review | no | none | ready for review | yes |
| Integrating AI Into Existing Applications | `integrating-ai-into-existing-applications` | AI Solutions | review | no | none | ready for review | yes |
| API Habits for a Small Product Team | `api-habits-for-a-small-product-team` | Backend & APIs | review | no | none | ready for review | yes |
| UX and QA Checks Before a Product Launch | `ux-and-qa-before-a-product-launch` | UI/UX Design, also QA | review | no | none | ready for review | yes |

Paths are `src/content/blog/<slug>.md`.

## Notes by article

**Planning an MVP for a Startup.** Kept the existing argument: one decision, the current workaround, a boring first architecture, and a definition of done. Added a checklist and a link to `/services/saas-platform-development`. About 700 words. Confirm the owner wants this published as company guidance.

**Choosing Between Native and Cross-Platform Apps.** Kept the existing tradeoffs. Added a decision table and a link to `/services/mobile-app-development`. The table is a planning aid, not a benchmark. About 815 words.

**What Startups Should Know About AI Integration.** Kept the existing privacy, review, and retrieval guidance. Added a table distinguishing a rule, a draft, retrieval, and an agent. Link to `/services/ai-intelligent-automation`. No model prices or accuracy rates. About 820 words.

**Building Maintainable SaaS Applications.** Kept the tenant, release, and support guidance. Added a short pre-customer checklist and a link to `/services/saas-platform-development`. About 675 words.

**Architecture for an Early-Stage SaaS Product.** Replaced a short demonstration stub. Covers tenant boundary, a single application, the records to store, API shape, two environments, and what to postpone. Link to `/services/saas-platform-development`. Labeled as a planning example, not a client build. About 1,050 words. Confirm it does not overlap the maintainable-SaaS draft more than the owner wants.

**Building Scalable Web Applications.** Replaced a short demonstration stub. “Scalable” is defined as changeable and measurable, not as a traffic claim. Link to `/services/web-application-development`. About 900 words.

**A Lean Release Setup for a Startup.** Replaced a short demonstration stub. The old title promised “confidence”; the new title does not. Covers a pipeline, two environments, backups, alerts, and cost visibility. Link to `/services/cloud-devops`. No claim that a backup has been restored for this company. About 935 words.

**How to Plan a Custom Software Project.** Replaced a short demonstration stub that repeated the MVP draft. This one is the written brief: task, constraints, current system, acceptance, and risks. Link to `/process`. It does not state a budget or a success rate. About 890 words. `featured` was true on the stub and is now false.

**Improving Mobile Application Performance.** Replaced a short demonstration stub. Tells the reader to time one task and not to publish a lab score. Link to `/services/mobile-app-development`. About 910 words.

**Integrating AI Into Existing Applications.** Replaced a short demonstration stub. Distinct from the other AI draft: where the call sits, permissions, timeouts, and the existing save button. Link to `/services/ai-intelligent-automation`. The ticketing sketch is labeled as an example, not a project. About 1,030 words.

**API Habits for a Small Product Team.** New draft. Auth, validation, idempotency, errors, limits, and logs. Includes one example JSON error body. Link to `/services/backend-api-engineering`. About 1,080 words.

**UX and QA Checks Before a Product Launch.** New draft. A few observed sessions, accessibility barriers on the shipped path, risk-based tests, and a release checklist. The card category is UI/UX Design. The body also links to `/services/qa-software-testing`. It does not claim WCAG conformance or a certified test program. About 1,030 words.

## Rights and attribution

No employee asked to be named as an author. Do not add a personal byline unless that person agrees in writing.

No third-party logo, screenshot, or client quote was added. The old decorative SVGs previously tied to three article ids (`article-marketing-strategy.svg`, `article-seo.svg`, `article-paid-ads.svg`) are not used on the cards. They were not illustrations of these articles.

Internal links point only at existing service, process, portfolio, and contact routes. Articles do not link to each other, so approving one cannot expose another.

## Suggested reading order

1. Architecture for an Early-Stage SaaS Product, and Building Maintainable SaaS Applications, to confirm they stay distinct.
2. The two AI drafts, for the same reason.
3. How to Plan a Custom Software Project, next to Planning an MVP for a Startup.
4. API Habits, the release setup, and the UX/QA checklist, because they are new.
5. The mobile choice and mobile performance drafts.

After that, approve or hold each file on its own.
