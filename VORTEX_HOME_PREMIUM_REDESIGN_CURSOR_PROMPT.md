# Vortex Digital — Homepage Premium Redesign & Motion System

**Implementation prompt for Cursor Agent**  
**Project:** `/home/ubuntu/Documents/website`  
**Frontend:** Astro 7 / TypeScript / Tailwind CSS v4  
**Scope:** Home page only, plus carefully reusable UI primitives if necessary  
**Input reference:** Owner-provided full-homepage PDF screenshot captured 2026-11-01

## Mission

Redesign the EXISTING Home page into a premium, distinctive, dynamic software-development-agency experience. Build a **product-first, editorial homepage** that showcases Vortex Digital's real work and team, with subtle interactive 3D depth and purposeful animation. Do **not** merely attach generic animation classes to the existing sections or introduce arbitrary neon spheres, orbit rings, particle swarms, fictional dashboards, or fake statistics.

The current homepage has a strong dark-purple base but a weak visual hierarchy: a large illustrative office hero and illustrative team video appear before proof of software delivery; many sequential sections repeat a heading + grid of equally sized cards; there are two collaboration/storytelling sections; portfolio work is buried mid-page; and extensive whitespace plus dense text make the page feel long. The redesign must solve the **structure and storytelling** problem first and use motion to support that structure.

## Read and protect the repo first

1. Inspect current `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`, all homepage components, navigation, tests, and `src/lib/content` CMS / local-source adapters.
2. Inspect `SITEWIDE_MOTION_IMPLEMENTATION_REPORT.md`, `SITEWIDE_MOTION_DESIGN_SYSTEM.md`, `SITEWIDE_MOTION_PAGE_MATRIX.md`, and Step 10C/10D integration reports if present.
3. Capture the existing homepage at 1440px and 375px before edits; preserve image/video and content-source behavior.
4. Make a local reversible checkpoint in Git or a clearly named diff/backup **without overwriting uncommitted user work**. Do not discard working changes.
5. Ensure Home works with `CONTENT_SOURCE=local` by default, and preserves CMS-mode home rendering from `ACTIVE` release snapshots. If a section uses mapped CMS fields, consume the existing content adapter rather than hardcoding a second content source.

## Visual design — use real software, not abstract AI shapes

Keep Vortex Digital's recognizable premium dark-purple brand, round logo, typography identity, and button hierarchy, but increase visual contrast and variety:

- Surfaces: near-black ink, deep-plum raised surfaces, a small number of luminous violet accents, **occasional contrasting editorial panel** to prevent an uninterrupted dark/card grid.
- Clear hierarchy: large short headings, readable 16–18px body text, less redundant copy, generous but **controlled** section spacing.
- Warm white on dark for primary text; accessible muted copy; crisp borders rather than heavy generic glows.
- Use asymmetric editorial/bento layouts instead of eight identical cards repeated through the entire page.
- Use only the six already approved project screenshots, confirmed team portraits, existing 30-second video/poster, and other approved assets. No invented client brands, product UIs, employee identities, office claims, testimonials, awards, or performance metrics.
- Preserve honest illustrative-scene labeling in a quiet, visible caption; do not imply the illustrative office photo or film depicts a verified real company event or office.

## Proposed new homepage information architecture

Do not delete real approved records from source data or CMS. Consolidate duplicate content on the **homepage** and link to full detail pages instead of repeating it in enormous grids.

### Section 1 — Product-first hero (highest priority)

Replace the giant office-photo-as-main-value-proposition with a two-column hero built around real digital products:

**Left:**
- Existing/software-development-for-startups positioning, sharpened if necessary without changing factual meaning.
- One clear headline of 2–4 short lines and one concise supporting paragraph.
- Primary CTA: `Start Your Project` (existing destination and functionality).
- Secondary CTA: `View Our Work` (existing `/portfolio/` route).
- Quiet proof row using only verified factual counts, if desired: 6 approved case studies, 8 service specialties, 9 team profiles; this is not a claim of customers or project outcomes.

**Right:**
- An interactive layered **product showcase** comprising actual approved project screenshots. Suggested mix: a browser-like desktop preview for ScaleUp Systems or Gain Energy, a phone-like display for MedaStaré, and a third optional approved screenshot.
- CSS `perspective` and transform layers for dimensionality, not fake complicated 3D geometry.
- Very restrained pointer parallax, slight device-card tilt, soft light falloff, and a visible focus/keyboard accessible switcher for 2–3 featured projects.
- Each featured preview links to its genuine published case-study page. Do not create unrelated showcase pages.
- Avoid carousel autoplay; user-controlled switches with static fallback are preferred.

Height target: around 70–85svh at spacious desktop widths **without clipping**; allow natural content height on tablets/mobile. The hero should visibly show the product screenshot within the first viewport. Retain existing brand atmosphere with one diffuse purple environmental light, not a blanket of glow.

### Section 2 — Work proof close to the top

