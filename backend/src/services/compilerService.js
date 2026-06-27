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

    const projectRoot = path.join(
  __dirname,
  "../.."
);

exec(
  `docker run --rm -v ${projectRoot}/temp:/code gcc:13 g++ /code/main.cpp -o /code/main`,
  (error, stdout, stderr) => {
        if (error) {

    console.log(
        "Compilation Failed"
    );

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

