import _ from 'lodash'
import PdfmakePrinter from 'pdfmake'
import Stream from 'stream'
import rawBody from 'raw-body'

import { renderTemplate } from '../template'
import { tryCache } from '../util/fetchUtil'
import { HOST } from '../env'
import { getTemplate, getFont, fontCacheDir } from './gotCaches'

const loadFont = prop => getFont(prop.fontName, prop)

const _printers = {}
const getPrinter = prop => {
  const { source } = prop.template
  const fonts = source.fonts || _.get(source.defaults, 'fonts')
  const fontArr = _.sortBy(_.toPairs(fonts), 0)
  const fontKey = JSON.stringify(fontArr)
  return tryCache(_printers, fontKey, () => {
    const fontNames = fontArr.map(fontPair => fontPair[1])
    const promises = fontNames.map(fontName => (prop.loadFont || loadFont)({ ...prop, fontName }))
    return Promise.all(promises).then(
      () =>
        new PdfmakePrinter({
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

const makePdf = prop =>
  getPrinter(prop).then(printer => {
    const pdfKitDocument = printer.createPdfKitDocument(prop.pdfDefinition)
    const pdfStream = pdfKitDocument.pipe(Stream.PassThrough())
    pdfKitDocument.end()
    // pdfStream.pdfKitDocument = pdfKitDocument
    return rawBody(pdfStream)
  })

// required: data, fontDir
// load from web: code, auth
// load from db: loadTemplate, loadFont, HOST
export default _prop => {
  const prop = _.defaults(_.omitBy(_prop, _.isNull), {
    HOST,
    fontDir: fontCacheDir,
  })

  return (prop.loadTemplate || getTemplate)(prop.templateId, prop).then(template => {
    // console.log(JSON.stringify(template, null, '  '))
    const { data } = prop
    const { source } = template

    const pdfDefinition = renderTemplate(_.omit(source, 'header', 'footer'), data)

    // convert header and footer to function
    _.forEach(['header', 'footer'], part => {
      if (source[part]) {
        pdfDefinition[part] = (pageNumber, pageCount, pageSize) => {
          return renderTemplate(source[part], { ...data, pageNumber, pageCount, pageSize })
        }
      }
    })

    // console.log(JSON.stringify(pdfDefinition.content, null, '  '))
    return makePdf({ ...prop, pdfDefinition, template })
  })
}
