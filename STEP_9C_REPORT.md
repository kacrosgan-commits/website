# Step 9C report — Insights

## 1. Executive summary

Step 9C is complete. The existing Insights section now has one publication rule, twelve unpublished drafts, and a public page that says the articles are still being prepared. No article was published. Zero posts are owner-approved.

The six portfolio studies and the nine named team profiles were not edited. The site was not deployed.

## 2. Existing architecture and routes

Insights already lived at `/insights` and `/insights/[slug]`, backed by the `blog` collection in `src/content/blog`. Cards are `BlogCard.astro`. The header and footer hid the Insights link when no post passed the old public filter (`draft` false and `demonstration` false). The homepage could show up to three posts with the same filter. The sitemap dropped any Markdown file with `draft`, `demonstration`, or `sample` set true.

That filter was not an approval check. A file with both flags false would have been public even with no owner decision. `featured: true` on one stub did not publish it only because `demonstration` was still true.

Local development still opens drafts for reading. The production build does not.

## 3. Inventory of preexisting articles

None of these files had `publicationApproved` or `status: published` before this step. Word counts are the body before this edit.

| Slug | Path | Original status | Approval evidence |
| --- | --- | --- | --- |
| `building-maintainable-saas-applications` | `src/content/blog/building-maintainable-saas-applications.md` | `draft: true`, `editorialReview: true`, author Vortex Digital, category SaaS, 532 words | none |
| `native-vs-cross-platform-apps` | same folder | `draft: true`, `editorialReview: true`, 566 words | none |
| `planning-an-mvp-for-a-startup` | same folder | `draft: true`, `editorialReview: true`, 549 words | none |
| `what-startups-should-know-about-ai-integration` | same folder | `draft: true`, `editorialReview: true`, 547 words | none |
| `building-scalable-web-applications` | same folder | `demonstration: true`, `draft: false`, author “Editorial desk”, 108 words | none |
| `choosing-architecture-for-a-saas-product` | same folder | demonstration stub, 123 words | none |
| `deploying-applications-with-confidence` | same folder | demonstration stub, 194 words | none |
| `how-to-plan-a-custom-software-project` | same folder | demonstration stub, `featured: true`, 175 words | none |
| `improving-mobile-application-performance` | same folder | demonstration stub, 102 words | none |
| `integrating-ai-into-existing-applications` | same folder | demonstration stub, 128 words | none |

`featured: true` was not treated as approval.

## 4. Editorial changes to preexisting drafts

The four longer drafts kept their argument. Each gained the approval fields, a category from the eight services, `updatedAt: 2026-10-27`, a short takeaway, and one internal link. The AI draft and the native-or-cross-platform draft also gained a decision table. The SaaS and MVP drafts gained a short checklist.

The six stubs were rewritten into full drafts. Permalinks stayed the same. Demonstration language and the “Editorial desk” byline were removed. The deploy stub’s title no longer says “confidence.” The planning stub no longer repeats the MVP article; it is now the written brief. `featured` on that stub is false.

No draft links to another draft. No draft names a client result, a staff author, or a metric.

## 5. New drafts

Both are unpublished (`publicationApproved: false`, `status: review`).

| Title | Slug | Path | Audience | Words |
| --- | --- | --- | --- | --- |
| API Habits for a Small Product Team | `api-habits-for-a-small-product-team` | `src/content/blog/api-habits-for-a-small-product-team.md` | Founders and engineers shaping a first API | about 1,080 |
| UX and QA Checks Before a Product Launch | `ux-and-qa-before-a-product-launch` | `src/content/blog/ux-and-qa-before-a-product-launch.md` | Teams about to put a web or mobile product in front of users | about 1,030 |

No further drafts were added. The other candidate topics were already covered once the stubs were expanded.

## 6. Coverage of the eight specialties

| Specialty | Drafts |
| --- | --- |
| Web Development | Building Scalable Web Applications |
| Mobile Apps | Choosing Between Native and Cross-Platform Apps; Improving Mobile Application Performance |
| AI Solutions | What Startups Should Know About AI Integration; Integrating AI Into Existing Applications |
| SaaS Development | Planning an MVP; Architecture for an Early-Stage SaaS Product; Building Maintainable SaaS Applications; How to Plan a Custom Software Project |
| Backend & APIs | API Habits for a Small Product Team |
| Cloud & DevOps | A Lean Release Setup for a Startup |
| UI/UX Design | UX and QA Checks Before a Product Launch |
| QA & Testing | Same article. The card category is UI/UX Design. The body links to the QA service as well. |

