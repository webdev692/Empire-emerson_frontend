import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationFile = '20260725230658_add_lead_idempotency_contract.sql';
const migrationUrls = [
  new URL(`../Emerson_Empire/supabase/migrations/${migrationFile}`, import.meta.url),
  new URL(`../Agency_LandingPage/supabase/migrations/${migrationFile}`, import.meta.url),
];
const verificationUrl = new URL('./verify-lead-idempotency.sql', import.meta.url);

test('lead idempotency migration mirrors are byte-identical and forward-only', async () => {
  const [empireSql, agencySql] = await Promise.all(
    migrationUrls.map((url) => readFile(url, 'utf8')),
  );

  assert.equal(agencySql, empireSql);
  assert.match(empireSql, /add column if not exists idempotency_key text/i);
  assert.match(empireSql, /create unique index if not exists idx_leads_idempotency_key/i);
  assert.match(empireSql, /create or replace function public\.store_lead_request/i);
  assert.match(empireSql, /pg_catalog\.pg_advisory_xact_lock/i);
  assert.match(empireSql, /return 'duplicate'/i);
  assert.match(empireSql, /public\.check_lead_rate_limit/i);
  assert.match(empireSql, /return 'rate_limited'/i);
  assert.match(empireSql, /return 'inserted'/i);
  assert.doesNotMatch(empireSql, /\b(?:drop|truncate)\s+(?:table|schema)\b/i);
});

test('lead storage RPC is service-role only', async () => {
  const sql = await readFile(migrationUrls[0], 'utf8');

  assert.match(sql, /security definer\s+set search_path = ''/i);
  assert.match(
    sql,
    /from public, anon, authenticated, authenticator;/i,
  );
  assert.match(sql, /to service_role;/i);
  assert.doesNotMatch(sql, /\busing\s*\(\s*true\s*\)/i);
  assert.doesNotMatch(sql, /\bwith check\s*\(\s*true\s*\)/i);
});

test('lead idempotency verification is metadata-only', async () => {
  const sql = await readFile(verificationUrl, 'utf8');

  assert.match(sql, /pg_catalog\.pg_attribute/i);
  assert.match(sql, /pg_catalog\.pg_constraint/i);
  assert.match(sql, /pg_catalog\.pg_index/i);
  assert.match(sql, /pg_catalog\.pg_proc/i);
  assert.match(sql, /service_role_execute/i);
  assert.doesNotMatch(sql, /\b(?:insert|update|delete|truncate|drop|alter|create)\b/i);
  assert.doesNotMatch(sql, /\bselect\s+.*\bfrom\s+public\.leads\b/is);
});
