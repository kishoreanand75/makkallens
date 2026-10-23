-- TN Vaazhga / Arasu Vazhi – Supabase (PostgreSQL) schema, MVP (launch plan section 7) + Row Level Security.
-- Run in the Supabase SQL editor. Review before running on a real project.
-- Privacy rule from the plan: never store Aadhaar, PAN, bank credentials, passwords or document images.

create extension if not exists pgcrypto;

-- ---------- public reference data (read-only for everyone) ----------
create table if not exists public.schemes (
  id text primary key,                      -- slug, e.g. 'pm-kisan'
  level text not null check (level in ('central','state')),
  category text not null,
  title_ta text not null,
  title_en text not null,
  department_ta text not null,
  department_en text not null,
  benefit_ta text not null,
  benefit_en text not null,
  eligibility_json jsonb not null default '{}'::jsonb,
  documents_json jsonb not null default '[]'::jsonb,
  apply_method_ta text,
  apply_method_en text,
  official_url text not null,
  districts text[] not null default '{}',   -- empty = all
  needs text[] not null default '{}',
  keywords text[] not null default '{}',
  popularity int not null default 5,
  status text not null default 'active' check (status in ('active','closed','changed')),
  last_verified_at date,                    -- NULL = verification pending (shown in the UI)
  fts tsvector generated always as (
    to_tsvector('simple', coalesce(title_ta,'') || ' ' || coalesce(title_en,'') || ' ' || coalesce(benefit_en,'') || ' ' || array_to_string(keywords,' '))
  ) stored
);
create index if not exists schemes_fts_idx on public.schemes using gin (fts);
create index if not exists schemes_category_idx on public.schemes (category);
create index if not exists schemes_status_idx on public.schemes (status);

create table if not exists public.documents (
  id text primary key,
  name_ta text not null,
  name_en text not null,
  issuing_authority text,
  process text,
  cost text,
  duration text,
  official_url text
);

create table if not exists public.help_centres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('csc','esevai','hospital','police','other')),
  district text not null,
  address text,
  lat double precision,
  lng double precision,
  phone text,
  hours text,
  services text[] not null default '{}'
);
create index if not exists help_centres_district_idx on public.help_centres (district, type);

create table if not exists public.faq_cache (
  id uuid primary key default gen_random_uuid(),
  question_hash text not null unique,
  normalized_question text not null,
  answer text not null,
  source_url text,
  hit_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- per-user data ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  district text,
  age int check (age between 1 and 110),
  gender text check (gender in ('female','male','other')),
  occupation text,
  income_range text,
  language text not null default 'ta' check (language in ('ta','en')),
  created_at timestamptz not null default now()
);

create table if not exists public.user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  document_id text not null references public.documents(id),
  status text not null default 'have' check (status in ('have','missing','expiring')),
  expiry_date date,
  notes text,
  unique (user_id, document_id)
);

create table if not exists public.saved_schemes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  scheme_id text not null references public.schemes(id),
  match_score int check (match_score between 0 and 100),
  status text not null default 'saved' check (status in ('saved','applied','received')),
  created_at timestamptz not null default now(),
  unique (user_id, scheme_id)
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  due_date date not null,
  channel text not null default 'app' check (channel in ('app','email','whatsapp')),
  status text not null default 'pending' check (status in ('pending','done','dismissed'))
);
create index if not exists reminders_due_idx on public.reminders (user_id, due_date);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  intent text,
  created_at timestamptz not null default now()
);

-- ---------- content operations ----------
create table if not exists public.scheme_updates (          -- change log for every scheme edit
  id uuid primary key default gen_random_uuid(),
  scheme_id text not null references public.schemes(id) on delete cascade,
  change_type text not null,
  old_value jsonb,
  new_value jsonb,
  verified_by text,
  verified_at timestamptz not null default now()
);

create table if not exists public.reports (                 -- "report outdated information" queue (admin verifies before publishing)
  id uuid primary key,
  kind text not null check (kind in ('outdated','contact','waitlist')),
  target text,
  message text not null,
  contact text,
  status text not null default 'new' check (status in ('new','verified','rejected')),
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.schemes enable row level security;
alter table public.documents enable row level security;
alter table public.help_centres enable row level security;
alter table public.faq_cache enable row level security;
alter table public.users enable row level security;
alter table public.user_documents enable row level security;
alter table public.saved_schemes enable row level security;
alter table public.reminders enable row level security;
alter table public.chat_messages enable row level security;
alter table public.scheme_updates enable row level security;
alter table public.reports enable row level security;

-- reference data: anyone may read; nobody writes except the service role (bypasses RLS)
create policy "public read schemes" on public.schemes for select using (true);
create policy "public read documents" on public.documents for select using (true);
create policy "public read help centres" on public.help_centres for select using (true);
create policy "public read scheme updates" on public.scheme_updates for select using (true);

-- users only touch their own rows
create policy "own profile read" on public.users for select using (auth.uid() = id);
create policy "own profile insert" on public.users for insert with check (auth.uid() = id);
create policy "own profile update" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "own profile delete" on public.users for delete using (auth.uid() = id);

create policy "own documents all" on public.user_documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own saved all" on public.saved_schemes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reminders all" on public.reminders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own chat read" on public.chat_messages for select using (auth.uid() = user_id);
create policy "own chat insert" on public.chat_messages for insert with check (auth.uid() = user_id);

-- faq_cache and reports have NO policies: only the server (service-role key) can read or write them.
