# Step 8F Report — Born To Rock

Born To Rock is published as the sixth approved case study. The public portfolio is now the full original set: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, and Born To Rock. Sample studies stay unpublished.

## 1. Public title

Born To Rock — Mobile Rhythm Game

Card title: Born To Rock

Subtitle: Mobile rhythm game development with React, Ionic, and PixiJS.

Document title: Born To Rock Mobile Game | Vortex Digital

## 2. Portfolio route

`/portfolio/born-to-rock`

Canonical while `PUBLIC_SITE_URL` is unset: `https://example.com/portfolio/born-to-rock/`

The page has one `h1` and no `noindex` robots meta. The meta description is the Born To Rock frontend-development sentence. The Open Graph image is the first App Store screenshot, `rock-1.png`.

## 3. Live App Store URL

https://apps.apple.com/us/app/born-to-rock-rhythm-game/id6789210953

Taken from the existing draft. A request to that URL returned HTTP 200. The button label is “View on App Store”.

## 4. Confirmed contribution wording

Vortex Digital developed the complete Born To Rock mobile rhythm game using React, Ionic, and PixiJS. The work included core rhythm gameplay, player input, audio synchronization, scoring, and the in-game interface and navigation.

The page states that this is the complete game engagement. It does not reduce the work to UI only, and it does not claim modules outside the confirmed list.

## 5. Confirmed delivered game systems

- Core rhythm gameplay
- Player input handling
- Audio synchronization
- Scoring system
- In-game user interface
- Menus
- Navigation

No timing algorithm, frame rate, latency figure, or scoring formula is described.

## 6. Technology stack

React, Ionic, and PixiJS.

- React: component-based application interface
- Ionic: mobile-oriented application interface and experience
- PixiJS: 2D graphics and rendering for the game experience

The technology section does not list Unity, Cocos, Capacitor, Phaser, Flutter, React Native, or a backend stack. Capacitor is not inferred from Ionic.

## 7. Engagement dates

April 2026 – Present. Status: Ongoing.

## 8. Screenshot file paths

Existing authorized App Store promotional screenshots, not regenerated:

- `/assets/portfolio/born-to-rock/rock-1.png`
- `/assets/portfolio/born-to-rock/rock-2.png`
- `/assets/portfolio/born-to-rock/rock-3.png`

Captions:

1. Promotional key art with a stage scene and a phone presentation of the game.
2. Promotional artwork of the rhythm screen, with note lanes and input buttons.
3. Promotional artwork of a leaderboard screen. The caption says this image does not establish that Vortex Digital built ranking, accounts, or cloud services.

## 9. Image dimensions and verification

PNG IHDR parse of the source files:

| File | Bytes | Width | Height |
| --- | ---: | ---: | ---: |
| rock-1.png | 1,850,803 | 600 | 1299 |
| rock-2.png | 957,248 | 600 | 1299 |
| rock-3.png | 970,142 | 600 | 1299 |

On the production preview, after the images decoded, all three gallery frames rendered at 320×693 (ratio 0.462, matching 600/1299). `naturalWidth` and `naturalHeight` were 600 and 1299. At 375px the same three frames were 320×693. They use the existing portrait gallery, not the landscape website frame.

The second image opened the dialog. Escape closed it and returned focus to that image trigger.

## 10. Screenshot provenance

The page calls the three images official App Store promotional screenshots. It does not describe them as runtime tests, debug builds, or development-environment captures. Marketing lines and on-screen figures in the artwork are not published as performance or business results.

## 11. Publication flag changes

Born To Rock:

- `contributionVerified: true`
- `publicationApproved: true`
- `featured: true`
- `homeRank: 6` (previously 4 while unpublished)

Preserved:

| Project | publicationApproved | homeRank |
| --- | --- | ---: |
| ScaleUp Systems | true | 1 |
| MedaStaré | true | 2 |
| Gain Energy / Upstrima | true | 3 |
| GoWabi | true | 4 |
| Daniela Diamonds | true | 5 |

Sample studies remain `sample: true` and are not `publicationApproved: true`.

`integrationsDeveloped` and `qaContribution` are empty. `metrics` is empty.

## 12. Final six-project ordering

1. ScaleUp Systems
2. MedaStaré
3. Gain Energy / Upstrima
4. GoWabi
5. Daniela Diamonds
6. Born To Rock

Homepage selection still requires a public, featured project before it sorts by `homeRank`. The cap is now six.

## 13. Homepage layout changes

`/` shows six approved cards in that order.

At 1440px the grid is three columns and two rows. Each card is 413px wide. At 768px and 1024px the grid is two columns of equal width. At 375px the six cards stack at 335px.

Portrait shots stay in the mobile frame. Born To Rock and MedaStaré card images measured 207×448 (ratio 0.462). Website screenshots stayed landscape, about 411×282 at 1440px. Images are contained, not stretched.

## 14. Portfolio overview changes

`/portfolio` shows the same six studies in the same order, with no placeholder cards.

At 1440px the portfolio grid is also three columns and two rows. Tablet is two columns. Mobile is one column.

Category filters stay hidden. ScaleUp Systems, GoWabi, and Daniela Diamonds still have no filter tags, so a category bar would hide approved projects. The bar renders only when every visible project has at least one filter. Born To Rock keeps the Mobile tag for later, and that tag is not turned into a button while the other studies are untagged.

