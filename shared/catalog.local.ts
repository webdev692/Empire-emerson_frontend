/** Deliberately unavailable private-authoring interface, never production data. */
import type { Catalog } from './content';
function unavailable(): never {
  throw new Error('Private catalog authoring is unavailable. Use the validated public build and preview.');
}
export const homePages: { entity: string; headline: string; intro: string }[] = [];
export const classTopics: string[] = [];
export const worksheetText = '';
export const fixtureCatalog: Catalog = unavailable();
export default fixtureCatalog;
