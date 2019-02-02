#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import connect from 'connect'
import logUpdate from 'log-update'
import prettyHrtime from 'pretty-hrtime'
import prettyBytes from 'pretty-bytes'
import basicAuth from 'basic-auth'
import tsscmp from 'tsscmp'
import mkdirp from 'mkdirp-promise'
import moment from 'moment'

import {postFile, middleware} from '../lib/node'

const cwd = process.cwd()

yargs.command('server [dir]', 'Startup a file server.', {
  'user': {
    alias: 'u',
    desc: 'Username for basic authentication.',
    type: 'string',
  },
  'password': {
    alias: 'p',
    desc: 'Password for basic authentication.',
    type: 'string',
  },
  'port': {
    alias: 'P',
    desc: 'HTTP port.',
    default: 3000,
    type: 'number',
  },
}, async argv => {
  // console.log(argv);
  const {
    user,
    passowrd,
    port,
    dir,
  } = argv
  const tmpDir = path.resolve(dir || '.')
  await mkdirp(tmpDir)

  const app = connect()
  if (user) {
    app.use((req, res, next) => {
      const credentials = basicAuth(req)
      if (credentials) {
        if (tsscmp(credentials.name, user)
          && tsscmp(credentials.pass, password)) {
          next()
          return
        }
      }
      res.writeHead(500)
      res.end()
    })
  }
  app.use(middleware({
    tmpDir,
    override: true,
  }))
  app.use((req, res) => {
    res.end()
  })
  app.listen(port, () => {
    console.log(`Listening on ${port}. Working on ${tmpDir}.`);
  })
})
.command('upload url [file|dir]', 'Upload files.', {
  'oneline': {
    desc: 'Print in one line.',
    default: false,
    type: 'boolean',
  },
  'chunk-size': {
    desc: 'Set chunk size.',
    default: 1024 * 1024,
    type: 'number',
  },
}, async argv => {
  // console.log(argv);
  const {
    _: [action, ...files],
    file,
    dir,
    ...options
  } = argv
  try {
    const start = process.hrtime()
    const stat = fs.statSync(path.resolve(dir))
    let size = 0
    if (stat.isDirectory() && files.length == 0) {
      size = await uploadDir(path.resolve(dir), options)
    } else {
      files.unshift(file)
      size = await uploadFiles (files, options)
    }
    const end = process.hrtime(start)
    const totalTime = prettyHrtime(end, {precise:true})
    const totalSize = prettyBytes(size)
    logUpdate.done()
    console.log(`Total time: ${totalTime}; Total size: ${totalSize}.`);
  } catch (e) {
    logUpdate.done()
    console.error(e.message)
    // yargs.showHelp()
  }
})
.strict(true)
.locale('en')
.argv

async function uploadDir (dir, {
  url,
  oneline,
  chunkSize,
}) {
  const list = getFiles(dir, [dir])
  const fileId = Base64.encode(path.basename(dir))
  let totalSize = 0
  for (let i=0, {length}=list; i<length; i++) {
    const file = list[i]
    const res = await postFile(url, file, {
      chunkSize,
      onProgress: (loaded, total, size) => {
        if (loaded == total) {
          totalSize += size
        }
        print(i, length, loaded, total, file, size)
      },
      fileId,
      fileDir: path.dirname(file).replace(dir, '') || '.',
    })
    if (!oneline) {
      logUpdate.done()
    }
    // console.log(await res.text(), res.status);
  }
  return totalSize
}

async function uploadFiles (files, {
  url,
  oneline,
  chunkSize,
}) {
  const list = getFiles(cwd, files)
  let totalSize = 0
  for (let i=0, {length}=list; i<length; i++) {
    const file = list[i]
    const res = await postFile(url, file, {
      chunkSize,
      onProgress: (loaded, total, size) => {
        if (loaded == total) {
          totalSize += size
        }
        print(i, length, loaded, total, file, size)
      },
    })
    if (!oneline) {
      logUpdate.done()
    }
  }
  return totalSize
}

function getFiles (dir, files) {
  const list = []
  for (let file of files) {
    file = path.resolve(dir, file)
    const stat = fs.statSync(file)
    if (stat.isFile()) {
      list.push(file)
    } else if (stat.isDirectory()) {
      list.push(...getFiles(file, fs.readdirSync(file)))
    }
  }
  return list
}

function print (index, length, loaded, total, file, size) {
  size = prettyBytes(size)
  if (loaded == total) {
    logUpdate(`[${index+1}/${length}] [${size}] ${file}`)
  } else {
    logUpdate(`[${index+1}/${length}] [${size}] [${Math.floor(loaded/total*100)}%] ${file}`)
  }
}
