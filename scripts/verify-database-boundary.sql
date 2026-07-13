-- Metadata-only verification for the EPDG career-data boundary migration.
-- This script reads no application rows and changes no database state.

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  pg_catalog.has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE') as anon_access,
  pg_catalog.has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE') as authenticated_access,
  pg_catalog.has_table_privilege('authenticator', c.oid, 'SELECT,INSERT,UPDATE,DELETE') as authenticator_access,
  pg_catalog.has_table_privilege('service_role', c.oid, 'SELECT,INSERT,UPDATE,DELETE') as service_role_access
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'epdg'
  and c.relname in (
    'career_files',
    'career_experiences',
    'career_projects',
    'career_skills'
  )
order by c.relname;

select
  p.proconfig as function_settings,
  pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
  pg_catalog.has_function_privilege('authenticator', p.oid, 'EXECUTE') as authenticator_execute,
  pg_catalog.has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_execute
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'update_timestamp'
  and pg_catalog.pg_get_function_identity_arguments(p.oid) = '';

select
  n.nspname as schema_name,
  c.relname as index_name,
  i.indisvalid as is_valid,
  i.indisready as is_ready
from pg_catalog.pg_index i
join pg_catalog.pg_class c on c.oid = i.indexrelid
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'epdg'
  and c.relname in (
    'idx_career_experiences_career_file_id',
    'idx_career_skills_endorsed_by'
  )
order by c.relname;

-- Expected result:
--   four rows with RLS true, browser access false, service_role access true;
--   update_timestamp search_path empty with browser execute false and
--   service_role execute true; two valid/ready indexes.
