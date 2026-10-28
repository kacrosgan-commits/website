# VORTEX DIGITAL — STEP 9E CURSOR AGENT PROMPT
## Final Website-Wide QA, Accessibility, Performance, SEO, Security Hygiene & Local Production Readiness

**Execution mode:** Cursor Agent, working on the EXISTING Vortex Digital Astro repository. **This is an implementation and verification task, not a new website build, mockup, or planning-only exercise.** Inspect code, establish a reproducible baseline, repair concrete in-scope issues, run real checks and browser tests, and write the mandatory reports. **Stop after Step 9E. Do not deploy.**

---

## 0. Mission and non-negotiable owner boundaries

Website: **Vortex Digital**, an agency serving startups with eight specialties: Web Development, Mobile Apps, AI Solutions, SaaS Development, Backend & APIs, Cloud & DevOps, UI/UX Design, and QA & Testing.

Existing stack: **Astro 7 + TypeScript + Tailwind CSS v4**. Retain the existing premium cinematic **dark + purple** UI, typography, page structure, shared components, and design tokens. Do **not** rebuild it from scratch or switch frameworks.

**Goal:** Make the current website as reliable, fast, usable, accessible, internally consistent, and maintainable as possible **within a local production build**, while guarding already approved material and honestly documenting remaining launch requirements. A check mark requires actual execution/evidence; a reported baseline is not proof of the current tree.

### Strict exclusions — NEVER DO THESE in Step 9E

1. **No domain work:** Do not purchase/select a domain, change DNS, set or rewrite `PUBLIC_SITE_URL`, replace `https://example.com` in source/config/environment, change canonical host values, or modify hosting provider configuration. The placeholder origin is KNOWN and intentionally deferred. **Audit/report its impact; do not fix it through a guess.**
2. **No business email or contact delivery:** Do not configure `PUBLIC_CONTACT_EMAIL`, mailbox, `PUBLIC_FORMSPREE_ENDPOINT`, SMTP, Resend, Formspree, webhook, CRM, booking integration, or production backend; do not send test inquiries. The current contact page is a **copy-only inquiry draft** with the explicit message **“Inquiry copied. No message has been sent.”** Preserve it. No fake send success and no placeholder `mailto:`.
3. **No deployment:** Do not publish to Vercel/Netlify/Cloudflare, push changes to a remote, change DNS, create production credentials, modify `.env` values, or claim a production URL was tested. Local `npm run build` and local production `astro preview`/existing preview commands are allowed.
4. **No fabricated content:** Do not invent client contributions, screenshots, ROI/metrics, staff history, employees, contact data, office address, social accounts, awards, certifications, press, reviews, uptime guarantees, legal protections, or company achievements.
5. **No approvals inferred:** Do not publish any draft Insights article, demonstration/sample portfolio project, unapproved photo, or unverified work scene. Do not alter project/team publication status or permission flags.
6. **No rewrite of approved portfolio/team/service claims:** Restrict text edits to objectively necessary accessibility/typo/link issues, with rationale; retain names, verified scopes, titles, owner approvals, images, case-study dates, order, and exclusions. Do not attribute external employer work to Vortex Digital.
7. **No unauthorized legal edits:** Review Privacy Policy and Terms for broken links/obvious placeholders; document matters requiring counsel/owner review, but do not invent or substantively rewrite legal terms.
8. **No sweeping upgrades:** Do not update Astro, Tailwind, TypeScript, Zod, Playwright, lockfiles/dependency versions, package manager, image pipeline, or analytics for the sake of a score. Use installed tools. No new service or third-party network dependency. Do not run `npm audit fix`, automated code transforms, or install packages without need/explicit approval.
9. **Do not rename the internal package automatically:** Step 9D found `package.json` name `velora-website`. Audit where it is referenced, report as a branding-cleanup recommendation if needed, but **do not change the package name or lockfile in Step 9E**.
10. **Do not start any later step.** Preserve every previous Step's result unless directly fixing a demonstrable regression.

### Reported Step 9D starting baseline — verify in the actual repo

