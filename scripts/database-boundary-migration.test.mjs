import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const migrationFile = '20260712090000_harden_career_data_boundary.sql';
const migrationDirectories = [
  new URL('../Emerson_Empire/supabase/migrations/', import.meta.url),
  new URL('../Agency_LandingPage/supabase/migrations/', import.meta.url),
];
const migrationUrls = migrationDirectories.map(
  (directory) => new URL(migrationFile, directory),
);

test('career-data boundary migrations are byte-identical', async () => {
  const [empireSql, agencySql] = await Promise.all(
    migrationUrls.map((migrationUrl) => readFile(migrationUrl, 'utf8')),
  );

  assert.equal(agencySql, empireSql);
  for (const directory of migrationDirectories) {
    const matchingFiles = (await readdir(directory)).filter((file) =>
      file.endsWith('_harden_career_data_boundary.sql'),
    );
    assert.deepEqual(matchingFiles, [migrationFile]);
  }
});

test('career-data hardening is deny-by-default and non-destructive', async () => {
  const sql = await readFile(migrationUrls[0], 'utf8');
  const tables = [
    'career_files',
    'career_experiences',
    'career_projects',
    'career_skills',
  ];

  for (const table of tables) {
    assert.match(
      sql,
      new RegExp(`alter table if exists epdg\\.${table} enable row level security`, 'i'),
    );
    assert.match(
      sql,
      new RegExp(
        `revoke all on table epdg\\.${table}\\s+from public, anon, authenticated, authenticator`,
        'i',
      ),
    );
  }

  assert.match(sql, /alter function public\.update_timestamp\(\) set search_path = ''/i);
  assert.match(
    sql,
    /revoke execute on function public\.update_timestamp\(\)\s+from public, anon, authenticated, authenticator/i,
  );
  assert.match(sql, /idx_career_experiences_career_file_id/i);
  assert.match(sql, /idx_career_skills_endorsed_by/i);
  assert.doesNotMatch(sql, /create\s+policy/i);
  assert.doesNotMatch(sql, /\b(?:drop|truncate)\s+(?:table|schema)\b/i);
  assert.doesNotMatch(sql, /\b(?:insert|update|delete)\s+(?:into|from|epdg\.)/i);
});

test('tracked migration identity matches the live migration ledger', async () => {
  for (const directory of migrationDirectories) {
    const files = await readdir(directory);
    assert.ok(
      files.includes('20260711212426_reconcile_leads_and_rate_limits.sql'),
    );
    assert.ok(
      !files.includes('20260711000000_reconcile_leads_and_rate_limits.sql'),
    );
  }
});
