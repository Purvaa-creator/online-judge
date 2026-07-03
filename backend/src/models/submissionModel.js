const pool = require("../config/db");

const createSubmission = async (
  userId,
  problemId,
  language,
  code
) => {
  const query = `
    INSERT INTO submissions
    (user_id, problem_id, language, code)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    userId,
    problemId,
    language,
    code,
  ]);

  return result.rows[0];
};
const getAllSubmissions = async () => {
  const result = await pool.query(
    "SELECT * FROM submissions ORDER BY id DESC"
  );

  return result.rows;
};
const getSubmissionById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM submissions WHERE id = $1",
    [id]
  );

  return result.rows[0];
};
const updateSubmissionVerdict = async (
  id,
  verdict
) => {
  const result = await pool.query(
    `
    UPDATE submissions
    SET verdict = $1
    WHERE id = $2
    RETURNING *;
    `,
    [verdict, id]
  );

  return result.rows[0];
};
const updateSubmissionMetrics = async (
  id,
  executionTime,
  memoryUsed
) => {
  const result = await pool.query(
    `
    UPDATE submissions
    SET
      execution_time_ms = $1,
      memory_used_kb = $2
    WHERE id = $3
    RETURNING *;
    `,
    [executionTime, memoryUsed, id]
  );

  return result.rows[0];
};
module.exports = {
  createSubmission, getAllSubmissions, getSubmissionById, updateSubmissionVerdict, updateSubmissionMetrics,
};
