import apiClient from "./apiClient.js";

export async function getAllProblems() {
  const response = await apiClient.get("/problems");
  return response.data.problems;
}

export async function getProblemById(id) {
  const response = await apiClient.get(`/problems/${id}`);
  return response.data.problem;
}