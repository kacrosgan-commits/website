# Site-wide motion design system

The motion system lives in `src/styles/global.css` and one inline observer in `src/layouts/BaseLayout.astro`. No animation library was added.

## Tokens

Defined on `:root`:

| Token | Value | Use |
| --- | --- | --- |
| `--motion-duration-fast` | 180ms | Hover, focus, press, dialog fade |
| `--motion-duration-normal` | 420ms | Section and card reveals |
| `--motion-duration-emphasis` | 680ms | Hero entrance, timeline line, ambient settle |
| `--motion-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Color and border changes |
| `--motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances |
| `--motion-ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Card stagger |
| `--motion-stagger` | 70ms | Delay between siblings, capped at the 8th item |
| `--motion-distance` | 12px | Rise distance |
| `--motion-scale` | 0.985 | Image and media settle scale |

## Classes

Opt in. Nothing animates every `div`, `p`, `a`, or `img`.

| Class | Behavior |
| --- | --- |
| `reveal` / `reveal-up` | Rises 12px into place when scrolled into view. Existing section class `reveal` uses this. |
| `reveal-fade` | Stays put, then eases opacity from 0.78 to 1. Used for the footer and long article prose. |
| `reveal-scale` | Scales from 0.985 to 1. Reserved for media that can scale without widening the page. |
| `stagger-children` | Direct `.motion-item` children rise in order. Delay stops growing after the 8th child. |
| `motion-item` | Marks a stagger child. Does nothing outside `stagger-children`. |
| `hero-in` plus `hero-in-2` … `hero-in-4` | CSS-only hero sequence. Starts at opacity 0.55 so the copy is readable during the delay. |
| `media-settle` | Opacity ease for hero photography and diagrams. No scale, so it cannot cause overflow. |
| `interactive-lift` | 3px rise on hover and keyboard focus for links that are not already cards. |
| `press-feedback` | 1px press on `:active`. Does not delay the click. |
| `section-divider-motion` | Grows the process line when that list enters view. The line is fully drawn without JavaScript. |

Cards with `.surface-card` already lift 4px and brighten their border on hover. The same treatment now applies on `:focus-within`, so keyboard users get the same cue. Staggered cards keep that hover after they have entered.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` sets `scroll-behavior: auto` and removes animations and transitions. The observer returns immediately, so it never adds `can-reveal` or `await-reveal`. Hero light, drifting orbs, and the gradient sheen also stop.

## Without JavaScript

Resting styles are `opacity: 1` and `transform: none`. The hidden offset is applied only after the observer adds `await-reveal`, and only inside `prefers-reduced-motion: no-preference`. With JavaScript off, copy, links, and the contact form stay in their normal place. Hero CSS animations still run, and they finish in a visible state.

## Observer

One `IntersectionObserver` watches `.reveal`, `.reveal-up`, `.reveal-fade`, `.reveal-scale`, and `.stagger-children`.

- Nodes already on screen are marked `is-in` immediately.
- Nodes with no height are left alone.
- Each node is revealed once, then unobserved.
- Focus and in-page hash links reveal the focused element and its motion ancestors right away.
- A scroll pass catches anything the observer misses at the bottom of a long page.
- `pageshow` with `persisted` reveals anything restored into the viewport from the back-forward cache.

## Usage

```html
<section class="section reveal">
  <div class="stagger-children grid">
    <article class="surface-card motion-item">...</article>
  </div>
</section>
```

Hero copy uses `hero-in`, not the scroll observer, because it is on screen at first paint.

Do not put `await-reveal` in server HTML. Do not set a resting `opacity: 0` on content.
