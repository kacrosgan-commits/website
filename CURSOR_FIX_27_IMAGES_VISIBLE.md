# CURSOR AGENT — FIX THE MISSING 27 IMAGES (COMPLETE IMPLEMENTATION PROMPT)

You are a senior Astro/Next.js/React engineer, UI designer, and QA engineer. **Make actual code edits in the EXISTING software-development-agency website.** The owner reports that the previous Cursor implementation did not visibly render the supplied 27 team images. Your task is to find the cause, fix it, and provide visible proof in the running site. Do not just recite the image list or say you completed a plan.

## Project identity and design

- Company: software development agency, **exactly nine roles**, NOT a marketing agency.
- Design: sophisticated **dark + purple gradient**, backgrounds `#090713` and `#151027`, surface `#1C1533`, purple `#8B5CF6`, lavender `#C084FC`, text `#F8F7FF`.
- Keep existing site framework, routing, header/footer, working services, portfolio, contact forms, and deployment behavior. **Do not rebuild the site.**
- These are AI-generated illustrative collaboration scenes, **not factual photographs of employees**. Some supplied portraits may be images of the same person. Display samples clearly as *concept imagery / preview* until actual identities are verified. No fictional names, employee history, client case studies, or descriptions claiming the pictured people truly work at this company.

## CRITICAL PASS CONDITIONS (NON-NEGOTIABLE)

**A.** `/team` must visibly show **9 unique portrait cards**, one for each exact role, with a working `View Profile` link. Don't hide cards because `isPublished=false` or `identityVerified=false` in preview mode; instead add a visible `Illustrative profile / pending verification` caption and set `noindex` for previews.

**B.** **Each of the nine** `/team/<slug>` pages must visibly show **three image elements** using that member's exact paths: `portrait.webp`, `work-01.webp`, `work-02.webp`. The work images must be in a clearly visible **“Working Together”** section, not hidden in CSS, tabs, accordions, carousels, offscreen negative-positioned backgrounds, or in data only. Keep this gallery within the primary page content after the bio.

**C.** Create `/team/gallery` titled **“Team & Collaboration Gallery — Image Preview”** containing **all 27 images at once**, grouped by member: portrait and two collaboration images. Link prominently to it from `/team` with text `View All 27 Images`. Keep this as a preview route marked `noindex` until employee identity/imagery is approved. On this page there must be **27 actual <img> elements**, not decorative CSS background-images. Captions label illustrative collaboration scenes.

**D.** Existing homepage and `/about` should contain visible previews: at least **3 actual collaboration images** in an editorial “How We Work Together” section on one of these pages, linking to `/team/gallery`. Avoid using the team imagery only in an admin dashboard; it belongs on the public-facing website preview, including homepage/team/about where appropriate.

**E.** All 27 exact files must resolve in browser with HTTP 200 (or successful equivalent local URL), nonzero intrinsic width/height, no broken image symbol, no invisible opacity or overlay. Render and check actual screenshot/browser when browser tools are available. If unable to open a browser, run the build plus structural/path checks and report the limitation.

**F.** After implementation, state exactly where the images can be viewed and what verification passed. **Do not say “completed” until the pages render them.**

## STEP 1 — INSPECT, EXTRACT, AND VERIFY FIRST

1. Read project `package.json`, route structure, current team data, Team/About/Home components and styles.
2. Read `ASSET_MANIFEST.json` from this extracted asset pack. It provides `members[]` with `slug`, `role`, `portrait.path`, and `workImages[].path`.
3. Confirm asset files are located at `<PROJECT_ROOT>/public/assets/team/<slug>/portrait.webp`, `work-01.webp`, `work-02.webp`. When the ZIP was extracted one directory too deep (such as `software_agency_27_collaboration_pack/public/assets/team/`), **move/copy the images to the real app's `public/assets/team/` directory**. Determine the actual app root before deciding.
4. Inspect for duplicate `public/public` nesting, case-sensitive spelling errors, wrong extensions, incorrect import conventions, broken `base` path, and `src="/public/assets/..."` URLs.
5. In standard Astro/Next/Vite setups, browser URL for `public/assets/team/example/portrait.webp` is `/assets/team/example/portrait.webp` (NOT `/public/assets/...`). Honor any configured base path if the app uses one.
6. Confirm image files have nonzero sizes and actual WebP signatures. Run the supplied `scripts/check_team_asset_files.py` if Python is available.
7. Audit current UI for filters such as `team.filter(member => member.isPublished)`, `status: 'draft'`, empty placeholders, `display:none`, `visibility:hidden`, `opacity:0` left by scroll effects, `aria-hidden`, zero-height ancestors, behind-background stacking/z-index, and broken lazy-load data attributes.
8. Report the actual root cause found in code and fix it, rather than simply replacing components blindly.

