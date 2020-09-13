const config = require("./config");
const Koa = require("koa");
const KoaRouter = require("koa-router");
const static = require("koa-static");
const path = require("path");
const koaBody = require("koa-body");
const fs = require("fs");
const mime = require("mime");
const cors = require("@koa/cors");

const router = new KoaRouter();
const app = new Koa();

app.use(static(path.join(__dirname, "./static")));
app.use(cors());
app.use(koaBody({ multipart: true }));

router.get("/api/test", (ctx) => {
  ctx.body = "ok";
});

router.post("/api/upload", (ctx) => {
  try {
    const file = ctx.request.files.file;
    if (!file || file.name.trim() === "" || file.size === 0) {
      throw new Error("没有选择上传的文件");
    }
    if (file.size > config.maxFileSize) {
      throw new Error("文件过大");
    }
    let fileName = file.name;
    if (ctx.request.body.fileName.trim() !== "") {
      fileName = ctx.request.body.fileName.trim();
      file.name = fileName;
    }
    const readeStream = fs.createReadStream(file.path);
    const filePath = path.join(__dirname, `./upload/${file.name}`);
    const writeStream = fs.createWriteStream(filePath);
    readeStream.pipe(writeStream);
    ctx.body = {
      success: true,
      data: {
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
      msg: "",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      data: {},
      msg: error.message,
    };
  }
});

router.get("/upload/*", (ctx) => {
  try {
    const fileName = decodeURI(ctx.url.split("/")[2]);
    const filePath = path.join(__dirname, `./upload/${fileName}`);
    const file = fs.readFileSync(filePath);
    const contentType = mime.getType(filePath);
    console.log("contentType: ", contentType);
    ctx.res.setHeader("Content-Type", contentType);
    ctx.body = file;
  } catch (error) {
    console.log(error.message);
    ctx.res.statusCode = 404;
    ctx.body = "Not Found";
  }
});

app.use(router.routes());

app.listen(config.port);
console.log(`serve running on http://localhost:${config.port}`);
