# Vortex Digital — Step 5 Portfolio Cursor Pack

**Exactly six project candidates, with three images each (18 distinct assets).**

## Installation

1. Open your **existing** Astro website project in Cursor (the project with `package.json`).
2. Extract this ZIP directly into the project root, preserving the `public/assets/portfolio/<slug>/` structure and putting `CURSOR_PROMPT.md`, `PORTFOLIO_ASSET_MANIFEST.json`, `VORTEX_PORTFOLIO_SOURCE.md`, and `Vortex_Digital_Portfolio_Draft.pdf` in the root. Overwrite `CURSOR_PROMPT.md` only after saving any prior prompt you want to keep.
3. Run: `python scripts/check_portfolio_assets.py` (or `python3`).
4. Paste the contents of `CURSOR_PROMPT.md` into Cursor Agent; tell Cursor to read all supplied source documents before editing.
5. Have Cursor implement all six complete **local review** case studies, validate media and pages, and report real test results.

## Important approval boundary

These six products' **public product descriptions** are included, but Vortex Digital's actual responsibility for them has **not been verified**. The PDF says so explicitly. The screenshot sources are public websites and publishers' App Store promotional media, not guaranteed Vortex-owned assets. Do not automatically publish them as agency client work. Use the `PORTFOLIO_ASSET_MANIFEST.json` review status and confirm contribution and reuse permission **per project** before publishing to customers.

## Included

- `CURSOR_PROMPT.md` — complete production-quality Step 5 implementation instructions.
- `VORTEX_PORTFOLIO_SOURCE.md` — detailed existing product research, source notes, technology evidence and contribution questions.
- `Vortex_Digital_Portfolio_Draft.pdf` — provided 14-page illustrated reference.
- `PORTFOLIO_ASSET_MANIFEST.json` — exact screenshot mapping, dimensions, hashes, and approvals.
- `public/assets/portfolio/` — six folders / 18 original source images.
- `scripts/check_portfolio_assets.py` — validates that all 18 files exist and match their SHA-256 hashes.
