import Path from 'path'
import fs from 'fs'

import { fetchJson, tryCache } from './common'

// fetchFont('chinese.msyh.ttf', { host: 'http://localhost:8888' }).then(res => {
//   res.body.pipe(fs.createWriteStream('chinese.msyh.ttf'))
// })

export const cacheDir = Path.join(__dirname, '../.cache')

const promises = {}

const write = (filepath, str) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filepath, str, 'utf8', err => (err ? reject(err) : resolve()))
  })

const read = filepath =>
  new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, str) => (err ? reject(err) : resolve(str)))
  })

const serverFetch = (url, option) =>
  tryCache(promises, url, () => {
    const cacheFilepath = Path.join(cacheDir, url)
    return fetchJson(url, option)
      .then(res => {
        if (res && res.body && res.body.pipe) {
          // stream font
          res.body.pipe(fs.createWriteStream(cacheFilepath))
        } else {
          // json template
          write(cacheFilepath, JSON.stringify(res))
        }
        return res
      })
      .catch(err => {
        // api json return should have no extension, font file should have extension
        const p = Path.extname(url) ? Promise.resolve(null) : read(cacheFilepath)
        return p.then(oldCached => oldCached || Promise.reject(err))
      })
  })

export default serverFetch
