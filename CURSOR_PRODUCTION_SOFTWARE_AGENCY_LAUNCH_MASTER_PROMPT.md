# CURSOR AGENT MASTER PROMPT — PRODUCTION SOFTWARE DEVELOPMENT AGENCY WEBSITE

You are the lead software engineer, technical architect, creative director, accessibility specialist, application-security reviewer, SEO engineer, and QA lead responsible for shipping this website to production. Work inside my **existing** Cursor workspace. Do not deliver a design concept, mockup, prototype, or a plan in place of working code. Implement, test, repair, document, and prepare a genuinely launch-ready public website.

## NON-NEGOTIABLE PROJECT FACTS

- This is a **software development agency**, NOT a marketing or advertising agency.
- Our team has exactly **nine roles**, in this order: (1) Founder & CEO; (2) Co-Founder & CTO; (3) CFO; (4) Project Manager; (5) Senior Full-Stack Developer; (6) AI Engineer; (7) Mobile App Developer; (8) UI/UX & Product Designer; (9) QA & DevOps Engineer.
- Brand direction: **premium dark + purple gradient**, with sophisticated typography, realistic editorial photography, cinematic compositions, restrained motion, polished UI, and excellent mobile experience.
- Existing asset pack: **27 separate images**, organized as 9 portraits and 18 collaboration/workplace scenes. The package may be in this project or may have just been extracted. Inspect `ASSET_MANIFEST.json`, `public/assets/team/`, and any included README before coding. Do not assume paths work until verified.
- Our public services are software engineering: custom web apps, SaaS, AI integrations and agents, mobile apps, backend/API systems, cloud/DevOps, UI/UX, testing and QA. Use the company's verified actual services; make offerings configurable.
- Our audience includes founders, startups, growing companies, and enterprise buyers looking for a reliable technical partner.
- This is a **public agency marketing website**, NOT an internal admin/dashboard product. Do not create a fake analytics dashboard or invented operational metrics.

## RELEASE STANDARD AND TRUTHFULNESS

Make every feature production-grade, not decorative. A visually impressive homepage with broken forms, fake work, nonfunctional buttons, untested mobile pages, or inaccessible controls is **not finished**. Do not invent employee names, bios, client logos, testimonials, achievements, company history, addresses, certifications, case-study metrics, or social URLs. Do not fabricate a legal business identity. Use actual business information found in verified existing project configuration; place unknown information in a centralized launch checklist and block public release of affected claims rather than publishing false details. Do not hide failures or report tests you did not run.

The 27-image pack contains AI-generated illustrative workplace scenes, and some earlier portraits may depict the same person. **Never present illustrative images as documentary photographs of real staff at real events, or depict the same person as multiple verified employees.** Support an explicitly labeled “Illustrative collaboration imagery” gallery on preview/staging and show verified staff portraits on production profiles only when their identities/permission are confirmed. Do not allow missing approvals to erase or break routes; instead preserve the pages as draft/noindex until truthful content is available.

Do **not** publish to the live custom domain without the required credentials, approved business content/legal information, successful release gates, and an explicit go-live authorization. You can complete and deploy to staging if the environment is available.

## STEP 1 — AUDIT BEFORE EDITING

1. Inspect repository root, package scripts, framework, routing, hosting, UI patterns, CSS, existing navigation, asset paths, environment variables, forms, authentication if present, content system, git status, and deployment config.
2. Preserve the current framework and working functionality. Avoid a risky framework rewrite. If the project is Astro, keep Astro/TypeScript/Tailwind if installed; use other existing framework conventions otherwise.
3. Identify dead links, unfinished sections, visual inconsistencies, obsolete marketing-agency copy, hardcoded placeholders, fake content, broken imports, accessibility problems, duplicate routes, and missing production settings.
4. Inspect all 27 image assets; build an inventory including member slug, file path, dimensions, format, and whether they are verified portraits or illustrative scenes. Validate actual bytes and signatures and look for duplicates. Do not count a manifest entry as proof an image loads in the browser.
5. Review what the public website already does and build a short implementation checklist in `docs/launch-audit.md`. Then **execute the repairs**. Do not stop after creating that document.

