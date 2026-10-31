# Vortex Digital — Site-Wide Premium Animation & Interaction Polish

**Cursor Agent implementation prompt**  
**Project:** `/home/ubuntu/Documents/website`  
**Stack:** Astro 7.3.x, TypeScript, Tailwind CSS v4, existing global CSS, static production build  
**Current content architecture:** local-first Astro; Directus 12 and PostgreSQL installed separately, with `local`, `cms-shadow`, and gated `cms` modes; do not cut over or change CMS data.  
**Mission:** Improve the perceived visual quality of **every existing public page and reusable UI component** through a coherent, premium motion system—not a redesign, a new frontend, or an explosion of constant flashing effects.

---

## EXECUTION CONTRACT — Read first

You are working inside a functioning, owner-reviewed Vortex Digital website. **Implement real code changes and real tests.** Do not stop after writing a plan or suggesting animations. Inspect the current files and git status before changing anything. Respect existing uncommitted work; do not reset, overwrite, or discard it. Preserve the existing dark-purple brand identity, content ownership, page hierarchy, and approved media.

Work directly on the existing Astro site in `/home/ubuntu/Documents/website`. This is a **standalone UI polish phase** that can be executed independently of the remaining CMS steps; do not alter their status or begin a new CMS phase.

**Nonnegotiable safeguards:**

1. Do not modify or wipe Directus/PostgreSQL data, permissions, Docker Compose, database volumes, CMS releases, `ACTIVE.json`, immutable snapshots, `.env`, credentials, or approved publication flags. Do not run `cms:release:activate` / `rollback` or switch the operational `CONTENT_SOURCE` to `cms`.
2. Local content mode remains the default. The current public content and existing Astro routes must remain intact. Do not create or publish new content just to showcase motion.
3. Preserve **all six approved portfolio case studies** and their exact attribution, links, screenshots, order, and publication behavior; preserve **all nine named team profiles** and owner-approved portraits, especially Adrian Cruz and Matheus Pereira's distinct images. Preserve **all eight services**, **all twelve unpublished Insights drafts**, and gallery/publication safeguards.
4. Preserve the owner's **current 30-second homepage MP4** at `public/videos/vortex-team-showcase.mp4`, its poster and illustrative-scenes disclosure. No video autoplay, no file replacement/re-encoding, and no added loading on initial page visit.
5. Preserve Contact's **copy-only inquiry** behavior: no fake send confirmation, no endpoint, no email configuration, no misleading button action; validation, focus, clipboard fallback, and no-JS truthfulness must keep working.
6. Do not change the domain, DNS, `PUBLIC_SITE_URL`, business email, contact delivery, SMTP/Formspree, hosting, analytics, legal terms, deployment, or the public CMS permission model.
7. Keep all animations accessible, responsive, performant, and progressively enhanced. **No rapid flashes, strobes, bright white full-screen pulses, aggressive parallax, nausea-inducing camera movement, or perpetual motion on every card.** The pre-existing homepage white-light exposure animation must remain subtle and safe. If it is currently too flashy, reduce intensity rather than adding another flashing layer.
8. No invented team footage, testimonials, employee claims, clients, performance scores, or test outcomes.
9. Do not install GSAP, Framer Motion, Lenis, locomotive-scroll, large motion packages, or new client frameworks by default. Favor Astro, CSS, a small native `IntersectionObserver` helper, and progressive enhancement. Any dependency requires clear justification and owner approval; normally **zero new dependencies**.
10. Do not redesign the information architecture, rewrite content, or change page templates merely to make an animation convenient. Do not begin a subsequent step.

---

## 1. REPOSITORY AUDIT & MOTION INVENTORY

Before editing, inspect the actual repo. At minimum inspect:

- `src/pages/index.astro`, `/about`, `/process`, `/services/index`, `src/pages/services/[slug].astro`, `/portfolio/index`, `src/pages/portfolio/[slug].astro`, `/team/index`, team profile dynamic route, `/team/gallery`, `/insights`, `/contact`, `/privacy`, `/terms`, `/404`.
- `src/layouts/BaseLayout.astro`, global stylesheet, Header, Footer, shared CTA/section components, cards, breadcrumbs, hero, team and portfolio widgets, video showcase, forms, galleries/dialogs, mobile menu, FAQ/accordion if present.
- Existing CSS reveal classes, animation/IntersectionObserver scripts, `prefers-reduced-motion`, focus styling, sticky header, carousel/scroll logic, media queries, image `loading` and aspect-ratio handling.
- Relevant Step 9E / 9F and 10A–10D reports and tests. The user may already have a site-wide homepage lighting effect; **inspect and retain it** rather than layering over it blindly.
- `package.json`, Playwright configuration, unit tests, CSS build size, and any outstanding test failures. Determine whether a Step 10E branch is in progress; preserve it without replacing its work.

