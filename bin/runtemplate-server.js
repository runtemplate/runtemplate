import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { serverRenderPdf } from '../src'

const app = new Koa()

app.use(bodyParser())

app.use(ctx => serverRenderPdf(ctx.request.body).then(pdfStream => {
  ctx.type = 'application/pdf'
  ctx.body = pdfStream
}))

const PORT = 8899
app.listen(PORT, '0.0.0.0', () => console.log(`runtemplate-server running at http://localhost:${PORT}`))
