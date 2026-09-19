import type { FeedbackEntry } from "../../Types/feedback";

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

// WEEK 3 — SYNTHETIC v0.1 FIXTURES (NOT Tim's real fixtures)
//The following link is the Week 3 Form with all the explanation of the code and how to see the seven Fixtures 
//https://docs.google.com/document/d/1zxYNB4wqgsn7-02lsS8R9BtC1pPR6vdY3lngExFICoE/edit?usp=drive_link

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
