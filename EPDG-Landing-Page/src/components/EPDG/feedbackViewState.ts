import type { FeedbackEntry, ViewState } from "../../Types/feedback";
import { mockFeedbackEntries, mockEmptyFeedbackEntry, Fixtures_Week_3, Fixtures_Week_4_FromTim, Fixtures_Week_4_States } from "./mockFeedbackData.ts";

const ALL_MOCK_ENTRIES: FeedbackEntry[] = [
  ...mockFeedbackEntries,
  ...Fixtures_Week_3,
  ...Fixtures_Week_4_FromTim,
  ...Fixtures_Week_4_States,
];

/** 
 *  *assignmentId values used for testing states:
 *  - undefined / ""       -> access-error (no assignment specified)
 *  - "no-access"           -> access-error (simulated permission failure)
 *  - "empty-demo"          -> ready with an empty entries list
 *  - "empty-feedback-demo" -> ready with one entry that has no comment yet
 *  - anything else         -> filtered from entries, or "empty" if nothing matches
 */
export function resolveFeedbackViewState(
  assignmentId: string | undefined,
  entries: FeedbackEntry[] = ALL_MOCK_ENTRIES
): ViewState {
  if (!assignmentId) {
    return { kind: "access-error", message: "No assignment was specified." };
  }
  if (assignmentId === "no-access") {
    return {
      kind: "access-error",
      message:
        "You don't have access to this assignment's feedback. Ask your lead to check your permissions.",
    };
  }
  if (assignmentId === "empty-demo") {
    return { kind: "ready", entries: [] };
  }
  if (assignmentId === "empty-feedback-demo") {
    return { kind: "ready", entries: [mockEmptyFeedbackEntry] };
  }

  const matches = entries.filter((e) => e.assignmentId === assignmentId);
  return matches.length > 0 ? { kind: "ready", entries: matches } : { kind: "empty" };
}

/*What the UI should display while waiting for the request below to finish.*/
export function initialViewState(): ViewState {
  return { kind: "loading" };
}

const ERROR_MESSAGE = "We couldn't load this feedback right now.";

export interface FetchOptions {
  /** Injected so tests do not actually wait on a real timer. */
  sleep?: (ms: number) => Promise<void>;
  /**
   * Tells the function whether this is the first try or a retry. Only matters for the error-recover test case
   */
  attempt?: number;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Two fake IDs let you test error handling without needing a real server:

"error-permanent" always fails, no matter how many times you try.
"error-recover" fails the first time, then succeeds if you try again (retry button actually works)
 */
export async function fetchFeedbackViewState(
  assignmentId: string | undefined,
  entries: FeedbackEntry[] = ALL_MOCK_ENTRIES,
  options: FetchOptions = {}
): Promise<ViewState> {
  const sleep = options.sleep ?? defaultSleep;
  const attempt = options.attempt ?? 1;

  await sleep(150); // keeps the loading state observably real, like Tim's transport.ts

  if (assignmentId === "error-permanent") {
    return { kind: "error", message: ERROR_MESSAGE };
  }
  if (assignmentId === "error-recover" && attempt < 2) {
    return { kind: "error", message: ERROR_MESSAGE };
  }

  return resolveFeedbackViewState(assignmentId, entries);
}
