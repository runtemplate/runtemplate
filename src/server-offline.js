import Path from 'path'
import PdfmakePrinter from 'pdfmake'
import flatCache from 'flat-cache'

import { compile, render, extend } from './template'
import { fetchTemplate } from './fetcher'

export { compile, render, extend }

const _caches = flatCache.load('template-caches', `${__dirname}/../.cache`)
export const loadTemplate = templateId => {
  // load template CACHE or from network
  const cache = _caches.getKey(templateId)
  if (cache) return cache

  // TODO API-KEY and options?
  return fetchTemplate(templateId).then(template => {
    _caches.setKey(templateId, template)
    _caches.save(true)
    return template
  })
}

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
