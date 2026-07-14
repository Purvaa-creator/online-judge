import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../../services/problemService.js";
import { executeCode } from "../../services/executeService.js";
import {
  createSubmission,
  getSubmissionById,
} from "../../services/submissionService.js";

const starterTemplates = {
  cpp: `#include <iostream>

int main() {
    return 0;
}`,
  python: `# Write your solution here`,
  java: `public class Main {
    public static void main(String[] args) {
    }
}`,
  c: `#include <stdio.h>

int main() {
    return 0;
}`,
};

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
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterTemplates.cpp);
  const [theme, setTheme] = useState("vs-dark");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const clearPollingInterval = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const formatSubmissionError = (err) => {
    const backendMessage = err?.response?.data?.message || err?.message || "Submission failed.";
    const backendType = err?.response?.data?.type;

    return backendType ? `${backendType}: ${backendMessage}` : backendMessage;
  };

  useEffect(() => {
    isMountedRef.current = true;

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
      isMountedRef.current = false;
      clearPollingInterval();
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

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;

    setLanguage(nextLanguage);
    setCode(starterTemplates[nextLanguage] ?? "");
  };

  const handleThemeChange = (event) => {
    const nextTheme = event.target.value;

    setTheme(nextTheme);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    setRunError("");
    setExecutionTime(null);

    try {
      const result = await executeCode(language, code, customInput);

      setOutput(result?.output ?? "");
      setExecutionTime(result?.executionTime ?? null);
    } catch (err) {
      const errorType = err?.response?.data?.type;
      const errorMessage = err?.response?.data?.message;
      const fallbackMessage = err?.message || "Unable to run code.";
      const friendlyType = errorType
        ? errorType
            .split("_")
            .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
            .join(" ")
        : "Run Error";

      setRunError(
        errorType || errorMessage
          ? `${friendlyType}: ${errorMessage || fallbackMessage}`
          : fallbackMessage
      );
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem?.id) {
      setSubmitError("Failed to submit problem.");
      return;
    }

    clearPollingInterval();
    setSubmitting(true);
    setSubmitError("");
    setSubmission(null);

    try {
      const createdSubmission = await createSubmission(problem.id, language, code);

      if (!isMountedRef.current) {
        return;
      }

      setSubmission(createdSubmission);

      if (createdSubmission?.verdict && createdSubmission.verdict !== "pending") {
        setSubmitting(false);
        return;
      }

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const latestSubmission = await getSubmissionById(createdSubmission.id);

          if (!isMountedRef.current) {
            return;
          }

          setSubmission(latestSubmission);

          if (latestSubmission?.verdict !== "pending") {
            clearPollingInterval();
            setSubmitting(false);
          }
        } catch (err) {
          clearPollingInterval();

          if (isMountedRef.current) {
            setSubmitError(formatSubmissionError(err));
            setSubmitting(false);
          }
        }
      }, 2000);
    } catch (err) {
      clearPollingInterval();

      if (isMountedRef.current) {
        setSubmitError(formatSubmissionError(err));
        setSubmitting(false);
      }
    }
  };

  const verdictBadgeClasses = (verdict) => {
    const normalizedVerdict = String(verdict ?? "").toLowerCase();

    if (normalizedVerdict === "pending") {
      return "bg-slate-100 text-slate-700";
    }

    if (normalizedVerdict === "accepted") {
      return "bg-green-100 text-green-800";
    }

    return "bg-red-100 text-red-800";
  };

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

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="theme">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={handleThemeChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <Editor
              height="500px"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="customInput">
              Custom Input
            </label>
            <textarea
              id="customInput"
              rows="4"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              placeholder="Enter custom input here"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {running ? "Running..." : "Run"}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? submission?.verdict === "pending"
                    ? "Judging..."
                    : "Submitting..."
                  : "Submit"}
              </button>
            </div>

            {executionTime !== null ? (
              <p className="text-xs text-slate-500">Executed in {executionTime} ms</p>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-700">Output</p>

            {runError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {runError}
              </div>
            ) : output ? (
              <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
                Run your code to see output here
              </div>
            )}
          </div>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : submission ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Verdict</p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${verdictBadgeClasses(submission.verdict)}`}
                  >
                    {submission.verdict === "pending" ? (
                      <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                    ) : null}
                    {submission.verdict === "pending"
                      ? "Judging..."
                      : submission.verdict === "Accepted"
                        ? "Accepted"
                        : submission.verdict}
                  </span>

                  {submission.verdict === "pending" ? (
                    <span className="text-xs text-slate-500">Polling every 2 seconds</span>
                  ) : null}
                </div>

                <div className="text-xs text-slate-500">
                  {submission.execution_time_ms != null ? (
                    <span>Execution Time: {submission.execution_time_ms} ms</span>
                  ) : null}
                  {submission.execution_time_ms != null && submission.memory_used_kb != null ? (
                    <span> · </span>
                  ) : null}
                  {submission.memory_used_kb != null ? (
                    <span>Memory Used: {submission.memory_used_kb} KB</span>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;