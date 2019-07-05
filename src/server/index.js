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
  const auth = query.auth || query.idToken

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

  const res = {}
  if (method === 'POST') {
    const pdfKitDocument = await serverRenderPdf(prop)
    const outputUrl = await saveOutput(outputId, pdfKitDocument, prop)
    res.body = {
      url: _.isString(outputUrl) ? outputUrl : `${outputId}?auth=${auth || ''}`,
      templateId,
      outputId,
    }
    res.type = 'application/json'
  } else {
    const output = await loadOutput(outputId, prop)
    if (_.isString(output)) {
      res.redirect = output
    } else {
      res.body = output
      res.type = 'application/pdf'
    }
  }
  return res
}
