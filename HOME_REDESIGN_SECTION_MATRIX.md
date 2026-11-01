# Homepage section matrix

| Order | Section | Component | Content source | Notes |
| --- | --- | --- | --- | --- |
| 1 | Product-first hero | `HomeProductHero` | CMS homepage fields when present; otherwise local defaults | Showcase prefers ScaleUp, MedaStaré, Gain Energy; falls back through remaining approved projects |
| 2 | Approved work | `HomeWorkGrid` | Local featured projects or all CMS projects by `homeRank` | Heading remains “Approved client work.” All six local approved studies stay discoverable |
| 3 | Services | `HomeServicesBento` | Featured services (8) | Groups: Web & Mobile; AI & SaaS; Backend & Cloud; Design & Quality |
| 4 | Process | `HomeProcessRibbon` | `processSteps` | Six existing stage names and summaries |
| 5 | Team film | `TeamShowcase` | Optional CMS film copy fields | Exact MP4, poster, autoplay/muted/loop/controls/playsinline/preload, disclosure |
| 6 | People | Inline roster | `getTeamForRender()` | Nine profile links and thumbs |
| 7 | Technology | `HomeTechStrip` | `technologyGroups` | Catalog only; not certifications |
| 8 | Insights | Conditional cards | Public insights only | Omitted while drafts remain private |
| 9 | FAQ | `FaqAccordion` | `faqs` | Existing questions |
| 10 | CTA | `CtaSection` | Existing copy | Contact remains copy-only |

## Explicitly not on the homepage anymore

| Former block | Status |
| --- | --- |
| Hall photograph hero | Removed from home; asset retained on disk |
| Company intro (“Your Startup Idea…”) | Removed from home; About page still covers it |
| Why teams stay | Removed from home; process section carries the story |
| Stats / testimonials | Still render only when verified data exists (currently empty) |
| CollaborationPreview scenes | Removed from home; gallery/team pages keep illustrations |

## Routes preserved

`/`, `/portfolio`, `/portfolio/*`, `/services`, `/services/*`, `/process`, `/team`, `/team/*`, `/contact`, `/insights`, `/about`, legal pages, 404.
