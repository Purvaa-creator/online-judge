const {
  updateSubmissionVerdict,
  getSubmissionById,updateSubmissionMetrics,
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

console.log("Submission language:");
console.log(submission.language);

console.log("Available languages:");
console.log(Object.keys(languages));   

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
let executionTime = 0;
for (const testCase of testCases) {

  const result =
  await runExecutable(
    executable,
    testCase.input,
    submission.language
  );
 executionTime = result.executionTime;
const output = result.output;
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
await updateSubmissionMetrics(
  submissionId,
    executionTime,
  0
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