## STEP 2 — UNIFIED BRAND AND VISUAL DESIGN

Design language:
- Background `#090713`; secondary `#151027`; raised cards `#1C1533`; deep purple `#6D28D9`; primary purple `#8B5CF6`; lavender `#C084FC`; primary text `#F8F7FF`; muted copy `#A7A0BD` with accessible contrast.
- Heading font: Space Grotesk/Sora or the site's existing suitable typeface. Body: Inter or equivalent. Use fluid type, clear hierarchy, natural copy line lengths and generous spacing.
- Component library: accessible header/mobile menu, buttons/links, page hero, section heading, service cards, technology chips, project cards, team cards, photo gallery, accordion, input/select/textarea, success/error states, footer, breadcrumbs, 404 and feedback states.
- Cinematic homepage hero: full-width photographic composition with a real-world engineering/team environment mainly on the **right**, dark readable negative space and real HTML headings/buttons on the **left**, subtle purple accents. Images are visual assets, not entire webpage screenshots. Build a mobile-optimized composition, including actual image crops and fallback.
- Brand logo: use approved existing company logo and name; do not silently use `Nexora`, `Circlify`, or any name from earlier reference screenshots as our legal identity. If missing, use a clearly identified temporary neutral wordmark only on preview and add branding to blockers.
- Excellent hover/focus states; light animations only where useful, CSS transforms/opacity preferred; respect reduced motion. Avoid oversized neon effects, distorted faces, low-contrast glass cards, repeated generic layouts, animated counters with invented numbers, or unnecessary libraries.

## STEP 3 — REQUIRED PUBLIC PAGES AND REAL CONTENT

Create or complete real routes (adapt URLs only if an established URL scheme exists, then preserve redirects):

1. `/` HOME: cinematic hero (“We Build Software That Moves Business Forward.”), clear software-development value proposition, verified services overview, engineering principles, featured verified work (or do not claim past clients), technology capabilities that truly apply, transparent delivery process, collaboration imagery, team preview, FAQ, and a final inquiry CTA. All calls to action link to real destinations, usually `/contact` or `/work`.
2. `/about`: company positioning, mission, working philosophy, team culture, capabilities and links to members. Verified claims only. Use professional images, not marketing-campaign stock.
3. `/services`: software-services index. Include 8 configurable services (web applications, SaaS, AI, mobile, backend/APIs, cloud/DevOps, product design, QA/testing); create meaningful service-detail pages when consistent with existing architecture. Each needs scope, problems solved, deliverables, typical approach, constraints and contact CTA. Do not promise guaranteed outcomes.
4. `/work` or `/portfolio`: a polished portfolio listing and genuine detailed case studies with problem, role, approach, deliverables, stack, visual evidence and client-approved outcomes. If real projects are not available, **do not publish fake case studies**. Instead ship a thoughtfully designed capabilities page and keep empty case-study templates unpublished; flag verified case studies as a launch improvement.
5. `/process`: Discovery → Requirements/Architecture → Design → Development → Testing → Deployment → Support, with clear cooperation and approval stages. Avoid false claims about contractual guarantees.
6. `/team`: exactly nine role entries, editorial photo grid and links to profile pages. Show confirmed real names and pictures only when verified; unverified roles should use honest role-only presentation without fictitious identities.
7. Nine profile routes: `/team/founder-ceo`, `/team/cofounder-cto`, `/team/cfo`, `/team/project-manager`, `/team/senior-fullstack-developer`, `/team/ai-engineer`, `/team/mobile-app-developer`, `/team/uiux-product-designer`, `/team/qa-devops-engineer`. Each contains accessible breadcrumb, title, portrait if verified or labeled illustrative visual if not, responsibilities, verified expertise, a natural summary, **two collaborative work images**, and other-team navigation. Avoid fabricated personal first-person quotes and fake education/employment history. If needed, keep profiles staging-only/noindex until names and photo permissions are verified.
8. `/team/gallery`: visibly render **all 27 asset images** with a consistent nine-section layout (portrait + two scenes per role); use a clearly visible label explaining which images are illustrative. This page is primarily an editorial/asset review until authenticity is confirmed; noindex in preview, and only publish the gallery if it can be honestly presented to customers. Do not hide the images in unopened tabs/carousels.
9. `/insights` plus article pages: genuinely helpful, reviewed technical content from Markdown/content collections. Use actual authors when known, date, categories, article navigation, code formatting, related posts and meta tags. Do not publish generic AI draft articles as actual researched thought leadership. A concise, accurate initial content set is better than fabricated statistics.
10. `/contact`: functioning inquiry form and trustworthy business contact details, service selector, email, company, project description, timeline and budget options (if useful), privacy notice, clear success/error states and practical next-step messaging.
11. `/privacy`, `/terms` if necessary, cookie/consent information when relevant, and a polished custom `/404`. Legal pages must be populated with verified company/jurisdiction/data-processing information and reviewed appropriately; never present generic legal placeholders as finalized legal advice.

