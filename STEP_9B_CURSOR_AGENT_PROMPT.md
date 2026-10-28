# STEP 9B — VERIFIED NAMED TEAM PROFILES, PORTRAITS & ABOUT PAGE

You are working inside the EXISTING Vortex Digital agency website repo. This is STEP 9B ONLY. Do not create a new project. The site uses Astro 7, TypeScript, Tailwind CSS v4, with a premium dark / purple-gradient identity. The public portfolio has exactly six owner-approved case studies and must remain unchanged.

OBJECTIVE:
Upgrade the existing nine role-based team pages into accessible, accurate, owner-approved named professional profiles, update the Team and About presentations, install eight provided replacement portraits, preserve Don Tran's current approved portrait, and produce a thorough implementation report.

INPUTS PROVIDED IN THIS PACK:
- step-9b-inputs/TEAM_9B_APPROVED_DATA.json — canonical user-approved names, backgrounds, current responsibilities, technologies, editorial distinctions, and publication approvals for nine people.
- step-9b-inputs/PORTRAIT_MANIFEST.json — eight designated uploaded portraits, dimensions, source hashes and final paths. Don Tran's existing Founder portrait is already in this project and should be preserved.
- step-9b-inputs/portraits/<role-slug>/portrait-original.png — unchanged uploaded source for all eight replacement images.
- step-9b-inputs/portraits/<role-slug>/portrait.webp — a proportion-preserving optimized version.
- step-9b-inputs/portraits/<role-slug>/portrait-thumb.webp — resized thumbnail without face alteration.

If the pack has not yet been copied into the repo, STOP just the asset migration portion, report exactly where it expects the pack, and DO NOT replace identities with arbitrary existing pictures. Continue the code/data review that is possible without the pack.

