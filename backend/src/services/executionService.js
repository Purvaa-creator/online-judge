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
      (error, stdout, stderr) => {

        if (error) {
          return reject(stderr);
        }

        resolve(stdout.trim());

      }
    );

  });
};

module.exports = {
  runExecutable,
};
