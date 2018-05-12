import Koa from 'koa'

import renderBill from '../src/server-offline'
import data from './data'

const app = new Koa()

app.use(async ctx =>
  renderBill({
    templateId: 'my-template-id',
    data,
    host: process.env.IBILL_API || 'https://ibill.today',
  }).then(pdfStream => {
    ctx.type = 'application/pdf'
    ctx.body = pdfStream
  }))

app.listen(3000, '0.0.0.0', () => console.log('koa-server running at http://localhost:3000'))
