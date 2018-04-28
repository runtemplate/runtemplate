import fetch from 'isomorphic-fetch'

import { API } from './env'

export const renderTemplate = ({ templateId, data, source }) =>
  fetch(`${API}/MY-DOC.pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, templateId, source }),
  }).then(res => res.blob())
