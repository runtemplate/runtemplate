import os from 'os'
// import _ from 'lodash'
import got from 'got'
import Keyv from 'keyv'
import KeyvFile from 'keyv-file'
import rawBody from 'raw-body'

const HOST = process.env.RUNTEMPLATE_HOST || 'https://runtemplate.com'

// long time-to-live, nearly won't delete cache
const longTtl = 100 * 24 * 3600 * 1000
// short invalid time to trigger re-get
const INVALID_TTL = 10 * 60 * 1000

// export for test only
export const makeGet = (keyv, func, invalidTtl = INVALID_TTL) => {
  const { namespace } = keyv.opts
  // console.log(`aa: ${namespace}`)

  return async (code, rest) => {
    const rawCache = await keyv.get(code, { raw: true })
    if (rawCache) {
      const { value, expires } = rawCache
      const invalidAt = expires - longTtl + invalidTtl
      const isInvalid = Date.now() > invalidAt
      console.info(`cache hit ${namespace}: ${code} (${isInvalid ? 'Invalided' : 'invalid'}:${new Date(invalidAt)})`)
      if (!isInvalid) {
        return value
      }
    }

    const newValue = await func(code, rest)
    console.info(`fetch ${namespace}: ${code}`)

    await keyv.set(code, newValue)
    return newValue
  }
}

export const makeKeyv = namespace => {
  return new Keyv({
    ttl: longTtl,
    namespace,
    store: new KeyvFile({
      // filename: `${os.tmpdir()}/keyv-file/default-rnd-${Math.random().toString(36).slice(2)}.json`, the file path to store the data
      filename: `${os.tmpdir()}/runtemplate/${namespace}.json`,
      // expiredCheckDelay: ms (default 24*3600*1000), check and remove expired data in each ms
      // expiredCheckDelay: ttl,
    }),
  })
}

const gotBuffer = (url, option) => got(url, { timeout: 3000, encoding: null, ...option }).then(r => r.body)
const gotJson = (url, option) => got(url, { timeout: 3000, json: true, ...option }).then(r => r.body)

// -------------------------------------------------------------------------

const outputKeyv = makeKeyv('output')

// -------------------------------------------------------------------------

export const getOutput = makeGet(outputKeyv, (code, rest) => gotBuffer(`${HOST}/pdf/${code}?auth=${rest.auth || ''}`))

export const setOutput = async (code, body, { auth, data }) => {
  await outputKeyv.set(code, await rawBody(body))
  await got(`${HOST}/pdf/${code}?auth=${auth}`, { method: 'POST', body: { data }, json: true }).catch(err => console.error(err))
}

export const getFont = makeGet(makeKeyv('font'), (fontName, rest) => {
  return gotBuffer(`${HOST}/font/${fontName}?auth=${rest.auth || ''}`)
})

export const getTemplate = makeGet(makeKeyv('template'), (templateCode, rest) => {
  return gotJson(`${HOST}/api/template/${templateCode}?auth=${rest.auth || ''}`)
})