Create a brief internal inventory: what already animates, which elements are static, which components appear repeatedly, where animation causes or could cause layout shift, and which interactive components are fragile. Identify design issues that can be improved by spacing/transition polish **without silently changing layout or content**.

## 2. DEFINE ONE CONSISTENT MOTION DESIGN SYSTEM

Implement CSS custom properties or equivalent existing token-based patterns in the existing design system, e.g.:

- `--motion-duration-fast` around 140–220 ms for hover/focus/press feedback.
- `--motion-duration-normal` around 300–500 ms for reveal and panel transitions.
- `--motion-duration-emphasis` around 550–850 ms for a small number of hero sequences.
- `--motion-ease-standard`, `--motion-ease-out`, and a gentle spring-like cubic-bezier for cards (CSS only, no library).
- A small stagger interval around 50–90 ms, with a strict cap so large lists do not wait for an elaborate sequence.

These are **guidance**, not hardcoded universal delays. Prefer motion of `opacity` + `transform` (GPU-friendly) over `top/left/width/height`, filter animation, `box-shadow` animation, or huge blurred layers. Prefer a small static gradient plus a subtle opacity transition for glows. Do not apply `will-change` to everything; only use it on actively animating elements when measured and necessary.

Build a reusable **motion vocabulary** through scoped classes / Astro props / `data-motion` attributes:

- `reveal-up` — gentle entrance for section titles, blocks and captions.
- `reveal-fade` — near-stationary entrance for legal text and visually dense content.
- `reveal-scale` — extremely small scale difference for images and hero/feature media, never dramatic zoom.
- `stagger-children` — cards and collection grids, capped for large collections.
- `interactive-lift` — subtle hover/focus movement (about 2–5px) for cards where meaningful.
- `interactive-glow` — restrained brand accent, no repeated animated halos.
- `press-feedback` — momentary, tactile button feedback, but never a transition that delays the actual action.
- `section-divider-motion` — optional discreet line/progress appearance, only if it looks coherent and does not create extra ornaments everywhere.

Avoid global selectors that automatically animate *all* `div`, `p`, `a`, `img`, or `button` nodes. Use explicit opt-in behavior to prevent nested animation overload. Limit main sequential hero entrance to a few elements with at most a short total reveal interval.

## 3. SCROLL REVEALS — PROGRESSIVE ENHANCEMENT & ROBUSTNESS

Build a tiny reusable animation mechanism (CSS + a single shared native `IntersectionObserver` where needed) rather than duplicating scripts on every page.

Strict rules:

- **Content is visible by default in initial server-rendered HTML and without JavaScript.** Never start with globally invisible sections that require JS to become visible. Only add an enhancement class after the observer is installed; immediately reveal nodes already in view.
- If `IntersectionObserver` is unsupported, the script fails, or JS is disabled, content remains readable and fully interactive. Consider reveal fallback / cleanup if an observer is interrupted.
- Observe meaningful containers rather than every text span or every card nested inside animated parents. Avoid hundreds of observers and unnecessary layout reads.
- Once an element has entered view, reveal it and unobserve it; do not repeatedly hide/replay it on every scroll.
- Ensure keyboard navigation to a below-the-fold control is **not obscured** by an unrevealed ancestor. Focus, `:focus-within`, anchor navigation, `scrollIntoView`, and `find-in-page` should expose content immediately.
- Anchor fragments, back-forward cache restore, and programmatic screenshots must not become blank or inconsistent.
- Reduce JavaScript use; a CSS-only solution is preferable for simple hover/focus effects.
- If adding lifecycle listeners, avoid duplicates and memory leaks when navigating; do not introduce Astro `ClientRouter` or SPA transitions just to add animation. They could break existing Astro scripts and Contact behavior.

## 4. PAGE-BY-PAGE IMPLEMENTATION MATRIX

