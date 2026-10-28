# Step 8D report

GoWabi is the fourth published portfolio case study. The public set is ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, and GoWabi. Born To Rock, Daniela Diamonds, and the sample studies stay unpublished.

## 1. Final GoWabi case-study content

Public URL: `/portfolio/gowabi`

Document title: GoWabi Marketing Website | Vortex Digital

Visible heading: GoWabi — Beauty & Wellness Marketing Website

Card title: GoWabi

Subtitle: Frontend website development focused on GoWabi's brand, services, and public interface.

Category: Web Development / Beauty & Wellness

The page has one `h1`. It presents GoWabi as a beauty and wellness brand whose public website introduces services, and it limits Vortex Digital's work to the marketing website layout and interface. The public site credit to the GoWabi Team is kept. This case study does not reassign the rest of the product.

Meta description: Explore Vortex Digital's GoWabi marketing website development, including frontend layout and brand presentation using HTML, CSS, and JavaScript.

Canonical URL uses the existing site setting. With no `PUBLIC_SITE_URL`, that is `https://example.com/portfolio/gowabi/`. The built page has no `noindex`.

The live button reads “Visit Live Website” and points to `https://www.gowabi.com/`. A request to that URL redirects to `https://www.gowabi.com/en` and returns HTTP 200.

The closing call to action is “Need a Website That Represents Your Brand?” with “Discuss Your Project” linking to `/contact`.

## 2. Confirmed engagement and dates

- Role: Public marketing website development
- Dates: February 2025 – August 2026
- Status: Completed
- Modules: marketing website frontend layout; public website interface; brand presentation; beauty and wellness service presentation
- Permission: agency owner approved the public showcase and all three existing website screenshots
- `contributionVerified: true`
- `publicationApproved: true`
- `featured: true`
- `homeRank: 4`

`integrationsDeveloped` and `qaContribution` are empty and are omitted. `metrics` is empty, so no outcomes block is rendered.

## 3. Technology stack

HTML, CSS, and JavaScript, for the public marketing website.

- HTML: page structure and content presentation
- CSS: layout, styling, and responsive presentation
- JavaScript: frontend behavior and interactions

No library, animation, or API integration is named. Next.js, React, Vue, Nuxt, WordPress, PHP, Laravel, Shopify, Node.js, TypeScript, Python, PostgreSQL, MySQL, AWS, and Firebase are not listed as this engagement's stack.

## 4. Development scope restrictions

The page says the work is the marketing website, not the booking marketplace behind the pages.

Screenshots that show search, listings, prices, ratings, and a map are labeled as visible public product context. They are not described as Vortex Digital booking, payment, account, or marketplace modules.

Not claimed: booking, availability, payments, vouchers, accounts, merchant tools, provider management, databases, backend APIs, mobile apps, or marketplace infrastructure.

## 5. Actual screenshot paths

- `/assets/portfolio/gowabi/gowabi-01-home.jpg` — public homepage: brand, promotion, and service categories
- `/assets/portfolio/gowabi/gowabi-02-listings.jpg` — public spa and massage listings
- `/assets/portfolio/gowabi/gowabi-03-venue.jpg` — public venue page with gallery, ratings, and a map

## 6. Screenshot file verification

All three files decode as JPEG at 1348×926. They show the GoWabi site: the homepage promotion and category icons, the spa and massage listings, and the PANPURI WELLNESS Gaysorn Tower venue page. The files were not regenerated.

Gallery frames use the landscape ratio 1.456, matching 1348/926. They are not shown in a phone frame. At 1440px each gallery image rendered at 1280×879.

Chrome opened the listings image, showed the caption that it is visible product interface and not a confirmed marketplace module, closed the dialog with Escape, and returned focus to that control.

## 7. Changes to publication flags

| Project | publicationApproved | featured | homeRank |
| --- | --- | --- | --- |
| ScaleUp Systems | true | true | 1 |
| MedaStaré | true | true | 2 |
| Gain Energy / Upstrima | true | true | 3 |
| GoWabi | true | true | 4 |
| Born To Rock | false | false | 4 |
| Daniela Diamonds | false | false | 6 |

Born To Rock's rank was already 4 and was left unchanged. It is not public, so it does not appear beside GoWabi in production. Sample studies remain `sample: true`. A project is public only when it is not a sample and `publicationApproved` is true.

