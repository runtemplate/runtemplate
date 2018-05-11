const Koa = require('koa')
const stream = require('stream')

const { default: renderBill } = require('../server-offline')

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

const app = new Koa()
app.use(async ctx => {
  ctx.body = 'Hello World'

  return renderBill({
    templateId: 'my-template-id',
    data,
  }).then(pdf => {
    ctx.type = 'application/pdf'
    ctx.remove('X-Frame-Options')

    ctx.body = pdf.on('error', ctx.onerror).pipe(stream.PassThrough())
    pdf.end()
  })
})
app.listen(3000, '0.0.0.0')
