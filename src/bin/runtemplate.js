#! /usr/bin/env node

const express = require('express')
const bodyParser = require('body-parser')
const { pdfMiddleware } = require('..')

const app = express()
app.use(bodyParser.json())

const respondJson = (func, req, res) => func(req).then(retData => {
  if (retData.status) res.status(retData.status)
  if (retData.headers) res.set(retData.headers)
  if (retData.type) res.type(retData.type)
  if (retData.redirect) {
    return res.redirect(retData.redirect)
  }
  return res.json(retData.body)
})

app.use('/pdf/:projectId/:name/:number', (req, res) => respondJson(
  pdfMiddleware,
  {
    method: req.method,
    path: req.path,
    query: req.query,
    reqBody: req.body,
  },
  res
))

if (!module.parent) {
  // listen to HOST and PORT
  const PORT = 8899
  const HOST = '0.0.0.0'
  app.listen(PORT, HOST, () => {
    console.log(`runtemplate server: http://${HOST}:${PORT}`)
  })
}

module.exports = app