The custom-project brief is categorized as SaaS Development because that is the closest public service. The article itself says the brief applies to a product build, not only to multi-tenant billing.

## 7. Publication predicate

`isPublicInsight` in `src/utils/insights.ts` is the rule:

- `publicationApproved === true`
- `status === "published"`
- `draft`, `demonstration`, and `sample` are not true

Defaults in `src/content.config.ts` are private: `publicationApproved` false, `status` draft, `draft` true, `demonstration` true.

The same function is used by:

- `src/pages/insights/index.astro`
- `src/pages/insights/[slug].astro` (`getStaticPaths`, related notes, schema, robots)
- `src/pages/index.astro`
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `frontmatterIsPublicInsight`, which the sitemap calls from `astro.config.ts`

Related notes use `relatedPublicInsights`, which filters with `isPublicInsight` before it ranks them. Sorting is `publishedAt` descending, then slug. Drafts have no `publishedAt`, so they cannot win a tie on the public list.

`getStaticPaths` emits a page only for a public post. In `astro dev`, a file with `editorialReview: true` is also readable on the machine. That branch is compiled out of the production build.

## 8. Public posts and unpublished drafts

Public posts: **0**.

Unpublished drafts: **12**, all `status: review`, all `publicationApproved: false`.

Planning an MVP for a Startup. Choosing Between Native and Cross-Platform Apps. What Startups Should Know About AI Integration. Building Maintainable SaaS Applications. Architecture for an Early-Stage SaaS Product. Building Scalable Web Applications. A Lean Release Setup for a Startup. How to Plan a Custom Software Project. Improving Mobile Application Performance. Integrating AI Into Existing Applications. API Habits for a Small Product Team. UX and QA Checks Before a Product Launch.

## 9. Insights index

`/insights` remains a real page. With zero approved posts the H1 is “Insights are being prepared.” A card states that nothing is published yet and links to `/services` and `/portfolio`. There is no draft grid, no filter, no search, and no subscriber count.

The header and footer still omit Insights until at least one post is public. That was the existing navigation rule. The URL stays available and is still in the sitemap. Direct visits work. The empty state does not pretend articles are live.

In local development only, the index also lists the drafts under “Drafts on this machine,” with an “Awaiting owner approval” badge and no publication date.

## 10. Article route and layout

Approved routes would render through the existing Markdown pipeline: one H1, the category, a computed reading time, the body, and a link back to Insights. A contents list appears when the article has at least four level-two headings. Those links use the ids the Markdown renderer already assigns. Related notes render only for other public posts, so the current set shows none.

Draft routes are not in `dist`. Visiting `/insights/planning-an-mvp-for-a-startup` and `/insights/api-habits-for-a-small-product-team` on the production preview returns 404.

On the local dev server, the API draft was checked separately. Its contents links match heading ids, the page is `noindex, follow`, the H1 is the article title, and a 375px viewport does not scroll sideways. The code sample scrolls inside its own box.

## 11. Author, date, and attribution

The byline stored on each draft is “Vortex Digital,” the organization. The article header prints the company name, not a person. Schema, when a post is actually public, uses `Organization` for author and publisher. No employee is named as an author.

`pubDate` remains the writing date required by the older schema. It is not shown. `publishedAt` is unset on every file, so a public card would not invent a publication date. `updatedAt` is 27 October 2026 and is not displayed as a publish date.

No article quotes a client, names a portfolio contribution, or uses a third-party logo. The decorative SVGs that had been attached to three old article ids are no longer shown. They were not pictures of these articles. The files were left in place and not regenerated.

## 12. Readability, categories, excerpts, related reading, links

Categories are limited to the eight service names. The card excerpt is the frontmatter description, a full sentence, not a mid-word trim.

Reading time uses `WORDS_PER_MINUTE = 220` in `src/utils/format.ts`, from the article text. The public empty page does not show a reading time. A future public card would.

Related reading cannot include a draft. Internal links in the drafts were checked against routes that exist:

