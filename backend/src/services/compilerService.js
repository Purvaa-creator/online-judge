const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const languages = require("../docker/languages");

const compileCpp = (
  code,
  language = "cpp"
) => {
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

    const projectRoot = path.join(
      __dirname,
      "../.."
    );

    const config = languages[language];

    exec(
      `docker run --rm -v ${projectRoot}/temp:/code ${config.image} ${config.compile}`,
      (error, stdout, stderr) => {

        if (error) {

          console.log("Compilation Failed");
          console.log(stderr);

          return reject({
            type: "COMPILATION_ERROR",
            message: stderr,
          });

        }

        resolve(executable);

      }
    );

  });
};

module.exports = {
  compileCpp,
};