- **35 production HTML pages** and **31 sitemap URLs**.
- Unit tests: **20 passed**; Playwright E2E: **8 passed**; `npm run check`: **0 errors, 0 warnings, 91 existing hints** (Zod deprecation hints).
- **6 owner-approved portfolio cases in this exact homepage/portfolio order**: `scaleup-systems`, `medastare`, `gain-energy-upstrima`, `gowabi`, `daniela-diamonds`, `born-to-rock`. Sample studies private; individual contribution claims constrained by owner verification.
- **9 published named team profiles**, in role order:
  1. Don Tran — Founder & CEO (`founder-ceo`)
  2. Joshua Mendoza — Co-Founder & CTO (`cofounder-cto`)
  3. Lin Jiayi — CFO (`cfo`)
  4. Pongsak Rattanakul — Project Manager (`project-manager`)
  5. Dmytro Melnyk — Senior Full-Stack Developer (`senior-fullstack-developer`)
  6. Carlo Garcia — AI Engineer (`ai-engineer`)
  7. Matheus Pereira — Mobile App Developer (`mobile-app-developer`)
  8. Adrian Cruz — UI/UX & Product Designer (`uiux-product-designer`)
  9. Sofia Vasylivna Melnyk — QA & DevOps Engineer (`qa-devops-engineer`)
- Nine owner-assigned portraits are installed. Don's original portrait is preserved; the other eight were replaced in Step 9B. Adrian and Matheus must retain **different portraits**. Illustrative work scenes are NOT literal photographs of named employees, real team meetings, or documented agency events. Adrian's separate Cepheid/UEGroup/SJSU background must not be recharacterized as Vortex Digital project delivery or as full-time/exclusive affiliation.
- **12 Insights drafts; 0 published**. `isPublicInsight` must require `publicationApproved === true`, `status === "published"`, and no draft/demo/sample flag. `/insights` is a real, honest empty-state page; there is no Insights header/footer link until a post is approved. Draft article routes are absent from production and sitemap; local-dev review is allowed.
- `/contact` has **Copy inquiry** action (not send), validation, a genuine clipboard-failure manual-copy fallback, honeypot, safe service prefill, and an explicitly unconfigured endpoint. Optional budget/timeline; no fake inbox. Known visual wrinkle: at **320px and 200% text size**, the large heading splits inside long words; no overflow, but readability could improve.
- Step 9D browser widths: **320, 375, 768, 1024, 1440**, including 200% root text on `/contact`; no overflow. No real send branch has been exercised in the browser without an endpoint. Contact test historic intermittent validation wait did NOT reproduce in Step 9D.
- SEO host still `https://example.com` because `PUBLIC_SITE_URL` not set. This is an owner-deferred **launch blocker**, not permission to substitute another URL.

Treat all figures as *reported* until measured. Do not force page counts to equal old figures if a legitimate fix changes them; explain differences precisely.

---

## 1. Inspect existing project and establish a BEFORE baseline

Read if present: `STEP_7_REPORT.md`, `STEP_8F_REPORT.md`, `STEP_9B_REPORT.md`, `STEP_9C_REPORT.md`, `STEP_9D_REPORT.md`, `CONTACT_PAGE_REVIEW.md`, `INSIGHTS_CONTENT_REVIEW.md`, `TEAM_CONTENT_REQUIRED.md`, `PORTFOLIO_CONTENT_REQUIRED.md`, `WEBSITE_COMPLETION_STATUS.md`, `FINAL_CONTENT_REQUIREMENTS.md`, `docs/contact-delivery.md`, `README.md`, `package.json`, and test configuration.

Inspect the actual source rather than assuming paths exist. Likely hotspots:

- `astro.config.ts`, `src/content.config.ts`, `src/data/site.ts`, `src/data/defaults.ts`;
- `src/layouts/**`, shared Header/Footer/SEO/CTA/nav components, `src/styles/global.css`;
- `src/pages/**` for home, about, eight services, portfolio overview/six case pages, team overview/nine profile pages, `/team/gallery`, `/process`, `/insights`, `/contact`, legal, and 404;
- `src/utils/portfolio.ts`, `src/utils/insights.ts`, `src/utils/inquiry.ts`;
- `src/data/team.ts`, existing content collections, public asset manifest, `public/assets/**`;
- unit tests, `tests/e2e/smoke.spec.ts`, Playwright/browser config, existing QA screenshots.

Before changing files:

1. Record working-tree state / diff (`git status`, if Git exists). Never reset or overwrite preexisting user modifications. If uncommitted changes exist, report them and edit carefully; do not discard work.
2. Run `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` once (or record execution blocker). Record exact exit codes, duration where available, pass/fail/hints, warnings, page/sitemap counts, and any initial flakiness. Do not silently fix a failing baseline before recording it.
3. Enumerate actual built HTML pages, public routes, sitemap URLs, links/assets, and publication filters. Do not assume `dist/` represents the fresh build until the build succeeds.
4. Record objective baseline problems in a **severity-ranked issue ledger** (P0, P1, P2) with file/route, reproducible evidence, proposed safe fix, and after-verification. P0 = data leak/unintended publication/security defect; P1 = broken/critical UX or accessibility; P2 = justified polish/performance/maintainability.
5. Use the site's existing test runner and browser tooling; don't introduce a parallel testing system if the repo already has one.

Create or update `docs/step-9e/` only if useful, and place **actual** evidence (screenshots, audit results, readable scripts) there. No fabricated screenshots or result tables.

---

## 2. Full-site functional and content integrity audit

Inspect all meaningful page classes, including the 8 existing service routes (derive precise paths from repo; historically these are `/services/web-application-development`, `/services/mobile-app-development`, `/services/ai-intelligent-automation`, `/services/saas-platform-development`, `/services/backend-api-engineering`, `/services/cloud-devops`, `/services/ui-ux-product-design`, `/services/qa-software-testing`). Also include:

- `/`, `/about`, `/process`, `/services`, `/portfolio`, each of the 6 portfolio routes;
- `/team`, each of the 9 profile routes, `/team/gallery` (must remain `noindex`);
- `/insights` (0 public articles), `/contact`, real legal pages and 404.

Check: navigation, footer, sticky header, mobile menu, CTA destinations, query-prefill, card click targets, breadcrumbs/previous-next, gallery dialogs, keyboard Escape/focus return, contact statuses, anchor links, tab ordering, 404 states, and direct URL loads.

Automate an internal route crawl against the **fresh local production preview**: collect all real internal `<a href>` URLs and important referenced local assets; detect broken/redirect-loop routes, dangling fragments/ids, protocol-relative mistakes, case mismatches, unexpected blank links, and `href="#"`/`javascript:` placeholders. Handle trailing-slash conventions. Avoid treating `mailto:` and external URLs as internal paths. **Do not crawl or submit private data to third parties.**

External links: validate only with available, low-impact requests if internet access permits, without bypassing bot protections. Mark failed network verification as **unverified**, not broken by assumption. Do not replace verified owner-supplied App Store or project links based on speculation. All visible CTA links must have real destinations or be clearly unavailable.

Preserve content rules:

- Six approved case studies remain the only public case studies; 3 screenshots each where currently provided; no fabricated case-study scope, stacks or performance claims. All sample portfolio slugs are 404 and excluded from sitemap, home, related lists.
- Nine profiles retain exact name/role pairing, owner-assigned portrait, alt text, role order and safe work-scene captioning; no fake social links, case-study ownership or biography expansions.
- Twelve Insights Markdown drafts retain unapproved status; their excerpts/titles/strings are not leaked into production HTML/JS/search/sitemap; their direct production routes are 404. Future approval predicate must remain default-private.
- Contact remains copy-only/unconfigured, user-consented action, no placeholder mailbox exposed, no POST when endpoint absent, no “sent” message on copy/failure.

---

## 3. Responsive visual QA — actual screenshots, not assumptions

Run browser inspection on the fresh **production preview** (not just dev HMR) at **320, 375, 768, 1024, and 1440 CSS px**; also test **200% root text size** at 320, 375, 768 and 1024 for representative routes. If feasible include 1920 desktop and zoom/reflow checks without relying solely on screenshots.

Test each page class: home, about, process, services index + at least two service details, portfolio index + both website and app/game case types, team overview + representative profile including Carlo's landscape source, Insights empty state, contact, 404, gallery. Perform a lightweight overflow/asset/heading audit across *all* built routes; deeply inspect representative routes with screenshots.

At each width check:

