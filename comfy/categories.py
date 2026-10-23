"""Category images for the site (Z-Image-Turbo via local ComfyUI). Resumable: skips existing files.
   python comfy/categories.py [name ...]      -> comfy/out/cat_<name>.png ; then python comfy/export_cats.py
Subjects are fictional everyday people; no real-person likeness; no in-image text."""
import sys, time
from generate import zgraph, run, RAW

REALISM = (
    "Faces are photographed with real human detail: a detailed iris with radial fibers and a limbal ring, two natural catchlights, "
    "individual eyelashes and eyebrow hair strokes, visible skin pores, fine vellus hair, natural uneven skin tone with a healthy warm glow, "
    "lips with fine lines, clear ear detail, individual hair strands with baby hairs, slight natural asymmetry, no airbrushing. "
    "Hands have five fingers with knuckle creases and clean nails. Natural, anatomically correct human proportions with a normal-sized head."
)
TAIL = " Warm natural light, soft depth of field, true-to-life colours, fine film grain, shot on a full-frame camera with a 50mm lens, hopeful uplifting mood, no text, no logos, no watermark."

PEOPLE = {
    "agriculture": "Waist-up photograph of a Tamil woman farmer in her forties standing in a lush green paddy field at golden sunrise, a cotton towel wrapped around her head, a faded cotton saree, holding a bunch of ripe rice stalks, a calm proud smile, coconut palms and soft mist behind her.",
    "health": "Photograph of a kind Indian woman doctor in a white coat with a stethoscope listening to an elderly Indian man seated on an examination bed in a bright, clean government clinic, both smiling gently, medium shot.",
    "women": "Medium shot of two Tamil women in their thirties in bright cotton sarees sitting at a table in a village self-help-group workshop, one stitching a cloth bag and the other arranging handmade soaps, laughing together, warm window light.",
    "seniors": "Photograph of an elderly Tamil couple with white hair sitting together on a veranda swing in the early morning, the man in a white shirt reading a newspaper and the woman in a cotton saree holding a steel tumbler of tea, content smiles.",
    "business": "Photograph of a young Tamil woman tailor in her own small shop, standing beside a sewing machine with colourful folded fabrics on shelves behind her, a confident smile, daylight through the open shutter.",
    "housing": "Photograph of a young Tamil family, a father, a mother and a small daughter, standing at the doorway of their newly built modest house painted light yellow with a kolam at the entrance, coconut trees and a clear blue sky, joyful.",
    "education": "Photograph of a Tamil school girl of about fifteen in a white and blue school uniform with two braided pigtails and ribbons, smiling and holding books against her chest, standing in a sunlit school corridor, classmates softly blurred behind her.",
    "jobs": "Photograph of a young Indian man and a young Indian woman in a bright skill-training computer lab, both focused and smiling at a monitor, an instructor softly blurred behind them, modern and hopeful.",
    "welfare": "Photograph of a middle-aged Tamil woman in a cotton saree receiving a cloth bag of rice across the counter of a fair price shop from a smiling shopkeeper, other customers softly blurred in the queue, natural daylight.",
    "csc": "Photograph of an Indian man in his thirties helping an elderly Tamil woman use a smartphone at a community service centre counter, both smiling, a plain wall behind them.",
    "emergency": "Medium shot of a friendly young Indian paramedic in a navy uniform with a reflective vest gently holding the arm of an elderly Tamil woman as she steps toward the open door of an ambulance at dusk, both of their faces clearly visible, warm hopeful expressions, the ambulance has no writing on it.",
}
SCENES = {
    "documents": "Close photograph of a pair of hands holding an open folder of official certificates on a wooden desk, a pen, reading glasses and a steel tumbler of tea nearby, warm window light, shallow depth of field, hands with five fingers and natural skin.",
    "government": "Photograph at sunrise of a stately white colonial-era government building with a long colonnade and a tall flagstaff flying the Indian tricolour, a clear sky and a green lawn, a few tiny people far away, straight vertical lines.",
}

if __name__ == "__main__":
    only = set(sys.argv[1:])
    RAW.mkdir(exist_ok=True)
    items = [(k, v, True) for k, v in PEOPLE.items()] + [(k, v, False) for k, v in SCENES.items()]
    for i, (name, text, people) in enumerate(items):
        if only and name not in only:
            continue
        out = RAW / f"cat_{name}.png"
        if out.exists():
            print("skip", name, flush=True)
            continue
        seed = 3000 + i * 17 + (500 if name == "emergency" else 0)
        prompt = f"{text} {REALISM if people else ''}{TAIL}"
        t0 = time.time()
        im = run(zgraph(prompt, 896, 1344, seed, "cat"))
        im.save(out)
        print(f"{out.name} {im.size} {time.time() - t0:.0f}s", flush=True)
