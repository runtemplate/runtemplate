import _ from 'lodash'
import { createRenderer } from 'json-e-customizable'
import dateFns from 'date-fns'
import { applyPatch as applyOperations, applyOperation, compare, getValueByPointer as getByPath } from 'fast-json-patch'

import mdToPdf from './mdToPdf'

export const applyPatch = (base, patch, validateOperation, mutateDocument) => {
  if (!patch) return base
  if (_.isArray(patch)) {
    return applyOperations(base, patch, validateOperation, mutateDocument).newDocument
  }
  return applyOperation(base, patch, validateOperation, mutateDocument).newDocument
}

export const getPatch = (base, customized) => compare(base, customized)

const mapContextValue = (v, ctx) => {
  if (_.isString(v)) {
    const ctxValue = ctx[v]
    if (ctxValue !== undefined) {
      return ctxValue
    }
  }
  return v
}
const makeSubContext = (template, ctx, omitKeys) => {
  ctx = Object.assign({}, ctx)
  Object.keys(template).forEach(k => {
    if (omitKeys && omitKeys.includes(k)) {
      return
    }
    ctx[k] = mapContextValue(template[k], ctx)
  })
  return ctx
}

export const renderTemplate = createRenderer({
  builtins: {
    _: { sumBy: _.sumBy },
    dateFns: _.pick(dateFns, 'format'),
    mdToPdf,
  },
  interpreterSetup: conf => {
    conf.prefixRules.identifier = (token, ctx) => {
      if (token.value in ctx.context) {
        return ctx.context[token.value]
      }
      return `\${${token.value}}`
    }
    return conf
  },
  operators: {
    $mdToPdf: (template, context) => {
      let mixins = _.omit(template, ['$mdToPdf'])
      const ctx = makeSubContext(mixins, context)
      mixins = _.mapValues(mixins, (v, k) => {
        return context.render(ctx[k], ctx, true)
      })
      return mdToPdf(mapContextValue(template.$mdToPdf, ctx), mixins)
    },

    $formatter: (template, context) => {
      let mixins = _.omit(template, ['$formatter'])
      const ctx = makeSubContext(mixins, context)
      mixins = _.mapValues(mixins, (v, k) => {
        return context.render(ctx[k], ctx, true)
      })
      if (template.$formatter === 'markdown') {
        delete mixins.text
        return mdToPdf(template.text, mixins)
      }
      return template
    },
  },
})

export { getByPath, applyOperations, applyOperation }

// export const observePatch = base => observe(base)
// export const unobservePatch = observer => unobserve(observer)
// export const getObservedPatch = observer => generate(observer)