Move actual approved software work immediately after the hero (or a slim proof strip). Use a spacious editorial grid: two large featured case-study panels and 4 smaller but fully navigable supporting case studies, or a similarly clear responsive layout. All six current approved case studies must remain represented or easily discoverable from this section and `/portfolio/`.

- One strong visual per project, truthful work scope, category, and technology when verified.
- Do not fabricate business outcomes, client testimonials, developer responsibilities or external awards.
- Alternate card sizes: 2 featured panels + supporting cards, not six visually equal tall text cards.
- Reveal image media using 500–650ms opacity/translate; apply 1.02 image scale and 4px surface lift on hover/focus.
- Clear `View Case Study` controls, proper keyboard focus and alt text.

### Section 3 — Eight services in a genuinely scannable structure

Keep all eight service specialties and links. Replace the current 4×2 indistinguishable-card wall with a purposeful bento / grouped module layout. Example: Web & Mobile; AI & SaaS; Backend & Cloud; UI/UX & QA. Each group visually supports its linked individual service entries so no service is removed. Optional mini UI/code/interface motif can be CSS, not fabricated projects.

Use a small animated connection line or icon on hover/focus; do not make all icons continually rotate.

### Section 4 — How Vortex builds products

Consolidate the repetitive `Why Teams Stay` and six-stage `Process` summary into one credible storytelling section: **Plan → Design → Build → Validate → Launch** (map the exact existing six stage names and semantics instead of inventing a new service process). Use a horizontal desktop progress ribbon / compact stage cards, stacking vertically on mobile.

- As the section enters, draw a line or fill a progress track **once**.
- Each step reveals 70–100ms after the previous step, with no scroll-jacking and no mandatory pinning.
- Link to `/process/` for full detail.

### Section 5 — Team story & existing 30-second film

Preserve `public/videos/vortex-team-showcase.mp4`, the existing approved 30-second content, poster, caption/disclosure, accessibility, and current playback behavior unless the owner explicitly approves a change. Display the video as an elegant editorial feature with a short title and `Meet the team` CTA. The actual nine people and distinct original portraits remain visible in a compact human-focused strip or grid with links to their profiles.

The current second collaboration-photo section can be condensed into this segment, with its illustrative captions retained where relevant; do not falsely attribute photographs of illustrative scenes to actual staff.

Do not duplicate two enormous collaboration sections just to make the page longer.

### Section 6 — Technology as supporting evidence

Keep the existing honest technology catalog, but compress the six dense boxes into an elegant compact tabbed strip / non-interactive grouped pill cloud depending on usability. Ensure all technologies represented remain accurate and do not imply unverified certifications or client results. This section should not visually compete with portfolio proof.

### Section 7 — FAQ and high-conversion CTA

Keep current functional FAQs, but improve spacing, disclosure animation, focus, and readability. Avoid animating accordion height if that creates layout jumping. The closing CTA is a strong contrasting editorial panel with a clean background and subtle light sweep, not another random orbital shape.

Keep Contact's copy-only inquiry behavior truthful; never make the site appear to submit messages or use an email address that has not been configured. Remove operational-looking placeholders from the **homepage footer** where they distract visitors, replacing them with a truthful contact-page link while preserving existing legal/functional notices.

## Motion specification — precision over volume

