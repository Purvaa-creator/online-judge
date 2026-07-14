import apiClient from "./apiClient.js";

export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
}

export async function register(username, email, password) {
  const response = await apiClient.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data.user;
}

export async function logout() {
  localStorage.removeItem("token");
}