- no horizontal document overflow (`documentElement.scrollWidth <= documentElement.clientWidth`); no clipped H1, buttons, touch targets, modal dialogs, menus, cards, text, or decorative effects;
- reliable responsive image frames: 600x1299 portrait App Store art still vertically contained; website screenshots not distorted; 9 team portrait crops retain faces; Carlo's 1448x1086 image doesn't crop his head; real photos remain correct; lazy images load when scrolled into view;
- proper layout order, legible text, responsive grids, fixed/sticky nav and mobile-menu behavior; minimum comfortable interactive target size, especially at narrow widths;
- form fields and error states, text reflow, 200% font scaling, and reasonable reading widths for long paragraphs / code blocks.

Specifically improve the **320px + 200% contact heading** only if a small, demonstrably better change is possible without breaking typography elsewhere; compare before/after screenshot. Don't churn the global design to solve one edge case. Verify motion-reduction support and no forced smooth scroll under reduced-motion settings.

Store representative **actual** before/after screenshots or final screenshots in `docs/step-9e/`, avoiding duplicate dozens of heavy images. Record viewport and page for each. Do not claim to have checked widths that were not tested.

---

## 4. Accessibility audit and targeted fixes

Apply established WCAG 2.2 AA principles as an evaluation guide, **not a certification**. Test actual behavior and fix concrete, low-risk defects:

- semantic landmarks, exactly one meaningful H1 per page, sensible heading levels, accessible names/labels for links/buttons/inputs, nondecorative alt text and empty alt for truly decorative graphics;
- keyboard-only usage: header/mobile menu, links, accordions if present, contact form/validation/focus, portfolio screenshot enlargement, team gallery; Escape close + focus restoration; no keyboard traps;
- visible focus, meaningful error text linked to fields, `aria-invalid`, live-region truthfulness, role/heading hierarchy, contrast for text/buttons/errors, reduced-motion support, zoom/reflow and resize;
- active navigation indications and accessible pagination/related-content labels if used; no duplicate ID collisions across components.

If an accessibility scanner is **already installed and working**, run it and attach raw results; otherwise conduct reproducible DOM + keyboard + CSS checks with the existing browser tool. **Do not silently install Axe/Lighthouse packages.** Manual assistive-tech screen-reader behavior may not be verifiable; label it **not tested** and add to owner QA. Never assert “WCAG-certified” or “100% accessible”.

---

## 5. Performance and loading audit — measure first, optimize safely

Set a reproducible baseline with the local production preview, browser version/device assumptions, disabled/enabled cache as appropriate, connection/CPU profile if supported, and page class. If Lighthouse or a browser tracing tool is **already available locally**, run it for a small representative sample: `/`, `/services`, `/portfolio`, one case-study route, `/team`, `/contact`. Keep raw reports, environment, and before/after comparison.

If Lighthouse is unavailable, collect honest, browser-observable proxies (navigation/resource sizes, load times, unused large image transfers, main-thread issues, requests, console warnings) and **say it is not a Lighthouse/Core Web Vitals score**. Local lab results do not establish field Core Web Vitals or actual real-user performance. Never fabricate LCP, CLS, INP, FCP, SEO scores, page weights or compression percentages.

Audit then fix only clear regressions:

- Images: unnecessary full-size downloads, intrinsic width/height or `aspect-ratio` missing, responsive dimensions and srcset opportunities, `loading="lazy"` for below-fold and appropriately eager/priority loading for actual hero/LCP, sensible `decoding`, source size versus display size, correct WebP/PNG use. Preserve screenshots/photos/provenance. Don't re-encode already optimized assets without measured benefit and visual equivalence.
- Fonts: check actual Google/local delivery, font fallbacks and any layout shifts; avoid new fonts/preloads without evidence. Preserve Space Grotesk and Inter if present as established brand fonts.
- CSS/JS: avoid loading page-specific script on unrelated routes if low-risk, remove genuinely unused assets/duplicate network requests only after verifying no references, minimize render-blocking behavior without breaking Astro hydration or interactions.
- Layout stability: explicit media dimensions, consistent gallery/carousel/card heights, avoid shifts from lazy images; no speculative animation effects.
- Network hygiene: no broken fonts/images/favicons, unexpected third-party trackers or calls, broken cache references. Do not introduce analytics.

Keep before/after measurements under identical conditions and document **each** performance edit's evidence. If performance is already adequate, **leave code alone** and report that; no arbitrary refactor.

