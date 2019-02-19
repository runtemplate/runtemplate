import { fetchData } from './util/fetchUtil'

import { HOST } from './env'

export * from './util/templateCode'
export { fetchData }

// template
export * from './template'

const _renderPdf = prop => fetchData(`${prop.HOST}/pdf-render/MY-DOC.pdf`, {
  method: 'POST',
  body: { data: prop.data, templateId: prop.templateId },
}).then(res => res.blob())

const defaultProp = { HOST }

// prop = { templateId, data, HOST }
export const renderPdf = _prop => _renderPdf({ ...defaultProp, ..._prop })
