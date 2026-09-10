// Types for the EPDG feedback & revision view.


export type RevisionStatus = "pending" | "returned" | "completed";

export interface ReviewerInfo {
  reviewerName: string;
  reviewerRole: string; // e.g. "Lead Reviewer", "Peer Reviewer"
}

export interface FeedbackEntry {
  id: string;
  submissionId: string; // I need to add  the Zuhair's submission IDs
  assignmentId: string; // I need to add Joshan's assignment IDs
  assignmentTitle: string;
  revisionStep: number; // Number of revisions
  status: RevisionStatus;
  reviewer: ReviewerInfo;
  comment?: string; // fictional feedback text; 
  updatedAt: string; // ISO date string
}

export type ViewState =
  | { kind: "loading" }
  | { kind: "access-error"; message: string }
  | { kind: "empty" }
  | { kind: "ready"; entries: FeedbackEntry[] };
