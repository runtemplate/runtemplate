const http = require('http')

const renderBill = require('../server-offline')

const data = {
  number: 'Receipt-Number',
  timeAt: new Date(),
  items: [
    {
      type: 'Product',
      name: 'A',
      quantity: 1,
      price: 12,
    },
    {
      type: 'Product',
      name: 'B',
      quantity: 1,
      price: 1,
    },
  ],
}

const server = http.createServer((req, res) => {
  renderBill({
    templateId: 'my-template-id',
    data,
  }).then(pdf => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    // ctx.remove('X-Frame-Options')

    pdf.pipe(res)
    // ctx.body = pdf.pipe(PassThrough())
    // pdf.end()
  })
})

const hostname = '127.0.0.1'
const port = 3000
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
