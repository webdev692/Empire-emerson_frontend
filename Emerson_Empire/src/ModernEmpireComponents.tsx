import { InquiryPanel } from '../../shared/PublicDesignSystem';
import { ImageCard, ImageCardGrid } from '../../shared/EditorialDesign';
import { mediaAsset } from '../../shared/public-media';

const epdg = 'https://emersonprofessionaldevelopment.netlify.app';
const agency = 'https://emersonagency.netlify.app';

export function Ecosystem() {
  return <div className="tee-ecosystem"><ImageCardGrid>
    <ImageCard asset={mediaAsset('tee-purple-emblem')} title="The Emerson Empire" href="/about" label="Our purpose">
      <p>Community resources, organizational leadership, and clear pathways to education and opportunity.</p>
    </ImageCard>
    <ImageCard asset={mediaAsset('tea-blue-emblem')} title="The Emerson Agency LLC" href={agency} label="Explore the Agency">
      <p>Financial education, tax-preparation inquiries, financial coaching, and practical small-business support.</p>
    </ImageCard>
    <ImageCard asset={mediaAsset('epdg-green-emblem')} title="Emerson Professional Development Group" href={epdg} label="Explore EPDG">
      <p>Research-informed learning, career readiness, structured internships, and portfolio development.</p>
    </ImageCard>
  </ImageCardGrid></div>;
}

export function CommunityAnchor() {
  return <div className="tee-community-anchor">
    <p className="modern-kicker">A local starting point</p>
    <h3>Columbia, South Carolina</h3>
  </div>;
}

export function ContactPanel() {
  return <InquiryPanel>
    <p>Tell us what you are looking for, and we will help identify the appropriate company or public resource.</p>
    <a className="modern-button" href="/contact">Find the right contact <span aria-hidden="true">→</span></a>
  </InquiryPanel>;
}
