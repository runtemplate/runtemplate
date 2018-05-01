import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import { API } from './env'

export async function fetchJson(url, option = {}) {
  const headers = (option.headers = _.defaults(option.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }))
  if (headers['Content-Type'] === 'application/json' && option.body) {
    option.body = JSON.stringify(option.body)
  }
  return fetch(url, option).then(res => {
    const rType = res.headers.get('Content-Type')
    const promise = !rType || rType.indexOf('/json') >= 0 ? res.json() : res.text()

    if (res.status >= 200 && res.status < 400) return promise

    return promise.then(data => {
      const error = new Error((data && data.message) || res.statusText)
      Object.assign(error, { response: res, data })
      return Promise.reject(error)
    })
  })
}

export const fetchTemplate = templateId => fetchJson(`${API}/api/template/${templateId}`)
