"""MakkalLens logo concepts: Z-Image-Turbo draws the MARK on flat magenta, we key it to transparency and typeset the exact
wordmark with a real font (image models cannot spell reliably). python comfy/logos.py -> public/logos/*.png + comfy/out/logo_sheet.jpg"""
import sys, time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from generate import zgraph, run, RAW

HERE = Path(__file__).resolve().parent
PUB = HERE.parent / "public" / "logos"
PUB.mkdir(parents=True, exist_ok=True)
BG = "on a perfectly flat solid pure magenta (#ff00ff) background with no shadow on the background, centred, plenty of empty margin around it, no text, no letters, no watermark"
PALETTE = "using only deep emerald green, fresh light green, white and a small warm golden-yellow accent"

CONCEPTS = {
    1: f"A premium glossy three-dimensional app-icon style logo mark of a round magnifying glass with a thick emerald green rim and a short green handle, the clear glass shows three simple white stylised people silhouettes standing together, a tiny golden spark on the glass, {PALETTE}, soft studio lighting, {BG}.",
    2: f"A clean flat vector logo mark: a bold letter M built from two arches like an open doorway, in emerald green and light green, with a small round magnifying lens in the middle of the M containing one golden dot, {PALETTE}, modern minimal, {BG}.",
    3: f"A flat vector emblem logo mark: a circular magnifying lens with a thick deep green rim, inside the lens a golden silhouette of a Tamil Nadu temple gopuram tower on a white background, a short green handle, {PALETTE}, elegant and simple, {BG}.",
    4: f"A friendly flat vector logo mark: two cupped open hands in light green holding up a glowing round magnifying glass with an emerald rim, inside the glass three tiny white people icons and a small golden star above, {PALETTE}, modern minimal, {BG}.",
}

def key(im: Image.Image) -> Image.Image:
    """Transparent background: flood from the border over colours close to the border's median colour, plus any magenta-ish pixel."""
    import numpy as np
    from scipy import ndimage as ndi
    rgb = np.asarray(im.convert("RGB")).astype(np.int16)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    ref = np.median(border, axis=0)
    near = np.sqrt(((rgb - ref) ** 2).sum(axis=2)) < 75
    lab, _ = ndi.label(near)
    edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge_labels))
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mag = (np.minimum(r, b) - g) > 45
    bg |= ndi.binary_dilation(mag, iterations=1) & mag
    bg = ndi.binary_closing(bg, iterations=2)
    alpha = (~bg).astype(np.float32)
    alpha = ndi.gaussian_filter(ndi.binary_erosion(alpha > 0.5, iterations=1).astype(np.float32), 0.9)
    out = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
    img = Image.fromarray(out, "RGBA")
    # drop specks: keep only the largest opaque blob's bounding box
    solid = ndi.label(alpha > 0.5)[0]
    if solid.max() > 0:
        sizes = ndi.sum(np.ones_like(solid), solid, index=range(1, solid.max() + 1))
        keep = 1 + int(np.argmax(sizes))
        mask = ndi.binary_dilation(solid == keep, iterations=6)
        a = np.asarray(img.getchannel("A")).copy()
        a[~mask] = 0
        img.putalpha(Image.fromarray(a))
    return img.crop(img.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())


def font(size):
    for f in ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()

def lockup(mark: Image.Image, dark_text="#07522e", light_text="#3fae6a", gold="#f5b800") -> Image.Image:
    h = 360
    m = mark.resize((int(mark.width * h / mark.height), h), Image.LANCZOS)
    f = font(230)
    a, b = "Makkal", "Lens"
    tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    wa, wb = tmp.textlength(a, font=f), tmp.textlength(b, font=f)
    W = int(m.width + 60 + wa + wb + 20)
    out = Image.new("RGBA", (W, h + 40), (0, 0, 0, 0))
    out.alpha_composite(m, (0, 20))
    d = ImageDraw.Draw(out)
    d.text((m.width + 60, h // 2 - 30), a, font=f, fill=dark_text, anchor="lm")
    d.text((m.width + 60 + wa, h // 2 - 30), b, font=f, fill=light_text, anchor="lm")
    d.rectangle((m.width + 66, h // 2 + 100, m.width + 66 + 170, h // 2 + 112), fill=gold)
    return out

if __name__ == "__main__":
    RAW.mkdir(exist_ok=True)
    only = {int(a) for a in sys.argv[1:]}
    for n, text in CONCEPTS.items():
        if only and n not in only:
            continue
        raw = RAW / f"logo_{n}_raw.png"
        if not raw.exists():
            t0 = time.time()
            run(zgraph(text, 1024, 1024, 9100 + n * 31, "logo")).save(raw)
            print(f"logo {n} generated {time.time() - t0:.0f}s", flush=True)
        mark = key(Image.open(raw))
        mark.save(PUB / f"logo-{n}-mark.png")
        lockup(mark).save(PUB / f"logo-{n}.png")
        lockup(mark, "#ffffff", "#8be0ae").save(PUB / f"logo-{n}-light.png")
    # preview sheet on white and on dark green
    sheet = Image.new("RGB", (2400, 1500), "white")
    d = ImageDraw.Draw(sheet)
    for i, n in enumerate(sorted(CONCEPTS)):
        if not (PUB / f"logo-{n}.png").exists():
            continue
        for j, bg in enumerate(("#ffffff", "#07522e")):
            lg = Image.open(PUB / (f"logo-{n}.png" if j == 0 else f"logo-{n}-light.png"))
            lg.thumbnail((1000, 300))
            x, y = (i % 2) * 1200, (i // 2) * 750 + j * 375
            d.rectangle((x, y, x + 1199, y + 374), fill=bg)
            sheet.paste(lg, (x + 100, y + 40), lg)
    sheet.save(HERE / "out" / "logo_sheet.jpg", quality=88)
    print("sheet ok")
