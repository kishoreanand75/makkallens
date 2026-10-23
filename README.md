# MakkalLens / MakkalLens (TN Vaazhga)

Tamil-first guide to government schemes, certificates, jobs, education and local services – Tamil Nadu first, India next.
Built from `docs/TN_Vaazhga_Complete_Launch_Plan.pdf`. Requirement-by-requirement status: `docs/REQUIREMENTS_CHECKLIST.md`.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 30 unit tests (matching, search, history, cache, rate-limit, AI pipeline, Gemini fallback)
npm run build && npm start
npm run check:urls   # reachability check of every official URL in data/*.json
```

No keys are required. Without them the site runs in **local mode** (rules-based answers, in-memory cache, on-device storage).
Copy `.env.example` to `.env.local` to switch on Gemini, Upstash Redis, Supabase, GA4 and the admin page.

## How it works

| Layer | File(s) |
|---|---|
| Data (database-first) | `data/schemes.json` (35), `exams.json`, `documents.json`, `helplines.json`, `districts.json`, `business.json`, `bills.json`, `people.json` |
| Eligibility rules + match % | `lib/match.ts` |
| Search (Tamil / English / Tanglish) | `lib/search.ts` |
| On-device personalisation (search/view history, 14-day half-life) | `lib/history.ts`, `lib/hooks.ts`, `lib/store.ts` |
| AI pipeline: normalise → cache → rules → Gemini only if ambiguous → cache → log | `lib/server/pipeline.ts`, `cache.ts`, `gemini.ts`, `log.ts`, `ratelimit.ts` |
| Client answer cache | `lib/clientcache.ts` |
| Supabase schema + RLS + seed | `supabase/schema.sql`, `supabase/seed.sql` (`node scripts/make-seed.mjs`) |
| Reports / admin review | `app/api/report`, `app/api/admin/reports`, `/admin` (needs `ADMIN_TOKEN`) |

## Content rules (important)

* Every scheme has `lastVerified: null` until a human checks it against the official site; the UI then shows "verification pending".
  To publish a verified entry set `lastVerified` to the check date in `data/schemes.json` and regenerate the seed.
* Leader photos come only from Wikimedia with an open licence (`scripts/fetch-photos.mjs` → `public/photos`, credits in `data/photo-credits.json`).
* Never store Aadhaar / PAN / bank details. Nothing in the app asks for them.

## Design (current)
Palette: white, deep green (#0a6b3d / #07522e), black text; light-green wash for highlights. No yellow, no dark theme, no gradients, no 3D.
Hero = solid green stage + photo + ask card; faint background letters/icons (`components/ui/Watermark.tsx`).
Floating: bottom-left chat (`ChatDock`), left-edge "My documents" tab (icon, expands on hover/focus; saves to this device).
Top 50 = curated list in `data/top50.json` (not Google search data); shown on `/` and `/popular`.
