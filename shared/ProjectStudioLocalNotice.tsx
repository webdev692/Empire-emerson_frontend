export default function ProjectStudioLocalNotice({ entity }: { entity: 'TEE' | 'TEA' }) {
  return <aside className="ps-review" aria-label="Project Studio design review"><strong>Local design review · {entity}</strong><span>Two package examples · Registration and live intake disabled · No request is submitted</span></aside>;
}
