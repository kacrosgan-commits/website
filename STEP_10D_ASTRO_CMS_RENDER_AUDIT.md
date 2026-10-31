# STEP 10D — Astro CMS Render Audit

**Scope:** Proof that `CONTENT_SOURCE=cms` renders **ACTIVE release** fields.  
**Evidence source:** Fixture release B (`rel-fixture-b-20260102-bbb`) build, 2026-10-31.  
**Real baseline:** Not activated — local mode remains the public default.

---

## Accessor

`getPublishedSiteSnapshot()` / `requireCmsSnapshot()` via `src/lib/content/site-content.ts`.  
`getStaticPaths()` for team, portfolio, services, insights derive routes from the release in cms mode.

---

## Page-by-page (fixture B)

| Route | CMS field proven in HTML | Notes |
| --- | --- | --- |
| `/` | `heroTitle` → **Fixture Hero Title B**; eyebrow **Fixture agency**; featured CMS projects; CMS team strip (Alice Managing Director) | Team film remains local MP4/poster (code-owned showcase) |
| `/team/` | Roster from release (Alice, Bob) | Copy adjusts for CMS count |
| `/team/fixture-alice/` | Role **Managing Director**; name/intro from release | Adjacent nav uses CMS roster |
| `/portfolio/` | Cards for alpha/beta/gamma | |
| `/portfolio/fixture-alpha/` | Title **Fixture Alpha Revised** via `CmsCaseStudy` | Screenshots use release `src` paths |
| `/portfolio/fixture-gamma/` | New authorized route present in B | Absent after C / rollback (rehearsal) |
| `/services/` | CMS titles/summaries | Nested “needs” section skipped when not in local model |
| `/services/web-application-development/` | Overlay CMS title/summary on code-owned ServiceDetail | |
| `/services/fixture-special/` | CMS-only slug; placeholder ServiceVisual | Documented code-owned diagram gap |
| `/insights/` | Lists **Fixture Insight One** only | Real 12 drafts not present |
| `/insights/fixture-insight-one/` | Title/excerpt/body from release (escaped text) | |
| `/about/` | Optional `page_sections` (`page_key=about`) | Baseline about copy remains when sections empty |
| `/process/` | Optional CMS section eyebrow/body/title | Timeline remains code-owned |
| `/contact/` | Unchanged copy-only flow | |
| Legal / 404 | Unchanged | |

---

## Sitemap / SEO (fixture)

- Routes match release membership (gamma present in B).
- Real draft Insight slugs absent.
- No `127.0.0.1:8055`, Bearer tokens, or Directus asset URLs in fixture `dist` scan.

---

## Local mode regression (default)

After restore: **35** HTML pages, **31** sitemap URLs; six case studies; nine profiles; Insights empty publicly.

---

## Code-owned UI retained

- Homepage photo hero chrome / lighting animation  
- TeamShowcase 30s film player  
- Complex ServiceDetail bodies (applications, FAQs, etc.) when local slug matches  
- Case study contribution blocks remain MDX/local in local mode; CMS mode uses `CmsCaseStudy` (no invented contribution claims)

---

## Insights gate

Release may include only `cmsEligible` articles. Real Directus Insights: 12 draft / `publication_approved=false` / `published_at=null` — never entered a real ACTIVE release.
