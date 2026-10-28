# Website audit

Audit date: 27 October 2026.  
Scope: source inspection and a filesystem check of image files. No pages were redesigned and no dependencies were installed.

This audit did **not** open a browser, run Playwright, run Lighthouse, or run axe. An earlier browser report exists in `docs/qa-report.md` (26 October 2026). Those results are not repeated here as current visual proof. `portrait-thumb.webp` files that report described are **not** on disk now.

---

## A. Current technology stack

| Layer | What the repo uses |
| --- | --- |
| Framework | Astro 7.3.8, static output (`astro.config.ts`) |
| Language | TypeScript (`astro check`, `typescript` ~6.0.3) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, plus `src/styles/global.css` |
| Content | Astro content collections for blog and case studies (`src/content.config.ts`), MDX integration installed |
| Fonts | Self-hosted Space Grotesk and Inter (`@fontsource/*`) |
| Icons | `@lucide/astro` |
| SEO | `@astrojs/sitemap`, `src/pages/robots.txt.ts`, per-page titles in `src/layouts/BaseLayout.astro` |
| Tests present | `node --test` for `tests/unit/inquiry.test.ts`; Playwright in `tests/e2e/smoke.spec.ts` (not executed in this audit) |
| Hosting config | Cloudflare Pages headers in `public/_headers`. No live deploy was found in this workspace. |
| Node | `package.json` engines `>=22.12.0`; `.nvmrc` is 24.21.0 |

There is no `.env` file. Public defaults come from `src/data/defaults.ts`.

Reusable UI lives under `src/components/` (layout, cards, sections, forms, team profile, visuals). Central data lives under `src/data/`.

Unused component files (no imports found): `src/components/visuals/HeroVisual.astro`, `src/components/visuals/AbstractVisual.astro`. `serviceIcon()` in `src/data/assets.ts` is also unused. The live service cards use Lucide icons from `src/data/services.ts`.

---

## B. Inventory of routes

Static pages and dynamic routes defined under `src/pages/`.

| Route | Source |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/services` | `src/pages/services/index.astro` |
| `/services/web-application-development` | `src/pages/services/[slug].astro` + `src/data/services.ts` |
| `/services/mobile-app-development` | same |
| `/services/ai-intelligent-automation` | same |
| `/services/saas-platform-development` | same |
| `/services/backend-api-engineering` | same |
| `/services/cloud-devops` | same |
| `/services/ui-ux-product-design` | same |
| `/services/qa-software-testing` | same |
| `/portfolio` | `src/pages/portfolio/index.astro` |
| `/portfolio/[slug]` | `src/pages/portfolio/[slug].astro` — generated only when `sample` is false. All six case studies are `sample: true`, so **no case-study URLs are built**. |
| `/process` | `src/pages/process.astro` |
| `/team` | `src/pages/team/index.astro` |
| `/team/gallery` | `src/pages/team/gallery.astro` |
| `/team/founder-ceo` | `src/pages/team/[slug].astro` |
| `/team/cofounder-cto` | same |
| `/team/cfo` | same |
| `/team/project-manager` | same |
| `/team/senior-fullstack-developer` | same |
| `/team/ai-engineer` | same |
| `/team/mobile-app-developer` | same |
| `/team/uiux-product-designer` | same |
| `/team/qa-devops-engineer` | same |
| `/insights` | `src/pages/insights/index.astro` |
| `/insights/[slug]` | `src/pages/insights/[slug].astro` — generated only when `draft` and `demonstration` are both false. All six articles are `demonstration: true`, so **no article URLs are built**. |
| `/contact` | `src/pages/contact.astro` |
| `/privacy` | `src/pages/privacy.astro` (`noindex`, omitted from sitemap) |
| `/terms` | `src/pages/terms.astro` (`noindex`, omitted from sitemap) |
| `/404` | `src/pages/404.astro` |
| `/robots.txt` | `src/pages/robots.txt.ts` |
| sitemap | `@astrojs/sitemap` during build |

Header and footer navigation (`src/data/site.ts`) link Home, About, Services, Our Work (`/portfolio`), Our Process, Team, Insights, and Contact. Gallery is linked from the team and collaboration sections, not from the main nav. Privacy and terms are footer links.

---

## C. Status of each page

Status means content readiness for a truthful public launch, not whether the route exists.

| Page | Status | Why |
| --- | --- | --- |
| Home | Partial | Layout, services, process, FAQ, team grid, and collaboration scenes are implemented. Client work, articles, statistics, and testimonials are intentionally empty. Brand is a placeholder. |
| About | Partial | Story, mission, values, and nine role cards render. Copy is a working company story under the placeholder name `Velora` (`src/data/about.ts`). |
| Services index | Partial | Eight services and a CTA are real routes. The lead photograph is `marketing-analytics.webp`, a filename left from an earlier marketing-site pack. |
| Eight service details | Partial | Each has overview, problems, approach, and deliverables in `src/data/services.ts`. They are practice descriptions, not proof of delivered client work. Four services share two photographs; four use a decorative SVG only (`src/components/visuals/ServiceVisual.astro`). |
| Portfolio index | Partial | Honest empty state. No approved case study is listed. |
| Portfolio case studies | Missing | Six sample markdown files exist and are **not routed**. There is no approved study. |
| Process | Complete as a method page | Six stages in `src/data/process.ts`. It does not claim contractual guarantees. It is not a record of past projects. |
| Team overview | Partial | Exactly nine role cards, portraits, and profile links. Every name is “Name pending”. |
| Nine profiles | Partial | Routes, role copy, and three images per member are implemented. All `isPublished: false`, so they are `noindex`. Previous/next thumbnails 404 (section E). |
| Team gallery | Partial | Code renders 27 images and labels them as illustrations. The page is `noindex` and is an asset review, not an approved public story. |
| Insights index | Partial | Empty state. No reviewed article is listed. |
| Insight articles | Missing | Six demonstration drafts exist and are **not routed**. |
| Contact | Partial | Form fields, validation, honeypot, and error states exist. Delivery is not configured (section F). |
| Privacy | Partial | Labeled template, `noindex`. Not a reviewed policy. |
| Terms | Partial | Labeled template, `noindex`. Not reviewed legal text. |
| 404 | Complete | Custom page with working links home and to contact. |
| robots.txt | Partial | Allows `/` and points at the sitemap. Canonical host is still `https://example.com` unless `PUBLIC_SITE_URL` is set. |

