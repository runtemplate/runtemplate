import _ from 'lodash'
import { format as dateFnsFormat } from 'date-fns'
import marked from 'marked'

const util = {
  // NOTE because of babel-plugin-lodash, need to use _.map in code, instead of _.pick(_, 'map', ...)
  map: _.map,
  toString: _.toString,
  sumBy: _.sumBy,
  dateFnsFormat,
  marked,
}

// const specialKeys = ['render', 'layout', 'baseKey', '_base']

export const render = (data, template) => {
  const templateRender = template.render
  if (templateRender) {
    if (typeof templateRender === 'function') {
      return templateRender.call(util, data, _.omit(template, 'render'), util)
    }
    return templateRender
  }

  // render list of sub-template which ordered by layout
  if (template.layout) {
    return _.map(template.layout, k => render(data, { ...template, ...template[k] }))
  }

  return template
}

util.render = render

const _extendDeep = (a, b) => {
  if (b && typeof a === 'object' && !Array.isArray(a)) {
    return {
      ...b,
      _base: b,
      ..._.mapValues(a, (subA, key) => {
        const subB = b[subA.baseKey || key]
        return subB ? _extendDeep(subA, subB) : subA
      }),
    }
  }
  return a
}
export const extend = (a, b) => {
  const template = _extendDeep(a, b)
  // handle main block
  const main = template.main || template.Main
  if (main) {
    return { ..._.omit(template, 'main', 'Main'), ...main }
  }
  return template
}

util.extend = extend

export default util
