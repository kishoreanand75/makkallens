"""Convert comfy/out/cat_*.png to web-ready WebP in public/cats and print measured sizes."""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "cats"
OUT.mkdir(parents=True, exist_ok=True)
total = 0
for png in sorted((HERE / "out").glob("cat_*.png")):
    if png.stem.startswith("cat_sheet"):
        continue
    name = png.stem.replace("cat_", "")
    im = Image.open(png).convert("RGB")
    dest = OUT / f"{name}.webp"
    im.save(dest, "WEBP", quality=80, method=6)
    total += dest.stat().st_size
    print(f"{dest.name}: {im.size} {dest.stat().st_size / 1024:.0f} KB")
print(f"total {total / 1024:.0f} KB")
