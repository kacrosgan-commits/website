#!/usr/bin/env python3
"""Write the browser-frame card images for the four website projects. Originals are never modified.

Each website capture includes the browser's scrollbar on the right and runs past a natural break
at the bottom. This writes `<name>.frame.webp` next to the first screenshot: the scrollbar and the
partial content below the chosen break are removed, so no line of text is cut, and every crop is
exactly 16:9 so the CSS browser frame never crops it again.

The crop boxes (left, top, right, bottom, in source pixels) were chosen by measuring row and
column variance of each capture:

- ScaleUp Systems: the page background is blank from y 640 to 736; "THE PROBLEM" starts at 742.
  The scrollbar starts at x 1343. The crop is centred on the content between x 17 and 1324.
- Gain Energy / Upstrima: the scrollbar starts at x 1333. The bullet list ends at y 744; the
  crop stops at 748, above the "START DRILLING" label.
- GoWabi: the green promotion bar ends at y 29 and is removed whole. The banner ends at y 765,
  the slider indicator starts at 780. The scrollbar starts at x 1333.
- Daniela Diamonds: the black top bar ends at y 29 and is removed whole. The subtitle ends at
  y 751 and the buttons start at 779. The scrollbar starts at x 1333.

Usage: python3 scripts/make_card_frames.py
"""
from pathlib import Path
import hashlib
import json
import sys

from PIL import Image

root = Path(__file__).resolve().parents[1]
public = root / "public"
manifest_path = root / "PORTFOLIO_ASSET_MANIFEST.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

CROPS = {
    "/assets/portfolio/scaleup-systems/scaleup-01-home.jpg": (17, 0, 1324, 735),
    "/assets/portfolio/gain-energy-upstrima/gain-01-home.jpg": (0, 0, 1330, 748),
    "/assets/portfolio/gowabi/gowabi-01-home.jpg": (7, 30, 1323, 770),
    "/assets/portfolio/daniela-diamonds/daniela-01-home.jpg": (2, 30, 1328, 776),
}

hashes = {media["public_url"]: media["sha256"] for project in manifest["projects"] for media in project["media"]}
errors = []
for src in CROPS:
    path = public / src.lstrip("/")
    if hashlib.sha256(path.read_bytes()).hexdigest() != hashes.get(src):
        errors.append(f"HASH MISMATCH OR NOT IN MANIFEST: {src}")
if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)

for project in manifest["projects"]:
    project.pop("cardFrame", None)

for src, box in CROPS.items():
    path = public / src.lstrip("/")
    left, top, right, bottom = box
    width, height = right - left, bottom - top
    assert abs(width / height - 16 / 9) < 0.004, (src, width, height)
    target = path.with_name(f"{path.stem}.frame.webp")
    with Image.open(path) as image:
        image.convert("RGB").crop(box).save(target, "WEBP", quality=86, method=6)
    public_url = "/" + str(target.relative_to(public))
    project = next(p for p in manifest["projects"] if any(m["public_url"] == src for m in p["media"]))
    project["cardFrame"] = {
        "public_url": public_url,
        "derivedFrom": src,
        "cropBox": list(box),
        "width": width,
        "height": height,
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "use": "Homepage and portfolio card image inside the CSS browser frame. Case-study pages keep the original screenshots.",
    }
    print(f"{target.relative_to(root)}  {width}x{height}  {target.stat().st_size // 1024} KB")

manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
