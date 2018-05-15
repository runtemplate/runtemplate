import fs from 'fs-extra'
import delay from 'delay'

import cacheFetch, { cacheDir } from './serverFetch'

beforeAll(async () => {
  fs.removeSync(cacheDir)
})

test('serverFetch .ttf file', async () => {
  fetch.once(fs.createReadStream(__filename), { headers: { 'Content-Type': 'pdf' } })
  await cacheFetch('HOST/font/test.ttf')
  // wait until decoupled promise
  await delay(500)
  expect(fs.existsSync(`${cacheDir}/test.ttf`)).toBe(true)
})

test('serverFetch api json', async () => {
  const data = { json: 'data' }
  fetch.once(JSON.stringify(data))
  await cacheFetch('HOST/api/template/test-template-id')
  // wait until decoupled promise
  await delay(500)
  expect(await fs.readJson(`${cacheDir}/test-template-id`)).toEqual(data)
})

afterAll(async () => {
  fs.removeSync(cacheDir)
})
