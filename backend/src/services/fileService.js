const fs = require("fs");
const path = require("path");
const languages = require("../docker/languages");

const writeSourceFile = (code, language) => {
  const config = languages[language];

  const sourceFile = path.join(
    __dirname,
    `../../temp/main.${config.extension}`
  );

  fs.writeFileSync(sourceFile, code);

  return sourceFile;
};

module.exports = {
  writeSourceFile,
};
