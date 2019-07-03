#! /usr/bin/env node

const express = require('express')
const bodyParser = require('body-parser')
const { pdfMiddleware } = require('..')

const app = express()
app.use(bodyParser.json())

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

if (!module.parent) {
  // listen to HOST and PORT
  const PORT = 8899
  const HOST = '0.0.0.0'
  app.listen(PORT, HOST, () => {
    console.log(`runtemplate server: http://${HOST}:${PORT}`)
  })
}

module.exports = app
