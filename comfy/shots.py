"""Single source of truth for every Rouge Noir image prompt.
generate.py renders these through ComfyUI; make_md.py writes PROMPTS.md from them.
All subjects are FICTIONAL adults. Never add real people's names.
Tuned for RealVisXL V5.0 (SDXL). Weights use (term:1.2) syntax.
"""

STYLE = (
    "Hasselblad X2D medium format, 90mm f/2.8, cinematic color grade, fine film grain, "
    "Vogue campaign quality, sharp eyes, 8k uhd"
)

SKIN = (
    "(hyper-realistic skin texture:1.3), visible pores, fine vellus hair, soft specular highlights on cheekbones, (not airbrushed:1.1), "
    "(detailed eyes with visible iris texture and natural catchlights:1.25), individual eyelashes, natural eyebrow hairs, "
    "natural hairline with baby hairs and flyaway strands"
)

ELEGANCE = (
    "poised elegant editorial posture, long graceful neck, serene intense gaze, natural relaxed hands"
)

BTS_STYLE = (
    "candid behind-the-scenes photograph on a fashion shoot, shot on Leica Q3 28mm, "
    "mixed tungsten and strobe light, slight motion, natural film grain, documentary realism, "
    "authentic unposed moment, (hyper-realistic skin texture:1.2), visible pores"
)

# ---- Face-detail realism (ALWAYS applied: main prompt gets a short form, FaceDetailer gets the full form) ----
REALISM_FACE = (
    "unretouched raw photograph of a real human face, (detailed iris with radial fibers and a limbal ring:1.3), natural round pupil, "
    "subtle red capillary veins in the sclera, moist tear line, sharp natural catchlights, individual upper and lower eyelashes with natural clumps and varying lengths, "
    "natural eyebrow hairs in individual strokes, slightly asymmetrical face, (visible skin pores and fine lines around the eyes:1.2), subtle under-eye texture, "
    "natural nose with fine pores and subtle shine and nostril detail, lips with fine vertical lines and natural moisture and uneven color, "
    "cheeks with slight natural redness and tiny blemishes, realistic ears with helix and lobe detail, "
    "fine peach-fuzz vellus hair on cheeks and upper lip and jawline, individual hair strands, natural hairline with baby hairs and flyaways, subtle neck creases"
)
FACE_NEG = (
    "dead eyes, glassy eyes, flat eyes, mismatched pupils, asymmetric iris, fused eyelashes, painted-on eyelashes, plastic skin, smooth skin, airbrushed, "
    "waxy, doll face, perfectly symmetrical face, blurry eyes, fake catchlight, tiny pupils, white eyes, no eyelashes, deformed ears, melted lips, "
    "wig-like hair, helmet hair, cgi, 3d render, illustration"
)
HAND_POS = "anatomically correct human hand, five fingers, natural knuckles, visible skin creases, realistic fingernails, fine hair on skin, natural pose"
HAND_NEG = "extra fingers, missing fingers, fused fingers, deformed hand, claw, blurry, plastic skin, six fingers"

NEGATIVE = (
    "(nsfw, nudity, topless:1.5), cartoon, illustration, painting, anime, cgi, 3d render, "
    "plastic skin, over-smoothed, airbrushed, waxy, doll, deformed hands, extra fingers, fused fingers, "
    "bad anatomy, asymmetrical eyes, cross-eyed, blurry, lowres, jpeg artifacts, watermark, text, logo, "
    "oversaturated, harsh flash, child, teenager, cropped head, duplicate, disfigured, uncanny"
)

CHARACTERS = {
    "Amara": "a 27 year old Black woman, deep ebony skin with warm undertone, closely cropped natural hair, high sculpted cheekbones, full lips, long neck, tall statuesque build, calm intense almond eyes",
    "Meher": "a 26 year old Indian woman, warm golden-wheatish skin, thick defined eyebrows, large dark almond eyes, sleek center-parted hair, delicate gold nose stud, classical graceful features",
    "Ines":  "a 28 year old Mediterranean woman, olive skin with a light tan, dark wavy hair, strong jawline, hazel eyes, light freckles across the nose bridge",
    "Freya": "a 25 year old Scandinavian woman, fair porcelain skin with natural freckles, long copper-blonde tousled hair, pale blue-grey eyes, high forehead, androgynous editorial elegance",
    "Yuna":  "a 26 year old East Asian woman, luminous fair skin, razor-sharp jet black bob haircut with blunt fringe, almond eyes, refined bone structure",
    "Nia":   "a 24 year old Black woman with a shaved head, flawless dark skin with cool undertone, strong brow bone, serene lips, long neck, sculptural cheekbones",
}

