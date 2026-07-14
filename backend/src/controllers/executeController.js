const { executeCode } = require("../services/executeService");

const executeHandler = async (req, res) => {
  try {
    const {
      language,
      code,
      input = "",
    } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const result = await executeCode(code, language, input);

    return res.status(200).json({
      success: true,
      output: result.output,
      executionTime: result.executionTime,
    });
  } catch (error) {
    if (
      error.type === "TIME_LIMIT_EXCEEDED" ||
      error.type === "MEMORY_LIMIT_EXCEEDED" ||
      error.type === "RUNTIME_ERROR" ||
      error.type === "COMPILATION_ERROR"
    ) {
      return res.status(400).json({
        success: false,
        type: error.type,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  executeHandler,
};