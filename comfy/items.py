"""One dedicated, bright photo per Top-50 item that has no image of its own yet. Resumable. python comfy/items.py [id ...]"""
import sys, time
from generate import zgraph, run, RAW
from categories import REALISM
from topics import TAIL

ITEMS = {
    "nativity-certificate": "A Tamil man in his thirties in a crisp checked shirt holding up a certificate folder inside a clean bright municipal office, smiling, a village temple tower softly visible through the window.",
    "pmfby": "A smiling Tamil woman farmer in a bright saree standing at the edge of her green crop field holding a folded insurance paper, blue sky with a few soft clouds, sunlit.",
    "nsp-scholarships": "A young Tamil college student in a smart casual shirt smiling and holding a laptop on a bright campus lawn, classmates softly blurred behind, hopeful mood.",
    "first-graduate-certificate": "A joyful young Tamil man in a graduation gown and cap holding a degree scroll with his proud parents on either side, bright campus background.",
    "pm-jay": "A relieved middle-aged Tamil man sitting up in a hospital bed smiling with his wife and a kind doctor at the bedside in a bright modern hospital ward.",
    "tn-oap": "An elderly Tamil woman with silver hair in a pastel cotton saree smiling as she receives a small envelope from a courteous young clerk at a bright post-office counter.",
    "tamil-pudhalvan": "A confident Tamil boy of sixteen in a neat school uniform smiling beside his proud mother in a green saree, a bright school corridor, books in his hand.",
    "pmmvy": "A cheerful pregnant Tamil woman in a pastel saree gently holding her belly and smiling, standing in a sunlit courtyard with a kolam, her husband beside her.",
    "tn-maternity": "A smiling young Tamil mother holding a healthy newborn while a friendly nurse in a clean uniform checks on her in a bright hospital room.",
    "death-certificate": "A calm dignified Tamil woman in a white cotton saree at a bright municipal office counter receiving a document folder from a courteous clerk, a quiet respectful expression, soft light.",
    "encumbrance-certificate": "A smiling Tamil couple at a bright registrar office desk reviewing property papers with a friendly official, a small model house on the desk.",
    "sukanya": "A happy Tamil father hugging his young daughter of about eight in a green school uniform, a savings passbook in his hand, a bright garden behind them.",
    "apy": "A cheerful Tamil auto-rickshaw driver in a khaki shirt smiling beside his auto holding a small blank pension card, sunny street behind him.",
    "eshram": "A smiling Tamil construction worker in a safety helmet and orange vest showing a blank card on his smartphone, a building site in bright daylight behind him.",
    "tn-labour-welfare": "A cheerful Tamil woman worker in a bright saree and a male mason smiling at a labour welfare office counter as they receive an envelope, bright daylight.",
    "kcc": "A smiling Tamil farmer in a white shirt at a bright bank counter holding a blank credit card and a passbook, a friendly bank officer behind the counter.",
    "pmay-u": "A young Tamil couple on the balcony of their new bright apartment building waving and smiling, a city skyline in sunlight behind them, a house key in hand.",
    "jan-dhan": "A smiling Tamil woman in a cotton saree holding a bank passbook and a blank bank card outside a bright small-town bank branch.",
    "udid": "A smiling young Tamil woman using a wheelchair, in a bright blue kurta, holding a blank ID card in a sunlit accessible office, a friendly officer beside her.",
    "pm-vidyalaxmi": "A hopeful Tamil engineering student with a backpack smiling and holding a laptop in front of a modern university building under a bright sky.",
    "skill-india": "Two young Tamil technicians in safety goggles learning electronics repair at a bright skill-training workbench with a smiling instructor beside them.",
    "pm-svanidhi": "A smiling Tamil street vendor woman in a green saree behind a colourful fresh fruit cart on a bright street, holding a smartphone for a digital payment.",
    "pm-vishwakarma": "A proud Tamil master carpenter in his fifties shaping wood in a bright workshop with tools neatly arranged behind him, smiling at the camera.",
    "standup-india": "A confident Tamil woman entrepreneur in a smart saree standing at the entrance of her new small factory unit with a proud smile, bright morning light.",
    "soil-health-card": "A Tamil farmer and an agriculture officer in a green field testing soil with a small kit, both smiling, bright morning light.",
}

if __name__ == "__main__":
    only = set(sys.argv[1:])
    RAW.mkdir(exist_ok=True)
    for i, (name, text) in enumerate(ITEMS.items()):
        if only and name not in only:
            continue
        out = RAW / f"item_{name}.png"
        if out.exists():
            print("skip", name, flush=True)
            continue
        t0 = time.time()
        im = run(zgraph(f"{text} {REALISM}{TAIL}", 1088, 816, 8200 + i * 17, "item"))
        im.save(out)
        print(f"{out.name} {im.size} {time.time() - t0:.0f}s", flush=True)