# fields are joined in this order to build the positive prompt
ORDER = ["shot", "char", "set", "wardrobe", "palette", "hair_makeup", "pose", "lighting", "lens"]

SHOTS = [
    dict(file="hero", title="Hero — Rouge", char="Amara", w=768, h=1344, seed=7001,
         shot="three-quarter length fashion portrait from the knees up, model standing, space above the head",
         wardrobe="sculptural red silk duchess-satin architectural gown with one enormous sculpted sleeve, crisp folds, visible weave and sheen",
         hair_makeup="natural dark brown skin tone, sleek slicked-back low bun, glossy red lip, soft bronzed eyelids, defined brows",
         pose="chin lowered slightly, eyes to camera, one hand resting on hip, weight on the back leg",
         set="solid deep crimson red seamless paper background, red wall, soft gradient falloff, long soft shadow on the wall, shoes visible on a red floor", neg="green skin, teal face paint, face mask, blue skin, grey background, gray backdrop, neutral background, white background, beige background",
         lighting="large octabox key camera-left at 45 degrees, subtle red-gel rim light from behind-right, black flag camera-right for contrast, 5600K",
         lens="85mm equivalent, f/4, eye-level",
         palette="monochrome crimson, deep oxblood shadows, warm skin highlights"),
    dict(file="g1", title="Gold Bloom", char="Ines", w=768, h=1344, seed=7411,
         shot="waist-up avant-garde couture portrait, the whole upper body and arms visible, standing straight, natural human proportions with a normal-sized head",
         wardrobe="a fitted floor-length gold gown covered in hand-forged coral-like gold branch embroidery with tiny emerald and ruby stones, and a delicate gold branch crown on her head",
         hair_makeup="hair swept under the headpiece, gold-dust eyelids, bare luminous skin, nude-rose lip",
         pose="arms slightly away from the body, feet apart, gaze straight to camera",
         set="textured painterly warm-grey studio backdrop, subtle floor reflection",
         lighting="soft diffused beauty light from a large scrim front-left, gentle fill from a white card, hair light behind, 5200K",
         lens="70mm equivalent, f/5.6, slightly low angle",
         palette="warm grey, burnished gold, deep emerald accents"),
    dict(file="g2", title="Nocturne", char="Meher", w=768, h=1344, seed=7021,
         shot="three-quarter length low-angle hero portrait from the knees up, dramatic stance",
         wardrobe="floor-length sheer black gown with geometric beaded lattice embroidery over a nude-tone lining, black ostrich-feather cuffs and hem, wide black velvet belt, long velvet lapels, high-neck bodice",
         hair_makeup="hair in two sculpted buns, smoky charcoal eyes, deep plum lip, glowing skin",
         pose="one leg forward through a high slit, hands in the feather cuffs, shoulders back",
         set="seamless blue-teal gradient backdrop, matte floor",
         lighting="single strip softbox camera-right, cool cyan kicker behind-left, deep shadows, controlled specular on beadwork, 4800K",
         lens="50mm equivalent, f/4, low angle",
         palette="teal-blue gradient, jet black, tiny sparkles of silver"),
    dict(file="g3", title="Rouge Hour", char="Amara", w=768, h=1344, seed=7031,
         shot="full-length editorial portrait, looking down and to the side",
         wardrobe="off-the-shoulder ruched red taffeta ball gown with huge puffed sleeves and a thigh-high slit, voluminous skirt with deep folds, gold strappy heels",
         hair_makeup="sleek low bun, bare shoulders, soft glam eyes, deep red satin lip",
         pose="one hand on waist, the other lightly holding the skirt, head tilted, eyes lowered",
         set="monochrome crimson studio, polished floor with faint reflection",
         lighting="large softbox top-front, fill bounce from below, subtle rim light on the shoulders, 5400K, rich satin highlights",
         lens="85mm equivalent, f/4",
         palette="red on red, burnished gold accents, rich warm skin"),
    dict(file="g4", title="Chrome Bloom", char="Nia", w=832, h=1216, seed=7041,
         shot="waist-up avant-garde runway portrait, front-facing, symmetrical",
         wardrobe="sculpted pleated fan collar and exaggerated shoulders in iridescent blue-silver liquid-metal fabric, radial pleats, second-skin pleated high-neck bodysuit with long sleeves",
         hair_makeup="shaved head, luminous glass skin, subtle silver lip, minimal makeup",
         pose="arms down, chin level, direct calm gaze",
         set="dark industrial runway, warm tungsten practical lights out of focus in the background, blurred audience silhouettes",
         lighting="overhead narrow spots, cool blue reflections on the metallic pleats, warm bokeh highlights, 4200K",
         lens="85mm f/2, shallow depth of field",
         palette="electric steel blue, silver, warm amber bokeh"),
    dict(file="g5", title="Zari — Bridal", char="Meher", w=832, h=1216, seed=7051,
         shot="three-quarter-length bridal couture portrait, 85mm crop",
         wardrobe="gold zardozi bridal lehenga with cut-work floral embroidery, sequins and tassel fringe, a gold embroidered net veil over the head, emerald and polki choker, matching earrings and maang tikka",
         hair_makeup="hair parted and tucked under the veil, kohl-rimmed eyes, soft rose lip, dewy skin with natural texture",
         pose="hands gently clasped at the waist, chin slightly lowered, soft eyes to camera",
         set="baroque palace hall, crystal chandeliers glowing as warm bokeh behind her",
         lighting="warm tungsten ambience, soft golden key from camera-left, subtle fill, glowing embroidery highlights, 3200K",
         lens="85mm f/1.8, creamy bokeh",
         palette="antique gold, emerald green, warm amber, dark mahogany"),
    dict(file="r1", title="Velvet Noir", char="Ines", w=768, h=1344, seed=7161,
         shot="three-quarter length back portrait looking over the shoulder",
         wardrobe="black velvet floor-length gown with a dramatically open back and a long train",
         hair_makeup="hair in a low chignon, bare shoulder blades, smoky eyes, nude lip",
         pose="turned away, head over shoulder, one arm bent gracefully",
         set="a dark marble hall with tall columns, plain smooth walls",
         lighting="soft diffused daylight from a tall window on camera-left, gentle even light on the skin, no patterns or projections on the skin",
         lens="85mm f/2.8",
         palette="black velvet, cold marble grey, pale warm skin"),
    dict(file="r2", title="Gilded Hall", char="Freya", w=768, h=1344, seed=7071,
         shot="three-quarter length symmetrical portrait",
         wardrobe="champagne sheer beaded cape gown with fine crystal embroidery, long sheer cape sleeves, high neck",
         hair_makeup="copper-blonde hair in a loose low twist, glowing champagne eyes, soft peach lip",
         pose="standing centered, arms relaxed, composed gaze",
         set="gilded baroque hall with tall mirrors, symmetrical composition, polished floor",
         lighting="warm chandelier key, soft fill, gentle backlight catching the beadwork, 3400K",
         lens="50mm f/4, wide environmental",
         palette="champagne gold, ivory, warm amber"),
    dict(file="r3", title="Crimson Silk", char="Amara", w=768, h=1344, seed=7081,
         shot="full-length motion portrait, mid-turn, fabric in motion",
         wardrobe="crimson silk charmeuse draped asymmetrical dress with a flowing skirt caught in motion, dramatic ripples",
         hair_makeup="cropped natural hair, gold hoop earrings, bold red lip, bronzed skin",
         pose="mid-twirl with arms flowing, face in clear focus, smiling softly",
         set="red studio seamless backdrop",
         lighting="large softbox front, strobe frozen at 1/250s, red-gel background light, crisp fabric detail, 5600K",
         lens="70mm f/5.6",
         palette="crimson, scarlet highlights, deep wine shadows"),
    dict(file="r4", title="Silver Rain", char="Yuna", w=768, h=1344, seed=7091,
         shot="three-quarter length runway portrait, front view, walking",
         wardrobe="silver sequin and tinsel-fringe column gown with long sleeves, tiny matching mini bag held by a chain",
         hair_makeup="sharp black bob, glossy red lip, minimal eyes",
         pose="mid-stride, arms natural, calm focus",
         set="dark grey runway with a soft smoky backdrop",
         lighting="soft backlight and overhead wash, fringe catching glints of light, 4500K",
         lens="85mm f/2.8, telephoto runway compression",
         palette="silver, graphite grey, red lip"),
    dict(file="r5", title="Marble & Flame", char="Ines", w=768, h=1344, seed=7101,
         shot="full-length dramatic portrait with floor reflections",
         wardrobe="black corset gown with gold embroidered vines, sheer black tulle skirt with a long train and gold branch embroidery, structured black off-shoulder sleeves",
         hair_makeup="dark hair in an elegant high updo, kohl eyes, deep berry lip",
         pose="three-quarter stance, one hand lightly resting on the skirt, gaze off camera",
         set="polished black marble floor with reflections, candelabra with lit candles, marble statue in a niche, haze",
         lighting="candlelight warmth, shaft of cool window light from top-left, deep chiaroscuro, 3000K",
         lens="50mm f/2.8",
         palette="black, antique gold, candle amber"),
    dict(file="r6", title="After Dark", char="Meher", w=768, h=1344, seed=7111,
         shot="three-quarter length seated editorial portrait",
         wardrobe="metallic gold sequined slip gown, delicate chandelier earrings, ankle bracelet, strappy heels",
         hair_makeup="sleek half-up hair, bronze eyes, glossy nude lip, luminous skin",
         pose="seated sideways on a black marble ledge, one hand on the ledge, relaxed shoulders, soft sideways look",
         set="luxury penthouse lounge at night, warm table lamps, white flower arrangements, city lights as bokeh",
         lighting="warm practical lamps as key, cool city glow as rim, soft fill, 3200K",
         lens="85mm f/1.8, bokeh",
         palette="warm gold, black marble, ivory flowers"),
    dict(file="bts1", title="BTS — final lip", char="Amara", w=832, h=1216, seed=7201, kind="bts",
         shot="close-up of a makeup artist's hand with a fine lip brush applying red lipstick to the model's lips, the model looking calm",
         wardrobe="model wearing a black robe, off-camera glam team",
         hair_makeup="model with sleek bun and bronzed skin, makeup artist's gloved hand in frame",
         pose="head slightly tilted back, eyes closed or lowered",
         set="vanity mirror with bulb lights glowing, brushes and palettes blurred in the foreground",
         lighting="warm bulb light around the mirror, soft overhead fill, 3200K",
         lens="35mm f/2",
         palette="warm tungsten, red lip accent"),
    dict(file="bts2", title="BTS — tethered", char="", w=1216, h=832, seed=7211, kind="bts",
         shot="wide environmental shot of a photographer behind a medium-format camera on a tripod, tethered laptop beside, an assistant holding a reflector",
         wardrobe="photographer in black clothing, assistant in grey",
         hair_makeup="",
         pose="photographer concentrating through the viewfinder",
         set="fashion studio with a large softbox on a C-stand, black gaffer tape on the floor, a crimson backdrop behind, cables and sandbags",
         lighting="softbox glow and tungsten work lights, hazy studio atmosphere",
         lens="28mm f/2.8, wide",
         palette="crimson, charcoal, warm tungsten"),
    dict(file="bts3", title="BTS — pins and prayers", char="Amara", w=832, h=1216, seed=7221, kind="bts",
         shot="a stylist kneeling and pinning the hem of a red gown on the model, pins held between lips",
         wardrobe="voluminous red taffeta gown being adjusted",
         hair_makeup="model with sleek low bun",
         pose="model standing still, looking down at the stylist",
         set="behind the scenes studio corner with a garment rail, a steamer, boxes of shoes",
         lighting="warm tungsten work lights, mixed with cool daylight from a window",
         lens="35mm f/2",
         palette="red satin, warm tungsten, soft grey"),
    dict(file="bts4", title="BTS — between takes", char="Yuna", w=1216, h=832, seed=7231, kind="bts",
         shot="the model sitting on an apple box in a robe between takes, sipping coffee and laughing softly",
         wardrobe="soft white robe over her gown",
         hair_makeup="hair and makeup done, sharp black bob, red lip",
         pose="relaxed, casual, mid-laugh, coffee cup in hand",
         set="blurred fashion set in the background with lights on stands",
         lighting="soft window light, warm bokeh from studio lights",
         lens="50mm f/1.8",
         palette="soft white, red lip, warm grey"),
]