---

## D. Missing or placeholder business content

| Item | Where | What the code does now | Proposed correction |
| --- | --- | --- | --- |
| Brand and legal name | `src/data/site.ts` (`name`, `legalName`, `nameIsPlaceholder: true`) | Public name is `Velora`. Footer says it is a working name. | Replace only after the owner confirms the legal name. |
| Domain | `src/data/defaults.ts`, missing `.env` | Canonical URL is `https://example.com`. | Set `PUBLIC_SITE_URL` to the owned domain. |
| Email | `src/data/defaults.ts`, `src/pages/contact.astro`, `src/components/layout/Footer.astro` | `hello@example.com`, with on-page “placeholder” notes. | Set `PUBLIC_CONTACT_EMAIL` to a mailbox the company reads. |
| Address | `src/data/site.ts` `location: ""` | Hidden. | Add only if the company wants an address published. |
| Employee names | `src/data/team.ts` — all nine `name: null` | UI shows “Name pending” via `displayName()`. | Set `name` only when confirmed. Do not invent names. |
| Publication of people | `src/data/team.ts` — all `isPublished: false` | Profiles stay `noindex` and out of the sitemap (`astro.config.ts`). | Set `isPublished: true` only after name and photo permission are confirmed. |
| Social profiles | `src/data/site.ts` `socialLinks` hrefs are `""` | Icons stay hidden (`activeSocialLinks`). | Add real `https` URLs or leave hidden. |
| Statistics | `src/data/stats.ts` empty array | `Stats` renders nothing (`src/components/sections/Stats.astro`). | Add a figure only with a verified source. |
| Testimonials | `src/data/testimonials.ts` empty array | `Testimonials` renders nothing. | Add a quote only with permission. |
| Client work | `src/content/case-studies/*.md`, all `sample: true` | Not built into routes. Homepage work block says none are approved (`src/pages/index.astro`). | Add a new markdown file with `sample: false` only for an approved engagement. |
| Articles | `src/content/blog/*.md`, all `demonstration: true` | Not built into routes. Insights index says nothing is published. | Set `demonstration: false` and `draft: false` only after editorial review. |
| Legal text | `src/pages/privacy.astro`, `src/pages/terms.astro` | Both say they are templates and need counsel. | Replace with reviewed documents, then remove `noindex` and the sitemap exclusions in `astro.config.ts`. |
| Technology list | `src/data/technologies.ts` | Labeled as a catalog, not certifications. Still an unverified claim of what the team uses. | Confirm the stack with the owner before launch, or narrow it. |
| About story | `src/data/about.ts` | First paragraph says the introduction is a working story to edit before launch. | Replace with the owner’s confirmed company description. |

