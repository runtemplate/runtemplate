import delay from 'delay'
import { makeGet, makeKeyv } from './gotCaches'

test('get', async () => {
  const keyv = makeKeyv('test')

  const doGet = jest.fn((code, rest) => {
    return Buffer.from(JSON.stringify({ ...rest, code }))
  })
  const get = makeGet(keyv, doGet, 200)

  expect(doGet).toBeCalledTimes(0)
  expect((await get('T1', { auth: 'AUTH' })).toString()).toEqual('{"auth":"AUTH","code":"T1"}')
  expect(doGet).toBeCalledTimes(1)

  expect((await get('T1', { auth: 'AUTH' })).toString()).toEqual('{"auth":"AUTH","code":"T1"}')
  expect(doGet).toBeCalledTimes(1)

  await delay(200)

  expect((await get('T1', { auth: 'AUTH' })).toString()).toEqual('{"auth":"AUTH","code":"T1"}')
  expect(doGet).toBeCalledTimes(2)
})
