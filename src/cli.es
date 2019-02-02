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
import pad from 'pad-left'
import cliColor from 'cli-color'

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
  // console.log(argv)
  const {
    user,
    password,
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
    console.log(`Listening on ${port}. Working on ${tmpDir}.`)
  })
})
.command('upload url [file|dir]', 'Upload files.', {
  'chunk-size': {
    desc: 'Set chunk size.',
    default: 1024 * 1024,
    type: 'number',
  },
  'oneline': {
    desc: 'Print in one line.',
    default: false,
    type: 'boolean',
  },
  'skip-fail': {
    desc: 'To skip the file, when error occurs.',
    default: false,
    type: 'boolean',
  },
  'error-stack': {
    desc: 'Print error stack.',
    default: false,
    type: 'boolean',
  },
  'dry-run': {
    desc: "Don't actually upload anything.",
    default: false,
    type: 'boolean',
  },
}, async argv => {
  // console.log(argv)
  const {
    _: [action, ...files],
    file,
    dir,
    url,
    oneline,
    chunkSize,
    dryRun,
    skipFail,
    errorStack,
  } = argv

  const startTime = process.hrtime()
  files.unshift(file)
  const list = getFileList(files, cwd)
  let uploadedSize = 0
  for (let i=0, {length}=list; i<length; i++) {
    const { file, rootDir, size } = list[i]
    let fileId, fileDir
    if (rootDir) {
      fileId = Base64.encode(path.basename(rootDir))
      fileDir = path.dirname(file).replace(rootDir, '') || '.'
    }

    try {
      if (dryRun) {
        print(i, length, 0, 0, file, size)
      } else {
        await postFile(url, file, {
          chunkSize,
          onProgress: (loaded, total) => {
            print(i, length, loaded, total, file, size)
          },
          fileId,
          fileDir,
        })
      }

      uploadedSize += size
    } catch (e) {
      printError(i, length, file, e)
      if (errorStack) {
        console.error(e.stack || e)
      }
      if (!skipFail) {
        break
      }
    }

    if (!oneline) {
      logUpdate.done()
    }
  }

  const endTime = process.hrtime(startTime)
  const totalTime = cliColor.greenBright(prettyHrtime(endTime, {precise:true}))
  const totalSize = cliColor.greenBright(prettyBytes(uploadedSize))
  if (dryRun) {
    logUpdate(`Total size: ${totalSize}. ${cliColor.redBright('No upload anything!')}`)
  } else {
    logUpdate(`Total time: ${totalTime}; Total size: ${totalSize}.`)
  }
  logUpdate.done()

})
.strict(true)
.locale('en')
.argv

function getFileList (files, dir, rootDir = null) {
  let list = []
  for (let file of files) {
    file = path.resolve(dir, file)
    try {
      const stat = fs.statSync(file)
      if (stat.isFile()) {
        list.push({
          file,
          rootDir,
          size: stat.size,
        })
      } else  if (stat.isDirectory()) {
        list = list.concat(getFileList(fs.readdirSync(file), file, rootDir || file))
      }
    } catch (e) {
      console.warn(e.message)
      break
    }
  }
  return list
}

function print (index, length, loaded, total, file, size) {
  const count = pad(index+1, length.toString().length, '0')
  const list = [
    `[${count}/${length}]`,
    cliColor.greenBright(file),
    cliColor.blackBright(`[${prettyBytes(size)}]`),
  ]
  if (loaded != total) {
    list.push(cliColor.redBright(`[${Math.floor(loaded/total*100)}%]`))
  }
  logUpdate(list.join(' '))
}

function printError (index, length, file, error) {
  const count = pad(index+1, length.toString().length, '0')
  const list = [
    `[${count}/${length}]`,
    cliColor.greenBright(file),
    cliColor.redBright(`[${error.message || error}]`),
  ]
  logUpdate(list.join(' '))
  logUpdate.done()
}
