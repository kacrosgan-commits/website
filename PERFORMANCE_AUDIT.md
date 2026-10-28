# Performance Audit — Step 9E

These are local lab measurements of the production build (`npm run build` + `astro preview`) on one development machine. They are **not** Lighthouse scores and **not** field Core Web Vitals. Lighthouse, field CWV (CrUX/RUM) and INP were **not measured**: Lighthouse is not installed in the repo and was not added (Step 9E forbids silent installs).

## 1. Method

- Tool: `scripts/perf-audit.mjs` (Playwright driving the installed Google Chrome 155.0.8059.39). Usage: `node scripts/perf-audit.mjs [baseUrl] [outFile] [runs]`; `PERF_ROUTES=/,/contact/` limits the route list.
- Each sample uses a fresh browser context with the HTTP cache disabled. The table shows the **median of 3 runs** per route and profile.
- Profiles:
  - `desktop`: 1440×900, no throttling.
  - `mobile`: 375×812, DPR 2, mobile emulation, no throttling.
  - `mobile-slow`: same viewport, 150 ms latency, 1.6 Mbps down / 750 Kbps up, CPU slowed 4×.
- Metrics:
  - FCP comes from the paint timeline; LCP from a `PerformanceObserver`, using the last candidate before scrolling.
  - "Load" is `loadEventEnd`.
  - CLS is the sum of shifts without recent input. It is recorded before scrolling and again after the page is scrolled to the bottom in 600 px steps.
  - Bytes are the CDP `encodedDataLength` transferred before scrolling ("initial") and during scrolling ("scrolled").
- Routes (11): `/`, `/about/`, `/services/`, `/services/web-application-development/`, `/portfolio/`, `/portfolio/scaleup-systems/`, `/portfolio/medastare/`, `/portfolio/born-to-rock/`, `/team/`, `/team/ai-engineer/`, `/contact/`.
- Raw data: `docs/step-9e/data/perf-before.json` (before any Step 9E change) and `docs/step-9e/data/perf-after.json` (final build). The two runs used the same script, Chrome build, profiles and routes.

## 2. Environment caveats (read before comparing timings)

- The machine was shared with other desktop software. The load average was 7–15 during the runs, for example 7.4 at the start of the after run and 12.6 during the `/contact/` recheck.
- Under that load, unthrottled FCP/LCP/load times rose by 0.2–1.3 s even on routes whose markup and assets did not change, such as `/services/` and `/team/ai-engineer/`. **Unthrottled timing differences in this report are not attributable to code changes.**
- Byte counts, request counts and CLS are deterministic enough to compare, and they are the basis for the conclusions below.
- Lazy images that are still downloading when a throttled run ends are under-counted in "scrolled KB". The before run showed 0 KB scrolled on several slow-profile routes for this reason.
- Hosting compression, CDN caching and HTTP/2 or HTTP/3 behaviour are unknown until deployment. `astro preview` is not a production server.

## 3. Findings before changes

| Issue | Evidence (before) | Severity |
| --- | --- | --- |
| Full-size PNG App Store art on portfolio cards and case pages | `rock-1.png` 1,807 KB is the Born To Rock card and hero image. `/portfolio/` downloaded 3,285 KB initially on desktop. Born To Rock loaded 1,914 KB initially and 3,255 KB more on scroll. MedaStaré loaded 956 KB initially and 3,497 KB on scroll. | P2 |
| Layout shift from mobile screenshots | `.shot-frame-mobile img` and the mobile gallery images used `width: auto; height: auto`, so no space was reserved before load. Slow-mobile CLS after scrolling: Born To Rock 0.5354, ScaleUp 0.1801 (from its related cards), MedaStaré 0.1714, home 0.1555. | P1 |
| Hidden dialog image | The closed "Enlarge image" dialog held an `<img>` with the hero source. Once the hero used WebP, that image would have fetched the PNG separately (seen as an aborted request in the audit). | P2 (found during the fix) |
| Font-swap shift on the home hero | Desktop `/` CLS 0.0486. `.photo-hero-title` changes height (273→205 px) when Space Grotesk replaces the fallback font. It is timing-dependent and reproduces when fonts arrive after first paint. | P2, left unchanged (below 0.1) |

