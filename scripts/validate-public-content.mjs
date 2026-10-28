import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectCatalog, validateCatalog } from '../shared/content.ts';

export function validatePublicContent(raw) {
  const input = validateCatalog(raw);
  const selected = selectCatalog(input, 'production');
  for (const key of Object.keys(input)) {
    if (input[key].length !== selected[key].length) throw new Error('Public content contains a record that is not eligible for release. Build stopped before bundling.');
  }
  return selected;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '../shared/catalog.public.json');
  const catalog = validatePublicContent(JSON.parse(readFileSync(target, 'utf8')));
  console.log(`Public content gate passed: ${Object.values(catalog).reduce((sum, rows) => sum + rows.length, 0)} approved records.`);
}
