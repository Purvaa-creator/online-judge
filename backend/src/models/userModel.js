const pool = require("../config/db");

const createUser = async (username, email, passwordHash) => {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email;
  `;

  const result = await pool.query(query, [
    username,
    email,
    passwordHash,
  ]);

  return result.rows[0];
};

module.exports = {
  createUser,
};