Define a small token system in `src/styles/global.css`, integrating with the existing sitewide motion system (don't introduce duplicate observers or override preexisting reduced-motion behavior):

| Interaction | Suggested behavior | Timing |
|---|---|---|
| Hero heading | Mask/line fade + 12–18px rise, not typewriter | 550–750ms |
| Hero CTA row | Gentle slide after title | 450–550ms, 80ms stagger |
| Hero product layers | 2–5° max pointer tilt + ±8–12px layered parallax, eased; still when idle/focus not present | pointer-driven, throttled to one rAF |
| Optional product floating | Very slow 3–5px up/down **on one layer only** | 8–12s |
| Case study media | 12px rise/fade; optional foreground image 1.02 hover zoom | 500–650ms / 250ms hover |
| Service cards | Border emphasis, translateY(-3px), tiny icon shift on hover/focus | 180–250ms |
| Process track | One-time line reveal synchronized with reading order | 700–950ms |
| Team portraits | Small grouped stagger (cap delays) | 380–500ms |
| FAQ | Icon rotation and short content transition, preserve semantics | 180–250ms |
| Final CTA | Hover/focus accent sweep, not an endless animated flare | 200–350ms |

**Hard rules:**
- Avoid opacity 0 as default resting state; content remains usable without JS.
- Animate compositor-friendly transforms and opacity; measure paint/reflow if using clip-path or backdrop filters.
- Respect `prefers-reduced-motion`; freeze all parallax, long loops, and section reveals and show static assets.
- Never force scrolling, block navigation during an intro, replay large entrance sequences on every small scroll, or implement a mandatory loading screen.
- The film is its own media element: DO NOT replace, recompress, rename, or change playback settings without authorization.
- Do not autoplay rapid-moving visuals or create bright strobing/exposure flashes.
- Require user control or pause for persistent motion; disable decorative motion in background tabs and out-of-view regions.

## Responsive design

- 1440 / 1280px desktop: asymmetrical split hero and editorial layout.
- 1024 / 768px: compress media stage; avoid crop or CTA collision.
- 375 / 320px: single-column hero with a static or lightweight layered product screenshot, visible CTA, no mouse parallax, no horizontal overflow.
- 200% zoom and large text: typography wraps naturally, product visuals do not cover content.
- All motion-backed interaction available with keyboard, touch and no-JS fallback.

## Performance, architecture, and CMS compatibility

- Prefer Astro + CSS transforms + the existing one IntersectionObserver. **Do not add Three.js as a default dependency** for the homepage; use genuine WebGL only if a clearly justified scene cannot be implemented as lightweight CSS 3D and pass explicit performance comparison.
- Progressive enhancement; server-rendered HTML first, page meaningful without JS.
- Existing 13,032,156-byte approved 30-second film should not be downloaded as an unnecessary LCP asset; preserve the user's present playback choice. Avoid preloading the entire film merely to create an entrance animation.
- Responsive hero screenshots in modern formats if assets are already permitted for transformation, with explicit `width`/`height`, `srcset`, and sensible loading priorities. Never alter original approved source media destructively.
- Lazy-load below-the-fold media; focus LCP on hero critical text and product screenshot, not the film.
- Limit per-page JS/hydration; guard requestAnimationFrame loops and pointer listeners. Don't introduce redundant motion libraries or observers.
- Target Google's good Core Web Vitals thresholds measured in context: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile in field data. Record actual lab and available field evidence rather than claiming they passed without testing.
- Test production preview on mobile CPU/network throttling where available.
- Ensure `CONTENT_SOURCE=local` remains default; CMS shadows/readers, Directus collection schema, release snapshots and ACTIVE pointer are unchanged. Test one isolated CMS fixture or previously documented fixture build to ensure homepage renders when CMS mode is selected, without activating actual CMS content.

## Workflow: actual implementation, not only a plan

1. Audit current homepage and take before screenshots (1440px, 768px, 375px).
2. Produce a brief wireframe / section ordering and identify reusable Astro components. Follow the proposed design unless conflicting with confirmed owner requirements, in which case preserve the constraint and document it.
3. Implement product-first responsive hero, including real project screenshots and accessible interactivity.
4. Redesign Work, Services, Process, Team/Film, Technology, FAQ, CTA, Footer while maintaining all required content and routes.
5. Integrate motion tokens with existing motion system, reduced-motion behavior, and static fallbacks.
6. Run automated tests and visually inspect screenshots. Fix issues rather than suppressing test cases.
7. Produce concise reports, before/after screenshots, and an explicit list of preserved behaviors or unresolved trade-offs.

### Mandatory tests

Run from `/home/ubuntu/Documents/website`:

```bash
npm test
npm run check
CONTENT_SOURCE=local npm run build
E2E_PORT=4322 CI=1 npm run test:e2e  # use a verified free preview port
npm run cms:shadow                  # if local Directus is available
```

Also verify:
- Baseline 35 HTML pages and 31 sitemap URLs in local mode unless a clearly justified change is approved.
- Six verified portfolios, nine team profiles, eight services; twelve Insights still private; no fake client evidence.
- Video remains the exact current 30s file and poster, with truthful illustration disclosure.
- All CTA links, service routing, navigation, dialog focus traps, FAQs, copy-only contact, and keyboard navigation still work.
- Touch/mobile at 320, 375, 768, 1024, 1440 widths; 200% font scaling; no horizontal overflow or CLS from media.
- No JS / reduced-motion fallback: hero and main CTA visible; portfolio cards usable.
- No console errors, broken images, unresolved CDN assets, new secrets in `dist`, or unexpected public Directus content.
- At least one CMS fixture-mode homepage build passes if safe QA fixture exists; otherwise report it as NOT TESTED (never quietly skip).
- Lighthouse mobile/desktop lab tests if available; no invented scores.

## Non-goals and protection

Do not change domain, DNS, PUBLIC_SITE_URL, business email, contact message delivery, hosting, deployment, Directus permissions, PostgreSQL, CMS releases, publication statuses, production ACTIVE, or unrelated internal page redesigns. Do not start Step 10E or Step 10F. Do not invent new case studies, employee photos, metrics, office claims, testimonials, or client endorsements.

## Required output

- `HOME_REDESIGN_IMPLEMENTATION_REPORT.md`
- `HOME_REDESIGN_SECTION_MATRIX.md`
- `HOME_REDESIGN_MOTION_AND_A11Y_AUDIT.md`
- `HOME_REDESIGN_PERFORMANCE_REPORT.md`
- `docs/home-redesign-qa/` containing before/after screenshots at desktop and mobile

**Stop after implementation and verifications. Do not deploy or activate the CMS.**
