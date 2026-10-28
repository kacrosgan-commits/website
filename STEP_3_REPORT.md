# Step 3 Report — Company Identity, About Us, and Homepage Introduction

Date: 27 October 2026

The public brand is now Vortex Digital. The site remains the existing Astro project. Team identities, the 27-image library, portfolio and blog publication, contact delivery, domain settings, and deployment configuration were not changed.

## 1. Brand name updates completed

- `src/data/site.ts` is the source of the public name. Header, footer, logo wordmark, page titles, descriptions, and organization metadata read `site.name`.
- `nameIsPlaceholder` is false. The footer no longer calls the brand a working name.
- `legalName` is an empty string and is not published as a registered entity. The copyright line uses the public brand until a legal name exists.
- The Open Graph image no longer says Velora or describes a marketing agency. It now reads “Vortex Digital” and “Software engineering for ambitious startups.”
- Privacy and terms still use the shared brand name. Two sentences that called that name a working brand were corrected so they do not contradict the confirmed public name. The rest of those templates, including the legal-review notices and `noindex`, was left in place.
- No public page in `src/` still says Velora.

The npm package name remains `velora-website`. It is not shown on the website.

## 2. Homepage introduction improvements

The company section now uses “Your Startup Idea Deserves Great Engineering.” The copy names Vortex Digital, startup teams, and the mix of product design, web and mobile development, AI engineering, and technical delivery. It points to `/about` instead of repeating the full company story.

The hero eyebrow and supporting paragraph now describe software engineering for startups. The existing hero headline and layout were kept. The services section names the eight specialties and links to `/services`. Existing calls to action still go to `/contact`, `/about`, `/services`, and `/portfolio`.

## 3. About Us sections implemented

`/about` now includes:

1. About hero — “About Vortex Digital” and “We Build Software for What's Next.”
2. Who we are — “A Development Team Built Around Products.”
3. Who we work with — four startup situations, labeled as situations rather than past engagements.
4. What we build — the eight confirmed services, linked to the existing service routes.
5. Our Mission — stated as a goal, with a note that it is not a record of completed outcomes.
6. Our Vision — stated as an aim, without a claim of market leadership.
7. Engineering philosophy — six practical blocks.
8. How we work — the six stages from `src/data/process.ts`, linked to `/process`.
9. Team — the existing nine roles and portrait cards, linked to `/team`. Names stay unpublished.
10. Final call to action — “Discuss Your Project” to `/contact` and “Explore Our Services” to `/services`.

## 4. Services and startup positioning used

Positioning used in the copy: Vortex Digital helps startups build software products through thoughtful design, engineering, and collaboration. The tagline is “From Idea to Product. Built Together.”

The eight specialties are Web Development, Mobile Apps, AI Solutions, SaaS Development, Backend & APIs, Cloud & DevOps, UI/UX Design, and QA & Testing. They map to the existing slugs and do not add a new catalog. The company is not described as a marketing, advertising, or SEO agency.

## 5. Files created or modified

Created:

- `COMPANY_INFO_REQUIRED.md`
- `STEP_3_REPORT.md`

Modified:

- `src/data/site.ts`
- `src/data/about.ts`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/components/ui/Logo.astro`
- `src/components/layout/Footer.astro`
- `src/styles/global.css`
- `src/pages/privacy.astro`
- `src/pages/terms.astro`
- `public/og.svg`
- `public/og.png`
- `README.md`
- `docs/content-approval-needed.md`

## 6. UI/UX improvements made

- About uses an editorial hero with the existing workspace photograph, full-width audience rows, a two-column service list, an asymmetric mission and vision pair, and a varied philosophy grid. It does not repeat one card layout for every section.
- The dark and purple palette, Space Grotesk, and Inter are unchanged.
- The wordmark stays on one line, and the desktop navigation still fits from 1024px through 1440px.
- Step 2 image paths and the scroll-reveal rules were left in place. New About sections use the existing reveal behavior, so they stay visible without JavaScript.

## 7. Screens and pages tested

Chrome, through Playwright, loaded the production preview after the build:

- `/` and `/about` at 375px, 768px, and 1440px
- Header and footer brand
- Mobile menu
- Header fit at 1024px, 1100px, and 1280px
- About service links, nine profile links, process link, and both final buttons

Images on both pages decoded. Horizontal overflow was 0. The visible text did not contain Velora or marketing-agency language.

## 8. Tests executed and results

| Command | Result |
| --- | --- |
| `npm test` | 5 passed, 0 failed |
| `npm run check` | 0 errors, 0 warnings, 31 existing `zod` deprecation hints |
| `npm run build` | Completed twice. The last build, after the Open Graph update, produced 29 pages. |
| `npm run test:e2e` | 6 passed, 0 failed |

The end-to-end run used the build from before the Open Graph file change. Those tests do not cover the social image. The social image was checked by rendering `public/og.png` after the text change, and a later production build copied it into `dist`.

## 9. Remaining unfinished information

Recorded in `COMPANY_INFO_REQUIRED.md` and not invented here:

- Registered legal name
- Founding year and company history
- Location, address, and jurisdiction
- Owned domain and business email
- Live contact-form delivery
- Employee names and verified identities
- Approved client work, testimonials, awards, and certifications

## 10. Issues that could not be resolved

- Domain and email remain `https://example.com` and `hello@example.com` until environment variables are set. That was left unchanged on purpose.
- `WEBSITE_AUDIT.md` and `docs/launch-audit.md` still describe the earlier Velora placeholder. They are the records of those earlier steps.
- Privacy and terms are still templates and still need counsel. They are not treated as a finished legal identity.
