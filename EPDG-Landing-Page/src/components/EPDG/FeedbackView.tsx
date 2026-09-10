import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { FeedbackEntry, RevisionStatus, ViewState } from "../../Types/feedback";
import { mockFeedbackEntries, mockEmptyFeedbackEntry } from "././mockFeedbackData";

/**
 * EPDG feedback & revision view.
 *
 * Shows learners what was reviewed and what to do next: reviewer,
 * revision step, and status (pending / returned / completed).
 *
 * Data here is fictional/mock (see mockFeedbackData.ts). Real wiring
 * to Joshan's assignment source and Zuhair's submission IDs happens
 * where `useFeedbackData` is swapped for a real fetch — left as a
 * clearly marked seam below.
 */

const STATUS_LABEL: Record<RevisionStatus, string> = {
  pending: "Pending review",
  returned: "Returned — needs changes",
  completed: "Completed",
};

const STATUS_STYLE: Record<RevisionStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  returned: "bg-rose-50 text-rose-800 border-rose-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

function StatusBadge({ status }: { status: RevisionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-sm font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function FeedbackCard({ entry }: { entry: FeedbackEntry }) {
  const hasComment = entry.comment && entry.comment.trim().length > 0;

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-slate-400">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{entry.assignmentTitle}</h3>
          <p className="text-sm text-slate-500">
            Revision step {entry.revisionStep} · Submission {entry.submissionId}
          </p>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Reviewer: <span className="font-medium text-slate-800">{entry.reviewer.reviewerName}</span>{" "}
        ({entry.reviewer.reviewerRole})
      </p>

      {hasComment ? (
        <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{entry.comment}</p>
      ) : (
        <p className="mt-3 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
          No feedback has been left yet. Check back after the reviewer completes this step.
        </p>
      )}

      <a
        href={`/assignments/${entry.assignmentId}/submissions/${entry.submissionId}`}
        className="mt-3 inline-block text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
      >
        View submission and next steps
      </a>
    </li>
  );
}

function AccessErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <p className="font-semibold">Can't open this feedback</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
      <p className="font-medium text-slate-700">No feedback yet</p>
      <p className="mt-1 text-sm">
        Nothing has been reviewed for this assignment yet. Check back once a reviewer starts.
      </p>
    </div>
  );
}

/**
 * Mock data hook — this is the seam to replace with a real fetch
 * against Joshan's assignment source / Zuhair's submission IDs.
 * `assignmentId` is read from the route so this view can be linked
 * per-assignment; passing an unknown id simulates an access error.
 */
function useFeedbackData(assignmentId: string | undefined): ViewState {
  return useMemo(() => {
    if (!assignmentId) {
      return { kind: "access-error", message: "No assignment was specified." };
    }
    if (assignmentId === "no-access") {
      return {
        kind: "access-error",
        message: "You don't have access to this assignment's feedback. Ask your lead to check your permissions.",
      };
    }
    if (assignmentId === "empty-demo") {
      return { kind: "ready", entries: [] };
    }
    if (assignmentId === "empty-feedback-demo") {
      return { kind: "ready", entries: [mockEmptyFeedbackEntry] };
    }
    const entries = mockFeedbackEntries.filter((e) => e.assignmentId === assignmentId);
    return entries.length > 0 ? { kind: "ready", entries } : { kind: "empty" };
  }, [assignmentId]);
}

export default function FeedbackView() {
  // In the real route this would be something like
  // /assignments/:assignmentId/feedback
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [filter, setFilter] = useState<RevisionStatus | "all">("all");

  const state = useFeedbackData(assignmentId ?? "ASG-118");

  return (
    <section aria-labelledby="feedback-view-heading" className="mx-auto max-w-2xl p-4">
      <h2 id="feedback-view-heading" className="text-xl font-semibold text-slate-900">
        Feedback and revision
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        See what was reviewed and what to do next.
      </p>

      {state.kind === "ready" && state.entries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["all", "pending", "returned", "completed"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={`rounded-md border px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                filter === option
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option === "all" ? "All" : STATUS_LABEL[option]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {state.kind === "loading" && (
          <p className="text-sm text-slate-500" aria-live="polite">
            Loading feedback…
          </p>
        )}

        {state.kind === "access-error" && <AccessErrorState message={state.message} />}

        {state.kind === "empty" && <EmptyState />}

        {state.kind === "ready" &&
          (state.entries.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {state.entries
                .filter((e) => filter === "all" || e.status === filter)
                .map((entry) => (
                  <FeedbackCard key={entry.id} entry={entry} />
                ))}
            </ul>
          ))}
      </div>
    </section>
  );
}