1. AUDIT BEFORE EDITING
Read: STEP_7_REPORT.md; STEP_8F_REPORT.md; TEAM_CONTENT_REQUIRED.md; WEBSITE_AUDIT.md, when present. Examine the actual current version of:
- src/data/team.ts and any team content/schema types, `displayName`, `identityVerified`, `isPublished`, image objects and publication functions;
- src/pages/team/index.astro, src/pages/team/[slug].astro, src/pages/team/gallery.astro;
- src/components/team/TeamProfile.astro, any TeamCard, homepage team section, About sections, team CTA/navigation;
- src/pages/about.astro, src/pages/index.astro, src/data/about.ts;
- src/data/assets.ts, ASSET_MANIFEST.json, public/assets/team/*, astro.config.ts, sitemap generation;
- existing tests/unit and tests/e2e, package scripts, src/styles/global.css.
Inspect rather than assume how the site actually implements each. Reuse existing components/routes/semantics and avoid unnecessary refactoring.

2. INVARIANTS — DO NOT BREAK OR TOUCH
- Do not change domain, PUBLIC_SITE_URL, DNS, business email, mailto settings, Formspree/contact delivery, booking URLs, hosting, deployment, package manager, or environment configuration.
- Do not deploy or change hosting infrastructure.
- Preserve the current six published portfolio case studies, their copy, route slugs, approval flags, home order, screenshot paths, and sitemap inclusion. Do not attribute any case study to an individual without explicit owner proof.
- Do not publish Insights/editorial drafts, sample portfolio entries or pending legal claims. No invented reviews, testimonials, metrics, clients, companies, social links, achievements, awards, certifications, credentials or employment dates.
- Keep exactly nine distinct member seats, existing role slugs, eight existing service routes, homepage navigation, and the company’s dark-purple visual identity.
- No AI-generated or recreated headshots, no face swaps, beauty retouching, facial alterations, identity reconstruction, or additional speculative team photographs. Only the approved input photographs and Don's owner-verified existing photo may be named portraits.
- The two `work-01.webp` and `work-02.webp` images per team member were NOT personally verified as actual workplace photographs. Do NOT describe them as documentary events or identify the depicted people as named staff; keep prominently labeled as illustrative, or hide those scenes if a named-profile presentation would otherwise confuse visitors. The team gallery remains an illustrative gallery (and noindex until separately approved), not a documentary record of these individuals working together.

3. EXACT NAMES, ROLES AND EXISTING SLUGS (DO NOT CHANGE SLUGS)
1. founder-ceo — Don Tran — Founder & CEO
2. cofounder-cto — Joshua Mendoza — Co-Founder & CTO
3. cfo — Lin Jiayi — CFO
4. project-manager — Pongsak Rattanakul — Project Manager
5. senior-fullstack-developer — Dmytro Melnyk — Senior Full-Stack Developer
6. ai-engineer — Carlo Garcia — AI Engineer
7. mobile-app-developer — Matheus Pereira — Mobile App Developer
8. uiux-product-designer — Adrian Cruz — UI/UX & Product Designer
9. qa-devops-engineer — Sofia Vasylivna Melnyk — QA & DevOps Engineer
Use the canonical JSON for complete owner-confirmed expertise, experience, history, and responsibilities. These 9 names and separate bio/photo permissions were explicitly confirmed by the owner. Do not omit or swap a member.

4. SOURCE OF TRUTH AND FACTUAL WRITING
Treat the provided JSON as the source of truth for this step. Preserve all actual experience durations (Don 9, Joshua 10, Lin 8, Pongsak 8+, Dmytro 15+, Carlo 9 including 4 in AI/ML, Matheus 8, Sofia 7); do NOT invent years of experience for Adrian. Avoid generic or inflated bios. Use crisp, natural, professional English, preferably 2–4 sentences per visible bio paragraph, with a short card summary and a richer individual profile. Detail expertise tags from the confirmed JSON only. Explain current job responsibilities separately from previous roles when needed. Preserve named biographies' publication approvals, and do not imply third-party independent verification.

ADRIAN CRUZ CAUTION: User reported current Human Factors Engineer role at Cepheid since May 2023, earlier UX Lab Assistant at UEGroup and Lead Vision Lab Coordinator at San José State University, MS Human Factors and Ergonomics (SJSU) and BA Psychology (CSUF). Do not attribute that external work to Vortex Digital or imply exclusive/full-time agency employment or a specific concurrency arrangement. His owner-confirmed Vortex responsibilities are UX research, usability studies, interface evaluation and translating research insights into design improvements with cross-functional teams. If external career detail is rendered, identify the employers explicitly and carefully, in a separate 'Previous and external experience' section; if space/clarity makes this difficult, omit external employer details and keep only his verified area of expertise.

PONGSAK CAUTION: The owner's supplied current-responsibilities answer repeated his professional background. Consolidate into Agile planning, stakeholder coordination, risk mitigation and team delivery as provided; do not invent new employer dates, budgets or success percentages.

5. PORTRAIT MIGRATION AND QUALITY
- Preserve the current assigned and owner-approved Founder & CEO portrait for Don Tran. Do not arbitrarily replace it with one of many similarly named source files.
- For each of the remaining 8 slugs, take ONLY the matching `step-9b-inputs/portraits/<slug>/portrait.webp` and `portrait-thumb.webp` from the pack and place them at the location the actual components expect (prefer `public/assets/team/<slug>/portrait.webp` and `portrait-thumb.webp` if current structure is consistent). Back up preexisting portrait assets outside `public/` if necessary for rollback. Original source PNG is available for verification but shouldn't be duplicated into public site unnecessarily.
- Make certain exact member-to-image assignments stay intact. Matheus must use the supplied `mobile-app-developer` image; Adrian must use the DISTINCT corrected `uiux-product-designer` image. Never reuse Matheus's old duplicate upload for Adrian. All 8 pack portrait-original.png files have distinct SHA-256 hashes, noted in the manifest.
- Verify portrait natural width/height, resource HTTP response and browser display, no broken src/alt/thumbnail references, faces not cut off on mobile/tablet/desktop. Maintain aspect ratios using image layout and CSS; no stretch, no excessive cropping, preserve full head, and avoid decorative filters that destroy readability. Add `object-position` tweaks per profile only if truly necessary.
- Build alt text e.g. `Portrait of Sofia Vasylivna Melnyk, QA & DevOps Engineer at Vortex Digital` using the role-associated approved user source; no guessing ethnicities/nationalities/locations/personality traits from pixels.
- Make Don's previous/next avatar or thumb work too: if his `portrait-thumb.webp` does not exist, generate a safe thumbnail from the existing approved original, or fall back to his actual valid portrait src. Avoid 404 thumbnails.
- Update ASSET_MANIFEST.json/image provenance if the repo uses it, and ensure the approved replacement portrait assets are not still mislabeled `illustrative` or `unverified`; limit any metadata updates to portraits, NOT other work-scene files.

6. TEAM PUBLICATION AND SEO
- Set real names for the nine appropriate existing team records; publish the named professional biographies and designated approved portraits. In the repo's actual model, set `isPublished: true` and `identityVerified: true` only for these owner-approved named portrait assignments, if those flags mean approval/owner-verified match. If flag semantics differ, use the correct existing flags; do not pretend any identity was independently verified from photo.
- Remove placeholder text such as `Name pending` and unverified-person notices from these nine approved profile/card renderings, while preserving honest labels for illustrative work imagery.
- All nine existing `/team/<role-slug>/` profiles should be searchable/indexable if the site normally includes approved profiles in the sitemap. Use each person's real name and role in title/meta/H1, with proper canonical URL behavior unchanged (don't edit PUBLIC_SITE_URL). Use name + role for Open Graph content where supported. Sitemap must include all nine approved profiles and exclude unapproved items, without adding `example.com` as a new manual constant.
- Existing routes must stay in place; do not create redirects or speculative new vanity slugs. Keep accessible keyboard navigation, headings, image descriptions, next/previous profile links.

7. TEAM DIRECTORY AND HOMEPAGE
- `/team` shows exactly nine named employee cards, in the existing role order, each with correct approved portrait, name, role, 1–2 sentence summary, confirmed skills, and working profile link. No card should display another employee's photo.
- `/` keeps the existing compact directory pattern (do NOT restore a bulky nine-card homepage duplicate grid). Update each thumbnail/name/role pairing through central team data. Keep public portfolio homepage section unchanged.
- Preserve premium, cinematic, dark + purple aesthetics; mobile-first readability, restrained gradients, strong contrast, 44px+ touch targets where relevant, performance-conscious images and lazy loading for offscreen content.

8. ABOUT PAGE — COHESIVE STORY WITHOUT UNSUPPORTED CLAIMS
- Keep the existing company About page sections, brand, CTAs, and factual agency overview. Add or refine an attractive “Meet the people behind Vortex Digital” section using approved named profiles, perhaps selected leadership (Don, Joshua, Lin, Pongsak) and a clear “Meet all nine” CTA. Do not turn About into a second exhaustive team directory. Ensure it accurately describes a 9-role startup-focused software agency and references existing 8 actual services without implying employee credits for unverified client case studies.
- If src/data/about.ts includes a still-unconfirmed company origin story, DO NOT silently assert it as fact. Keep it clearly framed or avoid rewriting it in this team-specific step.
- Do not use collaboration scenes as authenticated photographs of these exact named people. Any illustrative scenes must remain visibly labeled as such.

9. TEAM GALLERY
- `/team/gallery` currently uses 27 team images, including portraits and work scenes. Ensure it does not show outdated portraits or suggest that `work-01`/`work-02` show specific named employees. If publishing approved portraits in the gallery, bind to the 9 new portraits, but preserve `noindex` for the illustration gallery unless there was separate explicit gallery approval (there was not).
- Update copy so users clearly understand that individual approved portraits are named, while collaboration scenes are illustrative only. Do not imply the nine people appear together in a genuine group photo.

10. TECHNICAL IMPLEMENTATION AND TESTS
Implement with the existing Astro/TypeScript/Tailwind architecture and central team data. Keep changes scoped and check consistency across all team/photo references and About/home sections. Do not add dependencies unless genuinely required.
Run:
- npm test
- npm run check
- npm run build
- npm run test:e2e
- test production preview routes `/`, `/about`, `/team`, all nine `/team/<slug>`, `/team/gallery` (if available), `/portfolio`, `/contact` at widths 375 / 768 / 1024 / 1440.
- Verify no horizontal scroll or broken images, correct image naturalWidth, exactly nine distinct names/photos, all profile links work, nine published team routes and sitemap entries, no name pending in approved pages, named profile pages no `noindex`, gallery semantics and noindex remain truthful, keyboard nav/visible focus intact. Existing 6 approved portfolio studies unchanged and sample studies excluded.
- Add/update unit tests for team publication guard, nine-profile order/unique name/slug/portrait, user-approved flags, and image mapping; add E2E tests for all nine real names and correct portrait paths on overview and detail pages. Do not disable/skip existing tests or weaken assertions.
- If a test intermittently fails, rerun and document both results and root-cause investigation; don't hide first failures. If unrelated defects are found, list them separately without expanding the step's scope.
- `npm run build` previously generated 35 total pages as of Step 8F; the team routes already exist. Count may remain 35 after replacing role copy; report the observed count, investigate unexpected new routes. Sitemap entry count may increase when named profiles become published.

11. REPORT AND COMPLETION CRITERIA
Create `STEP_9B_REPORT.md` in the project root with:
1. Executive summary, scope and whether all 9 approved profiles are published.
2. Names, roles, existing slugs, publication flags for each of the 9.
3. Exact before/after portrait asset paths, dimensions, hashes, and whether thumb exists (Founder original preserved).
4. Explicit verification that Adrian and Matheus use different source portraits.
5. Concise finalized public biography and expertise summary per person (cite owner-approved input only).
6. Changed components/data/pages and rationale.
7. Home `/`, Team `/team`, nine profiles, About `/about`, gallery behavior with exact labeling.
8. SEO title/meta/robots/sitemap results for nine named profiles.
9. How unverified collaboration scene attribution is avoided.
10. Responsive browser checks at 375/768/1024/1440 and screenshot/resource errors.
11. `npm test`, `npm run check`, `npm run build`, `npm run test:e2e` output/exit codes and page counts; note first-run instability if present.
12. Confirmation six case studies remain public and unchanged, sample case studies and draft Insights remain private.
13. Confirmation domain, PUBLIC_SITE_URL, DNS, business email, contact delivery, legal copy, and deployment were not touched.
14. Any outstanding content facts, unknown affiliations, broken refs, accessibility issues or blockers; don't claim missing info is verified.

When finished, return a short completion summary, key test results, and path to `STEP_9B_REPORT.md`. Don't deploy and don't initiate Step 9C. Implement Step 9B now using these inputs.