No fabricated testimonials, review stars, revenue figures, or named employees were found in the rendered data arrays. Sample projects and demonstration articles still exist as files and would become public if their flags were flipped without review.

---

## E. Missing assets and incorrect image references

Filesystem check on 27 October 2026: all 27 paths in `ASSET_MANIFEST.json` exist as WebP files under `public/assets/team/<slug>/` (`portrait.webp`, `work-01.webp`, `work-02.webp`). Nine folders, no duplicate manifest paths.

| Issue | Path | Correction |
| --- | --- | --- |
| **Missing thumbnails.** `portrait()` sets `thumb` to `/assets/team/${slug}/portrait-thumb.webp`. Profile previous/next images use that URL (`src/components/team/TeamProfile.astro`). `ls` shows those nine files are **not** on disk. | `src/data/team.ts`, `src/components/team/TeamProfile.astro` | Point the small avatars at `portrait.src`, or generate 384px thumbs from the existing portraits without retouching faces. |
| Portraits are not verified identities. First four use `source: "supplied"`; the other five use `source: "illustrative"`. Manifest says the first four might be the same person. | `src/data/team.ts`, `ASSET_MANIFEST.json` | Keep the badges. Do not set `identityVerified` or `isPublished` until the owner confirms each photo. |
| Collaboration scenes are coded as illustrations (`isIllustrative: true`, captions say they are not documented events). | `src/data/team.ts`, `src/pages/team/gallery.astro` | Keep that labeling on any public page. |
| Services photography uses `/assets/services/marketing-analytics.webp`. The file exists. The name and the alt text (“product interface in violet light”) come from an older marketing pack. This audit did not visually open the WebP. | `src/data/assets.ts`, `src/pages/services/index.astro`, `src/components/visuals/ServiceVisual.astro` | Replace with an approved software-product image or stop using it for SaaS and AI if it is a marketing dashboard. |
| `assets.hero` (`/assets/hero/hero-orbit.webp`) is defined and the file is present, but no page imports `assets.hero`. The homepage hero uses `assets.aboutPhoto` (`/assets/about/office-visual.webp`). | `src/data/assets.ts`, `src/pages/index.astro` | Leave the unused file, or wire it only if it is the intended hero. Do not treat it as missing. |
| Marketing-era icon map (`social-media-marketing`, `google-ads-ppc`, and similar) is unused. Those SVG files still exist under `public/assets/icons/`. | `src/data/assets.ts` | Do not link them from service cards. Delete only in a later cleanup, not required for launch truthfulness. |
| Portfolio and blog SVGs are mapped for sample slugs that are not routed. | `src/data/assets.ts` | Harmless while those pages stay unpublished. |

The 27 team images are referenced from `src/data/team.ts` using manifest paths (`/assets/team/...`, not `/public/assets/...`). Cards on `/team` use `portrait.src`. Gallery and profile work images use the same paths.

---

## F. Nonfunctional or incomplete features

