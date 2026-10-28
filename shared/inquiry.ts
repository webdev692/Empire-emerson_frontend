/** Minimal inquiry boundary. Inject only an explicitly approved development sink or verified transport. */
export type InquiryTopic = 'CORRECTION' | 'PROGRAM' | 'SPEAKING';

export interface InquiryPayload {
  reply_email: string;
  topic: InquiryTopic;
  resource_id: string | null;
}

export type InquiryTransport = (payload: InquiryPayload, idempotencyKey: string) => Promise<{ receipt: string }>;
export type InquiryResult = {
  status: 'UNAVAILABLE' | 'INVALID' | 'PENDING' | 'FAILED' | 'DELIVERED';
  message: string;
  receipt?: string;
};
export type InquiryState = InquiryResult | { status: 'READY'; message: string };
export interface InquiryController {
  submit(raw: unknown): Promise<InquiryResult>;
  getState(): InquiryState;
}

const UNAVAILABLE: InquiryResult = { status: 'UNAVAILABLE', message: 'Inquiry delivery is unavailable. No request has been sent.' };
const INVALID: InquiryResult = { status: 'INVALID', message: 'Check the reply email, topic, and resource reference. Message text and attachments are not accepted.' };
const PENDING: InquiryResult = { status: 'PENDING', message: 'Inquiry delivery is pending. Please wait before submitting again.' };
const FAILED: InquiryResult = { status: 'FAILED', message: 'Inquiry delivery could not be confirmed. You may retry this same request.' };

function isPlainRecord(raw: unknown): raw is Record<string, unknown> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return false;
  const prototype = Object.getPrototypeOf(raw);
  return prototype === null || prototype === Object.prototype;
}

/** Syntax validation is not mailbox verification and never performs a network request. */
function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length > 320) return null;
  const value = raw.trim();
  if (value.length > 254 || /\s/.test(value)) return null;
  const parts = value.split('@');
  if (parts.length !== 2) return null;
  const [local, originalDomain] = parts;
  if (!local || local.length > 64 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return null;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  const domain = originalDomain.toLowerCase();
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  if (!/^[a-z][a-z0-9-]{1,62}$/.test(labels[labels.length - 1])) return null;
  // Preserve local-part case; the domain is case-insensitive, the mailbox may not be.
  return `${local}@${domain}`;
}

function normalizePayload(raw: unknown): InquiryPayload | null {
  if (!isPlainRecord(raw)) return null;
  const fields = ['reply_email', 'topic', 'resource_id'];
  const keys = Reflect.ownKeys(raw);
  if (keys.length !== fields.length || keys.some((key) => typeof key !== 'string' || !fields.includes(key))) return null;
  // Read data properties only. Imported accessors are outside the intake contract.
  const descriptors = Object.getOwnPropertyDescriptors(raw);
  if (fields.some((field) => !descriptors[field] || !('value' in descriptors[field]))) return null;
  const reply_email = normalizeEmail(descriptors.reply_email.value);
  const topic = descriptors.topic.value;
  const resource_id = descriptors.resource_id.value;
  if (!reply_email || !['CORRECTION', 'PROGRAM', 'SPEAKING'].includes(topic)) return null;
  if (resource_id !== null && (typeof resource_id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(resource_id))) return null;
  return { reply_email, topic: topic as InquiryTopic, resource_id: resource_id as string | null };
}

function receiptValue(raw: unknown): string | null {
  if (!isPlainRecord(raw) || Reflect.ownKeys(raw).length !== 1 || !Object.prototype.hasOwnProperty.call(raw, 'receipt')) return null;
  const descriptor = Object.getOwnPropertyDescriptor(raw, 'receipt');
  if (!descriptor || !('value' in descriptor) || typeof descriptor.value !== 'string') return null;
  return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(descriptor.value) ? descriptor.value : null;
}

/**
 * In-memory only: no endpoint, browser storage, logs, narratives, files or private records.
 * Failed attempts retain their idempotency key; a transport must honor that key server-side.
 * A controller also suppresses duplicate in-flight and confirmed-delivered requests locally.
 */
export function createInquiryController(transport?: InquiryTransport): InquiryController {
  let state: InquiryState = transport ? { status: 'READY', message: 'The configured inquiry route is ready.' } : { ...UNAVAILABLE };
  const keys = new Map<string, string>();
  const delivered = new Map<string, InquiryResult>();
  let active: { fingerprint: string; promise: Promise<InquiryResult> } | null = null;

  return {
    getState: () => ({ ...state }),
    submit(raw: unknown): Promise<InquiryResult> {
      // Fail closed before touching input when there is no verified/injected route.
      if (!transport) return Promise.resolve({ ...UNAVAILABLE });
      let payload: InquiryPayload | null;
      try { payload = normalizePayload(raw); } catch { payload = null; }
      if (!payload) {
        if (!active) state = { ...INVALID };
        return Promise.resolve({ ...INVALID });
      }
      const fingerprint = JSON.stringify(payload);
      if (active) {
        return active.fingerprint === fingerprint ? active.promise : Promise.resolve({ ...PENDING });
      }
      const existing = delivered.get(fingerprint);
      if (existing) {
        state = { ...existing };
        return Promise.resolve({ ...existing });
      }
      let key = keys.get(fingerprint);
      if (!key) {
        try { key = globalThis.crypto.randomUUID(); } catch {
          state = { ...FAILED };
          return Promise.resolve({ ...FAILED });
        }
        keys.set(fingerprint, key);
      }
      state = { ...PENDING };
      // Defer transport until active is registered, including synchronous transport failures.
      const promise = Promise.resolve().then(async (): Promise<InquiryResult> => {
        try {
          const response = await transport({ ...payload }, key);
          const receipt = receiptValue(response);
          if (!receipt) throw new Error('Invalid delivery confirmation');
          const result: InquiryResult = { status: 'DELIVERED', message: 'Inquiry delivery was confirmed.', receipt };
          delivered.set(fingerprint, { ...result });
          state = { ...result };
          return { ...result };
        } catch {
          state = { ...FAILED };
          return { ...FAILED };
        } finally {
          active = null;
        }
      });
      active = { fingerprint, promise };
      return promise;
    },
  };
}
