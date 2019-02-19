import _ from 'lodash'
import MarkdownIt from 'markdown-it'

const markdownIt = new MarkdownIt('zero').enable(['emphasis', 'strikethrough', 'list'])

const tokenToPdf = (ret, token, levels, ctx) => {
  const { type } = token
  const pd = { text: token.content, type, isPlain: true }

  if (type === 'bullet_list_open' || type === 'ordered_list_open') {
    ctx.retList = []
    return
  }
  if (type === 'bullet_list_close' || type === 'ordered_list_close') {
    const listItems = ctx.retList
    const listKey = type === 'ordered_list_close' ? 'ol' : 'ul'
    ret.push({ [listKey]: listItems })
    return
  }

  // console.log(type, `"${token.content}"`, levels)

  if (pd.text) {
    // console.log(type, `"${pd.text}"`, levels)
    if (levels.length > 0) {
      if (_.includes(levels, 'em_open')) {
        Object.assign(pd, { italic: true, isPlain: false })
      }
      if (_.includes(levels, 'strong_open')) {
        Object.assign(pd, { bold: true, isPlain: false })
      }
      if (_.includes(levels, 's_open')) {
        Object.assign(pd, { decoration: 'lineThrough', isPlain: false })
      }

      if (_.includes(levels, 'list_item_open')) {
        ctx.retList.push(pd)
        return
      }
    }

    const lastPd = _.last(ret)
    if (lastPd && lastPd.type !== 'text') {
      // console.log(lastPd, type, `"${pd.text}"`, levels)
      // if last block is not text, this block should have one more new line???
      pd.text = `\n${pd.text}`
    }

    ret.push(pd)
  }
}

const reportLevel = (levels, token) => {
  const { type } = token
  if (type === 'paragraph_open' || type === 'paragraph_close') {
    return
  }
  // console.log('openAndClose', `"${token.content}"`, token.type, token.level, token.nesting)
  if (token.nesting > 0 && token.level > 0) {
    levels.unshift(token.type)
  } else if (token.nesting < 0 && levels.length > 0) {
    levels.shift()
  }
}

const loopDeep = (tokens, func) => {
  const retTokens = []
  const levels = []
  const ctx = {}
  _.forEach(tokens, token => {
    if (token.children) {
      _.forEach(token.children, child => {
        reportLevel(levels, child)
        return func(retTokens, child, levels, ctx)
      })
    } else {
      reportLevel(levels, token)
      func(retTokens, token, levels, ctx)
    }
  })
  return retTokens
}

const combinePlainTextTokens = tokens => _.transform(tokens, (ret, token, i, pdfTokens) => {
  if (token.isPlain) {
    if (token.type === 'paragraph_close' && pdfTokens.length - 1 === i) {
      // drop last paragraph_close
      return
    }
    const last = _.last(ret)
    if (last && last.isPlain) {
      last.text += `\n\n${token.text}`
      return
    }
  }
  ret.push(token)
})

export default function toPdfmake(mdStr, mixins) {
  const tokens = markdownIt.parse(mdStr || '')

  // console.log('before loopDeep', tokens)
  const pdfTokens = loopDeep(tokens, tokenToPdf)

  // console.log('before combine', pdfTokens)
  const combined = combinePlainTextTokens(pdfTokens)

  if (mixins) {
    return _.map(combined, token => ({ ...token, isPlain: false, ...mixins }))
  }

  return combined.length === 1 && combined[0].isPlain ? combined[0].text : combined
}
