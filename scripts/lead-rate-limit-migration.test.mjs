import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const migrationFile =
  '20260712012321_serialize_lead_rate_limit_and_index_cleanup.sql';
const migrationDirectories = [
  new URL('../Emerson_Empire/supabase/migrations/', import.meta.url),
  new URL('../Agency_LandingPage/supabase/migrations/', import.meta.url),
];
const migrationUrls = migrationDirectories.map(
  (directory) => new URL(migrationFile, directory),
);
const verificationUrl = new URL('./verify-lead-rate-limit.sql', import.meta.url);

test('lead rate-limit migration mirrors are byte-identical', async () => {
  const [empireSql, agencySql] = await Promise.all(
    migrationUrls.map((migrationUrl) => readFile(migrationUrl, 'utf8')),
  );

  assert.equal(agencySql, empireSql);

  for (const directory of migrationDirectories) {
    const matchingFiles = (await readdir(directory)).filter((file) =>
      file.endsWith('_serialize_lead_rate_limit_and_index_cleanup.sql'),
    );
    assert.deepEqual(matchingFiles, [migrationFile]);
  }
});

test('lead rate-limit migration preserves the RPC contract and closes the race', async () => {
  const sql = await readFile(migrationUrls[0], 'utf8');

  assert.match(
    sql,
    /create or replace function public\.check_lead_rate_limit\(\s*request_hash text,\s*max_requests integer default 5,\s*window_minutes integer default 15\s*\)/i,
  );
  assert.match(sql, /returns boolean\s+language plpgsql\s+security definer/i);
  assert.match(sql, /set search_path = ''/i);
  assert.match(
    sql,
    /create index if not exists idx_lead_rate_limits_requested_at\s+on private\.lead_rate_limits \(requested_at\)/i,
  );

  const lockPosition = sql.indexOf('pg_catalog.pg_advisory_xact_lock');
  const countPosition = sql.indexOf('select count(*)');
  const insertPosition = sql.indexOf(
    'insert into private.lead_rate_limits (requester_hash)',
  );
  assert.ok(lockPosition >= 0);
  assert.ok(lockPosition < countPosition);
  assert.ok(countPosition < insertPosition);

  assert.match(
    sql,
    /revoke execute on function public\.check_lead_rate_limit\(text, integer, integer\)\s+from public, anon, authenticated, authenticator;/i,
  );
  assert.match(
    sql,
    /grant execute on function public\.check_lead_rate_limit\(text, integer, integer\)\s+to service_role;/i,
  );
  assert.doesNotMatch(sql, /\b(?:drop|truncate)\s+(?:table|schema)\b/i);
  assert.doesNotMatch(sql, /\bcore\./i);
});

test('post-deployment verification is metadata-only and checks the security boundary', async () => {
  const sql = await readFile(verificationUrl, 'utf8');

  assert.match(sql, /pg_catalog\.pg_index/i);
  assert.match(sql, /pg_catalog\.pg_proc/i);
  assert.match(sql, /pg_catalog\.aclexplode/i);
  assert.match(sql, /public_execute_revoked/i);
  assert.match(sql, /service_role_execute/i);
  assert.doesNotMatch(sql, /\b(?:insert|update|delete|truncate|drop|alter|create)\b/i);
  assert.doesNotMatch(sql, /\b(?:public\.leads|private\.lead_rate_limits)\b/i);
});
