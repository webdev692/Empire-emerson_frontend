export const readable = (value: string) => value === 'PUBLIC_RELEASE_APPROVED' ? 'Published information' : value.replaceAll('_', ' ').toLowerCase();
export const displayDate = (value: string | null) => value ? value.slice(0, 10) : 'Not yet verified';
export const localHref = (path: string, base = import.meta.env.BASE_URL, fixtures = !!(import.meta.env?.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('__fixtures'))) => {
  const url = `${base.replace(/\/$/, '')}${path}`;
  if (!fixtures) return url;
  const [route, hash] = url.split('#');
  return `${route}${route.includes('?') ? '&' : '?'}__fixtures=1${hash ? `#${hash}` : ''}`;
};
export const contractHref = (url: string, base = import.meta.env.BASE_URL) => url.startsWith('/') && !url.startsWith('//') ? localHref(url, base) : url;
