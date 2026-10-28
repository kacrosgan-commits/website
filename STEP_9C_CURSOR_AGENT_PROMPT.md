# VORTEX DIGITAL — STEP 9C CURSOR AGENT PROMPT
## Insights / Articles: Editorial Quality, Content Approval, Reader Experience, and Release Safety

**Agent mode:** Implement in the existing repository. Do not merely produce a plan. Complete code/content changes, run the available tests, inspect the built site, and write `STEP_9C_REPORT.md` in the repository root.

## 0. Mission and non-negotiable boundaries

You are working in **Vortex Digital's existing production-oriented website**, not building a new site. The established stack is **Astro 7 + TypeScript + Tailwind CSS v4**, with a premium dark/purple visual system. The audience is **startup founders, small product teams, and early-stage businesses**. Eight confirmed agency specialties are **Web Development, Mobile Apps, AI Solutions, SaaS Development, Backend & APIs, Cloud & DevOps, UI/UX Design, and QA & Testing**.

**Step 9C goal:** Make the existing **Insights / Articles** section professionally structured, technically sound, editorially useful, and ready for an owner approval workflow. Audit and improve existing draft articles; produce additional high-value drafts *only where needed* to cover important startup questions; implement real public/private publication safeguards; improve reading UX, metadata, link hygiene, and testing. **Never publish an article without explicit, existing owner approval.** Completing this step does NOT require publishing an unapproved article.

**Absolute exclusions:** Do not deploy, change DNS, choose/purchase a domain, change `PUBLIC_SITE_URL`, adjust canonical hostname configuration (`https://example.com` is a known placeholder), set up a business email, configure email delivery/Formspree/contact endpoints, add analytics or tracking, modify legal pages, or configure hosting/environment variables. Do not create fictional staff, projects, testimonials, clients, impact metrics, quotes, external links, or endorsements.

Preserve **all six approved portfolio studies**, their attribution, order, imagery, links, and publication settings: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, and Born To Rock. Preserve **all nine published named team profiles** and their approved portraits: Don Tran, Joshua Mendoza, Lin Jiayi, Pongsak Rattanakul, Dmytro Melnyk, Carlo Garcia, Matheus Pereira, Adrian Cruz, and Sofia Vasylivna Melnyk. Maintain team portrait/image identity safeguards; Adrian's Cepheid/UEGroup/SJSU experience must remain distinct from Vortex Digital work. Do not update the gallery or other site sections except narrowly necessary navigation to Insights.

## 1. Read first, inspect before editing

Read the reports and content documentation if present: `STEP_7_REPORT.md`, `STEP_8F_REPORT.md`, `STEP_9B_REPORT.md`, `PORTFOLIO_CONTENT_REQUIRED.md`, `TEAM_CONTENT_REQUIRED.md`, and relevant existing Insights notes. Treat reports as project context, then verify the current code rather than assuming file paths. Inspect `package.json`, `astro.config.*`, content collections, `src/content.config.ts` (if present), `src/content/` (including possible articles/insights/blog folders), `src/pages/`, `src/components/`, layouts, shared SEO helpers, navigation/footer, `src/data/`, `src/utils/`, styles, and current test files. Identify the **actual** Insights routes, draft flags, schemas, components, and public selectors. Do not overwrite unrelated work or create a parallel blog architecture if an existing one can be improved.

Write an initial local inventory before major edits: current Insights page and route behavior; exact content files/slug/status; whether any article has **explicit publication approval**; UI completeness; broken-link risks; missing SEO/accessibility; publication-leak risks. Keep this inventory in the final report, not as public UI.

## 2. Publication permission is a hard security/content boundary

Existing Insights drafts were deliberately unpublished after Step 9B. This is **not** permission to publish them. Treat an article as public only if its own metadata or an existing owner approval ledger **unambiguously records publication approval**. Merely having a draft file, a complete article, `featured: true`, or a past publish-date field is **not** approval. If approval is ambiguous, keep it private and list the approval needed in the final report.

