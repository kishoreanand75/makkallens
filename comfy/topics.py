"""Bright, aspirational topic images (Z-Image-Turbo). Resumable. python comfy/topics.py [name ...] -> comfy/out/topic_<name>.png"""
import sys, time
from generate import zgraph, run, RAW
from categories import REALISM

TAIL = " Bright airy natural light, vivid true-to-life colours, premium editorial lifestyle photography, neat clean modern clothing, shallow depth of field, fine film grain, shot on a 50mm lens, joyful hopeful mood, no text, no logos, no watermark."

ITEMS = {
    "schemes": "Medium shot of a joyful Tamil woman in her thirties in a neat bright green cotton saree at a clean, modern, sunlit government welfare counter, smiling as a courteous officer hands her a document folder.",
    "documents": "A smiling young Indian woman in a crisp white shirt holding a neat folder of certificates up in front of her, seated at a bright modern desk with a laptop and a small green plant, warm window light.",
    "jobs": "A confident young Indian man and a young Indian woman in smart casual clothes smiling at the camera in a bright modern skill-training computer lab, laptops open, both looking hopeful and proud.",
    "education": "A radiant Tamil schoolgirl of about fourteen in a crisp white and navy uniform with two neat braids and ribbons, laughing and holding books, in a sunlit modern school courtyard, friends softly blurred behind her.",
    "agriculture": "A proud Tamil farmer couple in their forties, he in a white shirt and veshti and she in a vivid saree, standing in a lush green paddy field at golden sunrise holding ripe rice stalks, big natural smiles, soft mist behind.",
    "health": "A warm young Indian woman doctor in a white coat with a stethoscope smiling with a cheerful middle-aged Tamil woman patient in a bright clean modern clinic, soft daylight.",
    "women": "Three confident Tamil women entrepreneurs in colourful sarees laughing together in a bright self-help-group workshop with neatly arranged handmade products on shelves behind them.",
    "seniors": "A happy elderly Tamil couple with white hair, he in a crisp white shirt and she in a silk saree, sitting on a sunlit garden bench holding hands and laughing, flowers in bloom behind.",
    "business": "A young Tamil woman shopkeeper in a modern kurta smiling warmly in her tidy, colourful boutique holding a tablet, shelves of neatly folded fabrics behind her.",
    "emergency": "A friendly young Indian paramedic in a clean navy uniform gently helping a smiling elderly Tamil woman at dusk beside an ambulance with warm light, both faces clearly visible, the ambulance has no writing on it.",
    "id": "A cheerful young Tamil man in his twenties in a blue shirt holding up a small blank plastic ID card in one hand with a bright smile, in a clean bright community service centre.",
    "card": "A smiling Tamil woman in a green saree holding a blank bank-style card and a smartphone at a bright bank counter, a friendly bank officer softly blurred behind.",
    "basket": "A smiling Tamil mother in a green cotton saree receiving a cloth bag of rice and lentils from a friendly shopkeeper at a clean fair price shop, bright daylight.",
    "baby": "A happy young Tamil couple tenderly holding their newborn baby wrapped in a soft white blanket in a bright hospital room, gentle smiles.",
    "ring": "A Tamil bride in a red silk saree with jasmine in her hair and a groom in a white veshti smiling as they sign a register in a bright registrar office with fresh flowers.",
    "home": "A young Tamil family of four laughing in front of their new bright pastel-yellow modern house with a kolam at the doorstep, blue sky and coconut trees behind.",
    "bus": "Cheerful Tamil women in colourful sarees boarding a clean green city bus on a bright morning in Chennai, a smiling driver visible, no readable text on the bus.",
    "bolt": "A smiling young Tamil man paying an electricity bill on his smartphone in a bright modern living room with a lit lamp, his family softly blurred behind.",
    "map": "A Tamil farmer and a young land surveyor in a green field looking at a land map on a tablet together, bright morning light, both smiling.",
    "vote": "A proud Tamil woman at a bright polling station showing her inked index finger and a blank voter card, smiling at the camera.",
    "car": "A smiling young Tamil woman in a white kurta leaning out of the window of a modern small car holding a blank driving licence card, bright street behind.",
    "passport": "A happy young Indian traveller holding a blue passport booklet beside a small suitcase at a bright airport terminal, planes visible through large windows, smiling.",
    "flame": "A joyful Tamil woman in a clean modern kitchen cooking on a blue LPG gas stove with a steaming pot, smiling at the camera, bright morning light.",
    "shield": "A happy Tamil family of three in a green park in bright sunlight, the father holding a folder of insurance papers, everyone smiling.",
    "meal": "Cheerful Tamil schoolchildren in uniforms eating a hot idli breakfast at long tables in a bright school hall while a cook serves them, smiling.",
}

if __name__ == "__main__":
    only = set(sys.argv[1:])
    RAW.mkdir(exist_ok=True)
    for i, (name, text) in enumerate(ITEMS.items()):
        if only and name not in only:
            continue
        out = RAW / f"topic_{name}.png"
        if out.exists():
            print("skip", name, flush=True)
            continue
        t0 = time.time()
        im = run(zgraph(f"{text} {REALISM}{TAIL}", 1088, 816, 7100 + i * 13, "topic"))
        im.save(out)
        print(f"{out.name} {im.size} {time.time() - t0:.0f}s", flush=True)
