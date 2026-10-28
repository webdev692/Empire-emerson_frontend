export function Badge({ children }: { children: React.ReactNode }) { return <span className="cp-badge">{children}</span>; }
export function Empty({ title = 'No reviewed records are available yet.', children }: { title?: string; children?: React.ReactNode }) {
  return <div className="cp-empty"><h2>{title}</h2><p>{children || 'This collection is waiting for content review. Check the coverage and source status before making plans.'}</p></div>;
}
export function Facts({ fields }: { fields: Record<string, React.ReactNode> }) {
  return <dl>{Object.entries(fields).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;
}
