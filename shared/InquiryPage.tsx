import { useState } from 'react';
import { createInquiryController } from './inquiry';
import type { InquiryState, InquiryTopic } from './inquiry';
import { Empty } from './PlatformUI';
import { localHref as href } from './platform-format';

function createLocalTestSink() {
  let outcome = 'fail';
  return { setOutcome: (value: string) => { outcome = value; }, controller: createInquiryController(async (_payload, key) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    if (outcome === 'fail') throw new Error('Controlled local sink failure');
    return { receipt: `local-test-${key}` };
  }) };
}
function LocalSinkForm() {
  const [sink] = useState(createLocalTestSink);
  const controller = sink.controller;
  const [status, setStatus] = useState<InquiryState>(controller.getState());
  const [email, setEmail] = useState('demo@example.invalid');
  const [topic, setTopic] = useState<InquiryTopic>(new URLSearchParams(window.location.search).get('topic') === 'SPEAKING' ? 'SPEAKING' : 'CORRECTION');
  const resourceId = new URLSearchParams(window.location.search).get('resource');
  return <section className="cp-callout"><h2>Local inquiry test sink</h2><p>This test keeps fictional values in memory. No network request, email or live submission occurs. Use the failure and delivery controls to review recovery.</p>
    <form onSubmit={async event => { event.preventDefault(); const pending = controller.submit({ reply_email: email, topic, resource_id: resourceId }); setStatus(controller.getState()); setStatus(await pending); }} noValidate>
      <label>Fictional reply email<input name="reply_email" type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} autoComplete="off" /></label>
      <label>Inquiry topic<select value={topic} onChange={e => setTopic(e.target.value as InquiryTopic)}><option value="CORRECTION">Resource correction</option><option value="PROGRAM">Program information</option><option value="SPEAKING">Speaking inquiry</option></select></label>
      <label>Local sink outcome<select defaultValue="fail" onChange={e => sink.setOutcome(e.target.value)}><option value="fail">Controlled failure</option><option value="deliver">Deliver to local sink</option></select></label>
      <button disabled={status.status === 'PENDING'} type="submit">{status.status === 'PENDING' ? 'Pending…' : 'Run local inquiry test'}</button>
    </form>
    <div role="status" aria-live="polite" className="cp-callout"><strong>{status.status === 'DELIVERED' ? 'Delivered to local test sink only' : status.status}</strong><p>{status.status === 'DELIVERED' ? 'The fictional request reached the in-memory test sink. No person or live system received it.' : status.message}</p>{'receipt' in status && status.receipt && <p className="cp-small">Test receipt: {status.receipt}</p>}</div>
  </section>;
}
export default function InquiryPage() {
  const [test, setTest] = useState(false);
  return <><div className="cp-page-title"><p className="cp-eyebrow">Corrections · program information · speaking</p><h1>Inquiry availability</h1><p>Share only the minimum needed to route a request. This interface does not accept personal documents, financial details or sensitive narratives.</p></div><Empty title="The delivery route is awaiting verification.">No message has been submitted. A verified support destination must be connected before live inquiries can be accepted.</Empty>
    <section className="cp-callout"><h2>Service questions by email</h2><p>The services catalog can open an editable email draft to the existing published business contact, with a company and offering selected. You review and send it in your email app. The website does not send messages or collect documents.</p><a href={href('/services-pricing')}>Choose a service & review inquiry options</a></section>
    {import.meta.env.DEV && <><button onClick={() => setTest(!test)}>{test ? 'Close local test sink' : 'Open local test sink'}</button>{test && <LocalSinkForm />}</>}
  </>;
}
