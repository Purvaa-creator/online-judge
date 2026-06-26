const {
  updateSubmissionVerdict,
  getSubmissionById,
} = require("../models/submissionModel");

const {
  compileCpp,
} = require("./compilerService");

const {
  runExecutable,
} = require("./executionService");
const {
  getTestCasesByProblemId,
} = require("../models/testCaseModel");
const judgeSubmission = async (
  submissionId
) => {
  try {
    const submission =
      await getSubmissionById(submissionId);
const testCases =
  await getTestCasesByProblemId(
    submission.problem_id
  );console.log("Loaded Test Cases:");
console.log(testCases);
    console.log(
      `Judging submission ${submissionId}`
    );

    const executable =
      await compileCpp(submission.code);

    const output =
  await runExecutable(
    executable,
    testCases[0].input
  );

    console.log(
      "Program Output:",
      output
    );

    const expectedOutput =
  testCases[0].expected_output.trim();

const verdict =
  output.trim() === expectedOutput
    ? "Accepted"
    : "Wrong Answer";

await updateSubmissionVerdict(
  submissionId,
  verdict
);

console.log(
  "Expected:",
  expectedOutput
);

console.log(
  "Actual:",
  output
);

console.log(
  "Verdict:",
  verdict
);
  } catch (error) {
    console.error(error);

    await updateSubmissionVerdict(
      submissionId,
      "Compilation Error"
    );
  }
};

module.exports = {
  judgeSubmission,
};
