import fs from 'fs'
import os from 'os'
import path from 'path'
import mkdirp from 'mkdirp'
import Busboy from 'busboy'
import rangeParser from 'range-parser'
import uuid from 'uuid/v4'
import {Base64} from 'js-base64'
import camelcaseKeys from 'camelcase-keys'

import pkg from '../package'

const defaultTmpDir = path.join(os.tmpdir(), pkg.name)

module.exports =function ({
  tmpDir = defaultTmpDir
} = {}) {
  mkdirp(tmpDir)
  return (req, res, next) => {
    const {headers} = req
    // console.log(headers);
    const {
      xFileId,
      xFileSize,
      xFileName,
      range,
    } = camelcaseKeys(headers)
    const id = xFileId || uuid()
    let name = null, filePath = null
    let finished = true

    const busboy = new Busboy({headers})
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      let stream = null
      if (range) {
        if (!xFileName) {
          next(new Error('No X-File-Name header'))
          return
        }
        if (!xFileSize) {
          next(new Error('No X-File-Size header'))
          return
        }
        name = Base64.decode(xFileName)
        const ext = path.extname(name)
        filePath = path.join(tmpDir, id + ext)
        const size = parseInt(xFileSize)
        const [{
          start,
          end,
        }] = rangeParser(size, range)
        finished = end + 1 == size
        stream = fs.createWriteStream(filePath, {
          flags: 'a',
          encoding: 'binary',
          start,
          end,
        })
      } else {
        name = filename
        mkdirp(path.join(tmpDir, id))
        filePath = path.join(tmpDir, id, name)
        stream = fs.createWriteStream(filePath, {
          flags: 'w',
          encoding: 'binary',
        })
      }
      file.pipe(stream)
    })
    busboy.on('finish', () => {
      if (finished) {
        req.file = {
          name,
          path: filePath,
        }
        next()
      } else {
        res.writeHead(204, {
          'X-File-Id': id,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'text/plain',
        })
        res.end()
      }
    })
    req.pipe(busboy)
  }
}
