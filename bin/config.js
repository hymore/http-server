const config = {
  port: {
    option: "-p,--port <val>",
    description: "set your server port",
    usage: "http-server-hymore --port 8889",
    default: 3000,
  },
  directory: {
    option: "-d,--directory <val>",
    description: "set your start directory",
    usage: "http-server-hymore --directory D",
    default: process.cwd(),
  },
  host: {
    option: "-h,--host <val>",
    description: "set your server hostname",
    usage: "http-server-hymore --host 127.0.0.1",
    default: "localhost",
  },
};
module.exports = config;
