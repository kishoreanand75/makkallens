import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy: only the third parties the site really calls are allowed.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // Next.js injects small inline bootstrap scripts; GA is allowed only when configured.
  `script-src 'self' 'unsafe-inline'${process.env.NEXT_PUBLIC_GA_ID ? " https://www.googletagmanager.com" : ""}`,
  `connect-src 'self' https://overpass-api.de https://overpass.kumi.systems https://api.open-meteo.com https://*.supabase.co wss://*.supabase.co${process.env.NEXT_PUBLIC_GA_ID ? " https://www.google-analytics.com https://*.analytics.google.com" : ""}`,
  "media-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(self), microphone=(self), camera=(), payment=()" },
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Tailwind CSS v4 runs through its Turbopack loader (this is what `create-next-app` generated; keep it).
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