Adapt the existing data model rather than unnecessarily breaking it. If safe and compatible, define explicit fields such as `publicationApproved: boolean`, `status: 'draft' | 'review' | 'published'`, `publishedAt` (optional) and `updatedAt` (optional). Only use a public predicate requiring BOTH confirmed approval and published status, with explicit rejection of samples/placeholders. If the repo has a different equivalent system, use it and document the logic. Defaults must be private. **Do not automatically set `publicationApproved: true` or `status: published` on any draft.** Don't backdate a draft's publication or treat writing completion as approval.

Use **one central public selector/predicate** everywhere: overview cards, article routes, related articles, featured links, sitemap, RSS (only if already implemented or justified), search/filter indexes, and any structured data. An unapproved article should have **no public page** (404/not generated), no public card/link, no sitemap entry and no accidental route access. Do not expose full draft text through client-side JSON or public static assets. Tests must try a known draft URL and verify exclusion. If there are zero approved articles, that is a valid result: retain or improve a professional, honest Insights empty state and do not imply articles are live.

Keep internal drafts readable/editable inside source content. If a preview feature exists, ensure it is local-only and not accidentally built into static public output; otherwise do not introduce public draft previews.

## 3. Editorial audit of ALL current drafts

For every existing draft/article, inspect and record: exact file path, slug, title, original intent, audience, service alignment, status/approval, author provenance, dates, structure, quality, word count, freshness, outgoing links, factual claims, potential company/project claims, and missing references. Keep useful content and the author's voice where possible. Correct typos, vague marketing language, repetitive headings, unsupported generalizations, weak introductions, and unhelpful filler. Avoid rewriting a good article only for stylistic novelty. Retain existing permalinks unless broken.

Apply a consistent editorial structure without forcing one rigid template on every article: audience problem -> relevant context and trade-offs -> practical steps/framework -> risks/common mistakes -> concise takeaway -> contextually useful next reading or service link. Favor specific, actionable explanations over generic AI-sounding thought leadership. Tone: approachable, technically credible, concise, professional, not exaggerated. Write for decision-makers as well as engineers; explain jargon briefly. No fake first-person project stories, fictional client anecdotes, guarantees, unverified metrics, invented quotes, or claims that Vortex Digital delivered features outside the six confirmed portfolio scopes.

For externally time-sensitive details (prices, regulations, version requirements, benchmark numbers, security guidelines), either verify with reliable primary sources and link them with meaningful context, or remove/qualify the claim. Do not fabricate a citation. Do not import large copyrighted excerpts. Prefer durable principles that do not require constant live data.

## 4. Draft content strategy and useful coverage

First identify which of the eight agency specialties existing drafts already cover well. If coverage is thin, prepare **up to six** substantial additional **unpublished** drafts (not automatically eight) to balance useful startup questions. Reuse/merge an existing overlapping draft rather than duplicate it. Prioritize these candidate angles, adapting their exact titles to avoid duplication:

- **MVP architecture:** Practical choices for an early-stage SaaS product—scope, data, API boundaries, deployment, observability, and avoiding premature complexity.
- **Web vs mobile:** How a startup chooses responsive web, cross-platform mobile, or native iOS/Android using audience, device capabilities, time, maintenance, and release trade-offs.
- **AI feature readiness:** When LLM integration, retrieval-augmented generation (RAG), or an AI agent is appropriate; evaluation, privacy, cost, and human review in a production workflow.
- **Backend and API reliability:** Authentication, validation, idempotency, error contracts, rate limits, observability, and reasonable scaling for a small product team.
- **Cloud/DevOps for a lean startup:** Delivery pipelines, environment separation, backups, monitoring, secrets, and cost visibility without needless complexity.
- **Product UX and QA before launch:** User research, accessibility, test prioritization, regression coverage, and a release checklist for web/mobile products.