- `/services/web-application-development`
- `/services/mobile-app-development`
- `/services/ai-intelligent-automation`
- `/services/saas-platform-development`
- `/services/backend-api-engineering`
- `/services/cloud-devops`
- `/services/ui-ux-product-design`
- `/services/qa-software-testing`
- `/process`

No draft links to `/insights/<slug>`. No external URL was added. Standards such as WCAG are named as checks, not as a certification and not as a citation with an unverified link.

## 13. SEO, Open Graph, and structured data

The index title is “Insights · Vortex Digital.” The description says articles are being prepared and are not published until approved. Canonical URLs still come from the existing site helper. `PUBLIC_SITE_URL` was not changed. The host in the built sitemap is still `https://example.com`.

The index uses the existing site share image from the layout. No article-specific image was created. BlogPosting JSON-LD is built only for a public post, and it omits `datePublished` unless `publishedAt` is set. It does not include an image field. Unpublished dev copies are `noindex` and do not emit that schema.

## 14. Sitemap and feeds

`dist/sitemap-0.xml` has 31 page URLs, the same count as Step 9B. `https://example.com/insights/` is one of them. None of the twelve slugs appear. Sample portfolio slugs do not appear. There is no RSS feed and none was added.

A search of the built HTML and JS found none of these draft strings: “An MVP is the smallest version,” “Planning an MVP,” “Architecture for an Early-Stage,” “API Habits for a Small,” “idempotency key,” or `publicationApproved`.

The production build lists 35 HTML pages and no `/insights/<slug>/` route.

## 15. Visual checks

Production preview at `http://127.0.0.1:4321`, Chrome, widths 375, 768, 1024, and 1440.

Routes: `/insights`, `/`, `/about`, `/team`, `/team/founder-ceo`, `/portfolio`, `/portfolio/scaleup-systems`, `/services`, `/services/web-application-development`, `/contact`.

No horizontal overflow on those routes. `/insights` has one H1, “Insights are being prepared.” The primary nav does not include Insights. Draft titles are absent. The intentional draft URL returns 404. The console error recorded during that visit is the 404 itself.

Below-the-fold images reported `naturalWidth` 0 before they were scrolled into view. Requests for the ScaleUp screenshot, Don Tran’s portrait, a work scene, and a Born To Rock screenshot each returned HTTP 200. They are lazy, not missing.

Screenshots of `/insights` at 1440 and 375 show the existing dark purple page, the empty-state heading, and readable body copy. The 375 page stacks the heading and does not clip it.

The article layout was checked only on the local dev server, because production has no article page. See section 10.

## 16. Accessibility

The empty state uses a real H1, an H2, and two links with a 48px minimum height. Tabbing to the services link shows a 2px solid focus outline. The mobile menu at 375px opens, does not list Insights, still lists Services, and Escape sets `aria-expanded` back to false. That menu behavior is also covered by the existing mobile-nav smoke test.

The draft article’s contents control is a `nav` with `aria-label="On this page"` and real fragment links. Heading order on that local page is one H1, then H2s. The production index was the page exercised in the browser. Reduced motion was already handled by the site CSS and was not changed for this step.

## 17. Performance and dependencies

No dependency was added or upgraded. A rehype plugin was tried and removed: Astro 7’s current Markdown processor rejects `rehypePlugins` unless `@astrojs/markdown-remark` is installed, and that package was not added. Heading ids already come from the built-in processor.

No new font, animation, or client framework. The index ships the existing page script, which does nothing when there are no filters. Article pages are not in the production output, so their contents list is not downloaded by visitors.

## 18. Files changed for this step

- `src/utils/insights.ts` — public predicate, sort, related posts, sitemap frontmatter check
- `src/content.config.ts` — approval fields, status, dates, category enum
- `astro.config.ts` — sitemap uses the same predicate for Insights; portfolio rules unchanged
- `src/utils/format.ts` — documents the 220-word reading-time estimate
- `src/styles/global.css` — article tables, code blocks, contents links
- `src/pages/insights/index.astro` — empty state; local drafts only in dev
- `src/pages/insights/[slug].astro` — public routes only in production; contents and related posts
- `src/components/cards/BlogCard.astro` — text cards, no fake publish date, no mismatched illustration
- `src/components/layout/Header.astro` and `Footer.astro` — nav follows the predicate
- `src/pages/index.astro` — homepage strip uses the predicate
- `src/content/blog/*.md` — ten edited drafts and two new drafts
- `tests/unit/insights.test.ts`
- `tests/e2e/smoke.spec.ts`
- `INSIGHTS_CONTENT_REVIEW.md`
- `STEP_9C_REPORT.md`

