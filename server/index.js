import _ from 'lodash'

import { parseTemplateCode, formatTemplateCode } from '../util/templateCode'
import serverRenderPdf from './serverRenderPdf'
import { getOutput, setOutput } from './gotCaches'

export { serverRenderPdf }

const HOST = process.env.RUNTEMPLATE_HOST || 'https://runtemplate.com'

const parseJson = str => {
  try {
    return str ? JSON.parse(str) : undefined
  } catch (err) {
    return undefined
  }
}

const PATH_PREFIX = '/pdf/'
export const pdfMiddleware = async ({
  method,
  path,
  query,
  reqBody,

  loadTemplate,
  fontDir,
  loadFont,
  renderProps,

  saveOutput = setOutput,
  loadOutput = getOutput,
}) => {
  if (!_.startsWith(path, PATH_PREFIX)) return null

  const code = path.substr(PATH_PREFIX.length)
  const data = reqBody.data || parseJson(query.data)
  const { auth } = query

  const codeObj = parseTemplateCode(code, true)
  const templateCode = formatTemplateCode(codeObj)
  const outputCode = formatTemplateCode(codeObj, true)

  let httpBody
  if (data) {
    httpBody = await serverRenderPdf({
      HOST,
      ...renderProps,
      templateCode,
      loadTemplate,
      fontDir,
      loadFont,
      data,
    })
  } else {
    httpBody = await loadOutput(outputCode, { auth })
  }

  const res = {}
  if (method === 'POST') {
    await saveOutput(outputCode, httpBody, { ...codeObj, templateCode, auth, data })
    res.body = {
      url: `${PATH_PREFIX}${outputCode}?auth=${auth || ''}`,
      templateCode,
      code: outputCode,
    }
  } else if (httpBody) {
    res.body = httpBody
    res.type = 'application/pdf'
  }
  return res
}
