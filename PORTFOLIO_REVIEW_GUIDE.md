# Portfolio review guide

The six case studies are visible on the development server. A production build omits them until each one is approved.

## Open the review

From the project directory, with Node 22 or newer:

```bash
npm run dev
```

Then open:

- http://127.0.0.1:4321/portfolio
- http://127.0.0.1:4321/portfolio/born-to-rock
- http://127.0.0.1:4321/portfolio/medastare
- http://127.0.0.1:4321/portfolio/scaleup-systems
- http://127.0.0.1:4321/portfolio/gain-energy-upstrima
- http://127.0.0.1:4321/portfolio/gowabi
- http://127.0.0.1:4321/portfolio/daniela-diamonds

If port 4321 is already in use, Astro prints the port it chose. Use that host and port. An existing dev server in this workspace has also been available at http://127.0.0.1:4322.

`npm run preview` serves the production build. Those six addresses return 404 there while the projects are unapproved. That is expected.

## What to check

Each page is labeled Internal review. The copy describes the public product. It does not say Vortex Digital built it.

Confirm:

- The three images belong to that product and the captions match the screen.
- Portrait images for Born To Rock and MedaStaré are tall and readable.
- Wide images for the other four products are not cropped into a short strip.
- Enlarge image opens the file, and Close or Escape dismisses it.
- View live product opens the real App Store or website listing.
- Discuss Your Project goes to `/contact`.
- Technical notes stay inside Confirmed platform, Publisher-described, Observed, or Unverified.
- Our contribution still says Not confirmed.
- No outcomes section is present.

On `/portfolio`, use All, Mobile, AI & SaaS, Marketplaces, and Ecommerce. MedaStaré belongs to Mobile and AI & SaaS.

## Approve one project

Approval is a content change, not a switch in the browser.

1. Fill the real contribution, dates, stack, and deliverables in that project's markdown file under `src/content/case-studies/`. The empty fields are `engagementRole`, `workDates`, `modulesDelivered`, `technologiesUsed`, `integrationsDeveloped`, `qaContribution`, and `publicationPermission`.
2. Set `contributionVerified: true` only after those fields are real.
3. Set `publicationApproved: true` only after image permission and publication approval exist.
4. Set `featured: true` only if that project should also appear on the homepage. The homepage shows at most three approved featured projects, using `homeRank` (ScaleUp Systems 1, MedaStaré 2, Gain Energy / Upstrima 3).
5. Run `npm run build` and open the new `/portfolio/{slug}` page from `npm run preview`.

Leave the other projects at `publicationApproved: false`. They stay out of the production build and the sitemap.

Do not set `sample: false` on the older `sample-*.md` files, and do not mark a sample as approved. Samples are excluded even if that flag is changed by mistake only when `sample: true` remains.

The contribution section is omitted from a public page until `contributionVerified` is true and the seven fields are filled. An approved page without those facts still must not invent a role.