## 4. Changes made

1. **WebP copies of the six PNG screenshots.** They are the same pixel size, quality 90, produced by `scripts/make_portfolio_webp.py`. The originals are untouched, and the manifest hashes still match (`scripts/check_portfolio_assets.py` passes). Peak signal-to-noise ratio in the quality trial was 37–45 dB.

   | File | PNG | WebP |
   | --- | ---: | ---: |
   | rock-1 | 1,807 KB | 196 KB |
   | rock-2 | 934 KB | 102 KB |
   | rock-3 | 947 KB | 110 KB |
   | meda-1 | 849 KB | 97 KB |
   | meda-2 | 675 KB | 69 KB |
   | meda-3-wardrobe | 491 KB | 75 KB |
   | **Total** | **5,703 KB** | **649 KB** |

2. **Card-size WebP copies** of each project's first screenshot: 480 px wide for portrait app art and 800 px wide for website captures (quality 85).

   | Card image | Original | Card copy |
   | --- | ---: | ---: |
   | rock-1 | 1,807 KB | 160 KB |
   | meda-1 | 849 KB | 72 KB |
   | scaleup-01 | 98 KB | 34 KB |
   | gain-01 | 130 KB | 47 KB |
   | gowabi-01 | 103 KB | 33 KB |
   | daniela-01 | 188 KB | 71 KB |

3. **Delivery through `<picture>`.** Cards, case heroes and galleries now use `<picture><source type="image/webp"><img src="original">`. The `img src`, width, height, alt and `loading`/`fetchpriority` attributes are unchanged, so browsers without WebP and the no-JS "open file" links still get the original. `picture { display: contents }` keeps the existing CSS layout.
4. **Reserved space for mobile screenshots.** Card images get a definite width, `min(100%, 240px)`, plus the existing `max-height: 28rem` with `object-fit: contain`. Gallery images get `min(100%, 320px)`. The width and height attributes now reserve the aspect ratio before load, and the loaded image still paints at the same size (about 207×448 px on cards).
5. **Dialog image created on first open.** The script creates it when the dialog opens and loads the WebP copy at that point, so a closed dialog requests nothing.
6. **Not changed:**
   - No font preload: the shift is below 0.1, depends on timing, and couldn't be shown to improve under the noisy conditions here.
   - Team portraits are already WebP at 100–212 KB, and no smaller derivatives exist. Creating new crops of approved portraits was out of scope.
   - No JS or CSS refactor. The only external script is the 6.8 KB contact-form script, loaded on `/contact/` only; the small header, reveal and gallery scripts are inlined by Astro. The stylesheet is 48 KB raw and about 11 KB transferred.

## 5. Before → after (median of 3)

Initial KB / scrolled KB are transfer sizes; CLS is after scrolling. Unthrottled timings are omitted where the environment caveat applies; see the raw JSON.

### Bytes and CLS

