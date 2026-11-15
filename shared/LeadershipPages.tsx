import type { PublicEntity, PublicPage } from './PublicDesignSystem';
import { leadershipCompanyIntroduction, leadershipProfiles } from './LeadershipData';
import { LeadershipDetail, LeadershipDirectory } from './LeadershipComponents';
import type { LeadershipPageOptions } from './LeadershipComponents';

export function createLeadershipPages(entity: PublicEntity, options: LeadershipPageOptions = {}): PublicPage[] {
  return [
    { path: '/leadership', title: 'Company Leadership', description: leadershipCompanyIntroduction[entity].description, content: <LeadershipDirectory entity={entity} options={options} /> },
    ...leadershipProfiles.map(profile => ({ path: `/leadership/${profile.slug}`, title: `${profile.name} — ${profile.title}`, description: `${profile.name}, ${profile.title}. ${profile.secondaryTitle ? profile.secondaryTitle + '. ' : ''}${profile.summary[entity]}`, content: <LeadershipDetail entity={entity} profile={profile} options={options} /> })),
  ];
}
