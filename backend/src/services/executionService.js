const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const languages = require("../docker/languages");
const projectRoot = path.join(
  __dirname,
  "../.."
);

const runExecutable = (
  executablePath,
  input,language = "cpp",
) => {
  return new Promise((resolve, reject) => {

    const inputFile = path.join(
      __dirname,
      "../../temp/input.txt"
    );

    fs.writeFileSync(inputFile, input);

   const config = languages[language];

const dockerCommand =
  `docker run --rm \
--network=none \
--memory=128m \
-v ${projectRoot}/temp:/code \
${config.runImage} \
bash -c "${config.run} < /code/input.txt"`;

    

    exec(
      dockerCommand,
      {
        timeout: 2000,
      },
      (error, stdout, stderr) => {

        if (error) {

    // Time Limit
    if (error.killed) {

        console.log("Time Limit Exceeded");

        return reject({
            type: "TIME_LIMIT_EXCEEDED",
            message:
                "Execution exceeded 2 seconds",
        });

    }

    // Memory Limit
    // Memory Limit
if (
    error.code === 137 ||
    stderr.includes("Killed")
) {

    console.log("Memory Limit Exceeded");

    return reject({
        type: "MEMORY_LIMIT_EXCEEDED",
        message: stderr,
    });

}

    console.log("Runtime Error");

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
