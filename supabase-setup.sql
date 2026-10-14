-- 305business.llc — database setup for the NEW Supabase project
-- Run once in: Supabase dashboard → SQL Editor → paste → RUN
-- Then the contact form, offer forms, and /admin/ Inbox all go live.

create extension if not exists "uuid-ossp";

-- Contact form submissions (homepage + site-wide)
create table if not exists public.contact_messages (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text,
    subject text,
    message text not null,
    status text default 'new',
    created_at timestamptz default now()
);

-- Acquisition offers + buyer inquiries (venture pages, marketplace)
create table if not exists public.inquiries (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid,
    buyer_name text not null,
    buyer_email text not null,
    buyer_phone text,
    message text,
    subject text,
    status text default 'new',
    created_at timestamptz default now()
);

-- Audit trail
create table if not exists public.activity_log (
    id uuid primary key default uuid_generate_v4(),
    action text not null,
    entity_type text,
    entity_id text,
    details jsonb,
    created_at timestamptz default now()
);

-- Public access: forms INSERT, admin panel SELECT.
-- NOTE: anon SELECT means anyone with the project URL+key could read the
-- inbox. Acceptable for launch (the /admin/ gate keeps it unlisted);
-- upgrade path = Supabase Auth email login later.
alter table public.contact_messages enable row level security;
alter table public.inquiries enable row level security;
alter table public.activity_log enable row level security;

create policy "public insert contact" on public.contact_messages
    for insert to anon with check (true);
create policy "public read contact" on public.contact_messages
    for select to anon using (true);
create policy "public insert inquiries" on public.inquiries
    for insert to anon with check (true);
create policy "public read inquiries" on public.inquiries
    for select to anon using (true);
create policy "public read activity" on public.activity_log
    for select to anon using (true);
create policy "public insert activity" on public.activity_log
    for insert to anon with check (true);

-- Done. The site needs the new Project URL + anon key dropped into
-- supabase-client.js (top of file) — ask Kimi Claw to do that part.
