import fetch from 'isomorphic-fetch'

import Json from './json-fn'
import { render, extend } from './template'

import { HOST } from './env'

export { render, extend, Json }

const _renderPdf = prop => fetch(`${prop.HOST}/pdf-render/MY-DOC.pdf`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: prop.data, templateId: prop.templateId }),
}).then(res => res.blob())

const defaultProp = {
  HOST,
}

// prop = { templateId, data, HOST }
export const renderPdf = _prop => _renderPdf({ ...defaultProp, ..._prop })
