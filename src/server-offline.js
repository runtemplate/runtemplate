import Path from 'path'
import PdfmakePrinter from 'pdfmake'

import transform from './transform'

export { transform }

let _printers
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

export const loadTemplate = templateId => {
  // load template CACHE or from network
}

export const makePdf = (pdfDef, options) => getPrinter('zh').createPdfKitDocument(pdfDef, options)

export default ({ templateId, data }) => loadTemplate(templateId).then(template => makePdf(transform(template, data), data))
