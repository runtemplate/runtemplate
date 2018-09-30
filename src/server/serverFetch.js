import Path from 'path'
import Url from 'url'
import fse from 'fs-extra'
import appRootPath from 'app-root-path'

import { parse } from '../util/FuncJson'
import { fetchJson, tryCache } from '../util'

export const cacheDir = appRootPath.resolve('.cache')

let memoryPromises = {}

const outputStream = (cacheFilepath, stream) => new Promise(resolve => {
  fse.ensureDir(cacheDir).then(() => {
    stream.pipe(fse.createWriteStream(cacheFilepath)).on('finish', resolve)
  })
})

const serverFetch = (url, option, postProcessor) => tryCache(memoryPromises, url, () => {
  const urlObj = new Url.URL(url)
  const cacheFilepath = Path.join(cacheDir, Path.basename(urlObj.pathname))
  // api json return should have no extension, font file should have extension
  const ext = Path.extname(urlObj.pathname)
  const isJsonFile = !ext || ext === '.json'
  // console.log('> serverFetch', url, cacheFilepath)
  let memoryP = fetchJson(url, option)
    .then(async res => {
      if (isJsonFile) {
        // console.log('> serverFetch then', isJsonFile, res)
        // json template
        await fse.outputFile(cacheFilepath, res)
        return parse(res)
      }
      // stream font
      await outputStream(cacheFilepath, res.body)
      return true
    })
    .catch(err => {
      if (isJsonFile) {
        // json template
        return fse.readFile(cacheFilepath, 'utf8').then(cache => (cache ? parse(cache) : Promise.reject(err)))
      }
      // stream font
      return fse.exists(cacheFilepath).then(cache => cache || Promise.reject(err))
    })
  if (postProcessor) {
    memoryP = memoryP.then(postProcessor)
  }
  return memoryP
})

export const clearMemory = () => {
  memoryPromises = {}
}

export default serverFetch
