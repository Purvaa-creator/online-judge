const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis();

const submissionQueue = new Queue(
  "submissionQueue",
  {
    connection,
  }
);

module.exports = submissionQueue;
