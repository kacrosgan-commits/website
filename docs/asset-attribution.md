# Asset attribution

The 27 team files are the pack described in `ASSET_MANIFEST.json`.

- Nine portraits: `public/assets/team/<slug>/portrait.webp` (768×768 WebP).
- Eighteen collaboration scenes: `work-01.webp` and `work-02.webp` in the same folders (1672×941 WebP).
- The manifest states that collaboration images are AI-generated fictional scenes, not photographs of employee meetings, and that the first four portraits might depict one person.
- `approvedForFactualEmployeeClaims` in the manifest is false.
- Nine `portrait-thumb.webp` files (384×384) were downscaled from those portraits for previous/next navigation. Faces were not retouched.
- The homepage hero uses `public/assets/about/office-visual.webp`, a dark conference-room photograph already in the project. It is not one of the 27 team files.
- Older contact-sheet crops (`member-01-…webp`, `team-01-…webp`) remain on disk and are not referenced by the live team pages.

Do not describe a collaboration scene as a documented meeting, and do not describe an unverified portrait as a named employee.
