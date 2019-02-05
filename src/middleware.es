import os from 'os'
import path from 'path'
import fs from 'then-fs'
import mkdirp from 'mkdirp-promise'
import Busboy from 'busboy'
import rangeParser from 'range-parser'
import {Base64} from 'js-base64'
import camelcaseKeys from 'camelcase-keys'
import pkg from '../package'
import generateFileId from './generateFileId'

const defaultTmpDir = path.join(os.tmpdir(), pkg.name)

async function getFilePath ({id, name, dir, tmpDir, req, res, override}) {
  // console.log({id, name, dir, override});
  if (override) {
    return path.join(tmpDir, dir, name)
  } else if (dir) {
    return path.join(tmpDir, id, dir, name)
  }
  const ext = path.extname(name)
  return path.join(tmpDir, id + ext)
}

async function checkFile (tmpDir, filePath, override, start, size) {
  let stat = null
  try {
    stat = await fs.stat(filePath)
  } catch (e) {
  }

  if (stat) {
    if (isNaN(size) && start == 0 || stat.size == size) {
      if (override) {
        await fs.unlink(filePath)
      } else {
        throw new Error(`${filePath.replace(tmpDir, '')} already exists`)
      }
    }
  }
}

module.exports = function ({
  tmpDir = defaultTmpDir,
  returnAbsPath = getFilePath,
  propertyName = 'files',
  override = false,
  strictPath = true,
  busboyConfig = {},
} = {}) {
  return (req, res, next) => {
    const {headers, method} = req
    if (method != 'POST') {
      res.writeHead(204)
      res.end()
      return
    }
    const {
      xFileId,
      xFileSize,
      xFileName,
      xFileDir,
      range,
    } = camelcaseKeys(headers)
    const files = []
    const id = xFileId ? Base64.decode(xFileId) : generateFileId()
    const dir = xFileDir ? Base64.decode(xFileDir) : ''
    const size = xFileSize ? parseInt(xFileSize) : NaN

    res.setHeader('X-File-Id', Base64.encode(id))
    res.setHeader('Accept-Ranges', 'bytes')

    let finished = true

    const busboy = new Busboy({
      ...busboyConfig,
      headers,
    })
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      run().catch(err => {
        res.setHeader('X-File-Error', Base64.encode(err.message))
        next(err)
      })
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
          filePath = await returnAbsPath({ req, res, id, name, dir, tmpDir, override })
          filePath = path.normalize(filePath)
          if (strictPath && filePath.indexOf(tmpDir) != 0) {
            next(new Error('The path did not meet expectations. Check your file path.'))
            return
          }
          const [{
            start,
            end,
          }] = rangeParser(size, range)
          await checkFile(tmpDir, filePath, override, start, size)
          await mkdirp(path.dirname(filePath))
          finished = end + 1 == size
          stream = fs.createWriteStream(filePath, {
            flags: 'a',
            encoding: 'binary',
            start,
            end,
          })
        } else {
          name = filename
          filePath = await returnAbsPath({ req, res, id, name, tmpDir, override })
          await checkFile(tmpDir, filePath, override, 0, size)
          await mkdirp(path.dirname(filePath))
          stream = fs.createWriteStream(filePath, {
            flags: 'w',
            encoding: 'binary',
          })
        }
        file.pipe(stream)
        files.push({
          id,
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
        res.writeHead(204)
        res.end()
      }
    })
    req.pipe(busboy)
  }
}
