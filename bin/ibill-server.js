import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { renderPdf } from '../src/server'

const app = new Koa()

app.use(bodyParser())

app.use(ctx =>
  renderPdf(ctx.request.body).then(pdfStream => {
    ctx.type = 'application/pdf'
    ctx.body = pdfStream
  })
)

const PORT = 8899
app.listen(PORT, '0.0.0.0', () => console.log(`ibill-server running at http://localhost:${PORT}`))
