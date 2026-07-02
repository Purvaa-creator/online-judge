const languages = {
  cpp: {
    extension: "cpp",
    compileImage: "gcc:13",
    runImage: "ubuntu:latest",
    compile: "g++ /code/main.cpp -o /code/main",
    run: "/code/main",
  },

  c: {
    extension: "c",
    compileImage: "gcc:13",
    runImage: "ubuntu:latest",
    compile: "gcc /code/main.c -o /code/main",
    run: "/code/main",
  },

  python: {
    extension: "py",
    compileImage: null,
    runImage: "python:3.12",
    compile: null,
    run: "python3 /code/main.py",
  },
};

module.exports = languages;
