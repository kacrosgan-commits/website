# Homepage motion and accessibility audit

## Motion

Homepage motion reuses the sitewide tokens and the single `IntersectionObserver` in `BaseLayout.astro`. No second observer and no Three.js on the homepage.

| Interaction | Behavior |
| --- | --- |
| Hero title / CTAs | Existing `hero-in` rise |
| Showcase panels | CSS perspective; active panel opacity; optional 10s drift on one desktop panel |
| Showcase pointer | Fine-pointer tilt capped near 5°, one rAF, ignored under reduced motion |
| Showcase switcher | Button tabs, arrow keys, no autoplay carousel |
| Work media | 250ms 1.02 zoom and 4px lift on hover/focus-within |
| Service links | 3px lift, border emphasis, arrow nudge |
| Process track | One-time line draw with `section-divider-motion` |
| Team roster | Existing stagger |
| CTA panel | Soft light sweep on hover/focus-within |

Hard rules kept: resting content stays visible without JS; reduced motion freezes parallax, drift, and reveals; decorative motion pauses when the tab is hidden.

## Accessibility

- One `h1` in the product hero.
- Showcase switcher is a `tablist`; panels remain real links to published case studies.
- Film region keeps the previous accessible name, disclosure caption, and “Meet our team” link after the player in tab order.
- Proof row uses verified counts only (projects, services, profiles).
- Keyboard path from the video controls reaches the team link.
- 200% text / 32px root font: homepage overflow measured at 0 after service-link `minmax(0, 1fr)` and wrap fixes.
- No invented outcomes, testimonials, or employee claims in motion copy.

## Residual risk

Native video controls still consume several Tab stops before the team link; the suite allows up to 15. Focus rings rely on existing global styles.
