"""Convert generated place PNGs to web-ready WebP in public/places and print measured sizes."""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "places"
OUT.mkdir(parents=True, exist_ok=True)
for png in sorted((HERE / "out").glob("place_*.png")):
    name = png.stem.replace("place_", "")
    im = Image.open(png).convert("RGB")
    dest = OUT / f"{name}.webp"
    im.save(dest, "WEBP", quality=82, method=6)
    print(f"{dest.name}: {im.size} {dest.stat().st_size / 1024:.0f} KB")
