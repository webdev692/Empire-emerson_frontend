import type { FeedbackEntry } from "../../Types/feedback";

// Fictional mock data - not real


export const mockFeedbackEntries: FeedbackEntry[] = [
  {
    id: "fb-001",
    submissionId: "SUB-201",
    assignmentId: "ASG-118",
    assignmentTitle: "Income Case Analysis — Exercise 1",
    revisionStep: 1,
    status: "pending",
    reviewer: { reviewerName: "Alejandra Garzon", reviewerRole: "Peer Reviewer" },
    comment: undefined,
    updatedAt: "2026-09-07T14:00:00Z",
  },
  {
    id: "fb-002",
    submissionId: "SUB-202",
    assignmentId: "ASG-118",
    assignmentTitle: "Income Case Analysis — Exercise 1",
    revisionStep: 2,
    status: "returned",
    reviewer: { reviewerName: "Sebastian White", reviewerRole: "Lead Reviewer" },
    comment:
      "There are a couple steps  missing (number 2 and 4) — please add it and resubmit.",
    updatedAt: "2026-09-08T09:30:00Z",
  },
  {
    id: "fb-003",
    submissionId: "SUB-2203",
    assignmentId: "ASG-118",
    assignmentTitle: "Quality Checkpoints — Worksheet",
    revisionStep: 1,
    status: "completed",
    reviewer: { reviewerName: "David Molina", reviewerRole: "Lead Reviewer" },
    comment: "Nice work identifying all four checkpoints.",
    updatedAt: "2026-09-06T17:15:00Z",
  },
];

// Fictional entry 
export const mockEmptyFeedbackEntry: FeedbackEntry = {
  id: "fb-004",
  submissionId: "SUB-2204",
  assignmentId: "ASG-121",
  assignmentTitle: "Quality Checkpoints — Worksheet",
  revisionStep: 1,
  status: "pending",
  reviewer: { reviewerName: "Priya Nair", reviewerRole: "Lead Reviewer" },
  comment: "",
  updatedAt: "2026-09-08T11:00:00Z",
};
