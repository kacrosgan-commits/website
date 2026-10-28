# CURSOR AGENT — STEP 5: BUILD THE SIX-PROJECT VORTEX DIGITAL PORTFOLIO

You are the senior Astro/TypeScript engineer, product designer, technical case-study editor, accessibility engineer, and QA lead working on **Vortex Digital**, an existing software development agency website.

## Mission and non-negotiable outcome

Implement a polished, content-rich, functional portfolio using the **SIX supplied project research profiles** and **EIGHTEEN supplied, real-source promotional images/screenshots**. Do not output another design-only mockup or a written implementation plan. Make actual code and asset changes, render the supplied images, run the available tests, and write a factual report.

**Important distinction:** These six products are portfolio candidates submitted by the owner. Their public pages and screenshots do NOT, by themselves, prove what Vortex Digital developed, who contracted the work, or whether the images can be used commercially. The research draft explicitly leaves team contribution, work dates, technology ownership, and public-presentation approval unconfirmed. Build the entire case-study system and all six content-complete **internal review pages** now, but **do not publish them as Vortex Digital client work** until the owner confirms each contribution and has permission to publish the corresponding text/assets. Avoid fake client histories, case-study statistics, testimonials, metrics, and unearned credit.

This is **STEP 5 ONLY**. Steps 1–4 are complete. Preserve their working functionality.

## 1. Confirm the project and inspect existing implementation

- Brand: **Vortex Digital**; audience: **startups**; category: **software development agency**.
- Eight established services: Web Development; Mobile Apps; AI Solutions; SaaS Development; Backend & APIs; Cloud & DevOps; UI/UX Design; QA & Testing.
- Existing stack: **Astro 7**, **TypeScript**, **Tailwind CSS v4**, Astro Content Collections and MDX capability. Keep the current architecture and current portfolio slugs policy.
- Design: premium dark + purple gradient, with `#090713`, `#151027`, `#1C1533`, `#8B5CF6`, `#C084FC`, `#F8F7FF`, `#A7A0BD`; existing Space Grotesk and Inter fonts.

Read these files before editing, when present:

- `WEBSITE_AUDIT.md`, `STEP_2_REPORT.md`, `STEP_3_REPORT.md`, `STEP_4_REPORT.md`, `COMPANY_INFO_REQUIRED.md`.
- `VORTEX_PORTFOLIO_SOURCE.md` (supplied project descriptions, sources, attribution and technology uncertainty).
- `Vortex_Digital_Portfolio_Draft.pdf` (14-page visual reference; 6 products and 18 screenshots).
- `PORTFOLIO_ASSET_MANIFEST.json` (source-to-destination mapping and publication flags).
- Existing `src/content.config.ts`, `src/content/case-studies/`, `src/pages/portfolio/index.astro`, `src/pages/portfolio/[slug].astro`, `src/pages/index.astro`, `src/data/assets.ts` and portfolio components.
- Actual file tree under `public/assets/portfolio/`.

Do not overwrite previously completed About, Services, Team, and Contact work. Inspect existing content flags: old generic/sample entries remain unpublished.

## 2. Six exact project identities, source URLs, and content angles

Create six structured case-study draft entries using these **exact product names, canonical slugs, live URLs, and defensible descriptions**:

**A — Born To Rock** (`born-to-rock`)
- Category: `Mobile Game` / rhythm and music.
- URL: `https://apps.apple.com/us/app/born-to-rock-rhythm-game/id6789210953`.
- Publicly presented features: timed-note rhythm play, scoring/combos, tour progression, leaderboards, Game Center, optional in-app purchases.
- Confirmed public platform: iOS/iPadOS. **Game engine, code language and SDKs actually integrated are unverified.** Policy-listed partners are not proof of active production use.

**B — MedaStaré** (`medastare`)
- Category: `Mobile App` / `AI Solutions` / fashion technology.
- URL: `https://apps.apple.com/us/app/medastar%C3%A9/id6813994639`.
- Product-facing features: MedAI styling, Closeté wardrobe, FashionStaré try-on/look visualization, StarDay creator content, MedArena challenges.
- Publisher describes Firebase services, Vercel, OpenAI/Gemini and other integrations. **Do not infer mobile framework or claim Vortex Digital integrated those services** until the owner confirms.

**C — ScaleUp Systems** (`scaleup-systems`)
- Category: `AI SaaS` / CRM automation.
- URL: `https://scaleupsystems.ai/`.
- Product-facing features: inbound Instagram inquiry handling, lead qualification, contacts/shared inbox, booking and reporting.
- Research observed Next.js/React **on the public marketing frontend**, not necessarily the authenticated application. Other disclosed services are product-level evidence, not proof of the team's implementation scope.