## STEP 2 — EXACT ASSET MAPPING: ALL 27 IMAGE FILES

Use each file; never guess a filename. `work-01` and `work-02` are real independent image files, not sliced UI screenshots.

| # | Exact role | Slug | 3 browser paths |
|---|---|---|---|
| 1 | Founder & CEO | `founder-ceo` | `/assets/team/founder-ceo/portrait.webp`, `/assets/team/founder-ceo/work-01.webp`, `/assets/team/founder-ceo/work-02.webp` |
| 2 | Co-Founder & CTO | `cofounder-cto` | `/assets/team/cofounder-cto/portrait.webp`, `/assets/team/cofounder-cto/work-01.webp`, `/assets/team/cofounder-cto/work-02.webp` |
| 3 | CFO | `cfo` | `/assets/team/cfo/portrait.webp`, `/assets/team/cfo/work-01.webp`, `/assets/team/cfo/work-02.webp` |
| 4 | Project Manager | `project-manager` | `/assets/team/project-manager/portrait.webp`, `/assets/team/project-manager/work-01.webp`, `/assets/team/project-manager/work-02.webp` |
| 5 | Senior Full-Stack Developer | `senior-fullstack-developer` | `/assets/team/senior-fullstack-developer/portrait.webp`, `/assets/team/senior-fullstack-developer/work-01.webp`, `/assets/team/senior-fullstack-developer/work-02.webp` |
| 6 | AI Engineer | `ai-engineer` | `/assets/team/ai-engineer/portrait.webp`, `/assets/team/ai-engineer/work-01.webp`, `/assets/team/ai-engineer/work-02.webp` |
| 7 | Mobile App Developer | `mobile-app-developer` | `/assets/team/mobile-app-developer/portrait.webp`, `/assets/team/mobile-app-developer/work-01.webp`, `/assets/team/mobile-app-developer/work-02.webp` |
| 8 | UI/UX & Product Designer | `uiux-product-designer` | `/assets/team/uiux-product-designer/portrait.webp`, `/assets/team/uiux-product-designer/work-01.webp`, `/assets/team/uiux-product-designer/work-02.webp` |
| 9 | QA & DevOps Engineer | `qa-devops-engineer` | `/assets/team/qa-devops-engineer/portrait.webp`, `/assets/team/qa-devops-engineer/work-01.webp`, `/assets/team/qa-devops-engineer/work-02.webp` |

Do not replace these with Unsplash, remote URLs, SVG placeholder, CSS gradients, or screenshot mockups. Do not use one picture for multiple member slots.

## STEP 3 — DATA AND ROUTING

- Create or repair ONE central typed team list (existing data module or `src/data/team.ts`) with nine members, in the exact order above, each `{slug, role, name:null until verified, portrait, workImages:[{src, alt, illustrative:true},{src, alt, illustrative:true}], status:'preview'}`.
- Populate URLs from the manifest; do not recopy paths incorrectly. Ensure all 27 paths occur in the data and are consumed by rendered components.
- Astro: use `src/pages/team/index.astro`, `src/pages/team/[slug].astro` with correct `getStaticPaths()`, and `src/pages/team/gallery.astro` or matching existing structure.
- Next.js App Router: use `app/team/page.tsx`, `app/team/[slug]/page.tsx`, `app/team/gallery/page.tsx`, with `generateStaticParams()` if static generation is configured. Avoid treating `/team/gallery` as a member slug.
- React Router: use explicit `/team`, `/team/gallery`, `/team/:slug` routes (gallery route must take precedence).
- Do NOT gate **preview UI** entirely on missing name or unverified status. Show `[Name pending verification]` or role title instead; add a visible image-authenticity notice and `noindex` where appropriate. Do not deploy inaccurate factual staff pages as verified employee biographies.

