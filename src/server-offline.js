import Path from 'path'
import PdfmakePrinter from 'pdfmake'
import Cacheman from 'cacheman'
import CachemanFile from 'cacheman-file'

import { compile, render, extend } from './template'
import { fetchTemplate } from './fetcher'

export { compile, render, extend }

const _caches = new Cacheman({
  engine: new CachemanFile({ tmpDir: `${__dirname}/../.cache` }),
})
// load template network or failback to CACHE
// TODO API-KEY
export const loadTemplate = (templateId, option) =>
  fetchTemplate(templateId, option)
    .then(template => _caches.set(templateId, template))
    .catch(() => _caches.get(templateId))

const _printers = {}
const getPrinter = locale => {
  let p = _printers[locale]
  if (!p) {
    p = _printers[locale] = new PdfmakePrinter({
      Roboto: {
        normal: Path.join(__dirname, 'fonts/chinese.msyh.ttf'),
        bold: Path.join(__dirname, 'fonts/chinese.msyh.ttf'),
        italics: Path.join(__dirname, 'fonts/chinese.msyh.ttf'),
        bolditalics: Path.join(__dirname, 'fonts/chinese.msyh.ttf'),
      },
    })
  }
  return p
}

export const makePdf = (pdfDef, options) => getPrinter('zh').createPdfKitDocument(pdfDef, options)

export default ({ templateId, data }) =>
  loadTemplate(templateId).then(template => {
    const pdfDef = render(template, data)
    return makePdf(pdfDef)
  })
