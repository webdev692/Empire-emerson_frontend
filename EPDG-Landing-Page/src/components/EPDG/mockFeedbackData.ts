import type { FeedbackEntry } from "../../Types/feedback.ts";

// Fictional mock data only — for demonstrating states, not real
// participant data. Do not connect this file to a live data source.

export const mockFeedbackEntries: FeedbackEntry[] = [
  {
    id: "fb-001",
    submissionId: "SUB-2201",
    assignmentId: "ASG-118",
    assignmentTitle: "Intro to Process Mapping — Exercise 2",
    revisionStep: 1,
    status: "pending",
    reviewer: { reviewerName: "Alex Rivera", reviewerRole: "Peer Reviewer" },
    comment: undefined,
    updatedAt: "2026-09-07T14:00:00Z",
  },
  {
    id: "fb-002",
    submissionId: "SUB-2202",
    assignmentId: "ASG-118",
    assignmentTitle: "Intro to Process Mapping — Exercise 2",
    revisionStep: 2,
    status: "returned",
    reviewer: { reviewerName: "Sam Okafor", reviewerRole: "Lead Reviewer" },
    comment:
      "Good first pass on the swimlane diagram. Step 3 is missing the handoff point — please add it and resubmit.",
    updatedAt: "2026-09-08T09:30:00Z",
  },
  {
    id: "fb-003",
    submissionId: "SUB-2203",
    assignmentId: "ASG-121",
    assignmentTitle: "Quality Checkpoints — Worksheet",
    revisionStep: 1,
    status: "completed",
    reviewer: { reviewerName: "Priya Nair", reviewerRole: "Lead Reviewer" },
    comment: "Clear and complete. Nice work identifying all four checkpoints.",
    updatedAt: "2026-09-06T17:15:00Z",
  },
];

// Fictional entry with no feedback text yet, to demonstrate the
// "empty feedback" case called out in the guide.
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

// Fixtures that i keep for week 3 that cover  Tim's Fixtures

export const Fixtures_Week_3: FeedbackEntry[] = [
  {
    // F1: pending, with an in-progress comment
    id: "f1", submissionId: "SYN-F1", assignmentId: "F1-pending",
    assignmentTitle: "Synthetic Fixture 1", revisionStep: 1, status: "pending",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Reviewing now, will confirm shortly.",
    updatedAt: "2026-09-14T09:00:00Z",
  },
  {
    // F2: returned, with a change request
    id: "f2", submissionId: "SYN-F2", assignmentId: "F2-returned",
    assignmentTitle: "Synthetic Fixture 2", revisionStep: 2, status: "returned",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Missing step 3 — please add and resubmit.",
    updatedAt: "2026-09-14T09:05:00Z",
  },
  {
    // F3: completed, with positive feedback
    id: "f3", submissionId: "SYN-F3", assignmentId: "F3-completed",
    assignmentTitle: "Synthetic Fixture 3", revisionStep: 1, status: "completed",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "All good, approved.",
    updatedAt: "2026-09-14T09:10:00Z",
  },
  {
    // F4: pending, no comment left yet (empty feedback state)
    id: "f4", submissionId: "SYN-F4", assignmentId: "F4-empty-feedback",
    assignmentTitle: "Synthetic Fixture 4", revisionStep: 1, status: "pending",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "",
    updatedAt: "2026-09-14T09:15:00Z",
  },
];

/* For the week 4  two scenarios adapted from Tim's real fixtures
// (learnerFlow.ts). 
// Tim built these against a different, already-shipped component (Feedback.tsx) by
// mistake; only the scenario design is reused here, not his data.
/*/

export const Fixtures_Week_4_FromTim: FeedbackEntry[] = [
  {
    // Adapted from Tim's `returnedRound1` — first round of a
    // multi-round exchange on the same submission.
    id: "f5", submissionId: "SYN-F5", assignmentId: "F5-multiround",
    assignmentTitle: "Synthetic Fixture 5 — multi-round", revisionStep: 1, status: "returned",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Add the permission-denied row before resubmitting.",
    updatedAt: "2026-09-06T15:30:00Z",
  },
  {
    // Adapted from Tim's `returnedRound2` — second round, same
    // submission/assignment, later revisionStep. This is how "multi
    // round" is expressed here: several entries sharing an
    // assignmentId, distinguished by revisionStep.
    id: "f6", submissionId: "SYN-F5", assignmentId: "F5-multiround",
    assignmentTitle: "Synthetic Fixture 5 — multi-round", revisionStep: 2, status: "returned",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Closer. The empty state still needs a contact route.",
    updatedAt: "2026-09-07T10:15:00Z",
  },
  {
    // Adapted from Tim's `orphanedReviewer` — reviewerDisplayName is
    // null because the reviewer left the program. 
    id: "f7", submissionId: "SYN-F3", assignmentId: "F3-completed",
    assignmentTitle: "Synthetic Fixture 3", revisionStep: 0, status: "completed",
    reviewer: { reviewerName: null, reviewerRole: "Peer Reviewer" },
    comment: "Earlier note from a reviewer no longer in the program.",
    updatedAt: "2026-09-02T08:00:00Z",
  },
];

/*
// One real fixture for the "recovery" state category.
// assignmentId "error-recover" is special-cased in
// feedbackViewState.ts to fail on attempt 1 and succeed on attempt
// 2+.
/*/

export const Fixtures_Week_4_States: FeedbackEntry[] = [
  {
    id: "f8", submissionId: "SYN-F8", assignmentId: "error-recover",
    assignmentTitle: "Synthetic Fixture 8 — recovers after retry", revisionStep: 1, status: "completed",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Loaded successfully after a retry.",
    updatedAt: "2026-09-20T09:00:00Z",
  },
];
