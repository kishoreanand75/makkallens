import Image from "next/image";

/** MakkalLens mark (ComfyUI-generated lens + people emblem, transparent PNG). */
export function LogoMark({ className = "size-11" }: { className?: string }) {
  return <Image src="/logos/makkallens-mark.png" alt="MakkalLens" width={219} height={256} className={`${className} object-contain`} />;
}