---

## 6. SEO, crawlability and metadata integrity (WITHOUT domain setup)

Audit existing SEO/layout helpers for every public route:

- `<title>` and meta descriptions are present and distinguishable by page type; one H1; proper `lang`, semantic heading hierarchy;
- canonical URLs derived consistently from existing helper, **but `https://example.com` is intentionally a placeholder — do not replace it**;
- Open Graph/Twitter metadata uses real available assets and truthful titles/descriptions, no invalid image references or fake date/author;
- `robots.txt`, sitemap generation and robots meta behavior are coherent; all 6 public case pages and 9 published team pages in sitemap; 12 Insights drafts, sample studies and `/team/gallery` excluded as before; Insights empty index may remain in sitemap;
- relative navigation, trailing slashes, 404 noindex treatment (if any), pagination and structured data with safe truthfulness; only publish BlogPosting JSON-LD on articles which are truly public (currently zero);
- check no broken/duplicate structured-data URLs, fake ratings/FAQ, staff author or project claim.

Create a deterministic SEO validation test if missing and reasonably scoped (inspect generated HTML/XML). Don't change intended information architecture, show Insights in nav prematurely, alter canonical origin, or deploy for Google Search Console. Mark owner-controlled domain/canonical configuration a **DEFERRED launch blocker**.

---

## 7. Security, privacy and dependency hygiene (read-only where appropriate)

Audit for client-exposed secrets, `console.log` of inquiry contents, inappropriate query-string sharing of personal information, insecure placeholder form action/recipient, malicious/untrusted content interpolation, external links with `target="_blank"` missing `rel="noopener noreferrer"`, iframe embedding where present, missing `autocomplete` where useful, XSS hazards in generated HTML, and accidental publication of private draft content.

Test contact without configuring delivery:

- validation and query prefill sanitize unexpected parameters (`<script>`-like input), copy-success vs copy-failure messaging, clipboard permission rejection, honeypot block, no POST and no fake success;
- no user input in localStorage, cookies, analytics, console, URL or generated static content;
- optional future real-endpoint provider branch can be unit-tested/mock-tested safely; **no live send**.

Inspect dependency status using local package files. Only run `npm audit` if it can complete with allowed access; if network unavailable, report **not verified**. Don't log or expose secrets. Do not run auto-fix/upgrades. Headers like CSP/HSTS depend on hosting and may not be testable locally; report them as deployment-dependent recommendations, not defects you silently “fix” by changing hosting.

---

## 8. Code quality, maintainability and naming audit

Review for concrete errors and high-impact technical debt rather than styling the entire repo:

- TypeScript/Astro errors, null/undefined paths, missing keys, redundant logic, unreachable branches, unreliable async focus/clipboard tests, SSR-safe browser APIs, safe `astro dev` vs build differences.
- Zod-related 91 hints: identify source and risk, **do not trigger framework/dependency migration**. If resolving a hint is an obvious compatible local refactor with no schema behavior change, it may be performed *only with focused regression tests*. Otherwise leave and document remaining warnings/hints.
- Inspect `package.json` internal name `velora-website`; log mismatch and whether referenced, but **do not rename automatically**.
- Avoid duplicate helpers if making a contained fix; preserve routing/conventions. Never disable tests, remove assertions, relax TypeScript, weaken publication filters, or add fake fixtures that pass instead of real behavior.
- Respect existing component patterns; test any nontrivial code edits and keep diff targeted.

---

## 9. Automated tests — extend rather than replace

After investigating and fixing the highest-value issues, run the entire suite again:

```bash
npm test
npm run check
npm run build
npm run test:e2e
```

Record **first and final** results, exit codes, failures and reruns. If a test fails, determine root cause. Do not delete tests to achieve green, use `.skip` to hide failures, or claim green when a step was not executed. When tests are environment-blocked, document limitation and provide a reproducible manual command.

Prefer additional targeted tests where appropriate:

