const {
  updateSubmissionVerdict,
  getSubmissionById,
} = require("../models/submissionModel");

const {
  compileCode,
} = require("./compilerService");
const languages = require("../docker/languages");
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

   

const config =
  languages[submission.language];

let executable = null;

if (config.compile) {

  executable =
    await compileCode(
      submission.code,
      submission.language
    );

}

    let verdict = "Accepted";

for (const testCase of testCases) {

  const output =
  await runExecutable(
    submission.language === "python"
      ? submission.code
      : executable,
    testCase.input,
    submission.language
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
    error.type ===
    "TIME_LIMIT_EXCEEDED"
  ) {
    verdict =
      "Time Limit Exceeded";
  }
else if (
    error.type ===
    "MEMORY_LIMIT_EXCEEDED"
) {
    verdict =
      "Memory Limit Exceeded";
}
else if (
    error.type === "RUNTIME_ERROR"
) {
    verdict = "Runtime Error";
}
else if (
    error.type === "COMPILATION_ERROR"
) {
    verdict = "Compilation Error";
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
