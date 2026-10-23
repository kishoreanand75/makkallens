import type { MetadataRoute } from "next";
import { schemes } from "@/lib/data";
import { sections } from "@/lib/sections";
import { services } from "@/lib/services";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Pages are bilingual on one URL (language switch in the UI), so a single entry per page is correct.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ["/services", "/ask", "/profile", "/explore", "/leaders/states", "/pricing", "/privacy", "/terms", "/contact"];
  return [
    ...sections.map((s) => ({ url: `${base}${s.href === "/" ? "" : s.href}`, lastModified: now, changeFrequency: "weekly" as const, priority: s.href === "/" ? 1 : 0.8 })),
    ...fixed.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...schemes.map((s) => ({ url: `${base}/schemes/${s.id}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...services.map((s) => ({ url: `${base}/service/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
