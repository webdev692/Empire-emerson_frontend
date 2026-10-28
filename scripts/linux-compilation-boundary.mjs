/** Compiler-platform evidence for existing content; never a publication approval. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { lfSha256, publicBoundarySha256, readPublicBoundary } from './public-source-boundary.mjs';

export const linuxCompilationSha256 = 'a7fa22b9bdda39280cb0026d50635b893fc759d5f3dd742c9879ce0d22d12e15';

export function readLinuxCompilationBoundary(root, read = readFileSync) {
  const text = read(resolve(root, 'shared/linux-compilation-boundary.json'));
  assert.equal(lfSha256(text), linuxCompilationSha256, 'Frozen Linux compiler evidence changed; separate compilation review is required.');
  const boundary = JSON.parse(text);
  assert.equal(boundary.schema_version, 1);
  assert.equal(boundary.kind, 'linux-compilation-evidence');
  assert.equal(boundary.public_boundary_sha256, publicBoundarySha256);
  assert.equal(boundary.platform.os, 'linux');
  assert.equal(boundary.platform.arch, 'x64');
  assert.equal(boundary.platform.runner, 'ubuntu-24.04');
  assert.equal(boundary.toolchain.node, '22.23.1');
  assert.equal(boundary.toolchain.npm, '11.17.0');
  const original = readPublicBoundary(root, read);
  assert.deepEqual(Object.keys(boundary.compiled), Object.keys(original.published));
  for (const [entity, site] of Object.entries(boundary.compiled)) {
    for (const key of ['app', 'origin', 'site_id', 'content_revision']) assert.equal(site[key], original.published[entity][key]);
    assert.equal(site.files.length, original.published[entity].files.length);
  }
  for (const [path, digest] of Object.entries(boundary.toolchain.lockfile_sha256_lf)) assert.equal(lfSha256(read(resolve(root, path))), digest, `Linux compiler lockfile changed: ${path}`);
  return boundary;
}