## 8. Homepage featured-work updates

The featured-work helper now keeps four approved projects instead of three. The existing “Approved client work.” section shows, in order:

1. ScaleUp Systems
2. MedaStaré
3. Gain Energy / Upstrima
4. GoWabi — Marketing website development using HTML, CSS, and JavaScript.

Each card uses that project's first approved screenshot, category, confirmed technology tags, and case-study link. At 768px and above the four cards sit in two columns. At 1440px those columns were 630px wide. Below 768px they stack.

## 9. Portfolio overview updates

`/portfolio` shows the same four cards and no empty placeholders. Category filters stay hidden. ScaleUp Systems has no filter tag, so a category bar would hide it from every filter. Filters still appear in development, where more than four projects are visible. Unpublished studies are not in the production card list, so they cannot be revealed by filtering.

## 10. Related-project behavior

GoWabi links to ScaleUp Systems, MedaStaré, and Gain Energy / Upstrima, in home-rank order. Those three pages now also link to GoWabi, because related projects are the other approved studies. Born To Rock, Daniela Diamonds, and the samples are not linked.

## 11. Files modified

- `src/content/case-studies/gowabi.md`
- `src/utils/portfolio.ts` — homepage featured limit raised from 3 to 4
- `src/pages/index.astro` — four featured cards use two columns
- `src/pages/portfolio/index.astro` — four-card grid; filters stay hidden at four projects
- `src/styles/global.css` — two-column portfolio grid for four cards at wide widths
- `tests/unit/portfolio.test.ts`
- `tests/e2e/smoke.spec.ts`
- `PORTFOLIO_CONTENT_REQUIRED.md`
- `STEP_8D_REPORT.md`

ScaleUp Systems, MedaStaré, and Gain Energy case-study copy was not rewritten.

## 12. Unit test results

`npm test`: 10 passed, 0 failed.

## 13. Astro/TypeScript check results

`npm run check`: 0 errors, 0 warnings, 86 hints. The hints are the existing Zod `z` deprecation.

## 14. Production build and page count

`npm run build`: 33 pages. The added page is `/portfolio/gowabi`.

## 15. E2E test results

`npm run test:e2e`: 7 passed.

The portfolio test checks four cards in order, the GoWabi heading, the live website link, the HTML/CSS/JavaScript scope, the statement that this is not the booking marketplace, three screenshot paths, related links to the other three approved studies, the absence of “booking engine”, “payment processing”, and “Ruby on Rails”, no Next.js or React in GoWabi's technology section, 404s for Born To Rock and Daniela Diamonds, and the sitemap.

## 16. Responsive layout checks

Chrome compared `scrollWidth` with `clientWidth` on the production preview. No horizontal overflow:

| Page | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| `/` | clear | clear | clear | clear |
| `/portfolio` | clear | clear | clear | clear |
| `/portfolio/gowabi` | clear | clear | clear | clear |
| `/portfolio/scaleup-systems` | clear | clear | clear | clear |
| `/portfolio/medastare` | clear | clear | clear | clear |
| `/portfolio/gain-energy-upstrima` | clear | clear | clear | clear |
| `/contact` | clear | clear | clear | clear |

At 1440px the homepage featured grid and the portfolio grid were both two columns of 630px.

## 17. Sitemap verification

The sitemap includes `scaleup-systems`, `medastare`, `gain-energy-upstrima`, and `gowabi`. It does not include `born-to-rock`, `daniela-diamonds`, or `sample-brand-platform`.

## 18. Remaining unverified content

Still unknown for GoWabi, and not claimed:

- Marketplace backend contributions
- Booking system contributions
- Payment integrations
- Individual marketplace modules
- Any framework beyond HTML, CSS, and JavaScript
- Performance or business metrics

`PORTFOLIO_CONTENT_REQUIRED.md` still lists the open items for Born To Rock, Daniela Diamonds, and the unverified application work on the other published projects.

## 19. Outstanding website blockers

- A real canonical domain is still unset, so canonical URLs remain on `https://example.com` until `PUBLIC_SITE_URL` is changed.
- Contact delivery is still unconfigured. The case-study button reaches that form.
- Born To Rock and Daniela Diamonds stay unpublished until their own contribution and image rights are confirmed.