You may choose fewer than six if existing quality drafts already cover these. Additional drafts should generally be **900–1,400 substantive words** when the topic warrants it; do not pad to meet a number. Add original decision tables, checklists, or examples where genuinely useful, correctly implemented in the current content format. No invented adoption statistics, revenue improvements, unnamed client quotes, or benchmark figures. Do not imply a Vortex Digital employee authored an article unless owner-approved authorship is already explicitly established. Prefer a neutral organizational byline or omit an author label if existing UI can support that accurately; do not invent named author identities.

All newly authored articles **must remain drafts awaiting owner review**, with no live URLs. Add a short owner-review abstract and a list of verification/approval needs in the nonpublic editorial tracker.

## 5. Build a real editorial approval tracker

Create or update a maintainable repo-level file named `INSIGHTS_CONTENT_REVIEW.md` (or an existing canonical equivalent). For each article, show: title, path/slug, topic/service area, current status, public eligibility, actual approval evidence, editorial readiness, important fact/link checks, requested owner decisions, and whether publication is blocked. Separate **editorial readiness** from **publication approval**—they are different. Clearly describe how an owner can approve content later, but do not grant approval yourself or add a one-click accidental mass-publication path. Note any missing author permission, ownership, logos, screenshots, or other third-party rights. Drafts stay gated unless the owner actually approves their release.

## 6. Insights overview experience

Use the existing Insights index page and existing navigation conventions. Make the public page polished and consistent with the current dark/purple visual system: typography from the repo (Space Grotesk / Inter where already configured), semantic hierarchy, tasteful gradient/accent use, readable line lengths, excellent contrast, restrained hover/focus transitions. Keep the site's premium design; no generic unbranded blog template.

If approved posts exist, show **only approved posts**, ordered deterministically (e.g., genuine publication date descending, then stable fallback). Each card should have a clear title, accurate excerpt, verified category (mapped to the eight services only as appropriate), and a real article URL; avoid dates/read times when not valid. A featured article is eligible only if publicly approved. Do not show empty category filters, dead pagination, inert search bars, or fake subscriber counts. If search/filter UI already exists, ensure it genuinely works and only indexes public articles; otherwise keep the interface simple rather than implementing unnecessary functionality.

If **no articles are owner-approved**, display an intentional, accessible empty state such as “Insights are being prepared” with a useful link to the **existing verified services** or portfolio pages. Avoid a deceptive full grid of drafts or sample posts. Keep public page accessible unless the existing information architecture intentionally hides it; report any nav decision.

## 7. Individual article page experience

For actually approved article routes only, ensure meaningful `<title>`, meta description, page heading, optional verified date, category when accurate, comfortable typography for paragraphs and lists, responsive tables/code snippets, descriptive links, contextual related reading from published articles only, and accessible navigation back to Insights. Article text must be rendered through the repository's established safe Markdown/MDX pipeline; do not create untrusted raw HTML paths or turn code blocks into malformed HTML. Prevent horizontal overflow on phones (tables/code can scroll within their own region). Maintain one H1, heading order, useful image alt text, and visible focus styles.

Any table of contents must actually link to deterministic heading IDs and be keyboard-accessible; add one only where an article is long enough to benefit. Reading time, if shown, must derive from actual article text with a documented words-per-minute estimate, never hard-coded. Related articles must not leak drafts or promise nonexistent content. Use existing layout components where possible; don't add heavy dependencies just for a blog.

## 8. SEO and structured data without invented identity

Reuse the site's existing canonical/OG metadata utilities; do **not** adjust `PUBLIC_SITE_URL` or the known placeholder hostname. Ensure public index and public articles have appropriate titles, descriptions, semantic URLs, OG values, and share images **only if a real licensed/owner-approved asset exists**. Do not create random stock images, invented screenshots, or fake cover assets. A clean text-based editorial card is acceptable.

If blog/article structured data already exists, validate it includes only true fields: actual page URL from the existing helper, actual title, actual public date if known, actual approved image if present, truthful author/publisher. Omit unsupported fields. Do not claim an employee is the author by inference. Never output draft article metadata in live sitemap or an RSS feed. If RSS is preexisting, make sure it uses the same public predicate; do not build one merely for decoration.

