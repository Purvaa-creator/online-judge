import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, EmptyState, ErrorState, Spinner } from "../../components/ui/SharedComponents.jsx";
import { getAllSubmissionsAdmin } from "../../services/adminService.js";

function getVerdictBadgeClasses(verdict) {
  const normalizedVerdict = String(verdict ?? "").toLowerCase();

  if (normalizedVerdict === "pending") {
    return "border border-paper/30 text-paper/60 font-display uppercase tracking-wider";
  }

  if (normalizedVerdict === "accepted") {
    return "border border-signal text-signal font-display uppercase tracking-wider";
  }

  return "border border-reject text-reject font-display uppercase tracking-wider";
}

function formatSubmittedAt(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function AdminSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError("");

        const submissionsResponse = await getAllSubmissionsAdmin();

        if (isMounted) {
          setSubmissions(Array.isArray(submissionsResponse) ? submissionsResponse : []);
        }
      } catch (submissionError) {
        const backendMessage =
          submissionError?.response?.data?.message ||
          submissionError?.message ||
          "Failed to load submissions.";

        if (isMounted) {
          setError(backendMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(() => submissions, [submissions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text-primary">All Submissions</h1>
        <p className="text-sm text-text-secondary">Review submissions across all users.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border-subtle/80 bg-bg-surface/70 px-4 py-6 text-sm text-text-secondary">
          <Spinner />
          <span>Loading submissions...</span>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : rows.length === 0 ? (
        <EmptyState message="No submissions yet." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle/80">
          <table className="min-w-full divide-y divide-border-subtle/80">
            <thead className="bg-bg-surface-hover/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Problem ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Language</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Verdict</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Execution Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Memory Used</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80 bg-bg-surface/70">
              {rows.map((submission) => {
                const submissionId = submission?.id ?? "";
                const userId = submission?.user_id ?? submission?.userId ?? "-";
                const problemId = submission?.problem_id ?? "-";
                const executionTime =
                  submission?.execution_time_ms != null
                    ? `${submission.execution_time_ms} ms`
                    : "-";
                const memoryUsed =
                  submission?.memory_used_kb != null
                    ? `${submission.memory_used_kb} KB`
                    : "-";
                const submittedAt = formatSubmittedAt(
                  submission?.submitted_at ?? submission?.created_at ?? submission?.submittedAt
                );

                return (
                  <tr
                    key={submissionId}
                    className="cursor-pointer transition hover:bg-bg-surface-hover/70"
                    onClick={() => navigate(`/problems/${problemId}`)}
                  >
                    <td className="px-4 py-4 text-sm text-text-secondary">{submissionId}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{userId}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{problemId}</td>
                    <td className="px-4 py-4 text-sm capitalize text-text-secondary">{submission?.language ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      <Badge value={submission?.verdict ?? "-"} variant="verdict" />
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{executionTime}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{memoryUsed}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{submittedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissions;