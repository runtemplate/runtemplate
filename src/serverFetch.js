import Path from 'path'
import fse from 'fs-extra'
import JSONfn from './json-fn'

import { fetchJson, tryCache } from './common'

export const cacheDir = Path.join(__dirname, '../.cache')

let memoryPromises = {}

const outputStream = (cacheFilepath, stream) => new Promise(resolve => {
  fse.ensureDir(cacheDir).then(() => {
    stream.pipe(fse.createWriteStream(cacheFilepath)).on('finish', resolve)
  })
})

const serverFetch = (url, option, postProcessor) => tryCache(memoryPromises, url, () => {
  const cacheFilepath = Path.join(cacheDir, Path.basename(url))
  // api json return should have no extension, font file should have extension
  const isJsonFile = !Path.extname(url)
  // console.log('> serverFetch', url)
  let memoryP = fetchJson(url, option)
    .then(async res => {
      if (isJsonFile) {
        // console.log('> serverFetch then', isJsonFile, res)
        // json template
        await fse.outputFile(cacheFilepath, res)
        return JSONfn.parse(res)
      }
      // stream font
      await outputStream(cacheFilepath, res.body)
      return true
    })
    .catch(err => {
      if (isJsonFile) {
        // json template
        return fse.readFile(cacheFilepath, 'utf8').then(cache => (cache ? JSONfn.parse(cache) : Promise.reject(err)))
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
