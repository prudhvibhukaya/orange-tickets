-- Orange Tickets
-- Migration 001: Initial schema

create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'customer'
    check (role in ('customer', 'organizer', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ORGANIZATIONS
-- =========================================================

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ORGANIZATION MEMBERS
-- =========================================================

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations(id) on delete cascade,
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  member_role text not null default 'member'
    check (member_role in ('owner', 'manager', 'member')),
  created_at timestamptz not null default now(),

  unique (organization_id, user_id)
);

-- =========================================================
-- EVENTS
-- =========================================================

create table public.events (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid not null
    references public.organizations(id) on delete cascade,

  title text not null,
  slug text not null unique,
  description text,

  venue_name text,
  venue_address text,

  start_datetime timestamptz not null,
  end_datetime timestamptz,

  timezone text not null default 'Europe/Berlin',

  status text not null default 'draft'
    check (status in ('draft', 'published', 'cancelled', 'completed')),

  cover_image_url text,

  capacity integer
    check (capacity is null or capacity > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- EVENT TICKET TYPES
-- =========================================================

create table public.event_ticket_types (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null
    references public.events(id) on delete cascade,

  name text not null,
  description text,

  price_cents integer not null
    check (price_cents >= 0),

  currency text not null default 'eur'
    check (char_length(currency) = 3),

  capacity integer
    check (capacity is null or capacity > 0),

  sales_start timestamptz,
  sales_end timestamptz,

  max_per_order integer not null default 10
    check (max_per_order > 0),

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index idx_organization_members_user_id
  on public.organization_members(user_id);

create index idx_events_organization_id
  on public.events(organization_id);

create index idx_events_status
  on public.events(status);

create index idx_events_start_datetime
  on public.events(start_datetime);

create index idx_ticket_types_event_id
  on public.event_ticket_types(event_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.events enable row level security;
alter table public.event_ticket_types enable row level security;