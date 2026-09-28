-- Orange Tickets
-- Migration 003: Initial Row Level Security policies

-- =========================================================
-- PROFILES
-- =========================================================

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

-- =========================================================
-- ORGANIZATIONS
-- =========================================================

create policy "Organization members can view their organization"
on public.organizations
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = organizations.id
      and om.user_id = auth.uid()
  )
);

-- =========================================================
-- ORGANIZATION MEMBERS
-- =========================================================

create policy "Members can view organization membership"
on public.organization_members
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.organization_members om
    where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
  )
);

-- =========================================================
-- EVENTS
-- =========================================================

create policy "Anyone can view published events"
on public.events
for select
to anon, authenticated
using (
  status = 'published'
);

create policy "Organization members can view their events"
on public.events
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = events.organization_id
      and om.user_id = auth.uid()
  )
);

create policy "Organization owners and managers can create events"
on public.events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = events.organization_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
);

create policy "Organization owners and managers can update events"
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = events.organization_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = events.organization_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
);

-- =========================================================
-- TICKET TYPES
-- =========================================================

create policy "Anyone can view ticket types for published events"
on public.event_ticket_types
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_ticket_types.event_id
      and e.status = 'published'
  )
);

create policy "Organization members can view their ticket types"
on public.event_ticket_types
for select
to authenticated
using (
  exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = event_ticket_types.event_id
      and om.user_id = auth.uid()
  )
);

create policy "Organization owners and managers can create ticket types"
on public.event_ticket_types
for insert
to authenticated
with check (
  exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = event_ticket_types.event_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
);

create policy "Organization owners and managers can update ticket types"
on public.event_ticket_types
for update
to authenticated
using (
  exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = event_ticket_types.event_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = event_ticket_types.event_id
      and om.user_id = auth.uid()
      and om.member_role in ('owner', 'manager')
  )
);