# Step 7 report

Site-wide pass on the existing Vortex Digital Astro site. Pages were reviewed and the defects below were changed in the application. The site was not rebuilt from scratch. Portfolio projects stay unpublished. Team identities stay unpublished. No form endpoint or mailbox was invented.

## 1. Full website review findings

Public routes that exist: `/`, `/about`, `/services`, eight `/services/[slug]` pages, `/portfolio`, `/process`, `/team`, nine `/team/[slug]` pages, `/team/gallery`, `/insights`, `/contact`, `/privacy`, `/terms`, `/404`.

Development-only routes that still render: six portfolio review pages and four editorial articles. Production returns 404 for those URLs. Confirmed against the preview on port 4321 and the dev server on port 4322.

What was already in good shape and left in place:

- Eight service titles, slugs, and detail pages.
- Nine role profiles, 27 team images, gallery, and the rule that names are omitted until confirmed.
- Six case-study layouts and 18 screenshots, visible only in development, with `publicationApproved: false`.
- Empty stats and testimonials components, which render nothing rather than invented numbers or quotes.
- Contact validation, honeypot, and the refusal to show a success state without a configured endpoint.

Defects that were visible:

- The homepage secondary action, “Explore Our Work,” sent people to a production portfolio with zero approved studies.
- Insights was a primary navigation item whose public page talked about clearing a demonstration flag.
- The footer, contact page, and privacy page presented `hello@example.com` as a mailto inbox.
- The homepage repeated the full team-card grid already on `/team`.
- The homepage reasons heading was a generic slogan (“Built With Purpose. Engineered for Growth.”).
- Homepage process labels (Discover, Plan, Design, Develop, Test, Improve) did not match the six stage names used on About, Services, and Process.
- The public portfolio subheading “Digital Products Across Industries.” sat on a page with no approved work.

## 2. Actual defects fixed

- Homepage secondary action now goes to `/services` (“Explore Our Services”). “Start Your Project” still goes to `/contact`.
- With zero approved studies, the homepage no longer shows a large empty “Approved client work” card. It keeps the truthful sentence and links to services and process.
- Insights is omitted from the header and footer until a post is published (`draft` and `demonstration` both false). The route remains.
- Public Insights copy no longer mentions demonstration flags. It says nothing is published yet and points to services and process.
- Placeholder email is no longer a visible mailto. Footer, contact, and privacy say a public inbox is not set and point people at the form.
- Homepage team block is a directory of the nine roles with thumbnail, role, and profile link, plus “Meet the team.”
- Homepage reasons heading is “How the work is run.”
- Homepage process steps use the same six titles as the process page.
- Public portfolio description, when nothing is approved, says studies appear after the work and the right to publish it are confirmed.
- Contact project types include “QA & Testing,” and the service-query alias maps to that option.
- Privacy copy no longer calls itself a template in the rights paragraph. The page still says it needs legal review.

## 3. Content improvements

Four editorial articles were written and left unpublished (`draft: true`, `editorialReview: true`, `demonstration: false`):

- Planning an MVP for a Startup
- Choosing Between Native and Cross-Platform Apps
- What Startups Should Know About AI Integration
- Building Maintainable SaaS Applications

The byline is “Vortex Digital.” They do not name an employee, cite a study, or describe a customer. In `astro dev` they appear on `/insights` under “Editorial review · local only” and their URLs render with a review badge and `noindex`. The production build does not emit those routes, and they are not in the sitemap.

Older demonstration posts stay unpublished.

## 4. UI/UX refinements

- Header loses one item until Insights has a published article, which keeps the 1024px bar from crowding. Measured at 1024px: Contact ends at 727px, “Let’s Talk” starts at 833px, no overlap, no horizontal overflow.
- Homepage role directory: one column under 640px, two from 640px, three from 1024px. Thumbnails are the existing 384px files, displayed at 48px.
- Portfolio, contact, and footer states read as intentional empty or unconfigured states rather than unfinished mockups.
- Design tokens were not replaced. No new neon, glass, or decorative sections were added.

## 5. Functional improvements

- Primary calls to action land on a page with real content: services, process, team profiles, or the contact form.
- Form still validates every required field, moves focus to the first invalid field, and does not show “Message submitted” while Formspree is unset. Empty submit in the browser produced the field errors and the status “Check the highlighted fields and try again.”
- A real endpoint still requires only `PUBLIC_FORMSPREE_ENDPOINT`. No form source change is required. Setup is in `docs/contact-delivery.md`.
- Header and footer Insights links return automatically when a post is published.

## 6. Files changed