def build_negative(s):
    n = NEGATIVE
    if any(k in s["shot"] for k in ("full-length", "full body")):
        n += ", close-up, headshot, portrait crop, cropped body, legs cut off, feet cut off, out of frame"
    if s.get("neg"):
        n += ", " + s["neg"]
    return n


def build_positive(s):
    """Most important tokens first: SDXL's CLIP weakens everything after the first ~75 tokens."""
    parts = ["RAW photo, high-fashion editorial photograph" if s.get("kind") != "bts" else "candid behind-the-scenes photo"]
    for k in ORDER:
        v = CHARACTERS.get(s.get("char", ""), "") if k == "char" else s.get(k)
        if not v:
            continue
        if k == "shot":
            v = f"({v}:1.2)"
        elif k == "set":
            v = f"({v}:1.2)"
        elif k == "wardrobe":
            v = f"({v}:1.15)"
        parts.append(v)
    parts += [BTS_STYLE] if s.get("kind") == "bts" else [ELEGANCE, SKIN, STYLE]
    return ", ".join(parts)


def build_face_prompt(s):
    """Prompt for the FaceDetailer pass: identity + full face-detail realism block."""
    ident = CHARACTERS.get(s.get("char", ""), "")
    return ", ".join(x for x in [ident, REALISM_FACE, "natural skin texture, soft studio light"] if x)