**D — Gain Energy / Upstrima** (`gain-energy-upstrima`)
- Category: `AI Solutions` / energy-sector SaaS.
- URL: `https://www.gain.energy/`.
- Public presentation: engineering-focused AI agents, agents marketplace, workflows, engineering data-processing use cases, industry expertise.
- Research observed a JavaScript-rendered website and publisher-described integrations. **Do not assert that React, an AI backend, a model vendor, or cloud provider was used by Vortex Digital without confirmation.** Distinguish public marketing pages from the live engineering workspace.

**E — GoWabi** (`gowabi`)
- Category: `Marketplace` / booking / ecommerce.
- URL: `https://www.gowabi.com/`.
- Publicly visible features: marketplace search, wellness service categories, filtered listings, venue details, images, ratings, maps, booking or voucher purchase entry points.
- Google Maps and analytics integrations are observable; Ruby on Rails is **an unconfirmed inference**. The public website credits the GoWabi Team; the Vortex Digital contribution relationship must be confirmed.

**F — Daniela Diamonds** (`daniela-diamonds`)
- Category: `Ecommerce` / Shopify / luxury jewelry.
- URL: `https://danieladiamonds.com/`.
- Public features: luxury catalog, engagement-ring filtering, diamond/ring customization choices, product gallery, customer/cart/wishlist entry points, appointment options.
- Shopify storefront presence is supported by public assets. The ring-builder backend and Vortex Digital's role are not verified. Research notes **Belgium Webnet Inc.** is publicly credited on the site; do not imply exclusive design/development ownership.

Write polished copy from the supplied draft that describes the **products and visible interfaces**. All six internal previews must be substantial, different, and service-relevant. Do not invent the internal architecture, project metrics, timelines or contributions. Avoid phrases like "We built," "Our client," and "Delivered by Vortex Digital" unless specifically confirmed.

## 3. Exact 18-image mapping — USE EVERY FILE

These files are included with this package under `public/assets/portfolio/<slug>/`. Use these **exact browser paths** (no `/public/` prefix):

| Slug | Image 1 | Image 2 | Image 3 |
|---|---|---|---|
| `born-to-rock` | `/assets/portfolio/born-to-rock/rock-1.png` | `/assets/portfolio/born-to-rock/rock-2.png` | `/assets/portfolio/born-to-rock/rock-3.png` |
| `medastare` | `/assets/portfolio/medastare/meda-1.png` | `/assets/portfolio/medastare/meda-2.png` | `/assets/portfolio/medastare/meda-3-wardrobe.png` |
| `scaleup-systems` | `/assets/portfolio/scaleup-systems/scaleup-01-home.jpg` | `/assets/portfolio/scaleup-systems/scaleup-02-analytics.jpg` | `/assets/portfolio/scaleup-systems/scaleup-03-pricing.jpg` |
| `gain-energy-upstrima` | `/assets/portfolio/gain-energy-upstrima/gain-01-home.jpg` | `/assets/portfolio/gain-energy-upstrima/gain-02-features.jpg` | `/assets/portfolio/gain-energy-upstrima/gain-03-cases.jpg` |
| `gowabi` | `/assets/portfolio/gowabi/gowabi-01-home.jpg` | `/assets/portfolio/gowabi/gowabi-02-listings.jpg` | `/assets/portfolio/gowabi/gowabi-03-venue.jpg` |
| `daniela-diamonds` | `/assets/portfolio/daniela-diamonds/daniela-01-home.jpg` | `/assets/portfolio/daniela-diamonds/daniela-02-ring-builder.jpg` | `/assets/portfolio/daniela-diamonds/daniela-03-product.jpg` |

Requirements:
1. Verify all **18 files exist and decode**; fail/report if missing rather than quietly substituting a generic image.
2. Use all three project images in each draft case-study page. The first can be the cover/hero, the other two in a clear project gallery. Add accurate captions from `VORTEX_PORTFOLIO_SOURCE.md`/manifest.
3. The six web products have landscape captures. The two mobile apps have portrait **publisher promotional images**. Do NOT use a landscape-only cover template that crops mobile app art into unreadable slivers. Use separate `mobile` and `web` visual variants, correct contain/cover choices, and sensible neutral backgrounds.
4. For `ScaleUp Systems`, image 2 is a **marketing analytics illustration**, not a verified logged-in SaaS analytics screenshot; label it accurately. Gain Energy imagery shows public promotional material, not verified private agent UI. Born To Rock and MedaStaré images are publisher App Store promotional assets, not hands-on gameplay/device recordings.
5. Keep trademarks/logos as they appear in the original sources; do not modify branding, forge signatures or artificially reconstruct product UIs. Do not add fake user counts, revenue charts or performance badges.
6. Show meaningful alt text, proper `width` and `height` or CSS `aspect-ratio`, `loading="lazy"` for lower images, and accessible large-image viewing. No broken images, stretching or click-dead gallery thumbnails.
7. Track source attribution / owner approval in the data. Owner-provided screenshots do not automatically transfer copyright or confer client endorsement. Do not publicly publish those images until reuse is authorized.

