-- Forward-only, deny-by-default hardening for the EPDG career-data boundary.
-- No end-user policy is added because the application JWT/ownership mapping is
-- not yet proven. The backend continues to use the service role.

alter table if exists epdg.career_files enable row level security;
alter table if exists epdg.career_experiences enable row level security;
alter table if exists epdg.career_projects enable row level security;
alter table if exists epdg.career_skills enable row level security;

revoke all on table epdg.career_files
  from public, anon, authenticated, authenticator;
revoke all on table epdg.career_experiences
  from public, anon, authenticated, authenticator;
revoke all on table epdg.career_projects
  from public, anon, authenticated, authenticator;
revoke all on table epdg.career_skills
  from public, anon, authenticated, authenticator;

grant select, insert, update, delete on table epdg.career_files
  to service_role;
grant select, insert, update, delete on table epdg.career_experiences
  to service_role;
grant select, insert, update, delete on table epdg.career_projects
  to service_role;
grant select, insert, update, delete on table epdg.career_skills
  to service_role;

alter function public.update_timestamp() set search_path = '';
revoke execute on function public.update_timestamp()
  from public, anon, authenticated, authenticator;
grant execute on function public.update_timestamp()
  to service_role;

create index if not exists idx_career_experiences_career_file_id
  on epdg.career_experiences (career_file_id);
create index if not exists idx_career_skills_endorsed_by
  on epdg.career_skills (endorsed_by);

-- Compensating plan: if a verified backend path loses access, ship a new
-- forward migration that grants only the missing operation to service_role.
-- Do not disable RLS or restore browser-role grants.
