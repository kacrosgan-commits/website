# Homepage team video — Step 9F

The owner-supplied MP4 is on the homepage, directly under the hero. It starts playing on its own, muted and looping. Visitors who prefer reduced motion get a paused player. The site was not deployed. Domain, DNS, `PUBLIC_SITE_URL`, business email, contact delivery, hosting, and package versions were not changed. Step 9E reports were not edited.

## 1. Video and poster

`ffprobe` is not installed. These values come from the MP4 boxes and from Pillow.

| Item | Value |
| --- | --- |
| Video | `public/videos/vortex-team-showcase.mp4` |
| Bytes | 4,718,893 |
| Container | ISO BMFF, `ftyp` isom. `moov` starts at byte 36, `mdat` at byte 6306 (fast start). |
| Codec | H.264 AVC (`avc1`), encoded with Lavc61.19.101 libx264, CRF 23. One video track. No `soun` box, so no audio track. |
| Dimensions | 1280×720 (16:9), from `tkhd` |
| Duration | 18.500 s (`mvhd` timescale 1000, duration 18500) |
| Embedded comment | “AI-generated company team scenes based on supplied portraits. Silent landscape website video.” |
| Poster | `public/videos/vortex-team-poster.webp` |
| Poster bytes | 95,264 |
| Poster pixels | 1280×720, RGB |

Frame rate was not read independently. The supplied note says 24 fps. Playback in Chrome reported `videoWidth` 1280 after play.

Both URLs returned HTTP 200 from the local production preview (`http://127.0.0.1:4321`).

## 2. What the film is, and what it is not

The file comment calls the footage AI-generated scenes based on supplied portraits. The page does not say that all nine named employees appear, does not name anyone in the frame, and does not call it a meeting or an office event.

Visible caption, under the player:

> Illustrative team scenes, not footage of an actual company event.

The nine portrait files were not replaced or relabeled. The film is not used as a headshot.

## 3. Where it sits

`TeamShowcase` is the first section after the homepage hero and before “Your Startup Idea Deserves Great Engineering.” The hero `h1` is unchanged. This section’s heading is an `h2`: “A look at collaboration, from idea to launch.” Eyebrow: “The people behind the build.” The link “Meet our team” goes to `/team`.

## 4. Player

Native `<video>` with the browser’s own controls. A short script only pauses or resumes playback for the reduced-motion setting.

- `autoplay`, `muted`, and `loop`, so the silent film starts immediately and keeps playing
- `playsinline`
- `preload="auto"`
- `poster="/videos/vortex-team-poster.webp"`
- `<source src="/videos/vortex-team-showcase.mp4" type="video/mp4">`
- `width="1280"` `height="720"`
- `aria-label` describes a silent illustration, not a company event

`muted` is set because browsers block autoplay that is not muted. The file has no audio track. Native controls stay available, so a visitor can pause it. A short script pauses the film when `prefers-reduced-motion: reduce` is set, and starts it again if that preference is turned off.

## 5. Files

Created:

- `src/components/sections/TeamShowcase.astro`
- `docs/step-9f/` (screenshots and the two network JSON files)
- this report

Modified:

- `src/pages/index.astro` — import and placement
- `src/styles/global.css` — `.team-showcase` frame and focus outline
- `tests/unit/site-quality.test.ts` — file size, poster size, and section order
- `tests/e2e/site-quality.spec.ts` — playback, preload, keyboard, and overflow

The MP4 and poster were already in `public/videos/`. No dependency was added. `package.json` and the lockfile were not changed.

## 6. Loading

Measured in Chrome (Playwright, production preview, cache not specially warmed beyond a fresh context). Resource Timing on `/` before play:

| Resource | Transferred |
| --- | ---: |
| `/assets/about/office-visual.webp` (existing hero) | 154,340 bytes |
| `/videos/vortex-team-poster.webp` | 95,564 bytes |
| `vortex-team-showcase.mp4` | not requested |

The hero image is still larger than the poster and is still the eager, high-priority image. The poster is not given `fetchpriority`.

The film now starts with the page, so the MP4 is requested on load instead of waiting for a click. `preload="auto"` is what makes that start immediate. The earlier measurement, taken when playback waited for a click, recorded only the 95,564-byte poster before play.

There is no separate before/after LCP or CLS number for this step. The previous homepage had no video. Lighthouse was not run.

## 7. Layout

Playwright checked the homepage at 320, 375, 768, 1024, and 1440 CSS pixels, and at 200% root text for every width except 1440. `scrollWidth` did not exceed `clientWidth`. The video box stayed within 0.02 of 16:9.

Screenshots from that run:

- `docs/step-9f/home-320.png` — heading, poster, disclosure, and team link
- `docs/step-9f/home-375.png`
- `docs/step-9f/home-375-200.png` — hero at 200% text (the film is below the fold; overflow was still 0)
- `docs/step-9f/home-768.png`
- `docs/step-9f/home-1024.png`
- `docs/step-9f/home-1440.png` — player after playback started, disclosure visible, faces not covered by a tint

## 8. Keyboard and focus

The video element accepts focus. Tab moves through the native control buttons, then reaches “Meet our team.” The first test expected the link on the very next Tab and failed for that reason. The assertion now allows those control stops and checks that focus does leave the player. A later full suite passed. The focus outline is a 2px lilac ring, offset 4px.

No video-related console errors were recorded.

## 9. Commands

| Command | Result |
| --- | --- |
| `npm test` | exit 0. 25 passed, 0 failed. |
| `npm run check` | exit 0. 79 files. 0 errors, 0 warnings, 0 hints. |
| `npm run build` | exit 0. 35 pages in 7.82 s. |
| `npm run test:e2e` | First full run: 16 passed, 1 failed (the Tab assertion above). After that assertion was corrected: exit 0, 17 passed, 0 failed, 0 retries. Duration 2.0 min. |

The new unit test checks the supplied byte sizes and that `TeamShowcase` sits between the hero and the intro heading. The new end-to-end test checks HTTP 200, one film section under the hero, the video attributes, the disclosure, the `/team` link, no MP4 request before play, playback, keyboard exit, and the widths above.

## 10. Regressions

The same end-to-end run still passed the six public case studies, the nine named profiles and gallery exclusion, the unpublished Insights 404s, and the contact test whose status text is “Inquiry copied. No message has been sent.” Publication flags were not edited. Homepage project order was not edited.

## 11. Left as they are

- Canonical host is still `https://example.com`.
- Contact is still copy-only. No endpoint was configured.
- Twelve Insights drafts stay unpublished.
- No deploy.
- `ffprobe` was unavailable, so frame rate and the H.264 profile flag were not confirmed beyond `avc1` and the libx264 encoder string.
- Chrome’s Resource Timing did not report how many MP4 bytes transferred after play.
- The film is an illustration. It is not evidence that any named employee is on screen.
