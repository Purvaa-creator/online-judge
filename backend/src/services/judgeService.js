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

    let verdict = "Accepted";

for (const testCase of testCases) {

  const output =
    await runExecutable(
      executable,
      testCase.input
    );

  const expectedOutput =
    testCase.expected_output.trim();

  console.log(
    `Running Test Case ${testCase.id}`
  );

  console.log(
    "Input:",
    testCase.input
  );

  console.log(
    "Expected:",
    expectedOutput
  );

  console.log(
    "Actual:",
    output
  );

  if (
    output.trim() !== expectedOutput
  ) {
    verdict = "Wrong Answer";
    break;
  }
}

await updateSubmissionVerdict(
  submissionId,
  verdict
);

console.log(
  "Final Verdict:",
  verdict
);  } catch (error) {

  console.error(error);
console.log(
  "Judge Error Type:",
  error.type
);
  let verdict = "Compilation Error";

  if (
    error.type === "RUNTIME_ERROR"
  ) {
    verdict = "Runtime Error";
  }

  else if (
    error.type ===
    "TIME_LIMIT_EXCEEDED"
  ) {
    verdict =
      "Time Limit Exceeded";
  }

  await updateSubmissionVerdict(
    submissionId,
    verdict
  );
}
};

module.exports = {
  judgeSubmission,
};
