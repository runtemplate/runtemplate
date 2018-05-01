import flatCache from 'flat-cache'

const cacheDir = `${__dirname}/../.cache`

test('flatCache', () => {
  const _caches1 = flatCache.load('template-caches', cacheDir)
  _caches1.removeKey('templateId')
  _caches1.save()

  const _caches2 = flatCache.load('template-caches', cacheDir)
  expect(_caches2.getKey('templateId')).toEqual()

  expect(_caches1.getKey('templateId')).toBe()
  _caches1.setKey('templateId', { content: 'template' })
  _caches1.save(true)
  expect(_caches1.getKey('templateId')).toEqual({ content: 'template' })

  const _caches3 = flatCache.load('template-caches', cacheDir)
  expect(_caches3.getKey('templateId')).toEqual({ content: 'template' })
})
