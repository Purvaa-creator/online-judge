const pool = require("../config/db");

const createProblem = async (
  title,
  description,
  difficulty,
  createdBy
) => {
  const query = `
    INSERT INTO problems
    (title, description, difficulty, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    title,
    description,
    difficulty,
    createdBy,
  ]);

  return result.rows[0];
};

const getAllProblems = async () => {
  const result = await pool.query(
    "SELECT * FROM problems ORDER BY id DESC"
  );

  return result.rows;
};
const getProblemById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM problems WHERE id = $1",
    [id]
  );

  return result.rows[0];
};
const updateProblem = async (
  id,
  title,
  description,
  difficulty
) => {
  const result = await pool.query(
    "UPDATE problems SET title = $1, description = $2, difficulty = $3 WHERE id = $4 RETURNING *",
    [title, description, difficulty, id]
  );

  return result.rows[0];
};
const deleteProblem = async (id) => {
  const result = await pool.query(
    "DELETE FROM problems WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};
module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};


