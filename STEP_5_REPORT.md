# Step 5 Report — Portfolio Review Pages

Date: 27 October 2026

Six product layouts are built from the supplied research and the 18 supplied screenshots. They are internal review pages. None is published as Vortex Digital client work. The production build still has zero approved case studies.

## Files created

- `src/utils/portfolio.ts` — publication, review, filter, and homepage rules
- `src/components/portfolio/CaseStudy.astro` — one case-study template
- `src/content/case-studies/born-to-rock.md`
- `src/content/case-studies/medastare.md`
- `src/content/case-studies/scaleup-systems.md`
- `src/content/case-studies/gain-energy-upstrima.md`
- `src/content/case-studies/gowabi.md`
- `src/content/case-studies/daniela-diamonds.md`
- `tests/unit/portfolio.test.ts`
- `PORTFOLIO_CONTENT_REQUIRED.md`
- `PORTFOLIO_REVIEW_GUIDE.md`

## Files modified

- `src/content.config.ts` — case-study schema for screenshots, features, technology evidence, and approval flags
- `src/pages/portfolio/index.astro` — Selected Work directory
- `src/pages/portfolio/[slug].astro` — production paths require approval; development also renders review entries
- `src/components/cards/ProjectCard.astro` — real first screenshot, review label, public-platform chips
- `src/pages/index.astro` — homepage work only when a project is approved and featured
- `src/styles/global.css` — portfolio grid, portrait frames, wide galleries, dialog
- `astro.config.ts` — sitemap drops case studies unless `publicationApproved: true`
- `tests/e2e/smoke.spec.ts` — production portfolio stays empty and the six slugs 404

Older sample case studies were not republished. Team, services, About, contact delivery, and deployment settings were not changed.

## Six layouts

| Slug | Layout | Images |
| --- | --- | --- |
| `born-to-rock` | Portrait game presentation | `rock-1.png`, `rock-2.png`, `rock-3.png` |
| `medastare` | Portrait fashion presentation | `meda-1.png`, `meda-2.png`, `meda-3-wardrobe.png` |
| `scaleup-systems` | Wide SaaS marketing gallery | `scaleup-01-home.jpg`, `scaleup-02-analytics.jpg`, `scaleup-03-pricing.jpg` |
| `gain-energy-upstrima` | Wide technical marketing gallery | `gain-01-home.jpg`, `gain-02-features.jpg`, `gain-03-cases.jpg` |
| `gowabi` | Wide marketplace gallery | `gowabi-01-home.jpg`, `gowabi-02-listings.jpg`, `gowabi-03-venue.jpg` |
| `daniela-diamonds` | Wide jewelry gallery | `daniela-01-home.jpg`, `daniela-02-ring-builder.jpg`, `daniela-03-product.jpg` |

Each review page has a hero, product overview, product challenge, four to six documented features, all three images with captions, technical notes split into confirmed platform, publisher-described, observed, and unverified, a contribution section that says “Not confirmed,” no outcomes, other review entries labeled as unapproved, and “Discuss Your Project” to `/contact`.

Promotional App Store artwork is labeled separately from public page captures. The ScaleUp analytics frame is labeled as a marketing illustration.

## Portfolio overview

`/portfolio` uses the heading “Selected Work” and the subheading “Digital Products Across Industries.”

In `astro dev`, all six cards are visible with an internal-review notice. Filters are All, Mobile, AI & SaaS, Marketplaces, and Ecommerce. MedaStaré is in both Mobile and AI & SaaS. The grid is one column on small screens, two from 768px, and three from 1280px.

In production, with nothing approved, the same heading remains and the page says no client case studies are approved. It links to the eight services. It does not show the six products.

## Publication behavior

A page is generated in production only when `sample` is not true and `publicationApproved` is true. Review entries are generated only while `import.meta.env.DEV` is true. The sitemap also requires `publicationApproved: true` for case studies. `noindex` is set on review pages and is not the only control.

The homepage features a project only when it is approved and `featured: true`, at most three, ordered by `homeRank`. The suggested order is already stored: ScaleUp Systems 1, MedaStaré 2, Gain Energy / Upstrima 3. Those ranks do not publish anything by themselves.

## Checks

`python3 scripts/check_portfolio_assets.py` passed: 6 projects, 18 distinct paths, hashes matched.

`npm test`: 10 passed, 0 failed. That includes the five existing inquiry tests and five portfolio tests.

`npm run check`: 0 errors, 0 warnings, 73 hints. The hints are the existing `z` deprecation from `astro:content`. Content sync succeeded, so the six entries match the schema.

`npm run build` with every project unapproved: 29 pages. None of the six slugs is in `dist`, the homepage, or the sitemap. `/portfolio` contains “Selected Work” and “No client case studies are approved.”

Temporary approval fixtures, removed afterward:

- ScaleUp Systems only: the build emitted 30 pages, including `/portfolio/scaleup-systems`. The homepage contained that name once. The sitemap contained that slug. The other five slugs and the old samples were absent.
- ScaleUp Systems, MedaStaré, and Gain Energy / Upstrima: the build emitted 32 pages and those three portfolio routes. The homepage contained those three names and not Born To Rock, GoWabi, or Daniela Diamonds. The sitemap contained those three slugs. Samples stayed absent.

Flags were restored to `publicationApproved: false` and `featured: false`. The final build returned to 29 pages. The preview at `http://127.0.0.1:4321/portfolio/born-to-rock/` returned 404.

`npm run test:e2e`: 7 passed, 0 failed, against that production preview. The new test checks the empty portfolio, six 404s, sitemap exclusion, and the homepage empty state. The previous route, team image, contact, 404, mobile menu, and noindex tests still passed.

## Browser testing

Review pages were opened on the development server at `http://127.0.0.1:4322`.

Measured hero images, natural size versus rendered size:

- Born To Rock at 1440px: 600×1299 rendered at 320×690
- MedaStaré at 375px: 600×1299 rendered at 320×690
- Gain Energy at 1440px: 1348×926 rendered at 659×453
- GoWabi at 1024px: 1348×926 rendered at 479×330
- Daniela Diamonds at 1440px: 1348×926 rendered at 659×453

Rendered proportions match the files. Portrait shots stay portrait. Wide shots stay wide.

Filter counts on the review directory: All 6, Mobile 2, AI & SaaS 3, Marketplaces 1, Ecommerce 1.

The ScaleUp gallery opened the analytics image in a dialog, with the marketing-illustration caption, and Close returned focus to the enlarge control. Escape closed the dialog in headless Chrome. Without JavaScript, the gallery link still points at the image file. “Discuss Your Project” points to `/contact`. Live product links are present and open in a new tab.

Checked widths were 375, 768, 1024, and 1440. No horizontal overflow was reported on the index or the six review pages. The Astro dev toolbar can sit over the bottom of a short viewport; that overlay is not part of the production page.

## Approved projects

0

## Publication blockers

For every project: the company’s exact role, dates, real stack, deliverables, image permission, and a decision to publish. Details are in `PORTFOLIO_CONTENT_REQUIRED.md`. The public portfolio is not complete.
