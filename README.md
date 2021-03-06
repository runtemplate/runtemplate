# runtemplate

![https://img.shields.io/npm/v/runtemplate.svg](https://img.shields.io/npm/v/runtemplate.svg?style=flat-square)
![state](https://img.shields.io/badge/state-alpha-green.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/runtemplate.svg?maxAge=2592000&style=flat-square)
![npm](https://img.shields.io/npm/l/runtemplate.svg?style=flat-square)

**Beta Version**

PDF template editor that is designed non-techs. Renderer service is standalone.

[runtemplate.com](https://runtemplate.com) is the online pdf template editor.

## Online Editor Features

- Upload logo and images
- Support markdown

## Standalone Server Features

- start microservice or middleware in your server
- smartly cache template from cloud
- render pdf in local microservice (work even network is disconnected)
- Non-developers can edit via online editor and microservice will get updated
- based on pdfmake and pdfkit

## Usage

microservice

```
npm install --global runtemplate
runtemplate
```

middleware

```js
import { pdfMiddleware } from 'runtemplate'

const response = await pdfMiddleware({
  method: request.method,
  path: request.path,
  query: request.query,
  reqBody: request.body,

  // optional
  saveOutput: async output => {
    cacheTable.set(output.code, output)
    return output
  },
  loadOutput: async ({ code }) => {
    return cacheTable.get(code).body
  },
})
// Use method=POST to generate pdf
// response.body = { url, code, ... }
// And http GET the response url

// if method=GET
// response.type = 'application/pdf'
// response.body = pdf stream
```

example http POST

```
http://localhost:8899/pdf/demo/new__Receipt-Number?auth=YOUR_AUTH_OR_EMPTY

{"data":{"number":"Receipt-Number","timeAt":"2019-02-18T15:31:08.067Z","items":[{"type":"Product","name":"A","quantity":1,"price":12},{"type":"Product","name":"B","quantity":1,"price":1}]}}'
```

example http GET

```
http://localhost:8899/pdf/demo/new__Receipt-Number?auth=YOUR_AUTH_OR_EMPTY
```
