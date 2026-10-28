# Vortex Digital — Step 9F (isolated improvement): Homepage team-showcase video

## GOAL AND CONTEXT

Implement the OWNER-SUPPLIED, PRE-OPTIMIZED 18.5-second MP4 as a polished, lightweight, accessible cinematic team showcase on the **public homepage** of the EXISTING Vortex Digital website. This is a real coding task, not a mockup or a redesign. Inspect the repo before editing. Do not create a new dashboard/admin application. Work only within the existing Astro project.

Current site: Astro 7, TypeScript, Tailwind CSS v4. Brand: premium/cinematic dark and purple (#090713, #151027, #1C1533, #8B5CF6, #C084FC, #F8F7FF), existing Space Grotesk / Inter design. The existing homepage has a hero, a six-project approved portfolio, and links to nine named team members. The existing team gallery/work scenes are explicitly illustrative; never recast an illustration as a real event.

**Important sequencing:** Apply this after completing and reviewing Step 9E if that QA pass is still running. Do not edit Step 9E reports or turn this into a website-wide redesign. This task is named Step 9F only to keep its report separate.

## SUPPLIED ASSETS (ALREADY INSIDE THIS IMPORT PACKAGE)

The ZIP should be extracted into the existing repo root, preserving its directory layout. Exact filenames:

- `public/videos/vortex-team-showcase.mp4` — owner-supplied video, transcoded for smaller delivery; H.264 AVC High, 1280×720, 16:9, 24 fps, yuv420p, silent, 18.5 seconds, 4,718,893 bytes, MP4 `moov` atom at the front (fast-start).
- `public/videos/vortex-team-poster.webp` — poster extracted from the same video at ~6.5 s, 1280×720, approximately 94 KB.

Original owner upload, not required inside the repo: `Vortex-Digital-Team-Video.mp4` (7,135,386 bytes, same duration/resolution/codec). The optimized copy is ~34% smaller. **Do not** regenerate video footage, use unrelated stock shots, alter identities, or swap in another image. Do not invent video URLs.

If files are not actually present, STOP the video insertion instead of creating a broken component; report the missing paths. Do not assume a bundled video CDN exists.

## NON-NEGOTIABLE ACCURACY AND RIGHTS

The MP4 metadata describes the footage as "AI-generated company team scenes based on supplied portraits. Silent landscape website video." A frame review shows three successive, three-person collaboration sequences. Neither the number of sequences nor appearances proves that all nine distinct staff members appear. Therefore:

- Present this as a **cinematic illustration** of team collaboration, not documentary video of Vortex Digital employees at work.
- Never claim "all nine employees shown," identify a person on screen, or claim it records a real company meeting/event.
- Add a brief, visible, natural-language disclosure near the video, for example: **"Illustrative team scenes created for Vortex Digital; not footage of an actual team event."**
- Do NOT overwrite or relabel the nine owner-approved individual team portraits. Do not reuse this video's images as purported real employee headshots.
- Keep a link to the actual `/team` profiles, which are separate from this brand film.

## PHASE 1 — REPO AUDIT

1. Inspect `package.json`, `src/pages/index.astro`, the homepage hero and section ordering, `src/components/sections/`, `src/styles/global.css`, any site/brand data, and the existing card/panel and link components.
2. Inspect recent `STEP_9B_REPORT.md`, `STEP_9C_REPORT.md`, `STEP_9D_REPORT.md`, and `STEP_9E_REPORT.md` if present. Do not overwrite them.
3. Confirm the supplied video and poster are real files, and verify codec, duration, actual dimensions, and bytes using `ffprobe` or another available local inspection command. Report any mismatch.
4. Check whether a homepage video component already exists: extend/reuse it rather than creating a conflicting duplicate.
5. Capture a baseline homepage production-preview screenshot and a basic network trace/loaded-asset summary where supported. No invented baseline numbers.

## PHASE 2 — VIDEO SECTION

Create or reuse `src/components/sections/TeamShowcase.astro`, following existing component naming and code style.

Preferred insertion: directly **below the current homepage hero** and before the rest of the existing homepage narrative, provided inspection reveals no conflict with its layout. Preserve all preexisting sections and ordering relative to each other.

Proposed copy (you may adjust punctuation to match site tone, not factual meaning):

- Eyebrow: `THE PEOPLE BEHIND THE BUILD`
- Heading: `A look at collaboration, from idea to launch`
- Description: `A short visual interpretation of the conversations, design reviews, and engineering work that shape digital products.`
- CTA: `Meet our team` → `/team`
- Visible disclosure: `Illustrative team scenes, not footage of an actual company event.`

Do not imply an office location, onsite staff gathering, or that filmed people are identified named employees.

Visual requirements:

- Responsive **16:9** media presentation, generous surrounding whitespace, no cropped faces, no portrait framing.
- Premium site-consistent border radius, thin violet border and subtle ambient purple glow, restrained rather than heavy effects.
- No dark overlay obscuring faces during playback. A transparent poster play affordance is acceptable if fully functional and accessible.
- On desktop, frame may use a width-constrained content container, not edge-to-edge screen takeover; on phones use nearly full content width with safe margins.
- No marquee, unnecessary carousels, heavy animation frameworks, custom complex player UI, or visual layout shift.
- Match existing semantic heading hierarchy: preserve the homepage H1 and use H2 for this new section.

## PHASE 3 — PLAYBACK AND PERFORMANCE (PREFERRED MODE: USER-INITIATED)

Use a native `<video>` player with:

- `controls` for accessible play/pause/seek/fullscreen;
- `playsinline` for iOS/mobile;
- `preload="none"` so the full MP4 is not fetched on initial page load;
- `poster="/videos/vortex-team-poster.webp"`;
- `<source src="/videos/vortex-team-showcase.mp4" type="video/mp4">`;
- `width="1280" height="720"` or equivalent fixed `aspect-ratio: 16/9` to avoid CLS;
- NO autoplay, NO forced playback, NO background looping by default;
- silence (file contains no audio) and a clear text description of its visual content.

If adding a custom large central Play button, ensure:

- It is a real keyboard-focusable `<button>` with an accessible name, NOT a decorative non-working control;
- Clicking or Enter/Space actually invokes play; native video controls stay available;
- On pause/end/error it stays consistent; browser playback rejection is handled;
- If JavaScript is off, the native player still works and no inert overlay blocks controls;
- Respect `prefers-reduced-motion`; never autoplay in reduced-motion environments.

Best default is native controls and a visually attractive poster, keeping JavaScript close to zero.

Ensure the poster has accurate dimensions and is not eagerly prioritized over the actual homepage LCP/hero asset. Do not use a remote player, autoplay-on-scroll, an embedded YouTube player, or `loading="eager"` to force the MP4 download. Preserve the existing homepage fonts and asset strategy.

## PHASE 4 — RESPONSIVE AND ACCESSIBILITY

Verify at 320, 375, 768, 1024, and 1440 CSS pixels, including a 200% root text-size check.

- No horizontal overflow; media scales down without cutting off people.
- The poster renders at a stable aspect ratio without stretching or blur.
- Focus outline visible for video controls/any play button and `/team` CTA.
- Descriptive context makes silent video understandable without hearing audio. The uploaded MP4 has no audio track, so do not invent subtitles for speech that does not exist.
- Ensure video is not a background that makes important text unreadable.
- Keyboard can reach and operate the player and leave it; no focus trap.
- Site's mobile menu, hero, and existing CTAs remain functional.

## PHASE 5 — TESTS AND DATA GUARANTEES

Update or add tests at existing conventions, not by creating a new test framework.

Tests should cover:

- Video + poster file paths exist in the built output and return 200 in production preview;
- Homepage section appears exactly once, in the intended location, without replacing hero or portfolio;
- Video attributes: controls, playsinline, preload none, poster, proper `source`;
- Exact video size/duration in report; the source plays in Chromium and shows changing frames after user initiation;
- The visual disclosure and link to `/team` are present;
- No eager full MP4 request before play, as observable in the test environment (report any browser-specific metadata request instead of hiding it);
- Mobile/tablet/desktop geometry with no horizontal overflow;
- Zero console errors attributable to video component.

Run and document actual outputs:

- `npm test`
- `npm run check`
- `npm run build`
- `npm run test:e2e`

Do not silently loosen or delete existing tests. Report any tool missing or test unsupported. When possible compare before-and-after homepage network transfer and LCP/CLS, clearly mark test settings and any absent baseline; NEVER invent Lighthouse scores.

## PHASE 6 — IMMUTABLE AREAS / NO DEPLOY

Preserve exactly:

- All **six** owner-approved portfolio cases: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock; all slugs, screenshots, permissions, and homepage order.
- All **nine** published, named team profiles and approved portraits, including the separation of Adrian Cruz's external Cepheid work from Vortex Digital work.
- All **twelve** unpublished Insights articles; never change their publication flags or expose their draft slugs.
- Existing Contact copy-only inquiry workflow: it must still say **"Inquiry copied. No message has been sent."** when appropriate; do not create a live submission endpoint.
- Services, navigation, legal pages, and branding unless an edit is strictly needed to mount this video component.

Do NOT modify `PUBLIC_SITE_URL`, DNS/domain/canonical, business email, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_FORMSPREE_ENDPOINT`, any other contact delivery, hosting, environment settings, analytics, deployment, or package versions. Do NOT deploy. Do not start another phase.

## PHASE 7 — REQUIRED REPORT

Create `HOMEPAGE_TEAM_VIDEO_REPORT.md` in the project root. Include:

1. Exact video and poster paths, byte sizes, dimensions, codecs, duration, and audio-track status.
2. Attribution/AI-generated illustrative footage safeguard and exact visible disclosure.
3. Exact homepage insertion point, section heading, CTA destination.
4. Video element attributes and how play/pause works without JavaScript.
5. All created/modified files; whether any new dependency was added (target: none).
6. Before/after measurable loading or performance findings, or honest explanation if unavailable.
7. Mobile/desktop responsive evidence at 320/375/768/1024/1440, 200% text.
8. Keyboard, focus, reduced-motion and fallback observations.
9. `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` results with pass counts and genuine failures.
10. Regression checks for six portfolio projects, nine team members, twelve unpublished Insights articles, Contact copy-only state.
11. Remaining issues; explicitly note domain/email/deployment untouched.

Complete implementation, inspect the actual rendered page, and stop. Do not claim launch or publication on a live domain.
