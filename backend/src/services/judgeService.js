const {
  updateSubmissionVerdict,
} = require("../models/submissionModel");

const judgeSubmission = async (
  submissionId
) => {
  console.log(
    `Judging submission ${submissionId}`
  );

  await updateSubmissionVerdict(
    submissionId,
    "Accepted"
  );

  console.log(
    `Submission ${submissionId} accepted`
  );
};

module.exports = {
  judgeSubmission,
};
