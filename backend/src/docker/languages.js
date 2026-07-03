const languages = {
  cpp: {
    extension: "cpp",
    compiled: true,
    compileImage: "gcc:13",
    runImage: "ubuntu:latest",
    compile: "g++ /code/main.cpp -o /code/main",
    run: "/code/main",
  },

  c: {
    extension: "c",
    compiled: true,
    compileImage: "gcc:13",
    runImage: "ubuntu:latest",
    compile: "gcc /code/main.c -o /code/main",
    run: "/code/main",
  },

  python: {
    extension: "py",
    compiled: false,
    compileImage: null,
    runImage: "python:3.12",
    compile: null,
    run: "python3 /code/main.py",
  },

  java: {
  extension: "java",
  compiled: true,

  compileImage: "eclipse-temurin:21",
  runImage: "eclipse-temurin:21",

  compile: "javac /code/Main.java",
  run: "java -cp /code Main",
},
};

module.exports = languages;