## 4. Portfolio index `/portfolio`

Build a premium, finished **Selected Work** portfolio landing page. Use the site's current header/footer and editorial design system. Sections:
- Rich intro relevant to Vortex Digital's startup audience.
- Accessible, genuinely functional project category filters (All / Mobile / AI & SaaS / Marketplaces / Ecommerce) **only if there are visible, approved projects in those categories**; no inert controls.
- Project card grid with distinctive cover presentation: portrait-aware for mobile projects, landscape for web projects. Show approved project name, concise actual product description, category, and a real View Case Study link.
- Value-oriented CTA into `/contact`, and helpful links into `/services`.
- When no projects are approved, provide a polished honest content state. Never expose six client credits just to fill the design.

**Review vs public state:** The owner has provided six candidates but has not supplied per-project contribution/permissions. Keep all six initially `review`, `published=false`, `contributionVerified=false`, `publicationApproved=false`. The public portfolio only lists approved entries. Make all six *complete and inspectable* via a local development review mode (or an explicitly enabled, nonindexed private preview build). Ensure review pages are excluded from normal production output/sitemap unless explicitly approved. Never rely on `noindex` alone for confidentiality: noindex is not access control. Implement the preview in the simplest safe way compatible with existing Astro static mode and document it clearly.

If the user later verifies some but not all projects, publishing is **per project**, not all-or-nothing.

## 5. Full case-study details

Use the existing Astro Content Collections and reusable `/portfolio/[slug]` template where possible; don't duplicate nearly identical page markup six times. Each draft should be a genuine, polished case study presentation, not an empty wireframe:

1. **Hero:** title, real URL/App Store destination, category, short factually supported product summary, appropriate cover imagery.
2. **The product:** detailed description of user workflows and audience based on supplied public evidence.
3. **The product problem / use case:** describe the visible user need or business context; do not invent what the client asked Vortex Digital to solve.
4. **Key capabilities:** 4–6 role-specific, publicly supported feature explanations.
5. **Visual walkthrough:** all three supplied screenshots with correct aspect ratios and thoughtful captions; group in one polished editorial gallery with accessible large-image behavior.
6. **Technical context:** clearly separate confirmed public-platform evidence, publisher-described or observed integrations, and unverified technologies. Do not label observed product stack as 'Technologies used by Vortex Digital.' Do not infer Unity/C#, Flutter, React Native, Swift, Rails, cloud providers or backend frameworks from appearance alone.
7. **Our contribution:** conditionally shown **only after verified**. In local review mode, show an internal-review box with fields for role, engagement dates, exact screens/modules, actual stack, integrations, testing/release work, proof and use permission. Never print brackets, 'TODO', 'pending', or internal source analysis in public customer-facing case studies.
8. **Outcome:** include only corroborated results; otherwise omit the entire section. A public pricing table or promo statistics do not prove Vortex Digital results.
9. **Related approved projects:** derived from actual category overlap. Never link to a preview route from a public page.
10. **Closing CTA:** discuss a similar product, linked to `/contact`.

Avoid repeating identical paragraphs and shallow filler between projects. Do not copy the PDF's internal 'Research note', 'Team contribution to confirm' or source inspection comments verbatim into public marketing copy.

## 6. Per-project design concept

- **Born To Rock:** vertical App Store art, kinetic rhythm/game UI feel, tasteful deep-purple product gallery; the agency site itself should retain the Vortex Digital branding, not imitate the game aesthetic everywhere.
- **MedaStaré:** elegant premium fashion mobile presentation, vertical device/gallery composition, refined typography and restrained gold-neutral accent in project media only.
- **ScaleUp Systems:** product-centric SaaS case study with a clear view of the public homepage, advertised analytics, and pricing architecture; don't re-create fake app screens.
- **Gain Energy / Upstrima:** technical, industrial/AI editorial layout highlighting agent marketplace concepts and energy engineering workflow illustrations already visible in provided captures.
- **GoWabi:** discovery, search, filtered listings, and venue detail screenshot sequence; do not claim the Vortex team built booking/payments without approval.
- **Daniela Diamonds:** refined ecommerce/Shopify case study, luxury product imagery, filter/catalog/product screenshots; clearly distinguish Shopify as observed platform from ownership of custom ring builder.

