# Hero 3D design system

One scene component draws every page hero. Pages pass a scene id, short labels, and, where a real screenshot already exists, image paths. They do not ship a second renderer.

## Layers

1. **CSS scene** (`HeroStage.astro`). Perspective panels, a workspace, or product plates. This is what paints on the first frame. It stays when JavaScript is off, when `prefers-reduced-motion: reduce` is set, or when WebGL cannot start.
2. **Pointer tilt** (`src/scripts/hero-parallax.ts`). A small module tilts the CSS scene toward the pointer. It stops for a stage once the WebGL scene is live, and it does not run under reduced motion.
3. **WebGL scene** (`src/scripts/hero-stage.ts`). Three.js is imported after `requestIdleCallback`, only on stages marked `data-engine="webgl"`. The homepage does not load it.

The homepage keeps the hall photograph. `HallDepth.astro` adds thin architectural fins and a sill, and moves the photograph a few pixels with the pointer. The circle glow and atmosphere SVGs are no longer in the hero.

## Scenes

| Id | What it shows | Used for |
| --- | --- | --- |
| `workspace` | A lit room: floor, two walls, a desk, a review screen | About |
| `architecture` | Frontend, API, Cloud, Mobile, and AI panels with links and a moving chip | Services index |
| `service` | The same module language, with that practice’s own labels | Eight service pages |
| `showcase` | Three angled screens. Textures are approved portfolio captures when they exist | Portfolio index |
| `study` | One real case-study capture, with two quieter panels behind it | Case studies |
| `pipeline` | Six stages in depth. A chip travels the path and also follows scroll | Process |
| `collaboration` | Design, Engineering, Delivery, and Quality panels linked together | Team index |
| `profile` | Two linked panels, kept quiet behind the portrait | Team profiles |
| `communication` | Brief, Reply, and Next step, with chips moving between them | Contact |
| `editorial` | Stacked sheets | Insights, gallery, privacy, terms, 404 |

Labels are painted into a canvas texture. They name a practice or a stage. They are not client product names, and the stage is `aria-hidden`.

## Motion rules

- The group eases toward the pointer. Idle motion is a few centimeters of vertical drift.
- The pipeline chip is the scroll-linked motion. Other scenes stay in place as the page scrolls.
- Desktop aims for about 48 frames per second. Narrow viewports and machines with four or fewer cores aim for about 24.
- Pixel ratio is capped at 1.25, and at 1 on those lower-power cases. Shadows use one 512 map and are skipped in the lower-power case.
- The canvas is masked so the left side of a hero (and the top on small screens) stays clear of the heading.
- Rendering pauses when the stage leaves the viewport or the tab is hidden. `pagehide` cancels the frame, disconnects the observers, and disposes the renderer, geometries, materials, and textures.
- Reduced motion never imports Three.js. The CSS scene does not loop.

## Color

Panels are `#161022` and `#241833`, with a violet rim light and a white key light. The page background stays `#090713`. No orbit rings, no particle fields, and no extra neon orbs.
