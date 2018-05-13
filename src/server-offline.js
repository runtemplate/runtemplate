import _ from 'lodash'
import Path from 'path'
import PdfmakePrinter from 'pdfmake'
import Stream from 'stream'
import Cacheman from 'cacheman'
import CachemanFile from 'cacheman-file'

import { compile, render, extend } from './template'
import { fetchTemplate, fetchFont } from './fetcher'

export { compile, render, extend, fetchTemplate, fetchFont }

const debug = obj => {
  console.log(obj)
  return obj
}

const tryCache = (cache, key, func) => {
  const c = cache[key]
  if (c) return c
  return (cache[key] = func()) // eslint-disable-line
}

// server-cache
const cacheDir = Path.join(__dirname, '../.cache')
const getKey = key => (typeof key === 'string' ? key.replace(/^cacheman:cache:/, '') : key)
class MyCachemanFile extends CachemanFile {
  get(key, ...args) {
    return super.get(getKey(key), ...args)
  }
  set(key, ...args) {
    return super.set(getKey(key), ...args)
  }
  del(key, ...args) {
    return super.del(getKey(key), ...args)
  }
  clear(key, ...args) {
    return super.clear(getKey(key), ...args)
  }
}
const _caches = new Cacheman({ engine: new MyCachemanFile({ tmpDir: cacheDir }) })
const networkPromises = {}
const networkFirstCache = (func, cacheKey, ...args) =>
  tryCache(networkPromises, cacheKey, () =>
    func(cacheKey, ...args)
      .then(template => _caches.set(cacheKey, template))
      .catch(err => _caches.get(cacheKey).then(oldCached => oldCached || Promise.reject(err))))

export const loadTemplate = prop =>
  networkFirstCache(fetchTemplate, prop.templateId, prop).then(template => {
    template.extended = compile(template.extended)
    return template
  })

export const loadFont = prop => networkFirstCache(fetchFont, prop.fontName, prop)

const defaultProp = {
  loadTemplate,
  loadFont,
}

const _printers = {}
const getPrinter = prop => {
  const { fonts } = prop.template.extended
  const fontArr = _.sortBy(_.toPairs(fonts), 0)
  const fontKey = JSON.stringify(fontArr)

  return tryCache(_printers, fontKey, () => {
    const fontNames = fontArr.map(fontPair => fontPair[1])
    const promises = fontNames.map(fontName => loadFont({ ...prop, fontName }))
    return Promise.all(promises).then(fontBase64s => {
      const vfs = fontBase64s.reduce((ret, fontBase64, i) => {
        ret[fontNames[i]] = fontBase64
        return ret
      }, {})
      // console.log('>>>', vfs)
      return new PdfmakePrinter({
        vfs,
        Roboto: fonts |> debug,
        // Roboto: _.mapValues(fonts, fontName => `${cacheDir}/${fontName}`) |> debug,
        // Roboto: {
        //   normal: `${rootDir}/fonts/chinese.msyh.ttf`,
        //   bold: `${rootDir}/fonts/chinese.msyh.ttf`,
        //   italics: `${rootDir}/fonts/chinese.msyh.ttf`,
        //   bolditalics: `${rootDir}/fonts/chinese.msyh.ttf`,
        // },
      })
    })
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

// prop = { templateId, data, loadTemplate, loadFont }
export default _prop => {
  const prop = { ...defaultProp, ..._prop }
  return prop.loadTemplate(prop).then(template => {
    const pdfDefinition = render(template.extended, prop.data)
    return makePdf({ ...prop, pdfDefinition, template })
  })
}
