# runtemplate

![https://img.shields.io/npm/v/runtemplate.svg](https://img.shields.io/npm/v/runtemplate.svg?style=flat-square)
![state](https://img.shields.io/badge/state-alpha-green.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/runtemplate.svg?maxAge=2592000&style=flat-square)
![npm](https://img.shields.io/npm/l/runtemplate.svg?style=flat-square)

**Still in Development. Not Yet Complete**

render PDF templates that your customers can edit via [https://runtemplate.com server](https://runtemplate.com)

## Features

- Support offline mode, in which, still can render even runtemplate.com server is down (template should be cached)
- Your (multi-tenancy) customers can use our self-serve editor to edit, upload image and preview template
- Support browser PDF rendering
- based on pdfmake and pdfkit

## Usage

CLI server

```
npm install --global runtemplate
runtemplate
```

example node.js server

```js
import http from "http";
import { serverRenderPdf } from "runtemplate";

http
  .createServer((req, res) => {
    serverRenderPdf({
      template: "my-template-id",
      data
    }).then(pdfStream => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/pdf");
      pdfStream.pipe(res);
    });
  })
  .listen(8899, "0.0.0.0");
```

example koa server

```js
import Koa from "koa";
import { serverRenderPdf } from "runtemplate";

const app = new Koa();
app.use(async ctx => {
  const pdfStream = await renderPdf({ template: "my-template-id", data });
  ctx.type = "application/pdf";
  ctx.body = pdfStream;
});

app.listen(8899, "0.0.0.0");
```
