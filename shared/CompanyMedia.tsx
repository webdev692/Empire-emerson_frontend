import { Section } from './PublicDesignSystem';
import type { PublicEntity } from './PublicDesignSystem';
import { mediaForPage } from './public-media';
import { PublicMediaImage } from './PublicMediaImage';
import './company-media.css';

export function CompanyMedia({ entity, path }: { entity: PublicEntity; path: string }) {
  const assets = mediaForPage(entity, path);
  if (!assets.length) return null;
  return <>{assets.map(asset => <Section key={asset.id}><figure className="company-media-feature">
    <PublicMediaImage asset={asset} className="company-media-picture" />
    <figcaption><p className="modern-kicker">Ideas in practice</p><h2>{asset.title}</h2><p>{asset.caption}</p><p className="company-media-note">Editorial illustration</p></figcaption>
  </figure></Section>)}</>;
}
