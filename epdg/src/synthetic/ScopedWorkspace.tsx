import { useEffect, useRef, useState } from 'react';
import { PortalRequestError, type Session } from './client';
import { createWorkspaceClient, type Workspace, type ResourceDetail } from './workspaceClient';
const api = createWorkspaceClient();
export default function ScopedWorkspace({ session, resourceId, onAuthenticationRequired }: {session:Session;resourceId?:string;onAuthenticationRequired:()=>void}) {
  const [data,setData]=useState<Workspace|null>(null); const [detail,setDetail]=useState<ResourceDetail|null>(null);
  const [error,setError]=useState(''); const [notice,setNotice]=useState(''); const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [publishConfirmed,setPublishConfirmed]=useState(false);
  const generation=useRef(0); const mutating=useRef(false);
  useEffect(() => {
    const activeGeneration = generation; const current=++generation.current;
    const load=async()=>{ try { const workspace=await api.workspace(session.user.id); const item=resourceId ? await api.resource(resourceId) : null;
      if(current===generation.current){setData(workspace);setDetail(item);} }
      catch(reason){if(current===generation.current){setData(null);setDetail(null);setError(reason instanceof PortalRequestError?reason.message:'Workspace data could not be verified.');if(reason instanceof PortalRequestError&&reason.status===401)onAuthenticationRequired();}}
      finally {if(current===generation.current)setLoading(false);} };
    void load();return()=>{++activeGeneration.current;};
  },[session.user.id,session.csrf_token,resourceId,onAuthenticationRequired]);
  async function save(form:HTMLFormElement, action: 'draft' | 'review' | 'publish' = 'draft') {
    if(!detail||mutating.current)return;mutating.current=true;setBusy(true);setError('');setNotice('');
    const current=++generation.current;
    try{if(action === 'draft') await api.save(detail.id,String(new FormData(form).get('draft')??''),detail.revision,session.csrf_token); else if(action === 'review') await api.review(detail.id,String(new FormData(form).get('comment')??''),session.csrf_token); else await api.publish(detail.id,detail.revision,session.csrf_token);const next=await api.resource(detail.id);if(current===generation.current){setDetail(next);setNotice(action === 'draft' ? 'Draft saved. Publishing requires separate permission and review.' : action === 'review' ? 'Review recorded.' : 'Resource published by the server.');setPublishConfirmed(false);}}
    catch(reason){if(current===generation.current){setError(reason instanceof PortalRequestError?reason.message:'The draft could not be saved.');if(reason instanceof PortalRequestError&&[401,403].includes(reason.status)){setDetail(null);setData(null);if(reason.status===401)onAuthenticationRequired();}}}
    finally{mutating.current=false;setBusy(false);}
  }
  if(loading)return <section className="sp-panel" role="status">Loading your authorized workspace…</section>;
  return <><section className="sp-panel"><p className="sp-eyebrow">Your authorized workspace</p><h2>{detail?.title??'Resources and responsibilities'}</h2>{error&&<div className="sp-error" role="alert"><p>{error}</p><p>Reloading discards unsaved text. Keep any draft you need before rechecking the saved version.</p><button type="button" onClick={()=>window.location.reload()} disabled={busy}>Reload saved resource</button></div>}{notice&&<p className="sp-message" role="status">{notice}</p>}
    {data&&<><p>Access reflects your approved roles and scopes. Applicants, resumes and onboarding remain in the CRM.</p><ul>{data.assignments.map(a=><li key={`${a.id}:${a.scope_type}:${a.scope_id}`}>{a.role_code.replaceAll('_',' ')} · {a.scope_type}: {a.scope_id}</li>)}</ul>
      {resourceId?detail&&<><p className="sp-note">{detail.kind} · revision {detail.revision}</p><div className="sp-resource-text">{detail.body}</div>{detail.can_edit&&detail.status==='draft'&&<form key={detail.revision} data-assignment-editor onSubmit={e=>{e.preventDefault();void save(e.currentTarget);}}><label htmlFor="resource-draft">Draft</label><textarea id="resource-draft" name="draft" rows={12} maxLength={16384} defaultValue={detail.body} disabled={busy}/><button type="submit" disabled={busy}>{busy?'Saving…':'Save draft'}</button></form>}<div className="sp-resource-actions">{detail.can_review && <form onSubmit={e=>{e.preventDefault();void save(e.currentTarget,'review');}}><label htmlFor="resource-review">Review feedback</label><textarea id="resource-review" name="comment" rows={4} maxLength={4000} required disabled={busy}/><button disabled={busy}>Record review</button></form>}{detail.can_publish && detail.status === 'draft' && <form onSubmit={e=>{e.preventDefault();void save(e.currentTarget,'publish');}}><label><input type="checkbox" checked={publishConfirmed} onChange={e=>setPublishConfirmed(e.target.checked)} disabled={busy}/> I have reviewed this revision for publication.</label><button disabled={busy||!publishConfirmed}>Publish reviewed revision</button></form>}</div><a href="/resources">Back to resources</a></>:data.resources.length?<ul className="sp-resource-list">{data.resources.map(r=><li key={r.id}><a href={`/resources/${r.id}`}>{r.title}</a><small>{r.kind} · {r.can_edit?'Draft editing permitted':'Read access'}</small></li>)}</ul>:<p>No resources are assigned to this account yet. Contact your coordinator if you expected access.</p>}
    </>}
  </section></>;
}