| Feature | Evidence | Proposed correction |
| --- | --- | --- |
| Contact delivery | No `.env`. `PUBLIC_FORMSPREE_ENDPOINT` is empty in `.env.example`. `planDelivery()` returns `unconfigured` unless the endpoint starts with `http` (`src/utils/inquiry.ts`). The form then opens `mailto:` and tells the user delivery is not confirmed (`src/components/forms/ContactForm.astro`). | Create the Formspree form, set the env var on the host, and send one test message. Do not show the success panel until `response.ok`. That guard is already in the submit handler. |
| Booking | `site.bookingUrl` is empty, so the booking button is not rendered (`src/pages/contact.astro`). | Add `PUBLIC_BOOKING_URL` only for a real scheduler. |
| Case-study filters | Filter buttons render only when approved projects exist (`src/pages/portfolio/index.astro`). With zero projects they do nothing visible. | No change until a real study exists. |
| Insights filters | Same pattern (`src/pages/insights/index.astro`). | No change until a reviewed article exists. |
| Stats and testimonials | Components are mounted on the homepage and render `null` when arrays are empty. | Leave them empty. Do not add fake numbers or quotes. |
| Sample project URLs | `getStaticPaths` drops `sample: true`. Old URLs such as `/portfolio/sample-launch-campaign` are not generated. | Expected. A later 404 is correct. Do not republish the samples as client work. |
| Demonstration article URLs | `getStaticPaths` drops `demonstration: true`. | Same. Keep them unpublished. |
| Gallery discoverability | Not in `navigation`. Linked from team collaboration and the home/about preview (`src/components/sections/CollaborationPreview.astro`). | Acceptable for a noindex review page. Do not add it to the main nav until imagery is approved for customers. |

Buttons that do exist (header “Let’s Talk”, homepage “Start Your Project”, service CTAs, 404 links) point at real routes (`/contact`, `/services`, `/`). No `href="#"` actions were found in `src/`.

---

## G. UI/UX and responsive design issues

Findings below are from source, not from a new visual pass.

| Issue | File | Proposed correction |
| --- | --- | --- |
| Profile previous/next avatars request missing files, so those slots will show broken images. | `src/components/team/TeamProfile.astro` | Use the full portrait or add the missing thumbs. |
| Scroll-reveal sections start at `opacity: 0` after an inline script adds `html.can-reveal`. If that script runs and the later observer does not, homepage blocks stay invisible. Reduced motion forces opacity back to 1. | `src/layouts/BaseLayout.astro`, `src/styles/global.css` (`.reveal`) | Do not put photographs inside `.reveal`, or default `.reveal` to visible and animate only when `.is-in` is supported. |
| Service pages are visually uneven: web and UI/UX reuse the office photo; SaaS and AI reuse `marketing-analytics.webp`; mobile, backend, cloud, and QA get a sphere background with `aria-hidden="true"`. | `src/components/visuals/ServiceVisual.astro` | Give each service its own approved image, or use one consistent non-photographic treatment. |
| Team and profile pages tell visitors the person is unnamed and the photo may be unverified. That is correct, and it will look unfinished until identities are approved. | `src/components/cards/TeamCard.astro`, `src/components/team/TeamProfile.astro` | Do not hide the seats. Publish names only when supplied. |
| Content security policy allows `'unsafe-inline'` scripts because Astro inlines them. | `public/_headers` | Tighten with hashes later. Not a layout bug. These headers are not applied by `astro preview`; they apply on Cloudflare Pages. |
| Contrast of muted text `#A7A0BD` on `#090713` was **not measured** in this audit. Focus rings are defined (`:focus-visible` in `src/styles/global.css`). Skip link exists. | `src/styles/global.css`, `src/layouts/BaseLayout.astro` | Run axe and a contrast check before calling the site WCAG AA. |
| Responsive behavior at 375 / 768 / 1024 / 1440 / 1920 was **not retested** in this audit. CSS does define column changes for team cards (`sm:grid-cols-2 lg:grid-cols-3` in `src/pages/team/index.astro`) and a desktop editorial gallery (`@media (min-width: 1024px)` in `src/styles/global.css`). | those files | Re-run the browser pass before launch. Do not treat the October 26 report as current. |

---

## H. Prioritized issues

### Critical

1. **Company identity is still a placeholder.** `src/data/site.ts`, `src/data/defaults.ts`. The live name, domain, and email are `Velora`, `example.com`, and `hello@example.com`. Correction: owner supplies the real values; set them in `src/data/site.ts` and `.env`. Do not launch on a custom domain before that.
2. **Contact form does not deliver.** `src/utils/inquiry.ts`, `src/components/forms/ContactForm.astro`, missing `.env`. Correction: configure Formspree and prove one submission arrives. Keep the “not delivered” message until then.
3. **Nine people are unpublished.** `src/data/team.ts`. Correction: names and photo permission from the owner. Leave `isPublished` false until then.

### High

