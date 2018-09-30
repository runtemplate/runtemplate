import fetch from 'isomorphic-fetch'

import { stringify } from './util/FuncJson'

import { HOST } from './env'

export * from './commonExports'

const _renderPdf = prop => fetch(`${prop.HOST}/pdf-render/MY-DOC.pdf`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: stringify({ data: prop.data, templateId: prop.templateId }),
}).then(res => res.blob())

const defaultProp = {
  HOST,
}

// prop = { templateId, data, HOST }
export const renderPdf = _prop => _renderPdf({ ...defaultProp, ..._prop })
