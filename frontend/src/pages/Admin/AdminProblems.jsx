import { useEffect, useState } from "react";
import { getAllProblems } from "../../services/problemService.js";
import {
  createProblem,
  updateProblem,
  deleteProblem,
} from "../../services/adminService.js";

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

function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formMode, setFormMode] = useState("closed");
  const [editingProblem, setEditingProblem] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("easy");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError("");
      setDeleteError("");

      const problemsResponse = await getAllProblems();

      setProblems(Array.isArray(problemsResponse) ? problemsResponse : []);
    } catch (problemsError) {
      const backendMessage =
        problemsError?.response?.data?.message ||
        problemsError?.response?.data?.error ||
        problemsError?.message;

      setError(backendMessage || "Failed to load problems.");
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleOpenCreateForm = () => {
    setFormMode("create");
    setEditingProblem(null);
    setFormTitle("");
    setFormDescription("");
    setFormDifficulty("easy");
    setFormError("");
    setDeleteError("");
  };

  const handleEditProblem = (problem) => {
    setFormMode("edit");
    setEditingProblem(problem);
    setFormTitle(problem?.title ?? "");
    setFormDescription(problem?.description ?? "");
    setFormDifficulty(problem?.difficulty ?? "easy");
    setFormError("");
    setDeleteError("");
  };

  const handleCancelForm = () => {
    setFormMode("closed");
    setEditingProblem(null);
    setFormTitle("");
    setFormDescription("");
    setFormDifficulty("easy");
    setFormError("");
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const trimmedTitle = formTitle.trim();
    const trimmedDescription = formDescription.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setFormError("Title and description are required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError("");

      if (formMode === "create") {
        await createProblem(trimmedTitle, trimmedDescription, formDifficulty);
      } else if (formMode === "edit" && editingProblem?.id != null) {
        await updateProblem(
          editingProblem.id,
          trimmedTitle,
          trimmedDescription,
          formDifficulty
        );
      }

      setFormMode("closed");
      setEditingProblem(null);
      setFormTitle("");
      setFormDescription("");
      setFormDifficulty("easy");
      await loadProblems();
    } catch (submissionError) {
      const backendMessage = submissionError?.response?.data?.message;
      setFormError(backendMessage || "Failed to save problem.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProblem = async (problem) => {
    const confirmed = window.confirm(
      "Delete this problem? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(problem?.id ?? null);
      setDeleteError("");
      await deleteProblem(problem.id);
      await loadProblems();
    } catch (deleteProblemError) {
      const backendMessage =
        deleteProblemError?.response?.data?.message ||
        deleteProblemError?.message ||
        "Failed to delete problem.";

      setDeleteError(backendMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const isEditing = formMode === "edit";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-paper">Manage Problems</h1>
          <p className="mt-2 text-sm text-paper/60">
            Create, edit, and remove coding problems from the admin panel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition hover:bg-signal-dark"
        >
          Add Problem
        </button>
      </div>

      {formMode !== "closed" ? (
        <form
          onSubmit={handleSubmitForm}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/80" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-paper/80"
                htmlFor="difficulty"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formDifficulty}
                onChange={(event) => setFormDifficulty(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-1 block text-sm font-medium text-paper/80"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="6"
              value={formDescription}
              onChange={(event) => setFormDescription(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
            />
          </div>

          {formError ? (
            <p className="mt-4 text-sm text-red-600">{formError}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={formSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelForm}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-paper/80 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>

          {isEditing && editingProblem ? (
            <p className="mt-3 text-xs text-paper/40">
              Editing problem ID {editingProblem.id}
            </p>
          ) : null}
        </form>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
          Loading problems...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error}
        </div>
      ) : problems.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
          No problems found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          {deleteError ? (
            <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          ) : null}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {problems.map((problem) => {
                const problemId = problem?.id ?? problem?._id ?? "";
                const problemTitle = problem?.title ?? "Untitled Problem";
                const problemDifficulty = problem?.difficulty ?? "Unknown";
                const isDeleting = deletingId === problemId;

                return (
                  <tr key={problemId} className="transition hover:bg-white/10">
                    <td className="px-4 py-4 text-sm text-paper/80">{problemId}</td>
                    <td className="px-4 py-4 text-sm font-medium text-paper">
                      {problemTitle}
                    </td>
                    <td className="px-4 py-4 text-sm text-paper/80">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDifficultyBadgeClasses(
                          problemDifficulty
                        )}`}
                      >
                        {problemDifficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-paper/80">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditProblem(problem)}
                          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-paper/80 transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProblem(problem)}
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
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

export default AdminProblems;