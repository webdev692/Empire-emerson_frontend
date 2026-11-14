import assert from 'node:assert/strict';
import test from 'node:test';
globalThis.__EPDG_RELEASE_PORTAL_MODE__ = true;
globalThis.__EPDG_RELEASE_REVIEW_MODE__ = false;
globalThis.__EPDG_RELEASE_PORTAL_ORIGIN__ = 'https://portal.example.invalid';
const {createPortalClient,parseSession,captureInvitation,resolveLoginEmail,API_ORIGIN}=await import('./client.ts');
const {portalRoles,portalNavigation,safeReturnPath}=await import('./releaseAccess.ts');
const {releaseContextAllowed}=await import('./runtimeProfile.ts');
const {createWorkspaceClient,parseWorkspace,parseResource}=await import('./workspaceClient.ts');
const {parseAccountManagement,canAccountAction,deliveryLabel}=await import('../admin-staging/accountManagementData.ts');
const fixture=()=>({success:true,environment:'portal-release-candidate',user:{id:2,name:'Review Participant',email:'participant@portal.invalid',legacy_role:'admin',memberships:[],permissions:['account.self.read','resource.read'],assignments:[{id:'role-2',role_code:'participant',revision:'1:11111111-1111-4111-8111-111111111111:1',scope_type:'self',scope_id:'2',organization_id:1}],privileged_controls_available:false},expires_at:'2030-01-01T00:00:00Z',csrf_token:'c'.repeat(43)});
const management=()=>({environment:'portal-release-candidate',capabilities:['admin.accounts.prepare','admin.accounts.approve','admin.accounts.send'],roles:portalRoles.map(code=>({code,name:code,permissions:['account.self.read'],scope_types:['self','organization']})),organizations:[{id:1,name:'Review organization'}],plans:[],accounts:[],invitations:[],audit:[],release:{enabled:true,delivery_enabled:false}});

