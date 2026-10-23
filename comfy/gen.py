"""Generate ONE image from a prompt — no ComfyUI UI, no dragging.

  1. Write your prompt in  comfy/prompt.txt   (plain English, describe the photo; no negative prompt needed)
  2. Run:   python comfy/gen.py
     or:    python comfy/gen.py "a woman in an oversized green sweatshirt leaning on a pale blue wall"
Options:  --land (landscape) | --square | --big (higher res) | --count 3 | --seed 123 | --plain (don't add the human-realism paragraph)
Result:   comfy/out/gen_<seed>.png  (path printed). ComfyUI must be open (127.0.0.1:8188). Model: Z-Image-Turbo.
"""
import sys, time
from pathlib import Path
from generate import zgraph, run, RAW
from shots import REALISM_NL

HERE = Path(__file__).resolve().parent
args = sys.argv[1:]


def flag(n):
    if n in args:
        args.remove(n); return True
    return False


def opt(n, d):
    if n in args:
        i = args.index(n); v = args[i + 1]; del args[i:i + 2]; return v
    return d


land, square, big, plain = flag("--land"), flag("--square"), flag("--big"), flag("--plain")
count, seed0 = int(opt("--count", 1)), int(opt("--seed", int(time.time()) % 100000))
prompt = " ".join(args).strip() or (HERE / "prompt.txt").read_text(encoding="utf-8").strip()
if not prompt:
    sys.exit("Prompt empty: write it in comfy/prompt.txt or pass it in quotes.")
base = (1152, 1728) if big else (896, 1344)
w, h = (base[1], base[0]) if land else ((1024, 1024) if square else base)
people = any(k in prompt.lower() for k in ("woman", "man ", "girl", "model", "person", "face", "portrait", "she ", "he ", "boy", "people"))
SHORT = ("Natural, anatomically correct human proportions with a normal-sized head; real skin with visible pores, natural catchlights in the eyes, "
         "individual eyelashes, fine baby hairs, no airbrushing, fine film grain; hands with five fingers.")
fullbody = any(k in prompt.lower() for k in ("full-length", "full length", "full body", "head-to-toe", "head to toe", "standing"))
full = prompt if (plain or not people) else prompt.rstrip(". ") + ". " + (SHORT if fullbody else REALISM_NL)
RAW.mkdir(exist_ok=True)
for i in range(count):
    s = seed0 + i * 101
    t0 = time.time()
    im = run(zgraph(full, w, h, s, "gen"))
    p = RAW / f"gen_{s}.png"
    im.save(p)
    print(f"{p}  {im.size}  {time.time() - t0:.0f}s", flush=True)
