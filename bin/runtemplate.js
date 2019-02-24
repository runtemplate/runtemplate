#! /usr/bin/env node

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { pdfMiddleware } = require('..')

const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {
  const {
    method,
    path,
    query,
    request: { body: reqBody },
  } = ctx

  const ret = await pdfMiddleware({
    method,
    path,
    query,
    reqBody,
  })
  Object.assign(ctx, ret)
})

// listen to HOST and PORT
const PORT = 8899
const HOST = '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`runtemplate server: http://${HOST}:${PORT}`)
})
