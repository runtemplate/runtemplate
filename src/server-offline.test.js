import Cacheman from 'cacheman'
import CachemanFile from 'cacheman-file'

const cacheDir = `${__dirname}/../.cache`

test('cacheman-file', async () => {
  const caches1 = new Cacheman({
    engine: new CachemanFile({ tmpDir: cacheDir }),
  })
  await caches1.clear()

  expect(await caches1.get('my-key')).toEqual(null)
  expect(await caches1.set('my-key', { foo: 'bar' })).toEqual({ foo: 'bar' })
  expect(await caches1.get('my-key')).toEqual({ foo: 'bar' })

  const caches2 = new Cacheman({
    engine: new CachemanFile({ tmpDir: cacheDir }),
  })
  expect(await caches2.get('my-key')).toEqual({ foo: 'bar' })
})
