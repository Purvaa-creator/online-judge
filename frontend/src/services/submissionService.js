import apiClient from "./apiClient.js";

export async function createSubmission(problemId, language, code) {
  const response = await apiClient.post("/submissions", {
    problemId,
    language,
    code,
  });

  return response.data.submission;
}

export async function getSubmissionById(id) {
  const response = await apiClient.get(`/submissions/${id}`);
  return response.data.submission;
}