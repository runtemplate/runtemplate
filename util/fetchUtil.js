import _ from 'lodash'
import 'isomorphic-fetch'

// const syncMem = (promises, func) => (key, ...args) => {
//   const oldPromise = promises[key]
//   if (oldPromise) return oldPromise
//   const promise = func()
//   promises[key] = promise
//   // clean up
//   promise.finally(() => {
//     delete promises[key]
//   })
//   return promise
// }

export const tryCache = (cache, key, func) => {
  const c = cache[key]
  if (c) return c
  return (cache[key] = func()) // eslint-disable-line
}

const _fetchParseType = (cType = '') => {
  const i = cType.indexOf('/')
  cType = i > 0 ? cType.substr(i + 1) : cType
  const i2 = cType.indexOf(';')
  cType = i2 > 0 ? cType.substr(0, i2) : cType
  return cType
}
export async function fetchData(url, option = {}) {
  const headers = (option.headers = _.defaults(option.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }))
  if (option.body) {
    option.method = option.method || 'POST'
    if (headers['Content-Type'] === 'application/json' && typeof option.body !== 'string') {
      option.body = JSON.stringify(option.body)
    }
  }
  option.credentials = option.credentials || 'include'

  const _fetch = option.fetch || global.fetch

  return Promise.race([
    _fetch(url, option).then(res => {
      let p
      const parseType = option.parseType || _fetchParseType(res.headers.get('Content-Type'))
      if (parseType === 'json') {
        p = res.json()
      } else if (parseType === 'text') {
        p = res.text()
      } else {
        p = Promise.resolve(res)
      }

      if (res.status >= 200 && res.status < 400) return p

      // console.log('>>>', url, res.statusText)
      return p.then(data => {
        const error = new Error(`${url}: ${(data && data.message) || res.statusText}`)
        Object.assign(error, { response: res, data })
        return Promise.reject(error)
      })
    }),
    new Promise((x, reject) => setTimeout(() => reject(new Error('Timeout')), option.timeout || 3000)),
  ])
}
