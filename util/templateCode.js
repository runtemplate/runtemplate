import _ from 'lodash'
import pathParse from 'path-parse'

const pathFormat = ({ dir, name, ext }) => `${dir}/${name}${ext}`

// const filenameReservedRegex = /[<>:"\/\\|?*\x00-\x1F]/g
// eslint-disable-next-line no-control-regex
const pathReservedRegex = /[<>:"\\|?*\x00-\x1F]/g

export const formatTemplateCode = ({ projectId: dir, name, ext, number }, hasNumber) => {
  if (hasNumber && number) {
    name = `${name}__${number}`
  }
  return pathFormat({ dir, name, ext })
}

export const parseTemplateCode = (code, hasNumber) => {
  code = _.trimStart(code, ' /').replace(pathReservedRegex, '_')
  const { dir, name, ext } = pathParse(code)
  const codeObj = { projectId: dir || 'demo', name: name || 'new', ext }

  if (hasNumber && codeObj.name !== 'new') {
    const i = codeObj.name.lastIndexOf('__')
    if (i >= 0) {
      codeObj.number = codeObj.name.substr(i + 2)
      codeObj.name = codeObj.name.substr(0, i)
    }
  }
  return codeObj
}
