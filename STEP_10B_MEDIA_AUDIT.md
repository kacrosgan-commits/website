# STEP 10B — Media audit

**CMS storage:** local Directus uploads (`cms/uploads`, persistent bind mount)  
**Public Astro media:** left untouched under `public/`  
**Anonymous access:** denied (observed **403** for `/files`, `/files/<id>`, `/assets/<id>`)

## Summary

| Category | Source files | Uploaded to Directus | Notes |
| --- | ---: | ---: | --- |
| Team portraits | 9 | 9 | Distinct paths; Adrian ≠ Matheus |
| Portfolio screenshots (originals) | 18 | 18 | 3 per approved project; checksum stored |
| Homepage poster | 1 | 1 | `vortex-team-poster.webp` (95,264 bytes) |
| Homepage team film MP4 | 1 on disk | **1** | Owner-accepted current 30s / 13,032,156-byte film |
| Service icon binaries | 0 editable uploads | 0 | Tokens only in CMS |
| **Total migration files** | — | **29** | Prior 28 intact; video additive; idempotent re-apply: 0 new |

Derived WebP copies under Astro (`*.webp` beside originals where present) were **not** uploaded as replacements for approved screenshot originals. Source of truth remains the paths referenced by case-study Markdown.

## Team portraits

All nine profiles use their owner-assigned `portrait.src` paths. Adrian Cruz and Matheus Pereira retain different files:

| Name | Source path | Distinct in CMS |
| --- | --- | --- |
| Adrian Cruz | `/assets/team/uiux-product-designer/portrait.webp` | Yes |
| Matheus Pereira | `/assets/team/mobile-app-developer/portrait.webp` | Yes |

Portrait binaries were uploaded with source-derived titles embedding SHA-256 for dedupe. Second `--apply` skipped all 9.

## Portfolio screenshots

| Project slug | Shots | Sort order |
| --- | ---: | --- |
| `scaleup-systems` | 3 | 1,2,3 |
| `medastare` | 3 | 1,2,3 |
| `gain-energy-upstrima` | 3 | 1,2,3 |
| `gowabi` | 3 | 1,2,3 |
| `daniela-diamonds` | 3 | 1,2,3 |
| `born-to-rock` | 3 | 1,2,3 |

Each `portfolio_screenshots` row stores `checksum_sha256` of the source file, alt/caption/kind/dimensions when present, and M2O `project` → imported project UUID.

## Homepage film (owner-accepted current file)

### Evidence

| Fact | Value |
| --- | --- |
| Working-tree path | `public/videos/vortex-team-showcase.mp4` |
| Working-tree bytes | **13,032,156** |
| Working-tree SHA-256 | `f0bff0fb6c5d87361e1c0327e14cfb2ec353e03ad7a917a28ed18954c0ccf91c` |
| Approx duration (mvhd) | **30.0 s** |
| Fast-start | `moov` before `mdat` |
| Step 9F historical optimized bytes | 4,718,893 (18.5 s) — **not present** in git; not restored |
| Owner decision | Current 30s file is the chosen homepage film |
| Directus | Imported as additive file #29; linked on `homepage_content.team_film_video` |
| Astro | Public path and homepage layout **unchanged** |
| Unit test | Asserts `13_032_156` bytes (owner-chosen file); **25/25** pass |
| Poster | `vortex-team-poster.webp` = 95,264 bytes, 1280×720 (unchanged) |

### Actions taken

1. Uploaded the current MP4 into Directus without deleting the prior 28 files.  
2. Attached it to `homepage_content.team_film_video`; poster already set.  
3. Left `public/videos/vortex-team-showcase.mp4` and TeamShowcase layout untouched.  
4. Updated the unit assertion to the owner-chosen byte size (not a blind retarget of an unknown substitute).  
5. Disclosure remains: *Illustrative team scenes, not footage of an actual company event.*

## Privacy checks (post-migration)

| Request | Auth | Observed status |
| --- | --- | --- |
| `GET /items/team_members` | anonymous | 403 |
| `GET /items/insights_articles` | anonymous | 403 |
| `GET /files` | anonymous | 403 |
| `GET /files/<id>` | anonymous | 403 |
| `GET /assets/<id>` | anonymous | 403 |
| Studio / admin file read | admin token | 200 |

No public read permissions were added in Step 10B.

## Hash equivalence note

Source SHA-256 values are stored in file titles / screenshot `checksum_sha256` fields and private manifest. Exact byte re-download of Directus storage objects for hash compare was not required for acceptance; size + UUID + relationship verification was performed. Full authenticated binary re-hash: optional owner enhancement.

## Excluded media

- Six `sample-*` case-study assets (projects excluded from import)  
- Step 9F historical 4,718,893-byte optimized MP4 (absent from git; not restored)  
- Contact / visitor inquiry attachments (none; not a CMS type)