test('all eleven canonical roles parse only with explicit assignments and exact release marker',()=>{
  assert.equal(portalRoles.length,11);
  for(const role of portalRoles){const f=fixture();f.user.assignments[0].role_code=role;const parsed=parseSession(f);assert.equal(parsed.user.assignments[0].role_code,role);assert.equal(parsed.user.legacy_role,'');assert.deepEqual(parsed.user.permissions,['account.self.read','resource.read']);}
  for(const change of [f=>delete f.environment,f=>f.environment='synthetic-local',f=>f.user.assignments[0].role_code='admin',f=>f.user.assignments[0].organization_id=null,f=>f.expires_at='2020-01-01',f=>f.user.permissions=['*'],f=>f.user.assignments[0].revision=1,f=>f.user.assignments[0].revision='1:unverified:1']){const f=fixture();change(f);assert.throws(()=>parseSession(f));}
  const f=fixture();f.user.password='private';f.user.assignments[0].token='private';assert.equal(JSON.stringify(parseSession(f)).includes('private'),false);
});
test('release entry is exact HTTPS origin, same-origin API and safe relative return paths',()=>{
  assert.equal(API_ORIGIN,'');const good={mode:'portal-release',production:true,development:false,origin:'https://portal.example.invalid'};
  assert.equal(releaseContextAllowed(good),true);for(const delta of [{origin:'https://portal.example.invalid.evil'},{mode:'production'},{development:true},{production:false}])assert.equal(releaseContextAllowed({...good,...delta}),false);
  assert.equal(safeReturnPath('/admin/accounts'),'/admin/accounts');assert.equal(safeReturnPath('/resources/resource-1'),'/resources/resource-1');
  for(const value of ['//evil.example','https://evil.example','/resources/a?redirect=evil','/admin/roles','/login'])assert.equal(safeReturnPath(value),'/dashboard');
});
test('release login, acceptance and recovery send only account fields over cookies',async()=>{
  const calls=[];const client=createPortalClient(async(url,options)=>{calls.push({url,options});return Response.json(fixture());});
  await client.login('user@example.com','local-test-password');await client.acceptInvitation('i'.repeat(43),'local-test-password');await client.forgot('user@example.com');
  assert.equal(resolveLoginEmail('USER@example.com'),'user@example.com');assert.equal(captureInvitation({pathname:'/accept-invitation',hash:'#token='+'i'.repeat(43)}),'i'.repeat(43));
  assert.deepEqual(JSON.parse(calls[1].options.body),{token:'i'.repeat(43),password:'local-test-password'});
  for(const c of calls){assert.match(c.url,/^\/api\/auth\//);assert.equal(c.options.credentials,'include');assert.equal(c.options.redirect,'error');assert.equal(c.options.cache,'no-store');assert.equal(c.options.headers['X-EPDG-Request'],'portal');assert.equal(c.options.headers.Authorization,undefined);}
});
test('navigation follows server permissions and never a role name or legacy profile',()=>{
  assert.equal(portalNavigation([]).accounts,false);assert.equal(portalNavigation(['admin']).accounts,false);assert.equal(portalNavigation(['admin.accounts.read']).accounts,true);
  assert.equal(portalNavigation(['account.self.read']).profileEdit,false);assert.equal(portalNavigation(['account.self.update']).profileEdit,true);
});
test('management retains safe data only and makes send independent of prepared status',()=>{
  const f=management();f.secret='private';const parsed=parseAccountManagement(f);assert.equal(parsed.roles.length,11);assert.equal('secret' in parsed,false);
  assert.equal(canAccountAction(parsed,['send'],'send'),false);parsed.release.delivery_enabled=true;assert.equal(canAccountAction(parsed,['send'],'send'),true);assert.equal(canAccountAction(parsed,[],'send'),false);
  parsed.capabilities=[];assert.equal(canAccountAction(parsed,['send'],'send'),false);
  assert.match(deliveryLabel('provider_accepted'),/delivery unconfirmed/);assert.doesNotMatch(deliveryLabel('provider_accepted'),/Delivery confirmed/);
  f.invitations=[{id:'invite-1',user_id:2,name:'Review Participant',email:'participant@portal.invalid',status:'accepted',delivery_status:'provider_accepted',expires_at:null,email_confirmed_at:null,accepted_at:null,activated_at:null,last_successful_sign_in:null,allowed_actions:[]}];assert.throws(()=>parseAccountManagement(f));
  f.invitations[0].email_confirmed_at=f.invitations[0].accepted_at=f.invitations[0].activated_at='2026-11-14T00:00:00Z';f.invitations[0].raw_token='secret';assert.equal('raw_token' in parseAccountManagement(f).invitations[0],false);
});
test('workspace binds response identity and selects no arbitrary resource fields',()=>{
  const f={environment:'portal-release-candidate',user:fixture().user,assignments:fixture().user.assignments,permissions:['resource.read'],resources:[{id:'resource-1',title:'Assigned learning',kind:'learning',organization_id:1,group_id:null,subject_user_id:2,can_edit:false,can_review:false,can_publish:false,password:'private'}],organizations:[{id:1,name:'Review organization'}]};
  assert.equal('password' in parseWorkspace(f,2).resources[0],false);assert.throws(()=>parseWorkspace(f,3));
  const d={resource:{id:'resource-1',title:'Assigned learning',kind:'learning',body:'Plain text',status:'draft',revision:'2',can_edit:true,can_review:false,can_publish:false,secret:'private'}};
  assert.equal(parseResource(d,'resource-1').revision,2);assert.throws(()=>parseResource(d,'resource-2'));d.resource.revision='9007199254740993';assert.throws(()=>parseResource(d,'resource-1'));
});
test('workspace mutations use CSRF, minimal payloads, revision checks and allowlisted paths',async()=>{
  const calls=[];const api=createWorkspaceClient(async(url,options)=>{calls.push({url,options});return Response.json({success:true,data:{id:2,name:'Review Participant',email:'participant@portal.invalid'}});});
  await api.profile('New display name','c'.repeat(43));await api.save('resource-1','Reviewed draft',3,'c'.repeat(43));await api.review('resource-1','Review comment','c'.repeat(43));await api.publish('resource-1',3,'c'.repeat(43));
  assert.deepEqual(JSON.parse(calls[0].options.body),{name:'New display name'});assert.deepEqual(JSON.parse(calls[1].options.body),{draft:'Reviewed draft',expected_revision:3});
  assert.equal(calls[0].options.method,'PATCH');assert.equal(calls[2].options.method,'POST');
  for(const call of calls){assert.equal(call.options.credentials,'include');assert.equal(call.options.headers['X-CSRF-Token'],'c'.repeat(43));assert.equal(call.options.headers.Authorization,undefined);}
  await assert.rejects(api.save('../auth/logout','draft',3,'c'.repeat(43)));assert.equal(calls.length,4);
});


test('release learner and mentor parsers accept verified real-format labels but preserve response identity',async()=>{
  const {parseOnboardingSummary}=await import('./onboardingClient.ts');
  const {parseDashboard}=await import('./learningClient.ts');
  const at='2026-11-14T00:00:00.000Z', program='10000000-0000-4000-8000-000000000001';
  const f={success:true,environment:'portal-release-candidate',learner_id:2,generated_at:at,privileged_controls_available:false,onboarding:{status:'ready',program_id:program,program_title:'Reviewed program',updated_at:at}};
  assert.equal(parseOnboardingSummary(f,2).onboarding.program_title,'Reviewed program');assert.throws(()=>parseOnboardingSummary(f,3));
  const d={success:true,environment:'portal-release-candidate',learner_id:2,generated_at:at,summary:{active_programs:0,completed_items:0,total_items:0,progress_percent:0},programs:[],upcoming:[],feedback:[],resources:[]};
  assert.equal(parseDashboard(d,2).learner_id,2);assert.throws(()=>parseDashboard({...d,environment:'synthetic-local'},2));
});