Navigation and footer must accurately reflect the pages that are live, have no dead links, and work with keyboard, touch and screen readers. Responsive layouts from small mobile through large desktop must look intentionally designed—not merely shrink desktop cards.

## STEP 4 — EXACT 27-IMAGE INTEGRATION, WITH VISIBLE PROOF

Confirm these exact slug folders exist under `public/assets/team/`:

```
founder-ceo
cofounder-cto
cfo
project-manager
senior-fullstack-developer
ai-engineer
mobile-app-developer
uiux-product-designer
qa-devops-engineer
```

Each folder must contain:
```
portrait.webp
work-01.webp
work-02.webp
```

For ordinary static public hosting, the browser URL for `public/assets/team/founder-ceo/portrait.webp` is `/assets/team/founder-ceo/portrait.webp` (account for configured base paths). Do NOT use `/public/assets/...` in HTML.

Implement a typed, centralized `team` data source (or equivalent for the existing stack) carrying id, slug, exact role, verified name, intro, responsibilities, actual verified skills, portrait source and identity/permission status, two work image sources and illustration status, links, and publication state. Use one source across Home/About/Team/profile routes. Validate that roles and image mappings cannot drift.

**Visibility contract:**
- `/team`: all 9 portraits displayed as real image elements, or verified-role presentation where portraits are not approved. On staging asset-review mode, all 9 portraits can appear with explicit illustration/unverified labels.
- Each individual profile: 1 associated portrait + **2 unique work scenes**, visibly present in document flow.
- `/team/gallery`: **27 distinct `<img>` elements**, 9 groups of 3, all visibly rendered without opening a tab. This is the required full visual verification route, and can remain noindexed staging-only if authenticity has not been approved.
- Home/About: at least 3 suitable work scenes in an editorial teamwork section, not just abstract shapes.
- No broken URLs, repeated wrong member image, CSS `display:none`, perpetual `opacity:0`, missing lazy-load triggers or overflow cropping all people out.
- Use `object-fit`, carefully tuned `object-position`, `width`/`height` or reserved aspect ratio, `srcset` or framework image optimization, WebP, alt text, lazy-load below-the-fold, appropriate eager priority for hero/LCP assets, and no forced upscale.
- The 18 scenes are conceptual collaborative images; do not claim to show the real nine specific employees.

## STEP 5 — FUNCTIONAL LEAD COLLECTION (REQUIRED BEFORE GO-LIVE)

Audit the existing contact form. Integrate a **real** working delivery mechanism through the configured backend, email provider, or suitable form service; choose the simplest secure approach compatible with the current stack. A `mailto:` link may supplement the form but must not be the only delivery method for a claimed working inquiry form.

- Real client + server/provider validation; sanitize safely; limit sizes; honeypot and practical spam/rate-limit protection; prevent duplicate submissions where possible; CSRF safeguards if applicable.
- Private keys only in server-side environment; never bundle secrets in frontend or commit them. No fake success notification before the provider confirms acceptance.
- Test an actual safe end-to-end submission in the configured staging environment and verify its destination (inbox/service dashboard). Avoid using actual customer data in tests.
- Privacy consent/information, minimum necessary retention, spam policy, and email notifications must reflect actual setup.
- If credentials or recipient business email are unavailable, implement the provider adapter, `.env.example`, clear error handling, tests with mocked service, and document **CONTACT FORM NOT LIVE — GO-LIVE BLOCKER**. Never claim it works in production until verified.
- All other buttons and interactive components must perform meaningful real actions. No inert pricing, CTA, booking, social, filters, FAQ or portfolio controls. Remove UI for unconfigured external destinations rather than faking actions.

