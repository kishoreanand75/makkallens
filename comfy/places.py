"""Batch-generate the hopeful Tamil Nadu place images for the site (Z-Image-Turbo via local ComfyUI).
Run:  python comfy/places.py [name]    Output: comfy/out/place_<name>.png (resumable; skips existing).
"""
import sys, time
from pathlib import Path
from generate import zgraph, run, RAW

TAIL = (" Natural true-to-life colour, realistic sky and clouds, believable scale and perspective, straight vertical lines on the buildings, "
        "fine photographic grain, shot on a full-frame camera with a 35mm lens. No text, no signboards with writing, no watermark, no people close to the camera.")

PLACES = {
    "hero": (1101, "A wide landscape photograph at sunrise over lush green rice paddy fields in rural Tamil Nadu, soft golden light spreading across the sky, "
             "thin morning mist hovering over the water-filled fields, rows of coconut palms along the bunds, a tall ancient granite temple gopuram standing calmly on the distant horizon, "
             "a few white egrets flying low over the paddy. Warm, peaceful, hopeful mood; the left third of the frame is open sky and soft field for text space."),
    "meenakshi": (1102, "Photograph of the Meenakshi Amman Temple in Madurai at golden hour, the tall multi-tiered gopurams covered in finely sculpted colourful stucco deities, "
                  "seen across the calm Golden Lotus Tank with the temple reflected in the water, warm low sun, clear blue and amber sky, a few distant visitors as tiny figures on the steps."),
    "thanjavur": (1103, "Photograph of the Brihadisvara Temple in Thanjavur at early morning, the monumental granite vimana tower rising above the stone compound walls, "
                  "the sculpted Nandi pavilion in the foreground, neat green lawns, soft pink and golden sunrise light on the weathered granite, a few tiny distant visitors."),
    "marina": (1104, "Photograph of Marina Beach in Chennai at sunrise, calm sea with gentle waves rolling onto wide clean sand, colourful traditional wooden fishing boats pulled up on the shore, "
               "a golden-orange sun just above the horizon, a few small distant silhouettes of people walking along the water's edge, a feeling of a fresh new day."),
    "kanyakumari": (1205, "Photograph of the tall stone statue of the Tamil poet-saint Thiruvalluvar on a rocky islet off Kanyakumari at sunrise: an elderly bearded man in a simple draped robe over one shoulder, "
                    "standing calmly with his right arm raised and a palm-leaf manuscript in his left hand, no weapons and no crown, on a stepped stone pedestal; warm golden light on the grey granite, "
                    "calm blue ocean around the rocks, a small ferry boat far in the distance, glowing sky with soft clouds."),
    "nilgiris": (1106, "Photograph of the Nilgiri hills near Ooty in the early morning, neat rows of bright green tea bushes curving over rolling hills, "
                 "soft mist filling the valleys, sunbeams breaking through the clouds, a narrow winding road and a few tiny tea pickers far in the distance, fresh and hopeful atmosphere."),
}

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    RAW.mkdir(exist_ok=True)
    for name, (seed, prompt) in PLACES.items():
        if only and name != only:
            continue
        out = RAW / f"place_{name}.png"
        if out.exists():
            print("skip", name, flush=True)
            continue
        t0 = time.time()
        im = run(zgraph(prompt + TAIL, 1344, 896, seed, "place"))
        im.save(out)
        print(f"{out}  {im.size}  {time.time() - t0:.0f}s", flush=True)
