"""comfy/out/topic_*.png -> public/topics/*.webp (1088 wide, q80) + a contact sheet comfy/out/topic_sheet.jpg for QC."""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "topics"
OUT.mkdir(parents=True, exist_ok=True)
pngs = sorted([p for p in (HERE / "out").glob("topic_*.png") if "sheet" not in p.stem] + list((HERE / "out").glob("item_*.png")))
total = 0
thumbs = []
for png in pngs:
    name = png.stem.replace("topic_", "").replace("item_", "")
    im = Image.open(png).convert("RGB")
    dest = OUT / f"{name}.webp"
    im.save(dest, "WEBP", quality=80, method=6)
    total += dest.stat().st_size
    thumbs.append((name, im.resize((340, 255))))
    print(f"{name}: {dest.stat().st_size / 1024:.0f} KB")
cols = 10
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * 340, rows * 255), "white")
for i, (_, t) in enumerate(thumbs):
    sheet.paste(t, ((i % cols) * 340, (i // cols) * 255))
sheet.save(HERE / "out" / "topic_sheet.jpg", quality=85)
print(f"{len(thumbs)} images, total {total / 1024:.0f} KB")
