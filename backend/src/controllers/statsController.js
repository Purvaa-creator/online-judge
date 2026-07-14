const pool = require("../config/db");

const getStatsHandler = async (req, res) => {
  try {
    const totalUsersResult = await pool.query(
      "SELECT COUNT(*) FROM users"
    );
    const totalProblemsResult = await pool.query(
      "SELECT COUNT(*) FROM problems"
    );
    const totalSubmissionsResult = await pool.query(
      "SELECT COUNT(*) FROM submissions"
    );
    const acceptedSubmissionsResult = await pool.query(
      "SELECT COUNT(*) FROM submissions WHERE verdict = 'Accepted'"
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsersResult.rows[0].count, 10),
        totalProblems: parseInt(totalProblemsResult.rows[0].count, 10),
        totalSubmissions: parseInt(totalSubmissionsResult.rows[0].count, 10),
        acceptedSubmissions: parseInt(
          acceptedSubmissionsResult.rows[0].count,
          10
        ),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStatsHandler,
};