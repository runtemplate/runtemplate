import Path from 'path'
import PdfmakePrinter from 'pdfmake'
import Stream from 'stream'
import Cacheman from 'cacheman'
import CachemanFile from 'cacheman-file'

import { compile, render, extend } from './template'
import { fetchTemplate } from './fetcher'

export { compile, render, extend, fetchTemplate }

const rootDir = Path.join(__dirname, '..')

const _caches = new Cacheman({
  engine: new CachemanFile({ tmpDir: `${rootDir}/.cache` }),
})
// load template network or failback to CACHE
// TODO API-KEY
export const loadTemplate = (templateId, option) =>
  fetchTemplate(templateId, option)
    .then(template => _caches.set(templateId, template))
    .catch(err => _caches.get(templateId).then(oldCached => oldCached || Promise.reject(err)))
    .then(template => {
      if (template) {
        // console.log('loadTemplate', template)
        template.extended = compile(template.extended)
      }
      return template
    })

const _printers = {}
const getPrinter = locale => {
  let p = _printers[locale]
  if (!p) {
    p = _printers[locale] = new PdfmakePrinter({
      Roboto: {
        normal: `${rootDir}/fonts/chinese.msyh.ttf`,
        bold: `${rootDir}/fonts/chinese.msyh.ttf`,
        italics: `${rootDir}/fonts/chinese.msyh.ttf`,
        bolditalics: `${rootDir}/fonts/chinese.msyh.ttf`,
      },
    })
  }
  return p
}

export const makePdf = (pdfDef, options) => {
  const pdfKitDocument = getPrinter('zh').createPdfKitDocument(pdfDef, options)
  const pdfStream = pdfKitDocument.pipe(Stream.PassThrough())
  pdfKitDocument.end()
  pdfStream.pdfKitDocument = pdfKitDocument
  return pdfStream
}

export default ({ templateId, data, ...option }) =>
  loadTemplate(templateId, option).then(template => {
    const pdfDef = render(template.extended, data)
    // console.log('render', Object.keys(template))
    return makePdf(pdfDef)
  })
