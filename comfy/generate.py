"""Render Rouge Noir shots with Z-Image-Turbo through a running ComfyUI -> ../images/<name>.webp
(Z-Image replaced RealVisXL: far more real skin/eyes/fabric. Old SDXL pipeline kept in generate_sdxl.py.)

  python generate.py                    # all shots (skips files that already exist)
  python generate.py hero g1            # only these
  python generate.py --force hero       # redo
  python generate.py --variants 3 g3    # 3 seeds -> images/_cand/  (pick the best by eye)
  python generate.py --big hero g3      # 1152x1728 instead of 896x1344 (heroes / full-bleed use)
Every output is also saved untouched as PNG in comfy/out/ with a face-crop check image (check_<name>.png).
"""
import io, json, sys, time, uuid, urllib.request, urllib.parse, urllib.error
from pathlib import Path
from PIL import Image
from shots import SHOTS, build_zimage_prompt

HOST = "http://127.0.0.1:8188"
HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "images"
RAW = HERE / "out"
QUALITY = 84


def api(path, data=None):
    req = urllib.request.Request(HOST + path, data=json.dumps(data).encode() if data else None, headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def zgraph(prompt, w, h, seed, prefix, steps=8):
    return {
        "28": {"class_type": "UNETLoader", "inputs": {"unet_name": "z_image_turbo_bf16.safetensors", "weight_dtype": "default"}},
        "30": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_3_4b_fp8_mixed.safetensors", "type": "lumina2", "device": "default"}},
        "29": {"class_type": "VAELoader", "inputs": {"vae_name": "ae.safetensors"}},
        "11": {"class_type": "ModelSamplingAuraFlow", "inputs": {"shift": 3.0, "model": ["28", 0]}},
        "27": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["30", 0]}},
        "33": {"class_type": "ConditioningZeroOut", "inputs": {"conditioning": ["27", 0]}},
        "13": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {"seed": seed, "steps": steps, "cfg": 1.0, "sampler_name": "res_multistep", "scheduler": "simple", "denoise": 1.0,
                                                    "model": ["11", 0], "positive": ["27", 0], "negative": ["33", 0], "latent_image": ["13", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["29", 0]}},
        "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": prefix}},
    }


def run(g):
    for attempt in range(6):
        try:
            pid = api("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
            while True:
                hist = api(f"/history/{pid}")
                if pid in hist:
                    h = hist[pid]
                    if h.get("status", {}).get("status_str") == "error":
                        raise RuntimeError(json.dumps(h["status"])[:800])
                    img = next(iter(h["outputs"].values()))["images"][0]
                    q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img["subfolder"], "type": img["type"]})
                    return Image.open(io.BytesIO(urllib.request.urlopen(f"{HOST}/view?{q}").read())).convert("RGB")
                time.sleep(3)
        except (ConnectionError, urllib.error.URLError, TimeoutError, OSError) as e:
            print(f"  connection problem ({e.__class__.__name__}), retry {attempt + 1}/6 in 20s", flush=True)
            time.sleep(20)
    raise RuntimeError("ComfyUI unreachable")


def run_raw(g):
    """Run any graph, return the raw bytes of the first output file (png / mp4)."""
    for attempt in range(6):
        try:
            pid = api("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
            while True:
                hist = api(f"/history/{pid}")
                if pid in hist:
                    h = hist[pid]
                    if h.get("status", {}).get("status_str") == "error":
                        raise RuntimeError(json.dumps(h["status"])[:1200])
                    img = next(v[0] for o in h["outputs"].values() for v in o.values() if isinstance(v, list) and v and isinstance(v[0], dict) and "filename" in v[0])
                    q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img["subfolder"], "type": img["type"]})
                    return urllib.request.urlopen(f"{HOST}/view?{q}").read()
                time.sleep(3)
        except (ConnectionError, urllib.error.URLError, TimeoutError, OSError) as e:
            print(f"  connection problem ({e.__class__.__name__}), retry {attempt + 1}/6 in 20s", flush=True)
            time.sleep(20)
    raise RuntimeError("ComfyUI unreachable")


def main():
    args = sys.argv[1:]
    variants = 1
    if "--variants" in args:
        i = args.index("--variants"); variants = int(args[i + 1]); del args[i:i + 2]
    big, force = "--big" in args, "--force" in args
    names = [a for a in args if not a.startswith("--")]
    OUT.mkdir(exist_ok=True); RAW.mkdir(exist_ok=True)
    for s in [x for x in SHOTS if not names or x["file"] in names]:
        portrait = s["h"] >= s["w"]
        w, h = ((1152, 1728) if big else (896, 1344)) if portrait else ((1728, 1152) if big else (1344, 896))
        for v in range(variants):
            seed = s["seed"] + v * 101
            final = OUT / ("_cand" if variants > 1 else ".") / (f"{s['file']}_{v + 1}.webp" if variants > 1 else f"{s['file']}.webp")
            if variants == 1 and final.exists() and not force:
                print(f"{s['file']:6} exists, skipping (use --force)", flush=True); continue
            t0 = time.time()
            im = run(zgraph(build_zimage_prompt(s), w, h, seed, f"rn_{s['file']}"))
            tag = f"{s['file']}_s{seed}"
            im.save(RAW / f"{tag}.png")
            final.parent.mkdir(exist_ok=True)
            im.save(final, "WEBP", quality=QUALITY, method=6)
            cw, ch = im.size
            box = (int(cw * .2), 0, int(cw * .8), int(ch * .42)) if portrait else (int(cw * .15), int(ch * .05), int(cw * .75), int(ch * .6))
            im.crop(box).save(RAW / f"check_{tag}.png")
            print(f"{s['file']:6} seed {seed} -> {final.name} {im.size} {final.stat().st_size // 1024} KB {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
