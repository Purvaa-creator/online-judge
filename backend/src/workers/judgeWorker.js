require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const {
  judgeSubmission,
} = require("../services/judgeService");

const connection = new IORedis({
  maxRetriesPerRequest: null,
});
const worker = new Worker(
  "submissionQueue",
  async (job) => {

    console.log(
      `Processing Submission ${job.data.submissionId}`
    );

    await judgeSubmission(
      job.data.submissionId
    );

  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(
    `Submission ${job.data.submissionId} completed`
  );
});

worker.on("failed", (job, err) => {
  console.log(
    `Submission ${job.data.submissionId} failed`
  );

  console.error(err);
});
