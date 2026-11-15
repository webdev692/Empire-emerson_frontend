import type { PublicMediaAsset } from './public-media';

export function PublicMediaImage({ asset, className, priority = false, decorative = false, sizes = '(max-width: 640px) calc(100vw - 40px), (max-width: 1120px) 44vw, 540px' }: { asset: PublicMediaAsset; className?: string; priority?: boolean; decorative?: boolean; sizes?: string }) {
  const fallback = asset.files.find(file => file.format === 'jpeg' && file.width >= 900) || asset.files.find(file => file.format === 'jpeg') || asset.files[0];
  const sources = (format: string) => asset.files.filter(file => file.format === format).map(file => `${file.src} ${file.width}w`).join(', ');
  return <picture className={className} data-media-id={asset.id}>
    {sources('avif') && <source type="image/avif" srcSet={sources('avif')} sizes={sizes} />}
    {sources('webp') && <source type="image/webp" srcSet={sources('webp')} sizes={sizes} />}
    <img src={fallback.src} alt={decorative ? '' : asset.alt} width={asset.width} height={asset.height} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'} />
  </picture>;
}
