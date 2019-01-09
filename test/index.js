const path = require('path')
const connect = require('connect')
const serveStatic = require('serve-static')

const middleware = require('../lib/middleware')
const {postFile} = require('../lib/node/index')

const app = connect()
app.use(serveStatic(path.join(__dirname, 'public')))
app.use('/upload', middleware({
  tmpDir: path.join(__dirname, 'tmp_bak'),
}))
app.use((req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(req.file))
})
app.listen(3000, () => {
  const file = process.argv[2] || path.join(__dirname, '../package.json')
  postFile('http://127.0.0.1:3000/upload', file, {
    chunkSize: 10 * 1024 * 1024,
    onProgress (loaded, total) {
      console.log(loaded +'/'+ total);
    }
  }).then(res => res.json()).then(console.log)
})