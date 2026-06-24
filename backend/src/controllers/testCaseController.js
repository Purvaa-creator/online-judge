const {
  createTestCase,
} = require("../models/testCaseModel");

const createTestCaseHandler = async (
  req,
  res
) => {
  try {
    const {
      input,
      expectedOutput,
      isSample,
    } = req.body;

    const testCase =
      await createTestCase(
        req.params.id,
        input,
        expectedOutput,
        isSample || false
      );

    res.status(201).json({
      success: true,
      testCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTestCaseHandler,
};
