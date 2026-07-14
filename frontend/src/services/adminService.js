import apiClient from "./apiClient.js";

export async function getStats() {
  const response = await apiClient.get("/stats");
  return response.data.stats;
}

export async function getAllUsers() {
  const response = await apiClient.get("/users");
  return response.data.users;
}

export async function getAllSubmissionsAdmin() {
  const response = await apiClient.get("/submissions");
  return response.data.submissions;
}

export async function updateProblem(id, title, description, difficulty) {
  const response = await apiClient.put(`/problems/${id}`, {
    title,
    description,
    difficulty,
  });

  return response.data.problem;
}

export async function deleteProblem(id) {
  const response = await apiClient.delete(`/problems/${id}`);
  return response.data;
}

export async function createProblem(title, description, difficulty) {
  const response = await apiClient.post("/problems", {
    title,
    description,
    difficulty,
  });

  return response.data.problem;
}