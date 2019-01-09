file-slicer
===

Installation
---

```sh
npm i file-slicer -S
```

Usage
---

server.js
```js
const express = require('express')
const {middleware} = require('file-slicer')

const app = express()
app.use('/upload', middleware({
  // tmpDir: '/tmp',
}))
app.use((req, res) => {
  res.json(req.file)
})
app.listen(3000)
```

client.js (in Node.js)
```js
const {postFile} = require('file-slicer')

const file = '/Users/xxx/Downloads/xxxx.zip'
postFile('http://127.0.0.1:3000/upload', file, {
  // chunkSize: 1024 * 1024,
  // headers: {},
  // onProgress (loaded, total) => {
  //   console.log(loaded +'/'+ total)
  // },
}).then(res => res.json()).then(console.log, console.error)
  // {name: 'xxxx.zip', path: '/tmp/<uuid>.zip'}
```

client.js (in Browser)
```js
const {postFile} = require('file-slicer')

document.querySelector('input[type=file]').onchange = evt => {
  const file = evt.target.files[0]
  postFile('http://127.0.0.1:3000/upload', file)
}
```

upload.js (in Node.js and Browser)
```js
const FormData = require('form-data')
const {Base64} = require('js-base64')
const {FileSlicer} = require('file-slicer')
const fetch = require('isomorphic-fetch-improve')

module.exports = function (url, file) {
  const slicer = new FileSlicer(file, {
    // start: 0,
    // chunkSize: 1024 * 1024,
  })

  return upload()

  function upload (id = '') {
    if (slicer.hasNext()) {
      const { body, start, end, range } = slicer.next()
      const formData = new FormData()
      formData.append('xxx', body)
      return fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          range,
          'X-File-Id': id,
          'X-File-Name': Base64.encode(slicer.fileName),
          'X-File-Size': slicer.fileSize,
        }
      }).then(res => {
        // console.log(slicer.loaded +'/'+ slicer.total)
        const id = res.headers.get('x-file-id')
        return id ? upload(id) : res
      })
    }
  }
}
```

License
---

MIT
