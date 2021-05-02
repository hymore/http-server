const http = require("http");
const fs = require("fs").promises;
const { createReadStream, createWriteStream, readFileSync } = require("fs");
const path = require("path");
const url = require("url");

const ejs = require("ejs");
const mime = require("mime");
const debug = require("debug")("server");
const chalk = require("chalk");
const template = readFileSync(
  path.resolve(__dirname, "./template.html"),
  "utf-8"
);
class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.host = options.host;
    this.template = template;
  }
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    pathname = decodeURIComponent(pathname);
    const filePath = path.join(this.directory, pathname);
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        this.sendFile(req, res, filePath, statObj);
      } else {
        const defaultPath = path.join(filePath, "/index.html");
        try {
          let statObj = await fs.stat(defaultPath);
          this.sendFile(req, res, defaultPath, statObj);
        } catch (e) {
          this.showList(req, res, filePath, pathname);
        }
      }
    } catch (e) {
      this.sendError(e, res);
    }
  }
  async showList(req, res, filePath, pathname) {
    let dirs = await fs.readdir(filePath);
    dirs = dirs.map((item) => {
      return {
        dir: item,
        src: path.join(pathname, item),
      };
    });
    console.log(dirs);
    const tempStr = await ejs.render(this.template, { dirs }, { async: true });
    res.setHeader("Content-Type", "text/html;;charset=utf-8;");
    res.end(tempStr);
  }
  gzip(req, res, filePath, statObj) {
    if (
      req.headers["accept-encoding"] &&
      req.headers["accept-encoding"].includes("gzip")
    ) {
      res.setHeader("content-encoding", "gzip");
      return require("zlib").createGzip();
    } else {
      return false;
    }
  }
  sendFile(req, res, filePath, statObj) {
    let contentType = mime.getType(filePath) + ";charset=utf-8;";
    res.setHeader("Content-Type", contentType);

    const gzip = this.gzip(req, res, filePath, statObj);
    if (gzip) createReadStream(filePath).pipe(gzip).pipe(res);
    else createReadStream(filePath).pipe(res);
  }
  sendError(e, res) {
    debug(e);
    res.statusCode = 404;
    res.end("Not Found");
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, this.host, () => {
      console.log(
        chalk.yellow(`starting up http-server,serving ${this.directory}`)
      );
      console.log(chalk.green(`http://${this.host}:${this.port}`));
    });
  }
}

module.exports = Server;
