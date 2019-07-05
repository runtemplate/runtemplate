#! /usr/bin/env node

const express = require('express')
const bodyParser = require('body-parser')
const { pdfMiddleware } = require('..')

const app = express()
app.use(bodyParser.json())

const respondJson = (func, req, res) => func(req).then(({ status, headers, type, redirect, body }) => {
  if (status) res.status(status)
  if (headers) res.set(headers)
  if (type) res.type(type)
  if (redirect) {
    return res.redirect(redirect)
  }
  if (!type || type.includes('/json')) {
    return res.json(body)
  }
  return res.send(body)
})

app.use('/pdf/:projectId/:name/:number', (req, res) => {
  const { projectId, name, number } = req.params
  const path = `/pdf/${projectId}/${name}/${number}`
  return respondJson(
    pdfMiddleware,
    {
      method: req.method,
      path,
      query: req.query,
      reqBody: req.body,
    },
    res
  )
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