Build consistent navigation, labels, spacing and typography across the site; variation should come from supplied media and the particular products, not six unrelated website skins.

## 7. Content data and authoring architecture

Use `src/content/case-studies/` and `src/content.config.ts` as the authoritative case study sources if they already exist. Reuse `getStaticPaths` rules, extending safely. Suggested fields (adjust to the actual schema and framework):

- `slug`, `title`, `productName`, `liveUrl`, `industry`, `categories`, `platform`.
- `summary`, `productOverview`, `features`, `userNeeds`, `media[]` with exact `src`, `alt`, `caption`, `origin`.
- `technicalEvidence[]` with `status: confirmed-public | publisher-described | inferred | unverified` and source link.
- `contribution` with `engagementRole`, `dates`, `ownedDeliverables[]`, `technologiesUsed[]`, `evidenceLinks[]`, `contributionVerified`.
- `assetUsePermissionConfirmed`, `publicationApproved`, `featured`, `status: review | approved`.

Publication requires **all** applicable approval gates; status alone should not bypass verification. Keep the six previous generic `sample: true` placeholder entries excluded, and prevent duplicate URLs/slugs. Content must be easy to maintain and update one project at a time. Do not hardcode six cases in six separate Astro pages.

## 8. Home page integration

The existing homepage should automatically display up to **three** featured approved portfolio entries, using the same data source and correct hero art ratios. A proposed future featured order is ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, conditional on their approval. Never insert preview-only work publicly. If no project is approved, keep a meaningful capabilities CTA rather than fabricated 'client work' cards. Preserve Step 3 homepage copy, Step 4 services, and Step 2 image fixes.

## 9. SEO, accessibility, and functionality

For approved pages only: valid canonical paths, unique page title/meta description, one H1, correct OG media, semantic breadcrumb links, meaningful alt text, accessible focus states, reduced motion, keyboard-functional filter/gallery, no empty controls or broken external links. Review pages must be omitted from normal sitemap, navigation and production builds unless explicitly enabled for a secure preview. External app/store links should work and open safely. Keep the base URLs/environment configuration as-is.

## 10. Test the implementation

Run actual commands and report results, not predictions:
- `npm test`
- `npm run check`
- `npm run build`
- `npm run test:e2e` when configured; use production preview when appropriate.

Add focused test coverage for the portfolio data and publication gate. Verify:
- Six defined candidate projects; 18 distinct media paths in the asset manifest.
- All 18 local image files exist, open/decode and render in the six *local review* pages.
- Exactly 3 screenshots per project, with correct caption/provenance.
- Zero public unapproved case-study routes; no accidental links to `sample` entries.
- Publishing just one approved fixture results in exactly one public case-study route and working card, without revealing the other five. Use nonproduction test fixtures, remove afterward.
- Category filters are functional when projects exist and hidden when not applicable.
- Project cards, gallery enlarge/close controls (if used), external links, CTA and previous/next navigation work.
- Screens at **375, 768, 1024 and 1440px**, checking portrait and landscape images, overflow and typography.
- No Step 1–4 regressions.
- Correct factual terminology on screenshots: do not call publisher art an independently verified operational screenshot.

If a tool or real business approval is unavailable, mark that check `blocked` or `not run`; never call it passed without execution.

## 11. Final outputs

Create:
- `STEP_5_REPORT.md`: implementation details, six project-page checklist, files changed, 18 media checks, screenshot preview evidence, actual test results, unresolved blockers, number of PUBLICLY APPROVED versus REVIEW projects.
- `PORTFOLIO_CONTENT_REQUIRED.md`: short per-project template for engagement role, Vortex team deliverables, dates, actual stack/integrations, evidence, screenshot permission, and public publishing approval. **Do not ask the owner to re-supply public descriptions or the 18 screenshots; they are already provided.**
- `PORTFOLIO_REVIEW_GUIDE.md`: exactly how to inspect all six local previews and approve projects individually once the facts are confirmed; include commands/URLs that actually work in this Astro project.

Finish your work only after implementing, validating, and reporting. A **technically complete review portfolio** with six substantial preview case studies is the correct Step 5 output until ownership and publication permission are verified. Do not falsely label public content complete if approval is still outstanding.

**BEGIN THE IMPLEMENTATION NOW.**