## STEP 4 — BUILD THE UI SO IMAGES ARE ACTUALLY VISIBLE

**`/team`:** Premium intro, readable nine-card grid (3 desktop / 2 tablet / 1 mobile). Portraits with normal `<img>` or framework image components, aspect ratio `4/5` or `1/1`, correct `object-fit:cover`, visible card heights, exact job titles, and `View Profile` links. At the bottom show a “Collaboration in Action” strip with a few `work-01` photos, plus the prominent link to `/team/gallery`.

**Nine detail pages:** Standard reusable template; portrait in a meaningful hero, title and role-based responsibility description (without invented personal achievements), “What They Focus On”, then a **large “Working Together” gallery with two actual landscape WebP images** and descriptive but honest illustrative captions. Add previous/next navigation and return link.

**`/team/gallery`:** Nine sections in order. Each shows a role heading and visible three-image row: portrait plus two separate work images. Display a clear counter `27 / 27 images` only when the code renders 27 available files. Do not make users click through a carousel or tab to discover images. Make this page accessible from the Team page. Add a small “Illustrative concept photography” notice.

**Homepage/About:** Add/rework a tasteful “Engineering Is a Team Sport” or “How We Collaborate” section with three visible scenes and a CTA linking to `/team/gallery`. Keep it professional and relevant to software engineering, not marketing campaigns.

Styling: violet accents (`#8B5CF6`), near-black backgrounds, restrained card borders. Keep photographs natural; do NOT overlay heavy gradients on faces, put text on top of subjects, obscure images with decorative blur, or animate them with permanent opacity zero. Use CSS grids and responsive sizes. Images in non-critical positions may be lazy loaded but MUST display when scrolled into view.

## STEP 5 — IMAGE IMPLEMENTATION CHECKS

- Browser URL **MUST NOT** include `/public/`.
- For Astro/public assets, normal image example: `<img src="/assets/team/founder-ceo/work-01.webp" alt="Illustrative collaborative software planning session" loading="lazy" width="1672" height="941" />`.
- If Next.js's `<Image>` is already used, set correct `src`, `width`, `height`, `sizes`, and use existing optimization conventions; public assets do not need importing from `public/`.
- Ensure image aspect ratio, width, `max-width:100%`, `object-fit:cover`, adequate parent height, and no accidental hidden state.
- Review computed styling and parent stacking for invisible images. Ensure CSS scroll reveals have a no-JS fallback and respect `prefers-reduced-motion`.
- Failed file paths should be surfaced as errors in development; do not silently replace broken images with unrelated generated gradients.

## STEP 6 — VERIFY IT, DON'T JUST WRITE CODE

1. Run the supplied file checker and fix all missing paths.
2. Run the project's normal typecheck / lint (if configured) and `npm run build`, fixing errors.
3. Start local dev server and **open** `/team`, `/team/gallery`, and **all nine** detail routes, using available browser tools.
4. If Playwright or another browser tool exists, assert:
   - `/team` has nine cards and nine loaded portraits;
   - `/team/gallery` has exactly **27 visible, distinct-path image elements**;
   - on each of nine `/team/<slug>` pages, all **three distinct images** are visible;
   - each loaded image satisfies `img.complete && img.naturalWidth > 0`;
   - each expected image request succeeds;
   - images are not CSS-hidden and visible at 375px and 1440px;
   - links navigate to the correct routes.
5. Take screenshots at 1440px and 375px for `/team` and `/team/gallery` if browser tooling is available. Review actual screenshot appearance.
6. If browser tooling is NOT available, explain that the build and file checks do not prove visual rendering; give the local URLs and a concise manual checklist.

## REQUIRED FINAL REPORT FORMAT

Return a short factual report with:
- `Root cause:` actual reason images did not render (if determined).
- `Changed files:` exact paths.
- `Visible pages:` `/team`, `/team/gallery`, nine detail routes.
- `Assets validated:` N/27 physically present, N/27 browser-loaded (or `not browser-tested`).
- `Build:` pass/fail with command.
- `Outstanding approvals:` employee identity and synthetic-image disclosure.

**Never mark this task complete when the images exist only on disk or in a manifest. Implement and verify real rendered UI. Start now.**
