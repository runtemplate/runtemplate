import Koa from 'koa'

import { serverRenderPdf } from '../src'
import data from './data'

const app = new Koa()

app.use(async ctx => serverRenderPdf({
  templateId: 'my-template-id',
  data,
  HOST: process.env.IBILL_API || 'https://runtemplate.com',
}).then(pdfStream => {
  ctx.type = 'application/pdf'
  ctx.body = pdfStream
}))

app.listen(3000, '0.0.0.0', () => console.log('koa-server running at http://localhost:3000'))
