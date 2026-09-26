
// All example data using these types is fictional/mock data,


export type RevisionStatus = "pending" | "returned" | "completed";

export interface ReviewerInfo {
  // Nullable per Tim's real fixture scenario: reviewerDisplayName is
  // null when a reviewer has left the program. The comment must still
  // render — this is a guarded case now, not an assumption of "always present".
  reviewerName: string | null;
  reviewerRole: string; 
}

export interface FeedbackEntry {
  id: string;
  submissionId: string; // aligns with Zuhair's submission IDs
  assignmentId: string; // aligns with Joshan's assignment IDs
  assignmentTitle: string;
  revisionStep: number; 
  status: RevisionStatus;
  reviewer: ReviewerInfo;
  comment?: string; // fictional feedback text; may be empty (see EmptyFeedback)
  // Intentionally no numeric "score" field — the guide asks to keep
  // score examples clearly fictional or omit them; we omit them.
  updatedAt: string; 
}

export type ViewState =
  | { kind: "loading" }
  | { kind: "access-error"; message: string }
  | { kind: "error"; message: string } // network/server failure — recoverable via retry
  | { kind: "empty" }
  | { kind: "ready"; entries: FeedbackEntry[] };
