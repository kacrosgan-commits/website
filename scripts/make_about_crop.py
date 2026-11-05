#!/usr/bin/env python3
"""Write the About page's reception crop of the lobby photo. The original is never modified.

The crop is a 4:5 portrait from the right of `public/images/vortex-digital-hall.png` (1813 x 868):
the halo light, the VORTEX DIGITAL wall sign, and the reception desk. It starts at x 1150, right of
the lounge doorway, so the round wall logo on the left of the photo stays out of frame. The
homepage hero uses the same photo as a wide, full-bleed crop.

Usage: python3 scripts/make_about_crop.py
"""
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / "public/images/vortex-digital-hall.png"
target = root / "public/images/vortex-hall-reception.webp"
BOX = (1150, 20, 1813, 849)  # left, top, right, bottom in source pixels

before = source.read_bytes()
image = Image.open(source).convert("RGB")
assert image.size == (1813, 868), image.size
crop = image.crop(BOX)
assert crop.size == (663, 829), crop.size
crop.save(target, "WEBP", quality=84, method=6)
assert source.read_bytes() == before, "the original photo changed"
print(f"{target.relative_to(root)} {crop.size[0]}x{crop.size[1]} {target.stat().st_size} bytes")
