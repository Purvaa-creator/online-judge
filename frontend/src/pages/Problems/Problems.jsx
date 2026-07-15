import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProblems } from "../../services/problemService.js";

function getDifficultyBadgeClasses(difficulty) {
  const normalizedDifficulty = String(difficulty ?? "").toLowerCase();

  if (normalizedDifficulty === "easy") {
    return "border border-signal text-signal font-display uppercase tracking-wider";
  }

  if (normalizedDifficulty === "medium") {
    return "border border-pending text-pending font-display uppercase tracking-wider";
  }

  if (normalizedDifficulty === "hard") {
    return "border border-reject text-reject font-display uppercase tracking-wider";
  }

  return "border border-paper/30 text-paper/60 font-display uppercase tracking-wider";
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
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-paper">Problems</h1>
          <p className="text-sm text-paper/60">Browse and filter the available problems.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-paper/80" htmlFor="searchTerm">
              Search
            </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-paper/80"
              htmlFor="difficultyFilter"
            >
              Difficulty
            </label>
            <select
              id="difficultyFilter"
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
            Loading problems...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
            No problems found.
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
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/5">
                {filteredProblems.map((problem) => {
                  const problemId = problem?.id ?? problem?._id ?? "";
                  const problemTitle = problem?.title ?? "Untitled Problem";
                  const problemDifficulty = problem?.difficulty ?? "Unknown";

                  return (
                    <tr
                      key={problemId}
                      className="cursor-pointer transition hover:bg-white/10"
                      onClick={() => navigate(`/problems/${problemId}`)}
                    >
                      <td className="px-4 py-4 text-sm text-paper/80">{problemId}</td>
                      <td className="px-4 py-4 text-sm font-medium text-paper">
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
                      <td className="px-4 py-4 text-sm text-paper/80">
                        <span
                          className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getDifficultyBadgeClasses(problemDifficulty)}`}
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