## STEP 6 — SECURITY, PRIVACY AND RELIABILITY

- Audit dependencies for known relevant vulnerabilities; upgrade safely and document remaining risks.
- Secure contact endpoints against abuse, input injection, excessive payloads and information leakage; do not log submitted sensitive personal data unnecessarily.
- Configure deployment HTTPS, security headers (e.g. HSTS when HTTPS is in place, content-type protection, referrer policy, reasonable CSP without breaking legitimate assets), and sensible cache behavior.
- Error handling: no uncaught exceptions or runtime blank screens; helpful form, 404 and unavailable-service states.
- Add only necessary analytics, such as a privacy-aware provider, and configure consent behavior according to applicable requirements; if none configured, do not claim analytics are tracking.
- Do not implement authentication, custom user-data storage or payment collection merely for decorative pages. Avoid exposing admin routes or debug tools in production.
- Provide a release checklist for domain ownership, DNS, HTTPS, official business email, and provider keys.

## STEP 7 — SEO, PERFORMANCE AND ACCESSIBILITY

- Unique accurate title/description per real public page; canonical URLs from configured official domain; Open Graph/Twitter metadata with **real** configured images; sitemap; robots.txt; internal links; JSON-LD Organization/ProfessionalService where details are verified, plus Article for published articles; no fake review/rating markup.
- Noindex staging, image-review galleries (until approved), and draft/unverified people/case-study pages. Avoid indexing duplicate content or accidental public preview routes.
- Use semantic HTML, skip-to-content, consistent headings, labeled forms, accessible accordion/menu controls, keyboard navigation, focus rings, correct aria attributes, contrasts sufficient for WCAG 2.2 AA, image alternatives, non-motion alternatives and minimum comfortable touch targets.
- Avoid layout shifts, bloated bundles, render-blocking unused JS, oversize images and unbounded animation. Run Lighthouse/Web Vitals when possible. Target strong real outcomes (e.g. Lighthouse >=90 in Performance/Accessibility/Best Practices/SEO on representative pages, LCP <=2.5s, CLS <=0.1, INP <=200ms where measurable), but **record observed results** and make no unsupported score claims. Document measurement context and remaining bottlenecks.

## STEP 8 — CONTENT, CONFIGURATION AND MAINTAINABILITY

Keep one central configuration/data layer for brand name, official domain, legal details, contact email and recipient, social links, site navigation, offerings, tech stack, nine members, approved projects, article publication state and image approval status. Keep values genuinely editable without hunting through components. Prefer existing content collection/Markdown architecture and structured, typed data. Do not build a full CMS/admin system unless one is actually needed.

Create/refresh:
- `.env.example` with names and usage of settings, **no real secrets**.
- `README.md` with exact local install/dev/build/test/deploy commands for this actual project.
- `docs/launch-audit.md`, `docs/qa-report.md`, `docs/production-launch-checklist.md`, `docs/content-approval-needed.md`, `docs/asset-attribution.md`.
- `docs/architecture.md` only as needed to explain real design decisions, not a theoretical specification.

Ensure the project's scripts include sensible equivalents of typecheck/lint/build/unit/e2e tests and run them; do not invent npm script names or report nonexistent commands.

## STEP 9 — REAL QA / RELEASE GATES

Set up or use Playwright (or existing browser E2E framework) for actual browser testing when available, and add meaningful automated smoke tests. Check desktop + mobile (at least 375, 768, 1024, 1440px, ideally 1920px). Test:

