const pool = require("../config/db");

const createTestCase = async (
  problemId,
  input,
  expectedOutput,
  isSample
) => {
  const query = `
    INSERT INTO test_cases
    (problem_id, input, expected_output, is_sample)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    problemId,
    input,
    expectedOutput,
    isSample,
  ]);

  return result.rows[0];
};
const getTestCasesByProblemId = async (
  problemId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM test_cases
    WHERE problem_id = $1
    ORDER BY id;
    `,
    [problemId]
  );

  return result.rows;
};
module.exports = {
  createTestCase, getTestCasesByProblemId,
};
