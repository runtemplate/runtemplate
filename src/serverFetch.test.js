import fs from 'fs-extra'

import JSONfn from './json-fn'
import cacheFetch, { cacheDir, clearMemory } from './serverFetch'

beforeAll(async () => {
  fs.removeSync(cacheDir)
})

test('serverFetch .ttf file', async () => {
  fetch.once(fs.createReadStream(__filename), { headers: { 'Content-Type': 'pdf' } })
  await cacheFetch('http://HOST/font/test.ttf')
  expect(fs.existsSync(`${cacheDir}/test.ttf`)).toBe(true)
})

test('serverFetch api json', async () => {
  const data = { json: 'data', render: () => 'result' }
  const json = JSONfn.stringify(data)
  fetch.once(json)
  await cacheFetch('http://HOST/api/template/test-template-id')
  expect(await fs.readFile(`${cacheDir}/test-template-id`, 'utf8')).toEqual(json)

  // offline
  clearMemory()
  fetch.mockRejectOnce(new Error('Offline'))
  const offline = await cacheFetch('http://HOST/api/template/test-template-id')
  expect(`${offline.render}`).toEqual(`${data.render}`)
})

// afterAll(async () => {
//   fs.removeSync(cacheDir)
// })