## 15. Related-project behavior

Related cards are the other public projects, sorted by `homeRank`. There is no three-card cap. A cap of three, taken from the lowest ranks, would leave Born To Rock off every other case study.

On Born To Rock the related set is:

1. ScaleUp Systems
2. MedaStaré
3. Gain Energy / Upstrima
4. GoWabi
5. Daniela Diamonds

The earlier five pages now include Born To Rock in that same public set. Sample studies are excluded.

## 16. Files created or modified

- `src/content/case-studies/born-to-rock.md`
- `src/content.config.ts` (`ctaLabel`, so the game page can say “Discuss Your Game” without changing the other buttons)
- `src/components/portfolio/CaseStudy.astro`
- `src/utils/portfolio.ts`
- `src/pages/portfolio/index.astro`
- `tests/unit/portfolio.test.ts`
- `tests/e2e/smoke.spec.ts`
- `PORTFOLIO_CONTENT_REQUIRED.md`
- `STEP_8F_REPORT.md`

Previously approved case-study copy was not rewritten. Homepage card classes were left as they were: six projects already use the two-column tablet grid and the three-column desktop grid.

## 17. Unit test results

`npm test` — 10 passed, 0 failed.

The homepage fixture expects the six approved ids and drops a seventh featured project at `homeRank` 7. The Born To Rock file is required to be approved, featured, and `homeRank: 6`. Samples remain ineligible.

## 18. Astro/TypeScript check results

`npm run check` — exit 0.

- 0 errors
- 0 warnings
- 87 hints (existing `z` deprecation hints in `src/content.config.ts`, one more than Step 8E because of `ctaLabel`)

## 19. Production build page count

`npm run build` — 35 pages built in 8.82s.

That includes `/portfolio/born-to-rock/index.html`. Step 8E was 34. One new case-study route accounts for the increase. A walk of `dist` matches that count.

## 20. End-to-end test results

First `npm run test:e2e` run: 6 passed, 1 failed. The contact-form test timed out waiting for `#full-name-error`. The failure snapshot already showed the validation text “Enter your full name.” A direct check of the same preview then found that error visible after “Open in email”. The contact form was not changed in this step.

Rerun of `npm run test:e2e`: 7 passed, 0 failed (47.3s), including the contact test in 3.0s and “six approved case studies are public” in 10.6s.

The portfolio smoke test checks six public cards in order, the Born To Rock page (title, App Store URL, React/Ionic/PixiJS, April 2026 – Present, three screenshots, no Unity/Cocos/Capacitor in the technology section, no Unity/Capacitor/backend in the contribution section, no download or revenue figures), related links to the other approved studies, a 404 for `sample-brand-platform`, and the sitemap.

## 21. Responsive browser test results

Chrome against the production preview at `http://127.0.0.1:4321`.

Widths: 375, 768, 1024, 1440.

Routes: `/`, `/portfolio`, `/portfolio/born-to-rock`, `/portfolio/scaleup-systems`, `/portfolio/medastare`, `/portfolio/gain-energy-upstrima`, `/portfolio/gowabi`, `/portfolio/daniela-diamonds`, `/contact`.

No horizontal overflow (`scrollWidth` stayed within `clientWidth`) on those routes at those widths.

Card geometry is in sections 13 and 14. Gallery behavior is in section 9. `/portfolio/sample-brand-platform` returned 404. The portfolio index rendered 0 filter buttons.

## 22. Sitemap verification

`dist/sitemap-0.xml` has 22 URLs, host `https://example.com`. Portfolio URLs:

- `/portfolio/`
- `/portfolio/scaleup-systems/`
- `/portfolio/medastare/`
- `/portfolio/gain-energy-upstrima/`
- `/portfolio/gowabi/`
- `/portfolio/daniela-diamonds/`
- `/portfolio/born-to-rock/`

It does not include `sample-brand-platform` or any other `sample-` slug.

## 23. Sample-project publication safeguards

`isPublicProject` still rejects `sample: true` even if `publicationApproved` is true. Production routes and the sitemap use that rule. The sample slug checked in the browser and in Playwright returns 404. The unit test still requires every `sample-*.md` file to stay `sample: true` and not `publicationApproved: true`.

## 24. Remaining unverified project details

Still not claimed for Born To Rock:

- Native wrapper or packaging details
- Exact audio implementation architecture
- Third-party integrations
- Monetization, purchases, and advertising
- Leaderboards, cloud saves, player accounts, and multiplayer
- Backend services and game servers
- Music licensing
- Any tool beyond React, Ionic, and PixiJS
- Testing or App Store release responsibilities
- Performance metrics
- Business results

The leaderboard in `rock-3.png` is described as promotional artwork only.

Outstanding items for the other five published projects remain in `PORTFOLIO_CONTENT_REQUIRED.md`.

## 25. Outstanding website-wide blockers

These were not changed in this step:

- `PUBLIC_SITE_URL` is still the `https://example.com` placeholder. Canonical URLs and the sitemap use that host.
- The contact form is still unconfigured. “Open in email” does not confirm delivery.
- Team profile names remain unpublished.
- Insights drafts stay out of production.
- The site was not deployed, and DNS was not changed.
