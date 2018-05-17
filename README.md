# ibill

![https://img.shields.io/npm/v/ibill.svg](https://img.shields.io/npm/v/ibill.svg?style=flat-square)
![state](https://img.shields.io/badge/state-alpha-green.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/ibill.svg?maxAge=2592000&style=flat-square)
![npm](https://img.shields.io/npm/l/ibill.svg?style=flat-square)

** render PDF templates that your customers can edit via [https://ibill.today server](https://ibill.today) **

## Features

* Support offline mode, in which, still can render even ibill.today server is down (template should be cached)
* Your (multi-tenancy) customers can use our self-serve editor to edit, upload image and preview template
* Support browser PDF rendering
* based on pdfmake and pdfkit


## Usage

example node.js server

```js
import http from 'http'
import { renderPdf } from 'ibill'

http.createServer((req, res) => {
  renderPdf({
    templateId: 'my-template-id',
    data,
  }).then(pdfStream => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    pdfStream.pipe(res)
  })
}).listen(8899, '0.0.0.0')
```

example koa server

```js
import Koa from 'koa'
import { renderPdf } from 'ibill'

const app = new Koa()
app.use(async ctx => {
  const pdfStream = await renderPdf({ templateId: 'my-template-id', data })
  ctx.type = 'application/pdf'
  ctx.body = pdfStream
})

app.listen(8899, '0.0.0.0')
```