# ---------------------------------------------------------------------------
# Z-Image-Turbo (Qwen text encoder): natural-language paragraph, NO negative prompt, NO weights.
# Verified on this machine to give far more real faces/skin than RealVisXL (see skills/photorealistic-ai-media-engineering).
# ---------------------------------------------------------------------------
REALISM_NL = (
    "Her face is photographed with real human detail: a detailed iris with radial fibers and a limbal ring, round pupils, two sharp natural catchlights, "
    "faint veins in the whites of the eyes, a visible tear line, individual upper and lower eyelashes with natural clumps, individual eyebrow hair strokes, "
    "visible skin pores, tiny blemishes and uneven skin tone, natural cheek redness, fine vellus peach-fuzz on the cheeks and upper lip, "
    "lips with fine vertical lines and uneven color, ears with clear helix and lobe detail, individual hair strands with baby hairs along the hairline, "
    "slight natural facial asymmetry, no airbrushing, no skin smoothing, fine film grain. Hands have five fingers with knuckle creases and clean nails."
)


def build_zimage_prompt(s):
    bts = s.get("kind") == "bts"
    cam = ("candid behind-the-scenes photograph shot on a Leica Q3 with a 28mm lens, mixed tungsten and strobe light, authentic unposed moment"
           if bts else "real, unretouched fashion editorial photograph shot on a Hasselblad X2D medium-format camera")
    parts = [f"A {cam}."]
    parts.append(s["shot"][0].upper() + s["shot"][1:] + ". Natural, anatomically correct human proportions.")
    ch = CHARACTERS.get(s.get("char", ""), "")
    if ch:
        parts.append("The subject is " + ch + ".")
    for k, pre in (("wardrobe", "She wears"), ("hair_makeup", "Hair and makeup:"), ("pose", "Pose:"), ("set", "Setting:")):
        if s.get(k):
            parts.append(f"{pre} {s[k]}.")
    if s.get("lighting"):
        parts.append("Lighting: " + s["lighting"] + ".")
    if s.get("lens"):
        parts.append("Lens and framing: " + s["lens"] + ".")
    if s.get("palette"):
        parts.append("Colour palette: " + s["palette"] + ".")
    if ch or s.get("char"):
        parts.append(REALISM_NL)
    return " ".join(parts)
