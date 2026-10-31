# STEP 10C — Content parity audit

**Mode tested:** `cms-shadow` via `npm run cms:shadow`  
**Public render source:** local (unchanged)  
**Private report:** `cms/.tmp/step-10c-shadow-parity.json`

## Counts

| Collection | Local public / source | CMS imported | Publish-eligible in CMS |
| --- | ---: | ---: | ---: |
| Team | 9 | 9 | **0** |
| Portfolio projects | 6 | 6 | **0** |
| Screenshots | 18 | 18 | n/a (follow projects) |
| Services | 8 | 8 | **0** |
| Insights | 12 drafts | 12 drafts | **0** |
| Homepage singleton | code + local video | 1 (video linked) | not public-eligible |
| Site settings | local `site.ts` | 1 | — |
| Page sections | code-managed + 8 CMS rows | 8 | — |

## Mapping outcome

| Area | Result |
| --- | --- |
| Team slugs (9) | Match |
| Adrian / Matheus distinct portraits | Pass |
| Project slugs (6 approved) | Match |
| Screenshots 3 per project | Pass (18) |
| Service slugs (8) | Match |
| Insights remain draft/unapproved | Pass |
| Sample `sample-*` projects | Excluded from CMS import (10B) / not public |
| Shadow issue_count | **0** |

## Insights privacy

- No insight is publish-eligible in CMS.
- Local production build still emits empty Insights index (no draft titles/slugs/bodies in `dist`).
- E2E “unapproved insights stay off the public site” passed.

## Unmapped / code-managed UI

Left on Astro code paths (not flattened into misleading CMS text):

- Homepage stats / testimonials / technology catalog grids
- Collaboration preview illustrative scenes
- FAQ accordion content from `src/data/faq.ts`
- Complex service page section components beyond mapped tokens/JSON

## Shadow vs local HTML

`CONTENT_SOURCE=cms-shadow npm run build` produced **35** pages / **31** sitemap URLs with local media paths. Draft CMS media was **not** copied into `dist` or `public/`.

## Body dumps

This audit intentionally omits Insight Markdown bodies. Private fingerprints live only under `cms/.tmp/`.
