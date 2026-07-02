const languages = {
  cpp: {
    extension: "cpp",
    image: "gcc:13",
    compile: "g++ /code/main.cpp -o /code/main",
    run: "/code/main",
  },
};

module.exports = languages;
