-- Metadata-only verification for the lead retry contract.
-- This script reads no lead or rate-limit rows and changes no database state.

select
  a.attname as column_name,
  not a.attnotnull as is_nullable,
  con.convalidated as format_constraint_validated
from pg_catalog.pg_attribute a
left join pg_catalog.pg_constraint con
  on con.conrelid = a.attrelid
 and con.conname = 'leads_idempotency_key_format'
where a.attrelid = 'public.leads'::pg_catalog.regclass
  and a.attname = 'idempotency_key'
  and not a.attisdropped;

select
  c.relname as index_name,
  i.indisunique as is_unique,
  i.indisvalid as is_valid,
  i.indisready as is_ready
from pg_catalog.pg_index i
join pg_catalog.pg_class c on c.oid = i.indexrelid
where i.indrelid = 'public.leads'::pg_catalog.regclass
  and c.relname = 'idx_leads_idempotency_key';

with target as (
  select p.*
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'store_lead_request'
)
select
  p.prosecdef as is_security_definer,
  p.proconfig as function_settings,
  pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
  pg_catalog.has_function_privilege('authenticator', p.oid, 'EXECUTE') as authenticator_execute,
  pg_catalog.has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_execute
from target p;

-- Expected result:
--   nullable idempotency_key with a validated format constraint;
--   one unique, valid, ready partial index;
--   security definer with empty search_path;
--   browser-role execute false and service_role execute true.
