import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveFeedbackViewState,
  initialViewState,
  fetchFeedbackViewState,
} from "./feedbackViewState.ts";
import type { FeedbackEntry } from "../../Types/feedback";

const noSleep = async () => {};

const sampleEntries: FeedbackEntry[] = [
  {
    id: "fb-test-1",
    submissionId: "SUB-TEST-1",
    assignmentId: "ASG-TEST",
    assignmentTitle: "Test Assignment",
    revisionStep: 1,
    status: "pending",
    reviewer: { reviewerName: "Test Reviewer", reviewerRole: "Peer Reviewer" },
    comment: "Looks good so far.",
    updatedAt: "2026-09-08T00:00:00Z",
  },
];

// ---- Loading state ----

test("loading: initial state before any fetch resolves is 'loading'", () => {
  const state = initialViewState();
  assert.equal(state.kind, "loading");
});

// ---- Success state ----

test("success: resolves to 'ready' with matching entries for a known id", async () => {
  const state = await fetchFeedbackViewState("ASG-TEST", sampleEntries, { sleep: noSleep });
  assert.equal(state.kind, "ready");
  if (state.kind === "ready") {
    assert.equal(state.entries.length, 1);
    assert.equal(state.entries[0].id, "fb-test-1");
  }
});

// ---- Empty state ----

test("empty: resolves to 'empty' when assignmentId matches nothing", async () => {
  const state = await fetchFeedbackViewState("ASG-DOES-NOT-EXIST", sampleEntries, { sleep: noSleep });
  assert.equal(state.kind, "empty");
});

test("empty: the empty-demo id resolves to 'ready' with zero entries", () => {
  const state = resolveFeedbackViewState("empty-demo", sampleEntries);
  assert.equal(state.kind, "ready");
  if (state.kind === "ready") assert.equal(state.entries.length, 0);
});

// ---- Error state (distinct from access-error and from empty) ----

test("error: 'error-permanent' always resolves to a distinct error state", async () => {
  const state = await fetchFeedbackViewState("error-permanent", sampleEntries, { sleep: noSleep });
  assert.equal(state.kind, "error");
  if (state.kind === "error") {
    assert.match(state.message, /couldn't load/i);
  }
});

test("error: an error state is NOT the same shape as empty or access-error", async () => {
  const errorState = await fetchFeedbackViewState("error-permanent", sampleEntries, { sleep: noSleep });
  const emptyState = await fetchFeedbackViewState("ASG-DOES-NOT-EXIST", sampleEntries, { sleep: noSleep });
  const accessErrorState = resolveFeedbackViewState("no-access", sampleEntries);
  assert.notEqual(errorState.kind, emptyState.kind);
  assert.notEqual(errorState.kind, accessErrorState.kind);
});

test("access-error: no assignmentId given resolves to 'access-error', not 'error'", async () => {
  const state = await fetchFeedbackViewState(undefined, sampleEntries, { sleep: noSleep });
  assert.equal(state.kind, "access-error");
});

// ---- Recovery state ----

test("recovery: 'error-recover' fails on attempt 1", async () => {
  const state = await fetchFeedbackViewState("error-recover", sampleEntries, {
    sleep: noSleep,
    attempt: 1,
  });
  assert.equal(state.kind, "error");
});

test("recovery: the SAME id succeeds on attempt 2 (retry)", async () => {
  const recoverEntries: FeedbackEntry[] = [
    { ...sampleEntries[0], id: "fb-recovered", assignmentId: "error-recover" },
  ];
  const first = await fetchFeedbackViewState("error-recover", recoverEntries, {
    sleep: noSleep,
    attempt: 1,
  });
  const retried = await fetchFeedbackViewState("error-recover", recoverEntries, {
    sleep: noSleep,
    attempt: 2,
  });
  assert.equal(first.kind, "error");
  assert.equal(retried.kind, "ready");
  if (retried.kind === "ready") {
    assert.equal(retried.entries[0].id, "fb-recovered");
  }
});

// ---- Carried forward from Week 3 ----

test("returns matching entries for a known assignmentId (sync)", () => {
  const state = resolveFeedbackViewState("ASG-TEST", sampleEntries);
  assert.equal(state.kind, "ready");
  if (state.kind === "ready") assert.equal(state.entries[0].id, "fb-test-1");
});

test("returns one entry with no comment for the empty-feedback-demo id (sync)", () => {
  const state = resolveFeedbackViewState("empty-feedback-demo", sampleEntries);
  assert.equal(state.kind, "ready");
  if (state.kind === "ready") assert.equal(state.entries[0].comment, "");
});
