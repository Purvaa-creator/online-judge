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

module.exports = {
  createSubmission,
};
