import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../../services/problemService.js";

function getDifficultyBadgeClasses(difficulty) {
  const normalizedDifficulty = String(difficulty ?? "").toLowerCase();

  if (normalizedDifficulty === "easy") {
    return "bg-green-100 text-green-800";
  }

  if (normalizedDifficulty === "medium") {
    return "bg-amber-100 text-amber-800";
  }

  if (normalizedDifficulty === "hard") {
    return "bg-red-100 text-red-800";
  }

  return "bg-slate-100 text-slate-700";
}

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const problemResponse = await getProblemById(id);

        if (isMounted) {
          setProblem(problemResponse ?? null);
        }
      } catch (err) {
        const backendMessage = err?.response?.data?.message;

        if (isMounted) {
          setError(backendMessage || "Failed to load problem.");
          setProblem(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProblem();
    } else {
      setLoading(false);
      setError("Failed to load problem.");
      setProblem(null);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Failed to load problem.</p>
        </div>
      </div>
    );
  }

  const title = problem.title ?? "Untitled Problem";
  const difficulty = problem.difficulty ?? "Unknown";
  const description = problem.description ?? "";
  const timeLimitMs = problem.time_limit_ms ?? problem.timeLimitMs;
  const memoryLimitKb = problem.memory_limit_kb ?? problem.memoryLimitKb;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Time Limit: {timeLimitMs ?? "-"} ms · Memory Limit: {memoryLimitKb ?? "-"} KB
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getDifficultyBadgeClasses(difficulty)}`}
          >
            {difficulty}
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 sm:p-6">
          <div className="whitespace-pre-wrap">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;