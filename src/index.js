import 'whatwg-fetch'

import { API } from './env'

export const renderTemplate = ({ data, templateId, source }) =>
  fetch(`${API}/MY-DOC.pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, templateId, source }),
  }).then(res => res.blob())
// .then(blob => this.setState({ url: URL.createObjectURL(blob) }))
