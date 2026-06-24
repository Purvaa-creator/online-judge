const {
  createSubmission,
} = require("../models/submissionModel");

const createSubmissionHandler = async (
  req,
  res
) => {
  try {
    const {
      problemId,
      language,
      code,
    } = req.body;

    if (
      !problemId ||
      !language ||
      !code
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const submission =
      await createSubmission(
        req.user.id,
        problemId,
        language,
        code
      );

    res.status(201).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubmissionHandler,
};
