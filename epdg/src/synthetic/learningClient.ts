import { HOSTED_PRACTICE, PRACTICE_ENVIRONMENT, type PracticeEnvironment } from './runtimeProfile.ts';
import { API_ORIGIN, PortalRequestError } from './client.ts';

export interface Program {
  id: string; enrollment_id: string; title: string; summary: string; status: 'active' | 'completed';
  starts_at: string; ends_at: string; completed_items: number; total_items: number;
  progress_percent: number; next_item_id: string | null;
}
export interface LearningItem {
  id: string; title: string; kind: 'lesson' | 'assignment'; description: string; content: string;
  due_at: string | null; status: 'not_started' | 'completed' | 'draft' | 'submitted'; completed_at: string | null;
}
export interface LearningDashboard {
  success: true; environment: PracticeEnvironment; learner_id: number; generated_at: string;
  summary: { active_programs: number; completed_items: number; total_items: number; progress_percent: number };
  programs: Program[];
  upcoming: { id: string; program_id: string; program_title: string; title: string; kind: 'lesson' | 'assignment'; due_at: string | null; status: 'not_started' | 'draft' }[];
  feedback: { id: string; program_id: string; program_title: string; title: string; comment: string; created_at: string; mentor_label: string }[];
  resources: { id: string; program_id: string; title: string; description: string; body: string }[];
}
export interface ProgramDetail {
  success: true; environment: PracticeEnvironment; learner_id: number;
  program: Program & { items: LearningItem[] };
}
export interface CompletionResult { success: true; item_id: string; completed_at: string; already_completed: boolean }
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const uuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const text = (v: unknown, max = 200): v is string => typeof v === 'string' && v.length > 0 && v.length <= max;
const date = (v: unknown): v is string => typeof v === 'string' && v.length <= 40 && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
const count = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) >= 0 && Number(v) <= 10000;
const invalid = () => new PortalRequestError(502, 'The program information could not be verified. Please retry.');
const percent = (completed: number, total: number) => total === 0 ? 0 : Math.round(completed / total * 100);
function counts(value: Record<string, unknown>): boolean {
  return count(value.completed_items) && count(value.total_items) && value.completed_items <= value.total_items &&
    value.progress_percent === percent(value.completed_items, value.total_items);
}
function program(value: unknown): value is Program {
  return record(value) && uuid(value.id) && uuid(value.enrollment_id) && text(value.title) && text(value.summary, 2000) &&
    ['active', 'completed'].includes(String(value.status)) && date(value.starts_at) && date(value.ends_at) &&
    Date.parse(value.ends_at) >= Date.parse(value.starts_at) && counts(value) && (value.next_item_id === null || uuid(value.next_item_id));
}
function envelope(value: unknown, ownerId: number): value is Record<string, unknown> {
  return record(value) && value.success === true && value.environment === PRACTICE_ENVIRONMENT &&
    Number.isSafeInteger(ownerId) && ownerId > 0 && value.learner_id === ownerId;
}
function selectProgram(p: Program): Program {
  return { id: p.id, enrollment_id: p.enrollment_id, title: p.title, summary: p.summary, status: p.status,
    starts_at: p.starts_at, ends_at: p.ends_at, completed_items: p.completed_items, total_items: p.total_items,
    progress_percent: p.progress_percent, next_item_id: p.next_item_id };
}
export function parseDashboard(value: unknown, ownerId: number): LearningDashboard {
  if (!envelope(value, ownerId) || !date(value.generated_at) || !record(value.summary) || !counts(value.summary) ||
    !count(value.summary.active_programs) || !Array.isArray(value.programs) || value.programs.length > 50 || !value.programs.every(program) ||
    new Set(value.programs.map(p => p.id)).size !== value.programs.length ||
    value.summary.active_programs !== value.programs.filter(p => p.status === 'active').length ||
    value.summary.total_items !== value.programs.reduce((sum, p) => sum + p.total_items, 0) ||
    value.summary.completed_items !== value.programs.reduce((sum, p) => sum + p.completed_items, 0)) throw invalid();
  const ids = new Map(value.programs.map(p => [p.id, p.title]));
  const belongs = (row: Record<string, unknown>) => uuid(row.program_id) && ids.has(row.program_id);
  if (!Array.isArray(value.upcoming) || value.upcoming.length > 200 || !value.upcoming.every(row => record(row) && uuid(row.id) && belongs(row) &&
      row.program_title === ids.get(row.program_id as string) && text(row.title) && ['lesson', 'assignment'].includes(String(row.kind)) &&
      (row.due_at === null || date(row.due_at)) && (row.status === 'not_started' || (row.kind === 'assignment' && row.status === 'draft'))) ||
    !Array.isArray(value.feedback) || value.feedback.length > 100 || !value.feedback.every(row => record(row) && uuid(row.id) && belongs(row) &&
      row.program_title === ids.get(row.program_id as string) && text(row.title) && text(row.comment, 4000) && date(row.created_at) && text(row.mentor_label)) ||
    !Array.isArray(value.resources) || value.resources.length > 100 || !value.resources.every(row => record(row) && uuid(row.id) && belongs(row) &&
      text(row.title) && text(row.description, 2000) && text(row.body, 6000))) throw invalid();
  const data = value as unknown as LearningDashboard;
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: data.learner_id, generated_at: data.generated_at,
    summary: { active_programs: data.summary.active_programs, completed_items: data.summary.completed_items,
      total_items: data.summary.total_items, progress_percent: data.summary.progress_percent },
    programs: data.programs.map(selectProgram),
    upcoming: data.upcoming.map(row => ({ id: row.id, program_id: row.program_id, program_title: row.program_title,
      title: row.title, kind: row.kind, due_at: row.due_at, status: row.status })),
    feedback: data.feedback.map(row => ({ id: row.id, program_id: row.program_id, program_title: row.program_title,
      title: row.title, comment: row.comment, created_at: row.created_at, mentor_label: row.mentor_label })),
    resources: data.resources.map(row => ({ id: row.id, program_id: row.program_id, title: row.title, description: row.description, body: row.body })) };
}
export function parseProgram(value: unknown, ownerId: number, requestedId: string): ProgramDetail {
  if (!envelope(value, ownerId) || !program(value.program) || value.program.id !== requestedId ||
    !record(value.program) || !Array.isArray(value.program.items) || value.program.items.length > 200 ||
    !value.program.items.every(item => record(item) && uuid(item.id) && text(item.title) && text(item.description, 2000) &&
      text(item.content, 12000) && ['lesson', 'assignment'].includes(String(item.kind)) &&
      (item.due_at === null || date(item.due_at)) &&
      ((item.kind === 'lesson' && ((item.status === 'completed' && date(item.completed_at)) || (item.status === 'not_started' && item.completed_at === null))) ||
        (item.kind === 'assignment' && ['not_started', 'draft', 'submitted'].includes(String(item.status)) && item.completed_at === null)))) throw invalid();
  const p = value.program;
  const items = p.items as unknown as LearningItem[];
  const lessonIds = new Set(items.filter(i => i.kind === 'lesson').map(i => i.id));
  if (new Set(items.map(i => i.id)).size !== items.length || p.total_items !== lessonIds.size ||
    p.completed_items !== items.filter(i => i.kind === 'lesson' && i.status === 'completed').length ||
    (p.next_item_id !== null && !items.some(i => i.id === p.next_item_id && i.kind === 'lesson' && i.status === 'not_started'))) throw invalid();
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: ownerId,
    program: { ...selectProgram(p), items: items.map(item => ({ id: item.id, title: item.title, kind: item.kind,
      description: item.description, content: item.content, due_at: item.due_at, status: item.status, completed_at: item.completed_at })) } };
}
export function createLearningClient(fetcher: typeof fetch = fetch) {
  async function request(path: string, signal?: AbortSignal, csrf?: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetcher(`${API_ORIGIN}/api/learner${path}`, { method: csrf ? 'POST' : 'GET', credentials: 'include', cache: 'no-store',
        redirect: 'error', referrerPolicy: 'no-referrer', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
        headers: csrf ? { 'Content-Type': 'application/json', 'X-EPDG-Request': 'portal', 'X-CSRF-Token': csrf } : {},
        ...(csrf ? { body: '{}' } : {}) });
    } catch {
      if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
      throw new PortalRequestError(0, 'Program information is unavailable while the synthetic practice backend cannot be reached.');
    }
    if (!response.ok) throw new PortalRequestError(response.status, response.status === 401 ? 'Your session has ended. Sign in to continue.' :
      response.status === 403 ? 'Learner programs are unavailable for this account.' : response.status === 404 ? 'This program or activity is unavailable for your account.' :
      response.status === 429 ? 'Too many requests. Please wait and try again.' : 'Program information is temporarily unavailable. Please retry.');
    try { return await response.json(); } catch { throw invalid(); }
  }
  return {
    loadDashboard: async (ownerId: number, signal?: AbortSignal) => parseDashboard(await request('/dashboard', signal), ownerId),
    loadProgram: async (id: string, ownerId: number, signal?: AbortSignal) => {
      if (!uuid(id)) throw new PortalRequestError(404, 'This program is unavailable.');
      return parseProgram(await request(`/programs/${id}`, signal), ownerId, id);
    },
    completeItem: async (id: string, csrf: string): Promise<CompletionResult> => {
      if (!uuid(id) || !/^[A-Za-z0-9_-]{43}$/.test(csrf)) throw new PortalRequestError(403, 'Request verification failed. Refresh account access and try again.');
      const value = await request(`/items/${id}/complete`, undefined, csrf);
      if (!record(value) || value.success !== true || (HOSTED_PRACTICE ? value.environment !== PRACTICE_ENVIRONMENT : value.environment !== undefined && value.environment !== PRACTICE_ENVIRONMENT)
        || value.item_id !== id || !date(value.completed_at) || typeof value.already_completed !== 'boolean') throw invalid();
      return { success: true, item_id: id, completed_at: value.completed_at, already_completed: value.already_completed };
    },
  };
}
const client = createLearningClient();
export const { loadDashboard, loadProgram, completeItem } = client;