Portfolio Markdown, team data, portraits, contact delivery, legal pages, and package versions were not edited.

## 19. `npm test`

First run of this step: 16 passed, 0 failed, exit 0. The four new Insights tests passed on that run. There was no failing rerun.

They check a default-private article, all twelve files on disk, the shared predicate and stable sort, rejection of samples and drafts, nonempty metadata for a public fixture, null links for unpublished slugs, and the six approved case studies plus the nine team names.

## 20. `npm run check`

The first run failed immediately. `markdown.rehypePlugins` is not active unless `@astrojs/markdown-remark` is installed. The plugin was removed instead of adding that package.

The second run finished with exit 0: 0 errors, 0 warnings, 91 hints. The hints are the existing Zod deprecation notes in `src/content.config.ts`, including the fields added for this step. Step 9B reported 87 hints before those fields existed.

## 21. `npm run build`

Exit 0. **35** HTML pages, the same count as Step 9B. No new article route. **31** URLs in `dist/sitemap-0.xml`. Build time was about 6.9 seconds. Output includes `/insights/index.html` and does not include an Insights slug directory.

## 22. `npm run test:e2e`

First run: **8 passed**, 0 failed, about 1.2 minutes, exit 0.

The new test checks the empty-state heading, the services and portfolio links, the absence of four draft titles, the absence of Insights in the desktop and mobile nav, 404 for two draft URLs, the absence of a draft title on the homepage, and the absence of those slugs from the sitemap. The sitemap still contains `/insights/`.

Existing tests still expect the six public case studies and the nine team profiles.

## 23. Portfolio regression

These six remain public and were not rewritten: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock. The unit test still requires `publicationApproved: true` and `sample: false` on each. Sample studies stay `sample: true` and unapproved. The smoke test still sees six homepage cards in the existing order and a 404 for `sample-brand-platform`.

## 24. Team regression

The nine published profiles are unchanged: Don Tran, Joshua Mendoza, Lin Jiayi, Pongsak Rattanakul, Dmytro Melnyk, Carlo Garcia, Matheus Pereira, Adrian Cruz, and Sofia Vasylivna Melnyk. `src/data/team.ts` was not edited. Portraits were not replaced. The gallery was not edited. Adrian’s external experience was not moved into Vortex Digital work. The smoke test still requires the nine portraits, Don’s title, and gallery `noindex`.

## 25. Approvals still required

Every article in `INSIGHTS_CONTENT_REVIEW.md` is blocked. The owner needs to read them and, for any one they want live, set `publicationApproved`, `status: published`, `draft: false`, `demonstration: false`, and `publishedAt` on that file only.

Highest priority for that read:

1. Confirm the architecture draft and the maintainable-SaaS draft should both exist.
2. Confirm the two AI drafts should both exist.
3. Confirm the planning brief and the MVP draft should both exist.
4. Decide whether the new API, release, and UX/QA drafts match how the company wants to teach those topics.
5. Decide whether “Vortex Digital” is the right organizational byline.

No personal authorship, client credit, or external citation was waiting on a source that this step pretended to resolve.

## 26. Launch issues left untouched

Not modified: domain, DNS, `PUBLIC_SITE_URL`, the `https://example.com` canonical host, business email, mailto settings, Formspree or any other contact delivery, booking URL, hosting, deployment, environment files, analytics, legal copy, package manager, and package versions.

Also untouched: portfolio copy and images, team biographies and portraits, the team gallery, and service-page content beyond links that already pointed at those routes.

## 27. Blockers and unchecked claims

No article is public, so the public article layout, its Open Graph article type, and its BlogPosting schema were not viewed on the production origin. They were typechecked, and one draft was read on the local dev server, including the contents links, a code block, and a 375px width.

Lazy images below the fold were not all scrolled into view. The ones requested directly returned HTTP 200.

No external source was opened in a browser for this step, and no external citation was added. WCAG is mentioned as a recommendation, not as a completed audit of this website or of a client product.

The Insights link stays out of the nav until a post is approved. That is the previous information architecture, kept on purpose. The page itself is public and indexed as an empty state.
