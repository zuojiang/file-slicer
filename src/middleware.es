import os from 'os'
import path from 'path'
import fs from 'then-fs'
import mkdirp from 'mkdirp-promise'
import Busboy from 'busboy'
import rangeParser from 'range-parser'
import uuid from 'uuid/v4'
import {Base64} from 'js-base64'
import camelcaseKeys from 'camelcase-keys'
import pkg from '../package'

const defaultTmpDir = path.join(os.tmpdir(), pkg.name)

async function getFilePath ({id, name, tmpDir, req, res}) {
  if (req.headers.range) {
    const ext = path.extname(name)
    return path.join(tmpDir, id + ext)
  }
  return path.join(tmpDir, id, name)
}

async function checkFile (filePath, override) {
  let existed = true
  try {
    await fs.stat(filePath)
  } catch (e) {
    existed = false
  }
  if (existed) {
    if (override) {
      await fs.unlink(filePath)
    } else {
      throw new Error(`${filePath} already exists`)
    }
  }
  await mkdirp(path.dirname(filePath))
}

module.exports = function ({
  tmpDir = defaultTmpDir,
  returnAbsPath = getFilePath,
  propertyName = 'files',
  override = false,
  busboyConfig = {},
} = {}) {
  return (req, res, next) => {
    const {headers} = req
    // console.log(headers);
    const {
      xFileId,
      xFileSize,
      xFileName,
      range,
    } = camelcaseKeys(headers)
    const files = []
    const id = xFileId || uuid()
    let finished = true

    const busboy = new Busboy({
      ...busboyConfig,
      headers,
    })
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      run().catch(next)
      async function run () {
        let name = null, filePath = null, stream = null
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
          filePath = await returnAbsPath({ req, res, id, name, tmpDir })
          if (!xFileId) {
            await checkFile(filePath, override)
          }
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
          filePath = await returnAbsPath({ req, res, id, name, tmpDir })
          await checkFile(filePath, override)
          stream = fs.createWriteStream(filePath, {
            flags: 'w',
            encoding: 'binary',
          })
        }
        file.pipe(stream)
        files.push({
          name,
          path: filePath,
          field: fieldname,
        })
      }
    })
    busboy.on('finish', () => {
      if (finished) {
        req[propertyName] = files
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
