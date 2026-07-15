import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubmissions } from "../../services/submissionService.js";

function getVerdictBadgeClasses(verdict) {
  const normalizedVerdict = String(verdict ?? "").toLowerCase();

  if (normalizedVerdict === "pending") {
    return "bg-slate-100 text-slate-700";
  }

  if (normalizedVerdict === "accepted") {
    return "bg-green-100 text-green-800";
  }

  return "bg-red-100 text-red-800";
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

function Submissions() {
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

        const submissionsResponse = await getMySubmissions();

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
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-paper">My Submissions</h1>
          <p className="text-sm text-paper/60">Review the submissions created from your account.</p>
        </div>

        {loading ? (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
            Loading submissions...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
            No submissions yet.
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Problem ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Verdict
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Execution Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Memory Used
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/5">
                {rows.map((submission) => {
                  const submissionId = submission?.id ?? "";
                  const problemId = submission?.problem_id ?? "-";
                  const executionTime =
                    submission?.execution_time_ms != null ? `${submission.execution_time_ms} ms` : "-";
                  const memoryUsed =
                    submission?.memory_used_kb != null ? `${submission.memory_used_kb} KB` : "-";
                  const submittedAt = formatSubmittedAt(
                    submission?.submitted_at ?? submission?.created_at ?? submission?.submittedAt
                  );

                  return (
                    <tr
                      key={submissionId}
                      className="cursor-pointer transition hover:bg-white/10"
                      onClick={() => navigate(`/problems/${problemId}`)}
                    >
                      <td className="px-4 py-4 text-sm text-paper/80">{submissionId}</td>
                      <td className="px-4 py-4 text-sm text-paper/80">{problemId}</td>
                      <td className="px-4 py-4 text-sm capitalize text-paper/80">
                        {submission?.language ?? "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-paper/80">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getVerdictBadgeClasses(submission?.verdict)}`}
                        >
                          {submission?.verdict === "pending" ? (
                            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                          ) : null}
                          {submission?.verdict === "pending"
                            ? "Judging..."
                            : submission?.verdict ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-paper/80">{executionTime}</td>
                      <td className="px-4 py-4 text-sm text-paper/80">{memoryUsed}</td>
                      <td className="px-4 py-4 text-sm text-paper/80">{submittedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;