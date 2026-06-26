const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const compileCpp = (code) => {
  return new Promise((resolve, reject) => {

    const cppFile = path.join(
      __dirname,
      "../../temp/main.cpp"
    );

    const executable = path.join(
      __dirname,
      "../../temp/main"
    );

    fs.writeFileSync(cppFile, code);

    exec(
      `g++ ${cppFile} -o ${executable}`,
      (error, stdout, stderr) => {

        if (error) {
          return reject(stderr);
        }

        resolve(executable);

      }
    );

  });
};

module.exports = {
  compileCpp,
};

