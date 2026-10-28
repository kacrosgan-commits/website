#!/usr/bin/env python3
"""Write WebP copies of portfolio screenshots. Originals are never modified.

- Each PNG screenshot gets a same-size `<name>.webp` (quality 90).
- Each project's first screenshot gets a smaller `<name>.card.webp` for portfolio cards:
  480 px wide for portrait app art, 800 px wide for website captures.

Usage: python3 scripts/make_portfolio_webp.py
"""
from pathlib import Path
import hashlib
import json
import re
import sys

from PIL import Image

root = Path(__file__).resolve().parents[1]
public = root / "public"
manifest = json.loads((root / "PORTFOLIO_ASSET_MANIFEST.json").read_text(encoding="utf-8"))

errors = []
for project in manifest["projects"]:
    for media in project["media"]:
        path = public / media["public_url"].lstrip("/")
        if hashlib.sha256(path.read_bytes()).hexdigest() != media["sha256"]:
            errors.append(f"HASH MISMATCH: {path}")
if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)


def first_screenshot(slug: str) -> str:
    raw = (root / "src/content/case-studies" / f"{slug}.md").read_text(encoding="utf-8")
    block = raw.split("\nscreenshots:\n", 1)[1]
    return re.search(r'^\s*- src:\s*"([^"]+)"', block, re.M).group(1)


written = []
for project in manifest["projects"]:
    for media in project["media"]:
        src = media["public_url"]
        path = public / src.lstrip("/")
        image = Image.open(path)
        if path.suffix.lower() == ".png":
            target = path.with_suffix(".webp")
            image.convert("RGB").save(target, "WEBP", quality=90, method=6)
            written.append(target)
        if src == first_screenshot(project["slug"]):
            width = 480 if image.height > image.width else 800
            height = round(image.height * width / image.width)
            card = image.convert("RGB").resize((width, height), Image.LANCZOS)
            target = path.with_name(f"{path.stem}.card.webp")
            card.save(target, "WEBP", quality=85, method=6)
            written.append(target)

for target in written:
    with Image.open(target) as image:
        print(f"{target.relative_to(root)}  {image.width}x{image.height}  {target.stat().st_size // 1024} KB")
