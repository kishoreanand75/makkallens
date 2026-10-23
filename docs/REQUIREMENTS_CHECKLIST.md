# TN Vaazhga / Arasu Vazhi – requirement checklist (source: docs/TN_Vaazhga_Complete_Launch_Plan.pdf + user messages)

Status is filled at the end of the build with evidence. `[ ]` = not yet.

## Product
- [ ] R1 Curated scheme DB: official URL, department, last-verified date on every scheme answer
- [ ] R2 Rules-based eligibility matching (not only free text) with match %
- [ ] R3 Document Doctor: missing-document checklist + how to get each
- [ ] R4 Deadline Radar: reminders (add / list / .ics export)
- [ ] R5 District-aware help-centre locator (hospital / police / CSC link)
- [ ] R6 Tamil-first UI, English toggle, voice input + TTS
- [ ] R7 Database-first, cache-first AI pipeline (normalise > cache > DB search > rules > Gemini format > cache TTL > log)
## Users (section 2) – priority features
- [ ] R8 Students: scholarship matcher, exam alerts, doc checklist
- [ ] R9 Job seekers: TNPSC/TNUSRB/TET eligibility, notifications, resume help
- [ ] R10 Women & families: scheme matcher, documents, helplines
- [ ] R11 Farmers: crop schemes, weather, guidance
- [ ] R12 Seniors: voice-first UI, large text, pension checker
- [ ] R13 Small business: checklist, scheme guidance
- [ ] R14 General citizens: Document Doctor, local services, official links
## Core loop (section 3)
- [ ] R15 30-second profile > matched schemes > missing docs, deadlines, next steps > Urimai Card / checklist / WhatsApp share > reminders + improving recommendations
## 12 pages (section 4)
- [ ] P1 Home · [ ] P2 Schemes · [ ] P3 Certificates & Documents · [ ] P4 Jobs & Exams · [ ] P5 Education & Scholarships · [ ] P6 Agriculture
- [ ] P7 Health · [ ] P8 Women & Family · [ ] P9 Senior Citizens & Pensions · [ ] P10 Business & Self-Employment · [ ] P11 Bills & Local Services · [ ] P12 Emergency & Help Centres
## Design (section 5)
- [ ] D1 one primary task per screen · [ ] D2 Mobile-first · [ ] D3 Tamil default + EN toggle · [ ] D4 Noto/Mukta Tamil fonts, body 17-19px
- [ ] D5 deep blue + saffron accent + green/yellow/red status · [ ] D6 buttons >= 48px · [ ] D7 official link + department + last-verified on every scheme
- [ ] D8 no login for basics · [ ] D9 eligibility wizard one question at a time with match %
## Tech (section 6/7)
- [ ] T1 Next.js + Tailwind · [ ] T2 Supabase schema (all MVP tables + RLS) + Auth (Google / email OTP) · [ ] T3 Gemini 2.5 Flash (server-only key)
- [ ] T4 Upstash Redis cache/rate-limit (with local fallback) · [ ] T5 Search · [ ] T6 Leaflet + OpenStreetMap · [ ] T7 storage/email/analytics/error tracking hooks
## Voice (section 9)
- [ ] V1 browser speech input + on-demand Tamil TTS · [ ] V2 live transcript / listening states
## Performance / security / content / launch
- [ ] S1 perf checklist · [ ] S2 RLS, no Aadhaar/PAN storage, rate limit, disclaimer, secure headers
- [ ] C1 schemes bilingual with weekly-check workflow + user "report outdated" + admin review + change log
- [ ] L1 sitemap, robots, OG, meta, privacy, terms, contact, a11y, 20-50 user beta (cannot be done by code)
- [ ] M1 pricing page (Free/Plus/Pro/CSC/Business)
## Added by user later
- [ ] U1 Personalised "for you" from on-site search/view/chat history (privacy-first, on-device, clearable)
- [ ] U2 TN government people pages + chatbot · [ ] U3 ComfyUI realistic hopeful images
