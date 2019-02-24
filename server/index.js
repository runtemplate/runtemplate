import _ from 'lodash'
import LRU from 'lru-cache'

import { parseTemplateCode, formatTemplateCode } from '../util/templateCode'
import serverRenderPdf from './serverRenderPdf'

export { serverRenderPdf }

const parseJson = str => {
  try {
    return str ? JSON.parse(str) : undefined
  } catch (err) {
    return undefined
  }
}

const cacheTable = new LRU(100)
const defaultSaveOutput = async output => {
  cacheTable.set(output.code, output)
  return output
}
const defaultOutput = async ({ code }) => {
  // console.log(code, outputCaches)
  return cacheTable.get(code).body
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

  saveOutput = defaultSaveOutput,
  loadOutput = defaultOutput,
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
      HOST: process.env.RUNTEMPLATE_HOST || 'https://runtemplate.com',
      ...renderProps,
      templateCode,
      loadTemplate,
      fontDir,
      loadFont,
      data,
    })
  } else {
    httpBody = await loadOutput({ code: outputCode })
  }

  const res = {}
  if (method === 'POST') {
    const outputDoc = await saveOutput({
      ...codeObj,
      templateCode,
      code: outputCode,
      body: httpBody,
    })
    res.body = {
      url: `${PATH_PREFIX}${outputCode}?auth=${auth || ''}`,
      templateCode,
      code: outputCode,
      _id: _.get(outputDoc, '_id'),
    }
  } else {
    res.body = httpBody
    res.type = 'application/pdf'
  }
  return res
}
