const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runExecutable = (
  executablePath,
  input
) => {
  return new Promise((resolve, reject) => {

    const inputFile = path.join(
      __dirname,
      "../../temp/input.txt"
    );

    fs.writeFileSync(inputFile, input);

    exec(
      `${executablePath} < ${inputFile}`,
  {
        timeout: 2000,
    },
      (error, stdout, stderr) => {
         if (error) {

    if (error.killed) {

        console.log(
            "Time Limit Exceeded"
        );

        return reject({
            type: "TIME_LIMIT_EXCEEDED",
            message:
                "Execution exceeded 2 seconds",
        });

    }

    console.log(
        "Runtime Error"
    );

    console.log(stderr);

    return reject({
        type: "RUNTIME_ERROR",
        code: error.code,
        message: stderr,
    });

}

        resolve(stdout.trim());

      }
    );

  });
};

module.exports = {
  runExecutable,
};