| Profile | Route | Initial KB | Scrolled KB | CLS after scroll |
| --- | --- | ---: | ---: | ---: |
| desktop | `/` | 275 → 276 | 3,889 → 1,130 | 0.0486 → 0.0486 |
| desktop | `/portfolio/` | **3,285 → 528** | 1 → 0 | 0.0002 → 0 |
| desktop | `/portfolio/scaleup-systems/` | 205 → 205 | **3,283 → 589** | 0.0308 → 0.0307 |
| desktop | `/portfolio/medastare/` | **956 → 204** | **3,497 → 495** | 0.0012 → 0.0012 |
| desktop | `/portfolio/born-to-rock/` | **1,914 → 304** | **3,255 → 475** | 0 → 0.0012 |
| desktop | `/team/` | 791 → 791 | 1,584 → 709 | 0.0012 → 0 |
| desktop | `/contact/` | 107 → 108 | 0 → 0 | 0.0009 → 0.054 (see note) |
| mobile | `/` | 275 → 276 | 3,889 → 1,130 | 0 → 0 |
| mobile | `/portfolio/` | **1,186 → 367** | **2,100 → 161** | 0 → 0 |
| mobile | `/portfolio/medastare/` | **956 → 204** | **3,497 → 495** | 0 → 0 |
| mobile | `/portfolio/born-to-rock/` | **1,914 → 304** | **3,255 → 475** | 0 → 0 |
| mobile-slow | `/` | 275 → 276 | 0 → 270 | **0.1555 → 0** |
| mobile-slow | `/portfolio/` | **1,186 → 214** | 2,100 → 315 | 0 → 0 |
| mobile-slow | `/portfolio/scaleup-systems/` | 205 → 205 | 88 → 169 | **0.1801 → 0** |
| mobile-slow | `/portfolio/medastare/` | **956 → 204** | 0 → 262 | **0.1714 → 0** |
| mobile-slow | `/portfolio/born-to-rock/` | **1,914 → 304** | 0 → 138 | **0.5354 → 0** |

Notes on the table:

- **`/contact/` 0.054 is an outlier.** In a 5-run recheck under the same load (`docs/step-9e/data/perf-contact-recheck.json`) the median was 0.0009, the same as before. With fonts forced late by 4× CPU throttling, the only contact shift was 0.0009, from the H1 moving 3 px on font swap.
- **Some rows are scroll-timing noise.** The `/team/` change (1,584 → 709 KB scrolled on desktop) and the mobile `/team/` initial bytes (252 → 544 KB) come from when lazy portraits happened to start loading. The team page markup and images did not change.
- **Unchanged routes.** Byte totals for `/about/`, `/services/`, `/services/web-application-development/` and `/team/ai-engineer/` match within 1 KB.

### Throttled-profile load time (the only timing with a stable baseline)

| Route (mobile-slow) | Load before | Load after |
| --- | ---: | ---: |
| `/portfolio/` | 6,606 ms | 2,494 ms |
| `/portfolio/medastare/` | 5,330 ms | 3,040 ms |
| `/portfolio/born-to-rock/` | 10,213 ms | 2,370 ms |

The other throttled routes moved by −0.2 s to +0.5 s, consistent with machine noise. On `/portfolio/medastare/` the throttled FCP/LCP rose from 1,628 to 3,020 ms while its load time fell. The LCP element on that route is the H1 text, which these image changes don't affect, so I treat that FCP/LCP change as environment noise.

## 6. LCP elements (after)

| Route | LCP element |
| --- | --- |
| `/`, `/about/` (desktop) | `office-visual.webp` (eager, `fetchpriority="high"`) |
| `/portfolio/` (desktop) | `scaleup-01-home.card.webp` |
| `/portfolio/medastare/` (desktop) | `meda-1.webp` hero |
| `/portfolio/born-to-rock/` (desktop) | `rock-1.webp` hero |
| `/portfolio/scaleup-systems/` (desktop) | `scaleup-01-home.jpg` hero (JPG kept; 98 KB) |
| Mobile, most routes | Hero text or decorative SVG background |

## 7. Remaining opportunities (not done)

- Home desktop font-swap CLS 0.0486: a measured `<link rel="preload">` for Space Grotesk 600 could remove it. Test it on the real host.
- Responsive `srcset` for team portraits (768–1448 px sources shown at about 333–528 CSS px) would need new derivatives of owner-approved portraits.
- Hosting: confirm Brotli/gzip, long-lived caching for `/_astro/*` (hashed) and `/assets/*`, and HTTP/2. `public/_headers` sets `/assets/*` to `max-age=604800`, but whether that applies depends on the host.
- After deployment, run Lighthouse or PageSpeed Insights against the real domain and collect field data (CrUX/RUM). That is the only way to report LCP/CLS/INP for real users.
