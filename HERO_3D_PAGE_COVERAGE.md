# Hero 3D page coverage

The old hero art was an SVG wash (`about-orbit`, `services-spheres`, `portfolio-portal`, `process-orbit`, `blog-panels`, `contact-globe`) or a pair of radial orbs. Those washes are no longer referenced by pages. Footer and call-to-action ribbons were left as they were. They are not heroes.

| Route | Scene | Renderer | Notes |
| --- | --- | --- | --- |
| `/` | Hall depth | CSS | Photograph stays. Circle overlay SVGs removed. No WebGL. |
| `/about` | `workspace` | WebGL | Office photograph stays in the column beside the copy. |
| `/services` | `architecture` | WebGL | Five linked modules. |
| `/services/*` (8) | `service` | WebGL, quiet | Diagram in `ServiceVisual` is unchanged. |
| `/portfolio` | `showcase` | WebGL | Up to three approved screenshots as panel textures. |
| `/portfolio/*` (6 local, CMS renderer too) | `study` | WebGL, quiet | That study’s own first screenshot only. |
| `/process` | `pipeline` | WebGL | Labels are the six real stage names. |
| `/team` | `collaboration` | WebGL | Discipline names, not portraits. |
| `/team/*` (9) | `profile` | WebGL, quiet | Portrait and biography stay in front. |
| `/team/gallery` | `editorial` | WebGL | Gallery images are unchanged. |
| `/insights` | `editorial` | WebGL | |
| `/insights/*` | `editorial` | CSS | Article text is not covered by a canvas. |
| `/contact` | `communication` | WebGL | Form behavior is unchanged. |
| `/privacy`, `/terms` | `editorial` | CSS | |
| 404 | `editorial` | CSS | Orbs removed. |

Shared entry points: `PageHero.astro` for the index-style heroes, and `HeroStage.astro` dropped into about, services, service detail, case studies, team profiles, insight articles, and the 404 page.

Service diagrams, case-study captions, team portraits, and the homepage film are content. They were not replaced by the scenes.