1. **Integrity guard:** exactly six public case studies in the approved order; public case pages/sitemap present, sample slugs 404 and absent.
2. **Team guard:** exactly nine published names, role slugs and owner-assigned portraits; Adrian and Matheus distinct; illustrative work scenes labeled and gallery noindex.
3. **Insights guard:** exactly 12 unapproved articles; 0 published; draft routes 404, not linked/listed/sitemapped in production, predicate default-private.
4. **Contact guard:** `Copy inquiry`, required/optional validation, no POST in unconfigured mode, clipboard failure recovery, no placeholder `mailto`, service prefill sanitation, no false-send copy.
5. **Site quality guard:** internal-link/anchor/asset validity across built routes, unique titles/H1 where appropriate, metadata/robots/sitemap presence, selected accessibility interactions.
6. **Responsive smoke:** at least 320/375/768/1024/1440 representative pages and 200% font reflow at narrow widths.
7. **No unintended content:** no prohibited sample/demo/draft snippets in public output, no placeholder external destinations offered as working business channels.

Keep tests deterministic and efficient. Don't add flaky network requests, hardcoded timestamp-sensitive assertions or oversized screenshot baselines. If route crawling scripts are useful, place them under the repo's established tooling convention and document execution.

---

## 10. Browser test checklist

Use Playwright/Chromium or existing browser harness against actual local **production** build. Where possible save a concise route/viewport matrix as data or Markdown. For each test, capture observed state:

- Homepage: navigation, all six featured cases and their ordering, nine named mini-team profiles (where present), service CTAs, no drafts.
- Services: index to 8 detail routes, all service CTAs prefill the corresponding contact type; Back and direct URL work.
- Portfolio: 6 case cards in correct order, related project links to other approved cases, app screenshots in portrait, websites landscape, accessible open/close gallery. Sample route 404.
- Team: 9 cards, nine name-role matches, distinct portrait URLs and naturalWidth > 0 **after load/lazy-scroll**, individual profile previous/next; gallery 27 images if still present, owner-assigned portrait vs illustrative captions, gallery `noindex` and absent sitemap.
- Insights: public empty-state page, no nav item yet, no draft leakage, draft routes 404; do not fake a published post to test production without reverting it. Future post template can be inspected locally only.
- Contact: validation, 48px targets where existing, copy outcome and clipboard denial, no real message and no fake confirmation; stress at 320px 200% text size.
- Footer/header: full keyboard, mobile toggle + Escape, focus states; no anchor link to missing id.
- 404/legal: useful path back; legal links exist; legal substance flagged pending professional review.

Some above checks were already included in Step 9D. Reuse them, do not duplicate unreliable suites.

---

## 11. Fix policy: do useful work but keep scope tightly bounded

Use this prioritized workflow:

1. Audit and run initial tests.
2. Fix confirmed P0 leaks, broken routes, or false contact-delivery states first; **do not** cross an owner exclusion.
3. Fix confirmed P1 mobile/accessibility/navigation/image issues.
4. Apply only measurable/low-risk P2 performance and semantic SEO improvements.
5. Run targeted checks after each meaningful edit, then all tests and responsive browser checks.
6. Write exact remaining owner blockers and a clean diff summary. Do not stop at “recommendations only” when code fixes are feasible, but do not manufacture problems to make edits.

If the site already passes a category, keep it as-is. All changes must be limited to existing site-quality issues. Do not rewrite service copy, biography claims, dates, image selection or approved project content for aesthetic preference.

---

## 12. Required deliverables (inside the existing repository)

Create these files with observed results, not template filler:

1. **`STEP_9E_REPORT.md`** — comprehensive numbered final execution report described below.
2. **`FINAL_WEBSITE_QA.md`** — succinct, owner-readable site checklist and route/device matrix with Pass / Fixed / Deferred / Not tested / Fail, evidence references, and a launch-readiness conclusion that distinguishes **local technical quality** from **business/public launch readiness**.
3. **`PERFORMANCE_AUDIT.md`** — actual methodology and before/after metrics (if measured), page/resource findings, adjustments, test environment and caveats. If no valid benchmarking tool exists, document available observables and explicitly mark LCP/CLS/INP/Lighthouse scores **not measured**.
4. **`docs/step-9e/`** — selective genuine screenshots or QA artifacts *if created*. Don't create huge duplicate image assets purely for the report.
5. Update tests/code **only as justified by verified defects**.

Do **not** create a new website, substitute mockups for app behavior, update agency facts, or add analytics/deployment helpers.

### Required sections in `STEP_9E_REPORT.md` (28 sections)

