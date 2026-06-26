const { exec } = require("child_process");

const runExecutable = (
  executablePath
) => {
  return new Promise((resolve, reject) => {

    exec(
      executablePath,
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
