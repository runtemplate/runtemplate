import Koa from 'koa'
import stream from 'stream'

import renderBill from '../src/server-offline'
import data from './data'

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello World'

  return renderBill({
    templateId: 'my-template-id',
    data,
    host: process.env.IBILL_API || 'https://ibill.today',
  }).then(pdf => {
    ctx.type = 'application/pdf'
    ctx.remove('X-Frame-Options')
    ctx.body = pdf.on('error', ctx.onerror).pipe(stream.PassThrough())
    pdf.end()
  })
})

app.listen(3000, '0.0.0.0', () => console.log('koa-server started at http://localhost:3000'))