Leave sitemap hostname as-is; this is an acknowledged later launch issue, not a Step 9C change.

## 9. Internal navigation, links, and factual attribution

Only link to service, portfolio, or team routes that actually exist. Derive internal URLs from the current project; do not guess slugs. Maintain semantic link text and avoid excessive sales CTAs. Links to six portfolio projects must respect **confirmed delivery scopes**: ScaleUp Systems is a marketing website only; GoWabi is a public marketing/frontend presentation only, not the booking/payments engine; Daniela Diamonds is frontend/interface contribution, not complete Shopify/checkout/backend ownership; Gain Energy / Upstrima has approved marketing website contribution, with any additional SaaS work unverified; MedaStaré and Born To Rock must not gain invented modules/metrics. No invented personal contribution links from team profiles. If an article describes a hypothetical architecture, label it an example, not a Vortex Digital project case study.

Audit internal article links for 404s, self-links, draft links, anchor behavior, and accessible external link text. For external factual references, prefer primary documentation/standards; only add verified URLs that are relevant and trustworthy. Don't claim external verification if browsing is unavailable.

## 10. Content integrity and editorial standards

Use accurate US English, consistent punctuation and headings, and the website's established vocabulary. Avoid unsupported quantification (“10x”, “guaranteed”, “best in class”, “industry-leading”), false urgency, “as seen in” claims, medical/security/compliance guarantees, and unattributed statistics. When discussing privacy/security, distinguish recommendations from compliance claims and avoid suggesting certification that the agency has not verified. Avoid an artificial publish schedule or author biography. No lorem ipsum, fake testimonials, placeholder “John Doe”, manufactured clients, date backfilling, or robotically repeated CTA blocks. Articles should stand alone as genuinely useful educational content, not thin disguised ads.

## 11. Accessibility, performance, and progressive enhancement

Test keyboard focus and heading order, color contrast, links, typography, reduced-motion behavior if animations exist, and sensible tap targets. Use native HTML/accessible patterns; no fake clickable divs. Mobile widths should not overflow; rich content must wrap or use local horizontal scrolling as appropriate. Avoid shipping unused large JavaScript packages, duplicate CSS frameworks, font replacements, or heavy blog animations. If adding excerpt text, trim safely on word boundaries without cutting meaning. Preserve clean HTML and the site's performance budget.

## 12. Keep working functionality stable

Do not modify team portraits, names, biographies, team routes, gallery labeling, portfolio content files or images, case-study order/publication flags, or the existing services content. Do not regenerate assets. Keep Insights drafts unpublished unless already explicitly owner-approved. Avoid changing shared components except for minimal, backward-compatible fixes necessary for Insights. If an integration test exposes an unrelated defect, document it instead of opportunistically broadening scope. Do not change global package/tool versions.

## 13. Automated unit tests

Extend existing test structure rather than building a new test runner. Add or update unit tests to prove:

1. A new article lacking approval is private by default.
2. All existing drafts remain unpublished unless explicit approval evidence existed before this step.
3. Public selectors require real approval + published status and reject samples/placeholders.
4. Overview, related items, sitemap/feed selectors all honor the identical public rule.
5. Sorting is deterministic; ties do not randomly reorder.
6. Metadata and URLs for public posts are nonempty and meaningful.
7. Existing six approved case studies and nine published team members remain intact.
8. Internal link helpers don't generate routes to unpublished article slugs.

Use realistic fixtures and avoid brittle substring slicing of entire source files. If there are genuinely no approved articles, tests should explicitly support **zero** published articles.

## 14. End-to-end tests and browser checks

Extend current Playwright/E2E smoke coverage with an Insights test that validates the current public state: index renders, empty state or approved cards are correct, no draft cards appear, direct visit to an unapproved article returns 404/not found, draft slug absent from sitemap, and a published article renders headings/links/metadata **only if one was already approved**. Verify navigation from site to `/insights` or the actual existing route; avoid hard-coding a new path when the repo differs. Ensure mobile nav remains usable. Keep tests deterministic—do not introduce network-dependent tests.