- `src/pages/index.astro`
- `src/pages/portfolio/index.astro`
- `src/pages/insights/index.astro`
- `src/pages/insights/[slug].astro`
- `src/pages/contact.astro`
- `src/pages/privacy.astro`
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/components/forms/ContactForm.astro`
- `src/components/cards/BlogCard.astro`
- `src/content.config.ts`
- `src/styles/global.css`
- `src/content/blog/planning-an-mvp-for-a-startup.md`
- `src/content/blog/native-vs-cross-platform-apps.md`
- `src/content/blog/what-startups-should-know-about-ai-integration.md`
- `src/content/blog/building-maintainable-saas-applications.md`
- `tests/e2e/smoke.spec.ts` (public portfolio subheading assertion updated to the honest empty state)
- `.env.example`
- `docs/contact-delivery.md`
- `STEP_7_REPORT.md`, `WEBSITE_COMPLETION_STATUS.md`, `FINAL_CONTENT_REQUIREMENTS.md`

Not changed: team image files, team slugs, service slugs, `publicationApproved` (still false on all six studies), `isPublished` (still false on all nine roles), sample case studies, legal name, domain, and form endpoint.

## 7. Accessibility findings

Checked in the running site and in code:

- One `h1` per page visited. Homepage section headings are `h2`, cards `h3`.
- Form controls have labels. Empty submit sets `aria-invalid` and visible errors. Focus moves to the first invalid field.
- `:focus-visible` is a 2px lavender outline.
- Role-directory images use empty alt because the link text is the role.
- Honeypot is off-screen, `tabindex="-1"`, and `aria-hidden="true"`.
- Reduced motion still disables animation and the reveal hide.
- Sampled contrast (sRGB): muted `#A7A0BD` on `#090713` is 8.00:1; lavender `#C084FC` on `#090713` is 7.56:1; primary text `#F8F7FF` on `#090713` is 18.77:1. This is a sample, not a full audit.
- The Astro dev toolbar audit reported no accessibility or performance issues on the homepage, services, a service detail, contact, and the dev portfolio. That scanner is not a WCAG evaluation.
- axe-core is not installed. WCAG conformance is not claimed.

## 8. Performance changes

No images were regenerated or recompressed. Team and portfolio files are unchanged. Below-the-fold role thumbnails use `loading="lazy"` and explicit width and height. No dependency was added. No client script was added except the existing contact and filter scripts. Editorial articles are absent from the production HTML, so they add no public weight.

## 9. Browser test results

Dev server `http://127.0.0.1:4322`. Production preview `http://127.0.0.1:4321` after the final build.

| Width | Homepage | Notes |
| --- | --- | --- |
| 375 | No document overflow. Menu button shown. Headline wraps inside the hero card. Role list is one column. | |
| 768 | No overflow. Desktop nav hidden. Menu shown. | |
| 1024 | No overflow. Desktop nav and “Let’s Talk” visible, no overlap. | |
| 1440 | No overflow. Seven nav links, no overlap. | |
| 1920 | No overflow. “Let’s Talk” ends near 1593px. | |

Also at 375px: `/services/web-application-development` had no overflow and no failed resource requests. Dev `/portfolio` had no overflow. Six portfolio card images were in the DOM; none of the completed ones were broken (two were still lazy-pending).

Journeys:

- A. `/services` lists eight services. `/services/web-application-development` renders and offers “Discuss Your Web Application.” `/contact` loads the form.
- B. Homepage role links cover all nine seats. `/team/founder-ceo` and `/team/gallery` return 200. Gallery markup contains 27 team image references.
- C. `/process` returns 200. Contact is the next step from that page’s existing CTA.
- D. No approved case study. Production `/portfolio/born-to-rock` is 404. Dev review page is 200. Same pattern for the other five slugs was confirmed earlier in this project and the production sitemap still excludes them.
- E. No approved article. All four new article URLs are 200 in dev and 404 in production.
- F. Empty submit shows field errors and does not show a success panel. Delivery stays `data-delivery="unconfigured"`. A live Formspree submit was not run because no endpoint is configured. That integration is not marked passed.

HTTP 200 on production for `/`, `/about`, `/services`, all eight service slugs, `/portfolio`, `/process`, `/team`, `/team/founder-ceo`, `/team/gallery`, `/insights`, `/contact`, `/privacy`, `/terms`. `/missing-page` is 404.

## 10. Automated test results

Final run after the process-title change:

- `npm test`: 10 passed, 0 failed (inquiry and portfolio unit tests).
- `npm run check`: 0 errors, 0 warnings, 74 hints. The hints are the existing `z` deprecation from `astro:content`.
- `npm run build`: success, 29 pages. No portfolio review routes. No editorial article routes.
- `npm run test:e2e`: 7 passed.

`publicationApproved` is false on all six case studies. `isPublished` is false on all nine roles.

## 11. Remaining limitations

- Contact delivery is not live. “Open in email” opens the visitor’s mail app with the configured address, which is still the placeholder, so it is not a working inbox.
- Public portfolio has no case studies. The six reviews are development-only.
- Public team pages describe roles. They do not name people.
- Insights has no published articles. The four new pieces are editorial review only.
- Privacy and terms still need counsel. They say so.
- `legalName`, a public address, social profiles, verified stats, and verified testimonials are still absent. Those sections stay empty or hidden.
- `PUBLIC_SITE_URL` is still `https://example.com` until a domain is connected. This step did not set hosting or a domain.
- The package name in `package.json` remains `velora-website`. It is not shown on the site.
- No WCAG audit tool was run.

## 12. Outstanding information required from the owner

See `FINAL_CONTENT_REQUIREMENTS.md` and `docs/contact-delivery.md`. Short version: real identities, portfolio contribution and permission, any technologies you want stated as verified, a Formspree endpoint and a real inbox, and approval if Insights should go public.
