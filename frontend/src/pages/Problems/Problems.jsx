import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProblems } from "../../services/problemService.js";

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

function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const problemsResponse = await getAllProblems();

        if (isMounted) {
          setProblems(Array.isArray(problemsResponse) ? problemsResponse : []);
        }
      } catch (problemsError) {
        const backendMessage =
          problemsError?.response?.data?.message ||
          problemsError?.response?.data?.error ||
          problemsError?.message;

        if (isMounted) {
          setError(backendMessage || "Failed to load problems.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProblems();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProblems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const normalizedDifficultyFilter = difficultyFilter.toLowerCase();

    return problems.filter((problem) => {
      const title = String(problem?.title ?? "").toLowerCase();
      const difficulty = String(problem?.difficulty ?? "").toLowerCase();

      const matchesSearch =
        normalizedSearchTerm === "" || title.includes(normalizedSearchTerm);
      const matchesDifficulty =
        normalizedDifficultyFilter === "all" || difficulty === normalizedDifficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [difficultyFilter, problems, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Problems</h1>
          <p className="text-sm text-slate-600">Browse and filter the available problems.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="searchTerm">
              Search
            </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="difficultyFilter"
            >
              Difficulty
            </label>
            <select
              id="difficultyFilter"
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Loading problems...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No problems found.
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredProblems.map((problem) => {
                  const problemId = problem?.id ?? problem?._id ?? "";
                  const problemTitle = problem?.title ?? "Untitled Problem";
                  const problemDifficulty = problem?.difficulty ?? "Unknown";

                  return (
                    <tr
                      key={problemId}
                      className="cursor-pointer transition hover:bg-slate-50"
                      onClick={() => navigate(`/problems/${problemId}`)}
                    >
                      <td className="px-4 py-4 text-sm text-slate-700">{problemId}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/problems/${problemId}`);
                          }}
                        >
                          {problemTitle}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDifficultyBadgeClasses(problemDifficulty)}`}
                        >
                          {problemDifficulty}
                        </span>
                      </td>
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

export default Problems;