import _ from 'lodash'
import PdfmakePrinter from 'pdfmake'
import Stream from 'stream'

import { render } from '../template'
import { tryCache } from '../util'
import cacheFetch, { cacheDir } from './serverFetch'
import { HOST } from '../env'

const _printers = {}
const getPrinter = prop => {
  const { fonts } = prop.template.extended
  const fontArr = _.sortBy(_.toPairs(fonts), 0)
  const fontKey = JSON.stringify(fontArr)
  return tryCache(_printers, fontKey, () => {
    const fontNames = fontArr.map(fontPair => fontPair[1])
    const promises = fontNames.map(fontName => prop.loadFont({ ...prop, fontName }))
    return Promise.all(promises).then(
      () => new PdfmakePrinter({
        Roboto: {
          normal: `${prop.fontDir}/${fonts.normal}`,
          bold: `${prop.fontDir}/${fonts.bold}`,
          italics: `${prop.fontDir}/${fonts.italics}`,
          bolditalics: `${prop.fontDir}/${fonts.boldItalics}`,
        },
      })
    )
  })
}

const makePdf = prop => getPrinter(prop).then(printer => {
  const pdfKitDocument = printer.createPdfKitDocument(prop.pdfDefinition)
  const pdfStream = pdfKitDocument.pipe(Stream.PassThrough())
  pdfKitDocument.end()
  pdfStream.pdfKitDocument = pdfKitDocument
  return pdfStream
})

// required: data, fontDir
// load from web: code, auth
// load from db: loadTemplate, loadFont,
const _renderPdf = prop => prop.loadTemplate(prop).then(template => {
  const pdfDefinition = render(prop.data, template.extended)
  // console.log(JSON.stringify(pdfDefinition.content, null, '  '))
  return makePdf({ ...prop, pdfDefinition, template })
})

const loadTemplate = prop => cacheFetch(`${prop.HOST}/api/template/${prop.template || prop.code}?auth=${prop.auth}`, prop)

const loadFont = prop => cacheFetch(`${prop.HOST}/font/${prop.fontName}?auth=${prop.auth}`, prop)

const defaultProp = {
  loadTemplate,
  loadFont,
  HOST,
  fontDir: cacheDir,
}

export default _prop => _renderPdf({ ...defaultProp, ..._prop })
