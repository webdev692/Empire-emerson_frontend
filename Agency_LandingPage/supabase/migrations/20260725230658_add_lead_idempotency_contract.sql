-- Forward-only lead retry contract.
-- Remote history identity: 20260725230658.
--
-- A request key is an irreversible server-side digest. The storage function
-- serializes identical requests, returns an existing-success state before
-- consuming another rate-limit slot, and inserts the key and lead in the same
-- database transaction.

alter table public.leads
  add column if not exists idempotency_key text;

do $migration$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'leads_idempotency_key_format'
      and conrelid = 'public.leads'::pg_catalog.regclass
  ) then
    alter table public.leads
      add constraint leads_idempotency_key_format
      check (
        idempotency_key is null
        or idempotency_key ~ '^[0-9a-f]{64}$'
      ) not valid;
  end if;
end
$migration$;

alter table public.leads
  validate constraint leads_idempotency_key_format;

create unique index if not exists idx_leads_idempotency_key
  on public.leads (idempotency_key)
  where idempotency_key is not null;

create or replace function public.store_lead_request(
  p_request_hash text,
  p_request_key text,
  p_first_name text default null,
  p_last_name text default null,
  p_full_name text default null,
  p_email text default null,
  p_phone text default null,
  p_message text default null,
  p_service_interest text default null,
  p_urgency text default null,
  p_intent_description text default null,
  p_track_interest text default null,
  p_division text default null,
  p_division_label text default null,
  p_max_requests integer default 5,
  p_window_minutes integer default 15
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_request_hash is null
    or length(p_request_hash) < 16
    or p_request_key is null
    or p_request_key !~ '^[0-9a-f]{64}$'
    or p_email is null
    or length(p_email) > 254 then
    return 'rejected';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('lead_request:' || p_request_key, 0)
  );

  if exists (
    select 1
    from public.leads
    where idempotency_key = p_request_key
  ) then
    return 'duplicate';
  end if;

  if not public.check_lead_rate_limit(
    p_request_hash,
    greatest(p_max_requests, 1),
    greatest(p_window_minutes, 1)
  ) then
    return 'rate_limited';
  end if;

  insert into public.leads (
    first_name,
    last_name,
    full_name,
    email,
    phone,
    message,
    service_interest,
    urgency,
    intent_description,
    track_interest,
    division,
    division_label,
    idempotency_key
  )
  values (
    p_first_name,
    p_last_name,
    p_full_name,
    p_email,
    p_phone,
    p_message,
    p_service_interest,
    p_urgency,
    p_intent_description,
    p_track_interest,
    p_division,
    p_division_label,
    p_request_key
  );

  return 'inserted';
end;
$$;

revoke execute on function public.store_lead_request(
  text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, integer, integer
) from public, anon, authenticated, authenticator;

grant execute on function public.store_lead_request(
  text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, integer, integer
) to service_role;

-- Compensating plan: if the new RPC regresses, deploy a new function version
-- that temporarily calls the prior service-only rate limiter and direct insert
-- while a forward migration repairs this function. Keep the nullable column
-- and unique index; they do not alter or remove existing lead records.
