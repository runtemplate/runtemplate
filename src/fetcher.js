import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import { HOST } from './env'

export async function fetchJson(url, option = {}) {
  const headers = (option.headers = _.defaults(option.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }))
  if (headers['Content-Type'] === 'application/json' && option.body) {
    option.body = JSON.stringify(option.body)
  }

  return Promise.race([
    fetch(url, option).then(res => {
      const rType = res.headers.get('Content-Type')
      const promise = !rType || rType.indexOf('/json') >= 0 ? res.json() : res.text()

      if (res.status >= 200 && res.status < 400) return promise

      // console.log(res.statusText)
      return promise.then(data => {
        const error = new Error((data && data.message) || res.statusText)
        Object.assign(error, { response: res, data })
        return Promise.reject(error)
      })
    }),
    new Promise((x, reject) => setTimeout(() => reject(new Error('Timeout')), option.timeout || 3000)),
  ])
}

export const fetchTemplate = (templateId, option = {}) => fetchJson(`${option.host || HOST}/api/template/${templateId}`)

export const fetchFont = (fontName, option = {}) => fetchJson(`${option.host || HOST}/api/font/${fontName}`)
