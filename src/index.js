import fetch from 'isomorphic-fetch'

import { API } from './env'

const renderPdf = ({ templateId, data, source }) =>
  fetch(`${API}/pdf-render/MY-DOC.pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, templateId, source }),
  }).then(res => res.blob())

export default renderPdf
