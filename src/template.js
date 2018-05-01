import _ from 'lodash'
import Handlebars from 'handlebars'
import { format as dateFnsFormat } from 'date-fns'
import JSON5 from 'json5'

Handlebars.registerHelper('dateFnsFormat', (date, formatStr) => dateFnsFormat(date, formatStr))

Handlebars.registerHelper('sumBy', _.sumBy)

const compileOne = teamplateStr => {
  const compiledFunc = Handlebars.compile(teamplateStr)
  return data => compiledFunc(data)
}

const renderOne = (template, data) => {
  if (template.ibTemplateFunc) {
    return template.ibTemplateFunc({ ...data, template: _.omit(template, 'ibTemplateFunc', 'ibTemplateStr') })
  }
  if (template.ibTemplateStr) {
    template.ibTemplateFunc = compileOne(template.ibTemplateStr)
    return renderOne(template, data)
  }
  if (template.layout) {
    const outArr = _.map(template.layout, k => renderOne(template[k], data))
    return `[${outArr.join()}]`
  }
  return template
}

Handlebars.registerHelper('render', function renderHelper(template) {
  // console.log('rr', this)
  return renderOne(template, this)
})

export const render = (template, data) => {
  const out = renderOne(template, data)
  if (typeof out === 'object') return out
  try {
    return JSON5.parse(out)
  } catch (err) {
    console.error(out)
    throw err
  }
}

// =================================
// Utils
// =================================

export const compile = obj =>
  _.mapValues(obj, subObj => {
    if (subObj && subObj.ibTemplateStr) {
      return {
        ...subObj,
        ibTemplateFunc: compileOne(subObj.ibTemplateStr),
      }
    }
    return subObj
  })

export const extend = (a, b) => {
  if (typeof b === 'function') return b(a)

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
