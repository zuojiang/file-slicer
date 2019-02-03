const path = require('path')
const connect = require('connect')
const serveStatic = require('serve-static')

const middleware = require('../lib/middleware')
const {postFile} = require('../lib/node/index')

const app = connect()
app.use(serveStatic(path.join(__dirname, 'public')))
// app.use((req, res, next) => {
//   setTimeout(next, 1000)
// })
app.use('/upload', middleware({
  tmpDir: path.join(__dirname, 'tmp_bak'),
  // returnAbsPath ({tmpDir, dir, name}) {
  //   return path.join(tmpDir, dir, name)
  // },
  // override: true,
}))
app.use((req, res) => {
  res.end(JSON.stringify(req.files))
})
app.use((err, req, res, next) => {
  res.end(JSON.stringify({error: err.message}))
})
app.listen(3000, () => {
  // const file = process.argv[2] || path.join(__dirname, '../package.json')
  // postFile('http://127.0.0.1:3000/upload', file, {
  //   chunkSize: 10 * 1024 * 1024,
  //   onProgress (loaded, total) {
  //     console.log(loaded +'/'+ total);
  //   }
  // }).then(res => res.json()).then(console.log)
})
