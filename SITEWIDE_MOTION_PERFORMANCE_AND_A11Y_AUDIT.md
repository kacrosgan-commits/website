# Site-wide motion performance and accessibility audit

Measurements are from this machine’s production build and Playwright run. They are not Lighthouse scores and not field Core Web Vitals. No CLS number was captured with a lab trace; that gap is stated below instead of filled in.

## Weight

| Asset | Before this pass | After |
| --- | --- | --- |
| Built CSS, raw | 51,640 bytes (`dist/_astro/BaseLayout.BHcZJaoK.css`, build already on disk) | 56,861 bytes (`BaseLayout.BFn4NZXM.css`) |
| Built CSS, gzip | Not retained; the previous file was replaced by the new build | 12,415 bytes |
| Contact form script | 6,833 bytes | 6,833 bytes, same filename hash |
| New packages | none | none |
| New font or CDN requests | none | none |

The CSS grew by 5,221 bytes raw, about 10%, for the shared tokens and classes. The reveal script is inline in the layout, so it does not add a network request. Motion uses opacity and transform. The new hero light does not animate `filter` or `box-shadow`. Permanent `will-change` hints were removed from the hero image layers.

## What was exercised

`CONTENT_SOURCE=local npm run build` produced 35 pages and 31 sitemap URLs, the same counts as the Step 10D baseline.

Playwright (`E2E_PORT=4322 CI=1 npm run test:e2e`, production `astro preview`) — 21 passed:

- No horizontal overflow at 320, 375, 768, 1024, and 1440 on the main route families.
- The existing suite also passed 200% root text at those widths on `/`, `/about`, a service detail, a case study, a team profile, `/process`, and `/contact`, plus 32px browser font navigation at 1024px.
- Reduced motion: `can-reveal` is absent, nothing is waiting to reveal, the hero opacity is 1, and its animation name is `none`.
- JavaScript disabled: homepage heading and primary CTA are visible; the contact form shows the unconfigured copy and the name field.
- Scroll reveal: the services section receives `is-in` once, and after scrolling the page no in-view node stays in `await-reveal`.
- Homepage console errors collected during that scroll test: none.
- Existing checks still passed for the mobile menu, skip link, portfolio dialog focus return, contact copy-only flow, six case studies, nine profiles, unpublished insights, and the homepage MP4.

`CI=1 npm run test:e2e` against port 4321 failed immediately because the local dev server already owned that port. The passing run is the production preview on 4322, not the dev server.

## Accessibility of the motion

- Content is opacity 1 in the stylesheet. The 12px offset exists only after JavaScript adds `await-reveal`, and only when reduced motion is not requested.
- Focus, hash changes, and the back-forward cache reveal the target instead of leaving it offset.
- `:focus-visible` outlines are unchanged. Card hover and card keyboard focus share the lift and border.
- The hero exposure peaks at opacity 0.11, is masked to the right side, runs over 18 seconds, and is disabled below 64rem and under reduced motion.
- Dialog, menu, form errors, and video controls keep their existing semantics.

## Not measured

- Lighthouse, lab CLS, and a throttled CPU trace were not run. Overflow and the absence of layout-affecting properties are the evidence available here.
- Screenshot set is in `docs/sitewide-motion-qa/` from the Playwright run: home at 1440 (top, scrolled, reduced motion), home at 375 and with the menu open, contact at 375, contact and home without JavaScript, portfolio at 1440, and team at 1440.