Apply the motion design system to every existing page family, using the **actual components** and adapting to their markup. Do not skip page families simply because they use dynamic routes. Treat the list below as a minimum, not permission to invent sections.

### Home (`/`)
- Hero eyebrow, H1, description and CTAs: short, intentional fade/translate sequence that looks strong immediately, even before animation finishes; preserve existing hero photograph, premium white-light exposure/purple ambient effect and legibility.
- Hero background accents: static first paint, optional calm ambient animation, no distracting flashes and no large paint-heavy effects.
- Existing six featured portfolio cards, services, team preview, process/benefit sections, testimonials or stats **only if actually present**: scroll reveal for sections and gentle stagger for repeated cards.
- Video showcase below hero: animate **the surrounding section heading/frame into view**, never autoplay or start video while scrolling; native playback controls always accessible. Keep poster and MP4 behavior unchanged.
- CTA and footer: restrained reveal and interaction transitions.

### About (`/about`)
- Hero copy and existing photos: complementary stagger and gentle image entrance without layout shift.
- Mission/vision/values and any relevant story cards: consistent reveals, restrained interactive feedback where clickable.

### Services (`/services` + **all 8 service detail routes**)
- Intro/hero title and description, overview cards, feature/technology lists, process steps, CTAs: accessible and consistent reveals/staggers.
- Existing service visuals: subtle reveal only; do not animate SVG diagrams into misleading states or change their content.
- Preserve CTA routing and `?service=<slug>` prefill on Contact.

### Portfolio (`/portfolio` + **all 6 case studies**)
- Filter buttons/tags (if present): clear hover/focus/selected states with no confusing movement.
- Project cards: gentle raise / border-glow on hover and equivalent keyboard focus, plus first-entry reveal.
- Case-study hero, contribution copy, three-image galleries, technology chips, related projects: gentle stagger/reveal without hiding content or changing approved images/attribution.
- Existing image-enlarge dialog: preserve focus trapping/return, Escape close, native dialog semantics, and lazy image loading; add only a safe subtle dialog transition if browser-compatible.
- Avoid moving gallery images under user's pointer during interaction.

### Team (`/team` + **all 9 team profile routes** + `/team/gallery`)
- Member cards, portrait frames, name/role copy: deliberate stagger with hover/focus feedback, no morphing or swapping photos.
- Individual profile hero, biography sections, expertise chips, next/previous navigation: light reveals, readable text, no distortion of photos.
- Gallery images and illustrative scenes: nuanced image reveal without implying scenes are real company meetings. Do not change their captions, filenames or approval context.

### Process (`/process`)
- Existing process timeline/cards: staged reveal in visual reading order, but all steps remain legible at all times. No scroll-jacking or lines that require scrolling past content to read.

### Insights (`/insights`)
- Animate the existing **truthful empty state** and any standard page sections only. Do not reveal the 12 private article titles, slugs, excerpts, or routes.
- For a future approved-public article page, apply the same safe reading-oriented motion styles without turning private drafts public.

### Contact (`/contact`)
- Animate page header, notes and form card on entrance only; do **not** animate fields individually on typing, validation, paste, or clipboard use.
- Preserve focus, live status, errors, `aria-invalid`, `aria-describedby`, and keyboard tab sequence.
- Give button and status states unobtrusive feedback but **never imply a send**. Clipboard fallback must remain visible and usable even with reduced motion and JS failure.

### Legal (`/privacy`, `/terms`) and `/404`
- Very modest intro fade or no reveal for long reading content. Legal text should always be readable immediately.
- 404 title / CTA may use a small entrance. Do not animate every paragraph or hide policy text behind IO.

### Shared layout
- Header/sticky nav: micro-interactions for links, mobile menu toggle/open/close, focus/active route indicators, but preserve current scrollable menu at 200% text.
- Footer: hover/focus link transitions and restrained entrance if practical; never hide contact/legal links.
- Buttons, badges, text links, inputs, breadcrumbs, galleries: consistent hover/active/focus transitions, but no motion for purely decorative text or inaccessible controls.

## 5. DESIGN QUALITY — WHAT GOOD LOOKS LIKE

Site must feel **premium, sophisticated, fluid, and intentionally animated**, retaining dark background and violet gradients (`#090713`, `#151027`, `#1C1533`, `#8B5CF6`, `#C084FC`, `#F8F7FF`). Motion reinforces hierarchy, not distracts from content.

