#! /usr/bin/env node
const { program } = require("commander");
const { version } = require("../package.json");
const config = require("./config");
const Server = require("../src/server");
program.version(version);
Object.values(config).forEach((val) => {
  if (val.option) {
    program.option(val.option, val.description);
  }
});

program.on("--help", () => {
  console.log("\r\nExamples:");
  Object.values(config).forEach((val) => {
    if (val.usage) {
      console.log(val.usage);
    }
  });
});
let resultConfig = {};
// 解析用户参数
program.parse(process.argv);
const parseObj = program.opts();
Object.keys(config).forEach((key) => {
  resultConfig[key] = parseObj[key] || config[key].default;
});

let server = new Server(resultConfig);
server.start();