Browser-check the Insights index and any eligible published article at **375, 768, 1024, and 1440px**; inspect viewport overflow, images, headings, cards, responsive tables, keyboard focus, and console errors. Spot-check `/`, `/about`, `/team`, a published team profile, `/portfolio`, a published portfolio case, `/services` or an actual service route, and `/contact` to ensure unrelated sections still render. Do not claim visual checks that were not performed.

## 15. Run the project's actual quality gates

Run exactly the project's scripts, where available, including:

```bash
npm test
npm run check
npm run build
npm run test:e2e
```

If a script is unavailable, report the truthful alternative or limitation, not a fake pass. Fix **in-scope** problems, rerun impacted tests, and disclose initial failures plus final outcomes. Record counts (tests, errors, warnings, hints, pages, sitemap URLs). Page counts need not increase if no articles are owner-approved; Step 9B built 35 HTML pages and included 31 sitemap URLs, but do not force fixed counts if the current repository legitimately differs. Ensure build output has **zero unapproved articles**, no accidental public article preview, and no sample-project leakage. Be precise about whether `/insights` is a landing page with drafts hidden or contains existing approved public articles.

## 16. Deliverable report: `STEP_9C_REPORT.md`

Create this root-level Markdown report with **all** of these numbered sections:

1. Executive summary and whether Step 9C completed.
2. Existing Insights architecture and exact routes discovered.
3. Inventory table of every preexisting article: slug/path, original status, approval evidence.
4. Editorial audit findings and concrete changes to preexisting drafts.
5. New draft articles (if any): title, slug, content path, audience, word count, unpublished status.
6. Coverage map of articles/drafts to Vortex Digital's eight specialties.
7. Exact publication predicate/schema and all places it is enforced.
8. Explicit count/names of owner-approved **public** posts vs **unpublished** drafts.
9. Insights index changes, including truthful empty-state behavior.
10. Individual article route/layout changes, if applicable.
11. Author/date/source and copyright/attribution safeguards.
12. Readability, categories, excerpts, related reading, and actual link checks.
13. SEO metadata, Open Graph, and structured data decisions.
14. Sitemap/feed verification and draft exclusion with exact URLs/slugs.
15. Mobile, tablet, desktop visual findings (375/768/1024/1440).
16. Accessibility checks and keyboard behavior.
17. Performance / dependency changes (or explicit statement of none).
18. Detailed list of created/modified files, scoped to Insights.
19. `npm test` outcome, including first failure/retest if any.
20. `npm run check` outcome (errors/warnings/hints).
21. `npm run build` outcome, HTML page count, sitemap count.
22. `npm run test:e2e` outcome and smoke test assertions.
23. Regression confirmation: exact six portfolio projects remain intact.
24. Regression confirmation: exact nine named team profiles and portraits remain intact.
25. Owner editorial approvals still needed, with a prioritized approval checklist.
26. Remaining known launch issues explicitly **not** modified (domain/canonical placeholder, business email/contact delivery, deployment, and any unrelated preexisting items).
27. Any blockers, deviations, or claims that could not be independently checked.

Also write/update `INSIGHTS_CONTENT_REVIEW.md` as the owner's actionable editorial queue. Provide real evidence and file paths; do not mark tasks completed without implementing/testing them.

## 17. Final acceptance criteria

Step 9C is complete **only if** the existing Insights architecture is audited and improved, the drafts are organized and meaningfully edited, any necessary additional drafts are professionally written yet **unpublished**, the public interface behaves correctly even with zero approved articles, tests prove approval-gated publication and draft exclusion, metadata and reading UX are sound, the six portfolio studies and nine team profiles are preserved, and all available checks are run with an honest `STEP_9C_REPORT.md`.

**Do not deploy or start Step 9D. Do not ask the owner to approve articles implicitly.** Finish the current step, leave drafts awaiting explicit review, and end with a concise report containing what is ready, what remains approval-blocked, and all test results.