- Consistent timing and easing, with deliberate differences for heroes/cards/microinteractions.
- No strange elements flying across the page, unexpected bouncing, overuse of neon, excessive glowing on every card, or flashes resembling camera strobe.
- Visibly polished at first paint, not a blank page while animations stage in.
- Hover effects never become the sole indication of interactivity. Focus must be clearly visible and keyboard interactions equivalent.
- Avoid perpetual oscillation; any ambient hero effect should be subdued and paused under reduced motion.
- Avoid changing color palette, fonts, content hierarchy, portrait crop, video source, CTA destinations, or current responsive grid layout.
- Use only CSS and small JS where it genuinely helps. Keep motion settings in one maintainable place rather than hundreds of inline styles.

## 6. ACCESSIBILITY REQUIREMENTS

- Honor both `@media (prefers-reduced-motion: reduce)` and JS `matchMedia` if JS is used. Under reduced motion, **disable all non-essential animation**, remove delays, avoid smooth scrolling/parallax, keep content visible, preserve interaction state changes.
- Do not use bright exposure flashes or rapid luminance changes. No flicker/strobe effects, especially in the hero photo; if existing pulse is intense, tone it down.
- Ensure animation is not needed to understand content or to complete tasks; provide a nonanimated equivalent.
- Never disable or hide accessible focus outlines; hover/focus parity.
- Respect sticky header offsets and screen reader reading order; don't create hidden duplicate text layers or `aria-hidden` copies.
- For dialogs, forms, mobile menu and video controls, preserve accessibility behavior and native semantics; don't block pointer events while reveal animation runs.
- Keep important text content readable while moving (small distance, short duration). Limit motion in image galleries and team portraits.

## 7. PERFORMANCE & PRODUCTION ENGINEERING

- Establish a **before baseline** from the current production build and existing site quality scripts where possible. Measure/record CSS and JS output sizes (raw and transferred if feasible), console errors, layout shifts, and initial resource requests; distinguish lab measurements from Lighthouse / Core Web Vitals.
- Use CSS transforms/opacity. Avoid filter/blur/box-shadow animations that repeatedly trigger expensive painting on large surfaces, and avoid long lists of composited layers.
- No new network fonts, animation services, CDNs or heavy packages.
- Preserve original image dimensions, WebP `<picture>` optimizations, responsive layout placeholders, lazy loading, poster and video preload settings.
- Video MP4 must **not** download before user playback (as already tested).
- Avoid animation-induced CLS, horizontal overflow, clipped text, excessive battery use and scroll jank. Avoid needless rerenders.
- Test with reasonable CPU/network throttling where available; document conditions and don't invent metrics.
- A pre-existing one-off homepage lighting animation must not compound with a new reveal to create jarring exposure spikes.

## 8. RESPONSIVE / INTERACTION / CONTENT MODE QA

Check **every existing route family** and preferably every built route, at widths **320, 375, 768, 1024, 1440 CSS pixels**, with **200% root text scaling** at representative small and medium viewports. Prefer reuse of `scripts/site-audit.mjs` and existing Playwright coverage instead of adding brittle screenshot-only checks.

Verify:
- No horizontal scroll, clipped heading/cards, squashed portraits, obscured CTAs, overlapped sticky header, or menu overflow.
- All content readable with JS disabled and reduced motion enabled.
- Keyboard: skip link, menu open/close/Escape, cards, accordions (if any), gallery dialog open/close/focus return, form controls, video player link.
- Contact: invalid focus + errors, valid **Copy inquiry**, clipboard failure fallback, no falsely sent message and no new network POST.
- Services → Contact safe query prefill.
- Team/portfolio counts, routes, case-study fidelity, team portrait distinctness.
- Insights 12 drafts stay absent from production HTML/JS/sitemap; `/insights` stays truthful.
- 30-second homepage MP4, poster and disclaimer stay intact and does not autoplay.
- Page navigation/anchor links back-forward behavior and no animation hidden states persisting after navigation.
- Existing local build: 35 pages / 31 sitemap URLs was Step 10D baseline. If current tree legitimately differs, document the reason; do not fabricate parity by hiding pages.
- `CONTENT_SOURCE=local` remains default. `cms-shadow` must continue to render local HTML; only check shadow if the current development environment supports it without mutating data. Do not activate any real CMS release or change editorial flags. Run a real `cms` build **only if** an already approved release exists and the owner explicitly authorizes it; otherwise skip intentionally.

