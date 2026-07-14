import apiClient from "./apiClient.js";

export async function executeCode(language, code, input) {
  const response = await apiClient.post("/execute", {
    language,
    code,
    input,
  });

  return response.data;
}