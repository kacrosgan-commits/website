# Step 6 Report — Team Section and Profiles

Date: 27 October 2026

The team section now presents nine role profiles without a public “Name pending” label. Existing portraits, collaboration images, and thumbnails were not replaced. None of the six portfolio projects were published or assigned to a role.

## 1. Team page

`/team` uses the eyebrow “Our team” and the heading “The People and Disciplines Behind Vortex Digital.” The introduction describes leadership, engineering, design, delivery, and quality working on startup products.

The roster is nine cards in the existing order. Each card shows the current portrait, the exact role as the title, a role-specific introduction, three responsibilities, and “View Profile.” A verified name is shown only when `name` is set. It is null for all nine seats. Supplied photos and illustrative portraits keep their badges.

The grid is one column at 375px, two columns at 768px, and three columns at 1024px and 1440px.

“How We Work Together” uses seven illustrative scenes in a mixed layout: one large product-discussion frame, a pair for architecture and planning, a row for engineering, problem solving, and design review, and a closing frame for testing and delivery. The scenes are labeled as conceptual illustrations. “View All 27 Images” still goes to `/team/gallery`.

## 2. Nine profiles

One template, `TeamProfile.astro`, renders every route. Each page has:

- An editorial hero with the correct portrait, the role as the heading, and a link back to the team
- A role overview
- Areas of responsibility, described as duties of the seat
- Expertise labeled as role capabilities, not personal credentials
- “Working Together,” with `work-01.webp` and `work-02.webp`
- How the role supports startups
- Related disciplines, linking to other seats in the nine-role structure
- Previous and next navigation using the 384×384 thumbnails, in role order, wrapping from the last role to the first
- “Back to Team”

Project contributions stay hidden because `projectIds` is empty. LinkedIn, GitHub, and portfolio links stay hidden because none were supplied. Profiles remain `noindex` while `isPublished` is false.

## 3. Gallery

`/team/gallery` still shows exactly 27 images in nine groups: one portrait and two collaboration scenes each. Captions still say the portrait identity is unverified and the scenes are illustrative. The page remains `noindex`. On wide screens the portrait sits beside the two wider scenes instead of forcing all three into equal columns.

## 4. Files modified

- `src/data/team.ts`
- `src/components/cards/TeamCard.astro`
- `src/components/team/TeamProfile.astro`
- `src/components/team/WorkTogether.astro` (new)
- `src/pages/team/index.astro`
- `src/pages/team/[slug].astro`
- `src/pages/team/gallery.astro`
- `src/pages/index.astro` (team-preview description only)
- `src/styles/global.css`
- `tests/e2e/smoke.spec.ts`

Services, portfolio entries, contact delivery, legal pages, blog flags, brand settings, and image files were not changed. The homepage and About page still use `TeamCard`, so they pick up the role titles and no longer show “Name pending.”

## 5. Image verification

The production gallery HTML references 27 team assets. End-to-end checks decoded every gallery image with a natural width above zero and a non-empty alt. Each of the nine profiles contains exactly three images for that slug: `portrait.webp`, `work-01.webp`, and `work-02.webp`. Navigation uses `portrait-thumb.webp` from the neighboring roles. No image file was regenerated.

## 6. Navigation and functionality

End-to-end coverage confirmed nine “View Profile” links, the gallery link, all nine profile routes, “Working Together” on each profile, next from Founder & CEO to Co-Founder & CTO, and previous back to Founder & CEO. Unpublished profiles and the gallery send `noindex`. Those profile URLs are absent from the sitemap. The six portfolio slugs remain absent from the production build and the sitemap.

## 7. Responsive results

Checked in headless Chrome at 375, 768, 1024, and 1440 on `/team`, two profiles, and the gallery.

- Roster columns: 1, 2, 3, and 3
- No horizontal overflow
- No “Name pending” text
- No undecoded team images
- Portrait frames stayed square
- Collaboration frames kept their wide ratio

## 8. Automated tests

- `npm test`: 10 passed, 0 failed
- `npm run check`: 0 errors, 0 warnings, 73 hints. The hints are the existing `z` deprecation from `astro:content`
- `npm run build`: 29 pages. The six review portfolio routes were not generated
- `npm run test:e2e`: 7 passed, 0 failed

## 9. Remaining issues

Names, approved identities, personal biographies, confirmed skills, professional links, and verified project involvement are still missing for all nine roles. Profiles stay unpublished until those facts are supplied and `isPublished` is set. Details are in `TEAM_CONTENT_REQUIRED.md`.

The public team page is a role directory. It is not a set of confirmed employee biographies.
