import Path from 'path'
import Url from 'url'
import fse from 'fs-extra'
import appRootPath from 'app-root-path'

import { fetchData, tryCache } from '../util/fetchUtil'

export const cacheDir = appRootPath.resolve('.cache')
// console.log(cacheDir)

let memoryPromises = {}

const outputStream = (cacheFilepath, stream) => new Promise(resolve => {
  fse.ensureDir(cacheDir).then(() => {
    stream.pipe(fse.createWriteStream(cacheFilepath)).on('finish', resolve)
  })
})

const parse = str => JSON.parse(str)

const serverFetch = (url, option, postProcessor) => tryCache(memoryPromises, url, () => {
  const urlObj = new Url.URL(url)
  const cacheFilepath = Path.join(cacheDir, Path.basename(urlObj.pathname))
  // api json return should have no extension, font file should have extension
  const ext = Path.extname(urlObj.pathname)
  const isJsonFile = !ext || ext === '.json'
  // console.log('> serverFetch', url, cacheFilepath)
  let memoryP = fetchData(url, { parseType: isJsonFile ? 'text' : null, ...option })
    .then(async res => {
      console.log(`Fetched ${url}`)
      if (isJsonFile) {
        // json template
        await fse.outputFile(cacheFilepath, res)
        return parse(res)
      }
      // stream font
      await outputStream(cacheFilepath, res.body)
      return true
    })
    .catch(err => {
      console.log(`Fetch ${url} fail, fallback to ${cacheFilepath}`)
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
