import assert from 'node:assert/strict';
import { attributes } from './verify-modern-public.mjs';

export function renderedMediaLayouts(html) {
  const stack = [], pictures = [], voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  for (const [, closing, name, rest] of markup.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
    const tag = name.toLowerCase();
    if (closing) { const index = stack.findLastIndex(node => node.tag === tag); if (index >= 0) stack.splice(index); continue; }
    const props = attributes(rest);
    if (tag === 'picture') {
      const styles = stack.map(node => node.props['data-editorial-kind']).filter(Boolean);
      pictures.push({ assetId: props['data-media-id'], presentation: styles.includes('research') ? 'research' : styles.at(-1) });
    }
    if (!voids.has(tag) && !rest.endsWith('/')) stack.push({ tag, props });
  }
  return pictures;
}

/** Audit rendered output, including pages not explicitly listed in the media manifest. */
export function inspectEditorialDocument(html, { entity, path, media }) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  assert.ok(main, `${entity} ${path}: main content required`);
  const pictures = [...main.matchAll(/<picture\b([^>]*)>([\s\S]*?)<\/picture>/gi)].map(match => ({ id: attributes(match[1])['data-media-id'], body: match[2] }));
  const counts = new Map();
  for (const picture of pictures) {
    const asset = media.assets.find(item => item.id === picture.id);
    assert.ok(asset, `${entity} ${path}: unreviewed or unidentified picture`);
    assert.ok(!(asset.kind === 'portrait' && (media.retainedAssets || []).some(item => item.assetId === asset.id)), `${entity} ${path}: retained portrait has no approved placement`);
    const images = [...picture.body.matchAll(/<img\b([^>]*)>/gi)];
    assert.equal(images.length, 1, 'One image belongs to each reviewed picture');
    for (const [, text] of picture.body.matchAll(/<(?:img|source)\b([^>]*)>/gi)) {
      const props = attributes(text);
      const sources = [...(props.src ? [props.src] : []), ...(props.srcset || '').split(',').filter(Boolean).map(value => value.trim().split(/\s+/)[0])];
      for (const src of sources) assert.ok(asset.files.some(file => file.src === src), `${entity} ${path}: responsive image differs from its reviewed asset`);
    }
    counts.set(asset.id, (counts.get(asset.id) || 0) + 1);
    if (asset.kind === 'editorial') assert.equal(counts.get(asset.id), 1, `${entity} ${path}: repeated editorial artwork`);
  }
  const founderPortraits = pictures.filter(picture => /^lyric-helena-emerson-(executive|plum)$/.test(picture.id));
  assert.ok(founderPortraits.length <= 1, `${entity} ${path}: repeated founder portrait`);
  const banners = [...main.matchAll(/<section\b([^>]*data-editorial-kind="banner"[^>]*)>([\s\S]*?)<\/section>/gi)];
  if (path === '/') assert.equal(banners.length, 1, `${entity}: company homepage requires one editorial banner`);
  for (const [, , banner] of banners) {
    assert.equal((banner.match(/<h1\b/g) || []).length, 1, 'Banner headline must remain accessible HTML');
    const image = attributes(banner.match(/<img\b([^>]*)>/i)?.[1] || '');
    const asset = media.assets.find(item => item.files.some(file => file.src === image.src));
    assert.equal(asset?.kind, 'editorial', 'Company banner cannot substitute a portrait or unreviewed art');
    assert.equal(image.loading, 'eager');
    assert.equal(image.fetchpriority, 'high');
  }
  return { founderPortraits: founderPortraits.length, editorialPictures: pictures.filter(p=>media.assets.find(a=>a.id===p.id)?.kind==='editorial').length, banners: banners.length, styles: [...new Set([...main.matchAll(/data-editorial-kind="(\w+)"/g)].map(match=>match[1]))] };
}
