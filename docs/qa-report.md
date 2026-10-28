# QA report

Date: 26 October 2026. Preview used for browser tests: `http://127.0.0.1:4321`, serving the `dist` from `npm run build`.

## Commands and results

| Command | Result |
| --- | --- |
| `python3 scripts/check_team_asset_files.py` | Pass. 27/27 WebP files present and unique. |
| `npm test` | Pass. 5 unit tests in `tests/unit/inquiry.test.ts`. |
| `npm run check` | Pass. 0 errors, 31 hints. The hints are Astro’s deprecation of `z` inside `src/content.config.ts`. |
| `npm audit` after `npm audit fix` | 0 vulnerabilities. |
| `npm run build` | Pass. 29 pages. |
| `npm run test:e2e` | Pass. 6 Playwright tests, 36.4s, Google Chrome. |
| Lighthouse | Not run. No score is claimed. |
| axe | Not run. |

## Browser checks that passed

- `/`, `/about`, `/services`, `/portfolio`, `/process`, `/team`, `/team/gallery`, `/insights`, `/contact`, `/privacy`, and `/terms` returned HTTP 200.
- Homepage heading contains “We Build Software That Moves Business Forward” and “Start Your Project” links to `/contact`.
- `/team` shows 9 “View Profile” links and “View All 27 Images”.
- `/team/gallery` has 27 team images, 27 distinct paths, each with `naturalWidth > 0` and non-empty alt text.
- Each of the nine profile routes shows 3 images for that slug and the heading “Working Together”.
- Empty contact submit shows field errors. The success panel stays hidden. The page shows `CONTACT FORM NOT LIVE`.
- `/missing-page` returns the custom 404.
- At 375px the menu button opens.
- Founder profile and gallery expose `noindex`.
- Horizontal overflow was 0 at 375, 768, 1024, 1440, and 1920 on `/`, `/about`, `/portfolio`, `/team`, `/team/gallery`, and `/contact` (30 checks).

## Not verified

- A message was not delivered to a real inbox. `PUBLIC_FORMSPREE_ENDPOINT` is empty.
- Security headers in `public/_headers` were not observed on `astro preview`. They apply when Cloudflare Pages serves the site.
- Keyboard coverage beyond the mobile menu and form errors was not a full tab-through of every page.
- No staging or production URL was opened.
