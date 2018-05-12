const http = require('http')

const renderBill = require('../server-offline').default
const data = require('./data').default

const server = http.createServer((req, res) => {
  renderBill({
    templateId: 'my-template-id',
    data,
    host: process.env.IBILL_API || 'https://ibill.today',
  }).then(pdfStream => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    pdfStream.pipe(res)
  })
})

const hostname = '127.0.0.1'
const port = 3000
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