4. **Broken previous/next images.** Missing `portrait-thumb.webp` for all nine slugs. Correction: change `src/components/team/TeamProfile.astro` to `portrait.src`, or add downscaled thumbs.
5. **No approved portfolio.** `src/content/case-studies/`, `src/pages/portfolio/index.astro`. Correction: publish only client-approved studies. Do not turn `sample: true` files into public case studies.
6. **Legal pages are templates.** `src/pages/privacy.astro`, `src/pages/terms.astro`. Correction: counsel review, then remove `noindex`.
7. **Team photography is not cleared as employee fact.** `ASSET_MANIFEST.json`, `src/data/team.ts`. Correction: keep illustrative labels. Do not describe scenes as real meetings.

### Medium

8. **Insights are an empty public page.** `src/pages/insights/index.astro`, `src/content/blog/`. Correction: review a draft or accept an empty index until then. Do not list `demonstration: true` posts.
9. **Service imagery is inconsistent and one file is still named as marketing analytics.** `src/components/visuals/ServiceVisual.astro`, `src/data/assets.ts`. Correction: replace or standardize the photographs.
10. **Technology catalog is unverified.** `src/data/technologies.ts`. Correction: owner confirms the stack.
11. **Reveal animation can hide homepage sections if the observer fails.** `src/styles/global.css`. Correction: make the no-observer state visible.
12. **Sitemap and canonical URLs use example.com** until env is set. `astro.config.ts`, `src/data/defaults.ts`. Correction: set `PUBLIC_SITE_URL` before any deploy that should be indexed.

### Low

13. Unused `HeroVisual.astro`, `AbstractVisual.astro`, `assets.hero`, and the marketing icon map. Correction: delete in a cleanup pass. They are not linked from pages.
14. Gallery is omitted from the main nav. Correction: leave it out while the page is `noindex`.
15. CSP uses `'unsafe-inline'`. Correction: hash inline scripts when tightening security.
16. `docs/qa-report.md` is older than the current thumbnail files. Correction: re-run `npm run test:e2e` after thumbnail fixes. Not done in this audit.

---

## I. Recommended implementation order

1. Collect the business facts in section J. Do not invent them in code.
2. Fix the nine missing thumbnail URLs so profile navigation does not show broken images.
3. Configure `PUBLIC_SITE_URL`, `PUBLIC_CONTACT_EMAIL`, and `PUBLIC_FORMSPREE_ENDPOINT`. Verify one real form delivery.
4. Replace the placeholder name in `src/data/site.ts` and the working about copy in `src/data/about.ts`.
5. Approve or replace portraits. Set `name` and `isPublished` per person only when confirmed.
6. Have counsel replace privacy and terms. Remove `noindex` only after that.
7. Add the first real case study (`sample: false`) or keep `/portfolio` as the empty capabilities page.
8. Review one insight or keep `/insights` empty.
9. Replace `marketing-analytics.webp` if it is the wrong photograph. Confirm `src/data/technologies.ts`.
10. Re-run `npm test`, `npm run check`, `npm run build`, and `npm run test:e2e`, then a visual pass at 375, 768, and 1440. Deploy to a preview URL before DNS.

---

## J. Business information the owner must supply

The repository does not contain these facts. They must come from the owner.

- Legal company name and the public brand name, if they differ.
- Owned domain.
- Public email address that is monitored.
- Whether a street address or jurisdiction should appear.
- Form provider endpoint (Formspree or another), and who receives inquiries.
- Optional booking URL.
- For each of the nine seats: the person’s name, whether the current portrait may represent them, and any real LinkedIn or GitHub URL.
- Confirmation that collaboration images may be shown only as illustrations, or replacement photographs.
- Any client-approved case study: problem, the company’s role, approach, deliverables, and outcomes the client cleared.
- Any article the owner has reviewed.
- Reviewed privacy policy and terms, including the legal entity.
- The technologies the team actually uses, if the catalog should be narrowed.
- Explicit permission to point DNS at the site.

---

## Tests performed for this audit

- Read routes, data files, content flags, form delivery code, and header/footer links.
- Compared `ASSET_MANIFEST.json` paths to files on disk: 27/27 WebP files present.
- Listed each team folder: `portrait.webp`, `work-01.webp`, `work-02.webp` only. No `portrait-thumb.webp`.
- Confirmed `.env` is absent.
- Searched `src/` for empty `href="#"` controls and for unused visual components.

Not performed: browser screenshots, Playwright, Lighthouse, axe, production build, or a live form submission.
