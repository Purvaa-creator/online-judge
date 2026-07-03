const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const languages = require("../docker/languages");

const compileCode = (
  code,
  language = "cpp"
) => {
  return new Promise((resolve, reject) => {

    const config = languages[language];

    const fileName =
  language === "java"
    ? "Main.java"
    : `main.${config.extension}`;

const sourceFile = path.join(
  __dirname,
  "../../temp",
  fileName
);

    const executable = path.join(
      __dirname,
      "../../temp/main"
    );

    fs.writeFileSync(sourceFile, code);

    // Python doesn't need compilation
    if (!config.compiled) {
      return resolve(executable);
    }

    const projectRoot = path.join(
      __dirname,
      "../.."
    );

    exec(
      `docker run --rm -v ${projectRoot}/temp:/code ${config.compileImage} ${config.compile}`,
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
  compileCode,
};
