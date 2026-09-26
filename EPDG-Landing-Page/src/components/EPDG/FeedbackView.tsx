import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { FeedbackEntry, RevisionStatus, ViewState } from "../../Types/feedback.ts";
import { initialViewState, fetchFeedbackViewState } from "./feedbackViewState.ts";

/**
 * Creation of Buttons to jump directly to each fixture's URL. In week 3 User need to open the URL of each fixture manually
 */
const FIXTURE_LINKS: { label: string; assignmentId: string | null }[] = [
  { label: "F1 · Pending", assignmentId: "F1-pending" },
  { label: "F2 · Returned", assignmentId: "F2-returned" },
  { label: "F3 · Completed", assignmentId: "F3-completed" },
  { label: "F4 · Empty feedback", assignmentId: "F4-empty-feedback" },
  { label: "F5 · No match (empty)", assignmentId: "F5-no-match" },
  { label: "F5b · Multi-round", assignmentId: "F5-multiround" },
  { label: "F6 · No id given", assignmentId: null },
  { label: "F7 · No access", assignmentId: "no-access" },
  { label: "Error (permanent)", assignmentId: "error-permanent" },
  { label: "Error (recovers on retry)", assignmentId: "error-recover" },
];

function FixtureQuickNav() {
  return (
    <nav
      aria-label="Fixture quick navigation (QA only)"
      className="mb-4 flex flex-wrap gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3"
    >
      {FIXTURE_LINKS.map(({ label, assignmentId }) => (
        <Link
          key={label}
          to={assignmentId ? `/assignments/${assignmentId}/feedback` : "/assignments/feedback"}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

/**
 *  * Shows learners what was reviewed and what to do next: reviewer,
 * revision step, and status (pending / returned / completed).
 *
 * All the data here is fictional
 */

const STATUS_LABEL: Record<RevisionStatus, string> = {
  pending: "Pending review",
  returned: "Returned for changes",
  completed: "Completed",
};

const STATUS_STYLE: Record<RevisionStatus, string> = {
  pending: "bg-orange-50 text-orange-800 border-orange-200",
  returned: "bg-red-50 text-red-800 border-red-200",
  completed: "bg-green-50 text-green-800 border-green-200",
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
        Reviewer:{" "}
        <span className="font-medium text-slate-800">
          {entry.reviewer.reviewerName ?? "Former reviewer"}
        </span>{" "}
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

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-md border border-amber-400 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * This is the seam to replace with a real fetch
 * against Joshan's assignment source / Zuhair's submission IDs 
 */
function useFeedbackData(assignmentId: string | undefined) {
  const [state, setState] = useState<ViewState>(initialViewState());
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setState(initialViewState());
    fetchFeedbackViewState(assignmentId, undefined, { attempt }).then((result) => {
      if (!cancelled) setState(result);
    });
    return () => {
      cancelled = true;
    };
  }, [assignmentId, attempt]);

  const retry = () => setAttempt((a) => a + 1);

  return { state, retry };
}

export default function FeedbackView() {
  // In the real route this would be something like
  // /assignments/:assignmentId/feedback
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [filter, setFilter] = useState<RevisionStatus | "all">("all");

  const { state, retry } = useFeedbackData(assignmentId);

  return (
    <section aria-labelledby="feedback-view-heading" className="mx-auto max-w-2xl p-4">
      <FixtureQuickNav />
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

        {state.kind === "error" && <ErrorState message={state.message} onRetry={retry} />}

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