## 9. AUTOMATED TESTS TO IMPLEMENT

Add or extend robust unit and E2E checks to cover at least:

1. Reduced motion disables all nonessential visual animation and does not hide content.
2. JS-disabled page still exposes all important text, links and forms.
3. Scroll reveal occurs once when supported and leaves a visible final state; no elements remain permanently hidden.
4. Navigation, hero CTAs, member and project cards remain functional while animation is active.
5. Contact validations / focus / copy-only semantics remain unchanged.
6. Portfolio dialog, mobile menu, carousel or accordions continue working.
7. No unexpected 404, extra unpublished insights or new publicly exposed draft media.
8. Hero video does not autoplay or download prematurely.
9. No desktop/mobile overflow at tested widths and 200% scaling.
10. No new console errors, unhandled promise rejections, blocked focus or unnecessary dependencies.

Run existing scripts, capturing **actual command output**:

```bash
npm test
npm run check
CONTENT_SOURCE=local npm run build
CI=1 npm run test:e2e
```

If `CI=1` uses an unavailable browser or port, diagnose the test configuration and use a **production `astro preview`** on an available local port; never mistake a dev-server E2E mismatch for an actual production regression. Verify scripts against the repository rather than trusting historical assumptions.

Optional read-only mode checks, if properly configured:

```bash
CONTENT_SOURCE=cms-shadow npm run build
npm run cms:shadow
```

Do **not** run destructive Docker/CMS/release commands. Do not deploy.

## 10. ACCEPTANCE CRITERIA

Step is complete only when:

- A consistent motion vocabulary exists and is reused instead of dozens of unrelated animation patterns.
- Every existing page family has an audited and intentional animation/microinteraction treatment (some reading-sensitive elements may intentionally remain static).
- Headings, cards, imagery, CTAs, navigation, galleries, team, portfolio, services, process and form receive context-appropriate polish.
- No content is trapped behind JS or IO; reduced motion / no JS / keyboard still work.
- The site retains its existing design, approved content, routes, media and publication protections.
- The current owner-selected **30-second** MP4 is preserved and user-initiated.
- All required tests pass. Any failure is explained and corrected in scope, not waived.
- Performance and responsive regressions are checked with evidence, not assumed.
- Directus, PostgreSQL, CMS releases, domain, business email, contact delivery and deployment are untouched.

## 11. REQUIRED FINAL DELIVERABLES

Create these files in the existing project root (or clearly referenced docs location):

1. **`SITEWIDE_MOTION_IMPLEMENTATION_REPORT.md`** — executive summary, before-state audit, every changed file, exact animations applied, interaction handling, test commands/results and remaining limitations.
2. **`SITEWIDE_MOTION_DESIGN_SYSTEM.md`** — motion tokens, easing/duration patterns, reusable classes/attributes, guidelines, reduced-motion behavior, JS-fallback strategy, maintainers' usage examples.
3. **`SITEWIDE_MOTION_PAGE_MATRIX.md`** — each route family and its component-level animation treatment, coverage and exceptions (e.g. legal pages), responsive checks.
4. **`SITEWIDE_MOTION_PERFORMANCE_AND_A11Y_AUDIT.md`** — before/after relevant CSS/JS weight, observed CLS/overflow/console and motion accessibility checks, any manual test gaps, no invented Lighthouse scores.
5. Screenshot evidence under `docs/sitewide-motion-qa/` for key routes, 375px/1440px, reduced motion, menu/form/video where feasible. Avoid generating mockups; screenshots must come from the running site.

In the main report, make the final status one of **PASSED**, **PARTIAL**, or **BLOCKED**, with transparent evidence. Preserve current modified files and any existing reports. **Stop after this animation task; do not advance the CMS roadmap or deploy.**

---

## FINAL DIRECTIVE TO CURSOR

Implement the premium site-wide animation polish **now** in the existing Astro repository. Use existing components, minimize code and network overhead, verify every important interaction, preserve local-first CMS safety and the exact approved content. **This should make the website look more alive without making it harder to use.** When complete, produce all five deliverables and stop.
