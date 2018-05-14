import _ from 'lodash'
import fetch from 'isomorphic-fetch'

export async function fetchJson(url, option = {}) {
  const headers = (option.headers = _.defaults(option.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }))
  if (option.body && headers['Content-Type'] === 'application/json') {
    option.body = JSON.stringify(option.body)
  }

  return Promise.race([
    fetch(url, option).then(res => {
      const rType = res.headers.get('Content-Type')
      const promise = !rType || rType.indexOf('/json') >= 0 ? res.json() : Promise.resolve(res)

      if (res.status >= 200 && res.status < 400) return promise

      // console.log('>>>', url, res.statusText)
      return promise.then(data => {
        const error = new Error((data && data.message) || res.statusText)
        Object.assign(error, { response: res, data })
        return Promise.reject(error)
      })
    }),
    new Promise((x, reject) => setTimeout(() => reject(new Error('Timeout')), option.timeout || 3000)),
  ])
}

export const tryCache = (cache, key, func) => {
  const c = cache[key]
  if (c) return c
  return (cache[key] = func()) // eslint-disable-line
}
