# Site-wide motion page matrix

Coverage is by route family. Legal pages stay quiet on purpose. Responsive checks at 320, 375, 768, 1024, and 1440 CSS pixels passed for `/`, `/about`, `/services`, `/portfolio`, `/team`, `/process`, `/contact`, and `/insights`, including the existing 200% text pass on the key routes in `tests/e2e/site-quality.spec.ts`.

| Route family | Treatment |
| --- | --- |
| `/` | Hero copy uses `hero-in`. The hall stays full-bleed under the transparent header. Desktop-only aura, exposure, and specular breathe slowly (peak exposure opacity 0.11) and are off under 64rem and under reduced motion. Service, reason, stack, work, insight, and role grids stagger. Process steps stagger and the desktop connector grows in. Team film section reveals; the MP4, poster, autoplay, and disclaimer are unchanged. FAQ stays inside the existing section reveal. CTA and footer use the shared treatments. |
| `/about` | Custom hero copy and workspace photo settle in. Existing section reveals remain. Leadership cards stagger. |
| `/services` and all 8 detail routes | Index hero settles in. Service cards, need cards, and the fit list stagger. Each detail page uses `hero-in` on the title block, `media-settle` on the diagram (the SVG drawing itself is not animated), and staggered cards for applications, challenges, approach, technologies, and related services. Contact links still use `?service=<slug>`. |
| `/portfolio` and all 6 case studies | Project grid staggers. Filter chips only change color and border. Case-study hero copy uses `hero-in`; the hero shot and gallery frames settle or stagger. Contribution sections use `reveal-up`. The enlarge dialog fades and rises slightly, and still traps focus, closes on Escape, and returns focus. |
| `/team`, all 9 profiles, `/team/gallery` | Roster staggers. Profile hero and portrait settle in. Biography sections reveal. Responsibility items stagger. Gallery groups reveal, and each portrait plus its two illustrative scenes stagger. Captions are unchanged. |
| `/process` | Page hero plus the full timeline. Steps stagger in reading order. The vertical line draws when the list enters and is already complete if motion or JavaScript is off. |
| `/insights` and article template | Empty state reveals once. No draft titles were added to the public page. A future public article gets `hero-in` on the header and `reveal-fade` on the prose so the text is never held at opacity 0. |
| `/contact` | Page hero, one entrance on the form card, and a stagger on the side notes. Fields are not animated on type, paste, or validation. Copy-inquiry behavior is unchanged. |
| `/privacy`, `/terms` | Page-hero entrance only. Policy text is not placed behind the scroll observer. |
| `/404` | Eyebrow, title, description, and actions use the short hero sequence. |
| Header and footer | Nav color, filter, breadcrumb, and footer link transitions use the fast token. Mobile menu open and close is the existing grid transition. Footer uses `reveal-fade` and stays readable. Buttons use `press-feedback`. |

## Exceptions

- Legal prose is static after the hero.
- Service diagrams are not drawn step by step.
- Gallery and portrait photos do not move under the pointer. Card photos keep the existing small hover scale, now also on keyboard focus.
- The homepage film still autoplays, muted and looping, because the current production tests require that. This pass does not change the file, poster, or preload.
