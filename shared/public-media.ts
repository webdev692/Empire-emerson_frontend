import manifest from './public-media.json';

export type MediaEntity = 'TEE' | 'TEA' | 'EPDG';
export type PublicMediaFile = { src: string; width: number; height: number; format: 'webp' | 'avif' | 'jpeg'; bytes: number; sha256: string };
export type PublicMediaAsset = { id: string; title: string; alt: string; caption: string; kind: 'brand' | 'editorial' | 'portrait'; width: number; height: number; files: PublicMediaFile[] };
export type PublicMediaPlacement = { entity: MediaEntity; path: string; assetId: string; role: 'brand' | 'editorial' | 'portrait'; subject?: string };
export const publicMedia = manifest as { revision: string; assets: PublicMediaAsset[]; placements: PublicMediaPlacement[] };
export function mediaForPage(entity: MediaEntity, path: string) {
  return publicMedia.placements.filter(item => item.entity === entity && item.path === path && item.role === 'editorial').map(item => publicMedia.assets.find(asset => asset.id === item.assetId)!).filter(Boolean);
}
export function brandMedia(entity: MediaEntity) {
  const placement = publicMedia.placements.find(item => item.entity === entity && item.role === 'brand');
  return placement ? publicMedia.assets.find(asset => asset.id === placement.assetId) : undefined;
}
export function portraitMedia(entity: MediaEntity, subject: string) {
  const placement = publicMedia.placements.find(item => item.entity === entity && item.role === 'portrait' && item.subject === subject);
  return placement ? publicMedia.assets.find(asset => asset.id === placement.assetId && asset.kind === 'portrait') : undefined;
}
