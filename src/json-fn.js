import _ from 'lodash'

// copy from https://github.com/vkiryukhin/jsonfn

const toJSON = value => {
  if (value instanceof Function || typeof value === 'function') {
    const fnBody = value.toString()
    if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') {
      // this is ES6 Arrow Function
      return `_EsFunc_${fnBody}`
    }
    return fnBody
  }
  return value
}

const fromJSON = value => {
  if (typeof value === 'string' && value.length >= 8) {
    const prefix = value.substring(0, 8)
    if (prefix === 'function') {
      // eslint-disable-next-line no-eval
      return eval(`(${value})`)
    }
    if (prefix === '_EsFunc_') {
      // eslint-disable-next-line no-eval
      return eval(value.slice(8))
    }
  }
  return value
}

const parseObject = value => {
  if (value) {
    const type = typeof value
    if (type === 'string') {
      return fromJSON(value)
    }
    if (type === 'object' && !Array.isArray(value)) {
      return _.mapValues(value, parseObject)
    }
  }
  return value
}

export default {
  toJSON,
  fromJSON,
  parseObject,
  stringify: obj => JSON.stringify(obj, (key, value) => toJSON(value)),
  parse: str => JSON.parse(str, (key, value) => fromJSON(value)),
}
