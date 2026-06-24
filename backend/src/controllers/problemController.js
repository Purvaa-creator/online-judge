const { createProblem } = require("../models/problemModel");

const createProblemHandler = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
    } = req.body;

    if (
      !title ||
      !description ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const problem = await createProblem(
      title,
      description,
      difficulty,
      req.user.id
    );

    res.status(201).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProblemHandler,
};

