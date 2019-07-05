import os from 'os'
import Path from 'path'
// import _ from 'lodash'
import fse from 'fs-extra'
import got from 'got'
import mem from 'mem'
import KeyvLrufiles from 'keyv-lru-files'
import rawBody from 'raw-body'
import Stream from 'stream'

const HOST = process.env.RUNTEMPLATE_HOST || 'https://runtemplate.com'

const getCacheDir = namespace => `${os.tmpdir()}/runtemplate/${namespace}`

const makeFileMap = namespace => {
  const wantDir = getCacheDir(namespace)
  fse.ensureDirSync(wantDir)
  // TODO remove this if keyv-lru-files changed
  const relativeDir = Path.relative(Path.join(require.main.filename, '..'), wantDir)
  const fileMap = new KeyvLrufiles({
    dir: relativeDir, // directory to store caches files
    files: 1000, // maximum number of files
    size: '1 GB', // maximum total file size
    // interval of stale checks in minutes
    check: process.env.NODE_ENV === 'test' ? false : 10,
  })
  const fixKey = key => key.replace(/\//g, '~~')
  return {
    ...fileMap,
    get: key => fileMap.get(fixKey(key)),
    set: (key, value) => {
      const fixedKey = fixKey(key)
      // console.log(`fileSet ${wantDir}/${fixedKey}`)
      return fileMap.set(fixedKey, value)
    },
  }
}

// export for test only
export const memAndFile = (namespace, asyncFunc, option = {}) => {
  const memoryMap = option.cache || new Map()
  const fileMap = makeFileMap(namespace)

  const getMemory = mem(
    async (key, ...args) => {
      let ret
      try {
        ret = await asyncFunc(key, ...args)
        await fileMap.set(key, ret)
      } catch (err) {
        console.error(err)
        return fileMap.get(key, ret)
      }
      return ret
    },
    {
      // short invalid time to trigger re-get
      maxAge: 600000,
      ...option,
      cache: memoryMap,
    }
  )
  Object.assign(getMemory, { memoryMap, fileMap })
  return getMemory
}

const gotBuffer = (url, option) => got(url, { timeout: 3000, encoding: null, ...option }).then(r => r.body)
const gotJson = (url, option) => got(url, { timeout: 3000, json: true, ...option }).then(r => r.body)

// -------------------------------------------------------------------------

export const getOutput = memAndFile('output', (code, rest) => gotBuffer(`${HOST}/pdf/${code}?auth=${rest.auth || ''}`))
const { memoryMap, fileMap } = getOutput
export const setOutput = async (code, pdfKitDocument, { auth, data }) => {
  const writeStream = Stream.PassThrough()
  const pdfStream = pdfKitDocument.pipe(writeStream)
  pdfKitDocument.end()

  const body = await rawBody(pdfStream)
  memoryMap.set(code, body)
  fileMap.set(code, body)
  await got(`${HOST}/pdf/${code}?auth=${auth}`, { method: 'POST', body: { data }, json: true }).catch(err => console.error(err))
}

// -------------------------------------------------------------------------

export const getTemplate = memAndFile('template', (templateCode, rest) => {
  return gotJson(`${HOST}/api/template/${templateCode}?auth=${rest.auth || ''}`)
})

// -------------------------------------------------------------------------

export const fontCacheDir = getCacheDir('font')
export const getFont = memAndFile('font', (fontName, rest) => {
  return gotBuffer(`${HOST}/font/${fontName}?auth=${rest.auth || ''}`)
})

// -------------------------------------------------------------------------
