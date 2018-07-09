import _ from 'lodash'
import { format as dateFnsFormat } from 'date-fns'

const util = {
  map: _.map,
  toString: _.toString,
  sumBy: _.sumBy,
  dateFnsFormat,
}

export const render = (template, data) => {
  const templateRender = template.render
  if (templateRender) {
    if (typeof templateRender === 'function') {
      const subTemplate = _.omit(template, 'render')
      return templateRender.call(util, data, subTemplate, util)
    }
    return templateRender
  }

  if (template.layout) {
    return _.map(template.layout, k => {
      const subTemplate = { ...template, ...template[k] }
      return util.render(subTemplate, data)
    })
  }

  return template
}

util.render = render

export const extend = (a, b) => {
  if (typeof a === 'object' && !Array.isArray(a)) {
    return {
      ...b,
      ..._.mapValues(a, (subA, boxKey) => {
        const subB = b[subA.ibExtend || boxKey]
        return subB ? extend(subA, subB) : subA
      }),
    }
  }
  return a
}

util.extend = extend

export default util
