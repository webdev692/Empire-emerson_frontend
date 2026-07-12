-- Forward-only remediation for the lead-intake rate limiter.
--
-- The transaction-scoped advisory lock serializes the count-and-insert
-- decision for a single requester without changing the RPC signature or
-- boolean response. The timestamp index supports the existing retention
-- cleanup predicate independently of the requester-leading lookup index.

create index if not exists idx_lead_rate_limits_requested_at
  on private.lead_rate_limits (requested_at);

create or replace function public.check_lead_rate_limit(
  request_hash text,
  max_requests integer default 5,
  window_minutes integer default 15
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_count integer;
begin
  if request_hash is null or length(request_hash) < 16 then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('lead_rate_limit:' || request_hash, 0)
  );

  delete from private.lead_rate_limits
  where requested_at < now() - interval '24 hours';

  select count(*)
    into recent_count
  from private.lead_rate_limits
  where requester_hash = request_hash
    and requested_at >= now() - make_interval(mins => greatest(window_minutes, 1));

  if recent_count >= greatest(max_requests, 1) then
    return false;
  end if;

  insert into private.lead_rate_limits (requester_hash)
  values (request_hash);

  return true;
end;
$$;

revoke execute on function public.check_lead_rate_limit(text, integer, integer)
  from public, anon, authenticated, authenticator;
grant execute on function public.check_lead_rate_limit(text, integer, integer)
  to service_role;

-- Non-destructive compensating plan: if the lock behavior causes an
-- unexpected regression, ship a new forward migration that restores the
-- prior function body. Leave the cleanup index in place; it is additive and
-- removing it would not recover data or restore application behavior.
