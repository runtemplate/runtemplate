import Path from 'path'
import { createWriteStream, outputJson, readJson, ensureDir } from 'fs-extra'

import { fetchJson, tryCache } from './common'

export const cacheDir = Path.join(__dirname, '../.cache')

const promises = {}

const serverFetch = (url, option) =>
  tryCache(promises, url, () => {
    const cacheFilepath = Path.join(cacheDir, Path.basename(url))
    return fetchJson(url, option)
      .then(async res => {
        if (res && res.body && res.body.pipe) {
          // stream font
          await ensureDir(cacheDir)
          res.body.pipe(createWriteStream(cacheFilepath))
        } else {
          // json template
          outputJson(cacheFilepath, res)
        }
        return res
      })
      .catch(err => {
        console.error('>>>', err)
        // api json return should have no extension, font file should have extension
        const isJsonFile = !Path.extname(url)
        const p = isJsonFile ? readJson(cacheFilepath) : Promise.resolve(null)
        return p.then(oldCached => oldCached || Promise.reject(err))
      })
  })

export default serverFetch
