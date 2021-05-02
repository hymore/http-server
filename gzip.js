const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
zlib.gzip(
  fs.readFileSync(path.resolve(__dirname, "./package-lock.json"), "utf-8"),
  (err, data) => {
    console.log(data);
  }
);
