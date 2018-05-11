import Path from 'path'
import PdfmakePrinter from 'pdfmake'
import Cacheman from 'cacheman'
import CachemanFile from 'cacheman-file'

import { compile, render, extend } from './template'
import { fetchTemplate } from './fetcher'

export { compile, render, extend, fetchTemplate }

const _caches = new Cacheman({
  engine: new CachemanFile({ tmpDir: `${__dirname}/../.cache` }),
})
// load template network or failback to CACHE
// TODO API-KEY
export const loadTemplate = (templateId, option) =>
  fetchTemplate(templateId, option)
    .then(template => _caches.set(templateId, template))
    .catch(err => _caches.get(templateId).then(oldCached => oldCached || Promise.reject(err)))
    .then(template => template && compile(template))

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
    console.log('render', template)
    const pdfDef = render(template, data)
    return makePdf(pdfDef)
  })
