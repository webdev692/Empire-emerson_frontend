-- Metadata-only verification for the prepared lead rate-limit hardening.
-- Run only after an approved deployment. This script does not read lead or
-- rate-limit rows and does not change database state.

select
  n.nspname as schema_name,
  c.relname as index_name,
  i.indisvalid as is_valid,
  i.indisready as is_ready,
  pg_catalog.pg_get_indexdef(i.indexrelid) as index_definition
from pg_catalog.pg_index i
join pg_catalog.pg_class c on c.oid = i.indexrelid
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'private'
  and c.relname = 'idx_lead_rate_limits_requested_at';

with target as (
  select p.*
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'check_lead_rate_limit'
    and pg_catalog.pg_get_function_identity_arguments(p.oid) = 'request_hash text, max_requests integer, window_minutes integer'
)
select
  p.prosecdef as is_security_definer,
  p.proconfig as function_settings,
  p.pronargdefaults as default_argument_count,
  pg_catalog.strpos(
    pg_catalog.pg_get_functiondef(p.oid),
    'pg_advisory_xact_lock'
  ) > 0 as has_transaction_lock,
  not exists (
    select 1
    from pg_catalog.aclexplode(
      coalesce(p.proacl, pg_catalog.acldefault('f', p.proowner))
    ) acl
    where acl.grantee = 0
      and acl.privilege_type = 'EXECUTE'
  ) as public_execute_revoked,
  pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
  pg_catalog.has_function_privilege('authenticator', p.oid, 'EXECUTE') as authenticator_execute,
  pg_catalog.has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_execute
from target p;

-- Expected result after deployment:
--   one valid/ready requested_at index;
--   security definer = true;
--   function_settings contains an empty search_path;
--   two default arguments and transaction lock = true;
--   PUBLIC/anon/authenticated/authenticator execute = false;
--   service_role execute = true.
