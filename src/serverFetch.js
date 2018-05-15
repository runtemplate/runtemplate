import Path from 'path'
import { createWriteStream, outputJson, readJson, ensureDir } from 'fs-extra'

import { fetchJson, tryCache } from './common'

export const cacheDir = Path.join(__dirname, '../.cache')

const memoryPromises = {}

const outputStream = (cacheFilepath, stream) =>
  new Promise(resolve => {
    ensureDir(cacheDir).then(() => {
      stream.pipe(createWriteStream(cacheFilepath)).on('finish', resolve)
    })
  })

const serverFetch = (url, option, postProcessor) =>
  tryCache(memoryPromises, url, () => {
    const cacheFilepath = Path.join(cacheDir, Path.basename(url))
    let memoryP = fetchJson(url, option)
      .then(async res => {
        if (res && res.body && res.body.pipe) {
          // stream font
          await outputStream(cacheFilepath, res.body)
        } else {
          // json template
          await outputJson(cacheFilepath, res)
        }
        return res
      })
      .catch(err => {
        // api json return should have no extension, font file should have extension
        const isJsonFile = !Path.extname(url)
        const p = isJsonFile ? readJson(cacheFilepath) : Promise.resolve(null)
        return p.then(oldCached => oldCached || Promise.reject(err))
      })
    if (postProcessor) {
      memoryP = memoryP.then(postProcessor)
    }
    return memoryP
  })

export default serverFetch