1. Executive summary and completion status; clearly state if site was deployed (must be **no**).
2. Exact repository architecture, stack versions read from installed repo, files/reports inspected.
3. Git/worktree state and guardrail protection of preexisting changes.
4. Before-state test baseline: original exit codes, counts, browser and limitations.
5. Severity-ranked issue ledger (P0/P1/P2), with defect, evidence, resolution/deferred reason.
6. Complete public-route inventory and any page count difference from Step 9D's 35 pages.
7. Navigation and link crawl results: internal routes, fragments, broken/redirected/external unverified.
8. Homepage UX and performance result, six-portfolio showcase and mini-team integrity.
9. Eight service pages/CTA-prefill regression and UX checks.
10. Six portfolio case studies/screenshots/related links: preserved claims and sample safeguards.
11. Nine team profiles, designated portraits, alt/captions and gallery integrity.
12. Twelve Insights drafts, zero publication, default-private rule, 404 and leak audit.
13. Contact copy-only workflow, privacy/validation/clipboard failure and no network send.
14. Responsive matrix at 320/375/768/1024/1440 + 200% reflow outcomes.
15. Exact 320px/200% contact-heading review, before/after fix or stated reason left unchanged.
16. Accessibility DOM, keyboard, focus, contrast, motion, zoom findings and limitations.
17. Image correctness, sizes, lazy loading, above-fold behavior, broken asset audit.
18. Lab/performance audit method, environment, real metrics (if available), before/after, caveats.
19. Metadata/structured data, canonicals, robots, sitemap (including placeholder-origin caveat).
20. Security/privacy hygiene, secrets/links/headers limitation and dependency audit state.
21. Code-quality debt including Zod hints and legacy internal `velora-website` package name; actions vs owner-deferred recommendations.
22. All modified/created files with a precise explanation; nonessential files deliberately untouched.
23. Final `npm test` results: passes/failures, new assertions, exit code.
24. Final `npm run check` and `npm run build`: errors/warnings/hints, HTML count, sitemap URLs, exit codes.
25. Final `npm run test:e2e`: passes/failures, browser results, retries/flakes, exit code.
26. Screenshot/QA artifacts and exact path/viewport, only if produced.
27. Remaining owner/deployment-dependent blockers: real domain/canonical, business email/form delivery, editorial approvals, legal review, actual hosting/performance, optional named social links or other unverifiable facts — **do not act on any of them**.
28. Final acceptance checklist, precise status (**locally quality-audited** vs **publicly launch-ready**), and handoff guidance; explicit confirmation no deployment/domain/email/contact endpoint changes, no content publication, no Step 10.

Do not write “passed” for steps not executed. Provide raw logs/summaries and useful reproducible commands. Explain any P0 or P1 unresolved issue prominently.

---

## 13. Acceptance criteria and stop condition

Step 9E meets its **in-scope** acceptance criteria when:

- You completed a real cross-site audit, fixed objectively confirmed feasible issues, and documented the remainder honestly.
- Fresh `npm test`, `npm run check`, `npm run build`, and `npm run test:e2e` have **actual recorded final results**, ideally all green; any failures or execution blockers are explicit rather than concealed.
- No severe unaddressed P0 exposure exists; any unresolved P1 is prominently called out and does not get a fake “ready” status.
- Representative pages and all relevant page classes work at the declared responsive widths, with readable content and no demonstrable document overflow.
- Six approved cases, nine named team profiles and portraits, twelve unpublished Insights drafts, and the copy-only contact contract are regression-safe.
- Sitemaps/robots/meta avoid unauthorized sample/private routes; the canonical host stays the intentionally unresolved `https://example.com` value.
- Required `STEP_9E_REPORT.md`, `FINAL_WEBSITE_QA.md`, and `PERFORMANCE_AUDIT.md` exist and contain real evidence.
- No domain, DNS, business email, endpoint, booking, hosting, environment, legal substantive text, analytics or deployment configuration was modified. No deploy and no owner-unapproved publication.

**Afterward STOP.** Reply with a concise factual summary, state the exact test outcomes, list remaining owner-only launch blockers, and tell the owner to upload `STEP_9E_REPORT.md` (ideally also `FINAL_WEBSITE_QA.md` and `PERFORMANCE_AUDIT.md`) for review. Do **not** start another step.
