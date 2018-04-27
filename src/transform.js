import _ from 'lodash'

const transformers = {}

const transform = (a, b) => {
  if (typeof b === 'function') return b(a)
  const extender = transformers[b._$extender || a._$defaultExtender || 'extend']
  return extender(a, b)
}

const extend = (plan, planB) => {
  if (typeof plan === 'object' && !Array.isArray(plan)) {
    return {
      ...planB,
      ..._.mapValues(plan, (a, boxKey) => {
        const b = planB[a._$extend || boxKey]
        return b ? transform(a, b) : a
      }),
    }
  }
  return plan
}

const toPdf = (a, vars) => {
  if (a._$toPdf) {
    return a._$toPdf(a, vars, toPdf)
  } else if (a.layout) {
    return _.map(a.layout, k => toPdf(a[k], vars))
  }
  return a.content
}

Object.assign(transformers, {
  extend,
  toPdf,
})

export default transform