1. All public navigation and footer destinations, redirects and 404.
2. Homepage hero/visual crop, working CTA, mobile nav opening/closing via keyboard and touch.
3. Every primary page at real viewport widths; no clipping, horizontal overflow or overlapping headings/buttons.
4. Team page exactly nine roles. Nine profile routes. Gallery exactly 27 visible image elements. All 27 image URLs return successfully; image `complete === true` and `naturalWidth > 0`; images have useful alt text and size.
5. All accordions/filters, links, focus management, active nav and previous/next team navigation.
6. Contact form invalid submission, validation messages, loading, confirmed success, server/provider error, anti-spam behavior, and actual staging delivery once credentials exist.
7. Published-page SEO tags, canonical URL, sitemap and robots behavior, noindex draft pages, social preview assets.
8. Console errors, hydration errors, server exceptions, failed resource requests and important security headers.
9. Accessibility checks using axe or equivalent plus manual keyboard testing; review contrast, reduced motion and image text alternatives.
10. Production build, types/lint, representative unit tests and end-to-end smoke tests. Save screenshot artifacts/report where supported.

Fix defects rather than documenting obvious bugs as acceptable. Re-run failed checks. If browser tools are not available, add runnable test scripts and openly report that visual/E2E verification was not performed; treat that as an outstanding release gate, not a pass.

Define **DONE** strictly: no dead routes; no broken assets; 27-image verification complete; no fake or misleading public claims; all configured CTAs/forms functional; responsive QA performed; build/lint/types/tests passing; deployment behavior tested; real business/legal/contact details approved. A development server starting successfully is **not** proof of production readiness.

## STEP 10 — DEPLOYMENT AND GO-LIVE

Keep existing hosting configuration. If Cloudflare Pages is already selected, use correct output directory, environment configuration, preview deployments, domain setup, HTTPS and caching; otherwise respect existing hosting and explain the exact deployment procedure for this repo. Prefer Git-based repeatable deployments. Add CI checks if appropriate, without needing new paid services by default.

Perform a **staging deployment** only if repository/platform integration and permissions are already available, then run the staging smoke test against its actual URL. Verify the correct official domain and business mailbox are configured before live cutover. Do not modify DNS blindly. Do not declare “launched” until the live URL is reachable, TLS valid, form submission delivered, indexing configured and release checklist signed off.

If external credentials, official domain, actual approved employee photos/names, verified company identity, legal policy details or genuine portfolio content are absent, complete the code and staging-ready site **as far as possible**, then produce a concise **BLOCKERS TO OFFICIAL LAUNCH** list with exact action required. Do not claim these missing elements have been completed.

## EXECUTION PROCESS (DO THIS NOW)

Phase A: repository/asset audit and immediate fixes.
Phase B: cohesive design system and production homepage.
Phase C: complete services, about, process, work, blog, contact and legal/navigation pages.
Phase D: nine team profiles, gallery and **all 27 images** in working components, with truthful illustrative/verified labels.
Phase E: real contact delivery integration, analytics/SEO/accessibility/security/performance.
Phase F: automated and browser QA, iterate on defects, build and staging validation.
Phase G: documentation, release-ready summary and exact launch blockers.

Use your available tools and implement code changes directly. Do not stop at mockups, screenshots, text-only descriptions or a list of proposed steps. If a step is genuinely blocked by an inaccessible external account, continue completing independent work and state the precise limitation, rather than fabricating a result.

## FINAL HANDOFF FORMAT

Provide a factual report at the end of your coding work:
1. Summary of production changes made and routes shipped.
2. Team/image inventory: 9 portraits + 18 collaboration scenes, visible on which routes, and browser asset verification outcome.
3. Contact form provider, integration status, live submission test evidence (or blocker).
4. Typecheck, lint, build, unit/E2E and accessibility results with actual commands/results; screenshots if collected.
5. SEO, security, performance and responsive QA status; unresolved defects.
6. Staging/live URL only if actually deployed and opened successfully.
7. **BLOCKERS TO OFFICIAL LAUNCH**, ranked by severity, with exact credentials/approvals/content needed.
8. Exact final steps for me to connect domain, business email, approve content and authorize go-live.

**START AUDITING AND IMPLEMENTING IN THIS EXISTING REPOSITORY NOW.**
