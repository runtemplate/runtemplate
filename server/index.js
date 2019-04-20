import _ from 'lodash'

import serverRenderPdf from './serverRenderPdf'
import { getOutput, setOutput } from './gotCaches'

export { serverRenderPdf }

const HOST = process.env.RUNTEMPLATE_HOST || 'https://runtemplate.com'

/* #region utils */
const parseJson = str => {
  try {
    return str ? JSON.parse(str) : undefined
  } catch (err) {
    return undefined
  }
}
/* #endregion */

const parseReqPath = path => path.split('/').splice(-3)

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
  const [projectId, name, number] = parseReqPath(path)
  // console.log('>>>', projectId, name, number)

  const data = reqBody.data || parseJson(query.data)
  const { auth } = query

  const templateId = [projectId, name].join('/')
  const outputId = [projectId, name, number].join('/')

  const prop = {
    HOST,
    ...renderProps,
    loadTemplate,
    fontDir,
    loadFont,

    projectId,
    name,
    number,
    templateId,
    outputId,
    auth,
    data,
  }

  let httpBody
  let outputUrl
  if (data) {
    httpBody = await serverRenderPdf(prop)
    outputUrl = await saveOutput(outputId, httpBody, prop)
  } else {
    httpBody = await loadOutput(outputId, prop)
  }

  const res = {}
  if (method === 'POST') {
    res.body = {
      url: _.isString(outputUrl) ? outputUrl : `${outputId}?auth=${auth || ''}`,
      templateId,
      outputId,
    }
    res.type = 'application/json'
  } else if (httpBody) {
    res.body = httpBody
    res.type = 'application/pdf'
  }
  return res
}
