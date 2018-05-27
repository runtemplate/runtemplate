import _ from 'lodash'
import PdfmakePrinter from 'pdfmake'
import Stream from 'stream'

import { render, extend } from './template'
import { tryCache } from './common'
import cacheFetch, { cacheDir } from './serverFetch'
import { HOST } from './env'

export { render, extend, cacheFetch }

// const debug = obj => {
//   console.log(obj)
//   return obj
// }

const _printers = {}
const getPrinter = prop => {
  const { fonts } = prop.template.extended
  const fontArr = _.sortBy(_.toPairs(fonts), 0)
  const fontKey = JSON.stringify(fontArr)
  return tryCache(_printers, fontKey, () => {
    const fontNames = fontArr.map(fontPair => fontPair[1])
    const promises = fontNames.map(fontName => prop.loadFont({ ...prop, fontName }))
    return Promise.all(promises).then(() =>
      new PdfmakePrinter({
        Roboto: {
          normal: `${prop.fontDir}/${fonts.normal}`,
          bold: `${prop.fontDir}/${fonts.bold}`,
          italics: `${prop.fontDir}/${fonts.italics}`,
          bolditalics: `${prop.fontDir}/${fonts.boldItalics}`,
        },
      }))
  })
}

export const makePdf = prop =>
  getPrinter(prop).then(printer => {
    const pdfKitDocument = printer.createPdfKitDocument(prop.pdfDefinition)
    const pdfStream = pdfKitDocument.pipe(Stream.PassThrough())
    pdfKitDocument.end()
    pdfStream.pdfKitDocument = pdfKitDocument
    return pdfStream
  })

const _renderPdf = prop =>
  prop.loadTemplate(prop).then(template => {
    const pdfDefinition = render(template.extended, prop.data)
    return makePdf({ ...prop, pdfDefinition, template })
  })

export const loadTemplate = prop => cacheFetch(`${prop.HOST}/api/template/${prop.templateId}`, prop)

export const loadFont = prop => cacheFetch(`${prop.HOST}/font/${prop.fontName}`, prop)

const defaultProp = {
  loadTemplate,
  loadFont,
  HOST,
  fontDir: cacheDir,
}

// prop = { templateId, data, loadTemplate, loadFont }
export const renderPdf = _prop => _renderPdf({ ...defaultProp, ..._prop })
