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

function getFilePath ({id, name, dir, tmpDir, req, res, override}) {
  // console.log({id, name, dir, override});
  if (override) {
    return path.join(tmpDir, dir, name)
  } else if (dir) {
    return path.join(tmpDir, id, dir, name)
  }
  const ext = path.extname(name)
  return path.join(tmpDir, id + ext)
}

module.exports = function ({
  tmpDir = defaultTmpDir,
  returnAbsPath = getFilePath,
  propertyName = 'files',
  override = false,
  strictPath = true,
  busboyConfig = {},
} = {}) {
  return (req, res, _next) => {
    function next (err) {
      if (err) {
        res.setHeader('X-File-Error', Base64.encode(err.message))
        _next(err)
      } else {
        _next()
      }
    }

    res.setHeader('Accept-Ranges', 'bytes')

    const {headers, method} = req
    const {
      xFileId,
      xFileSize,
      xFileName,
      xFileDir,
      range,
    } = camelcaseKeys(headers)

    const id = xFileId ? Base64.decode(xFileId) : generateFileId()
    res.setHeader('X-File-Id', Base64.encode(id))

    let name = null, filePath = null

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
      const dir = xFileDir ? Base64.decode(xFileDir) : ''
      filePath = returnAbsPath({ req, res, id, name, dir, tmpDir, override })
    }

    if (method != 'POST') {
      let promise = Promise.resolve()
      if (method == 'HEAD' && filePath) {
        promise = promise.then(() => fs.stat(filePath).then(stat => {
          res.setHeader('X-File-End', stat.size)
        }, err => {}))
      }
      promise.then(() => {
        res.writeHead(204)
        res.end()
      })
      return
    }

    const size = xFileSize ? parseInt(xFileSize) : NaN

    const files = []
    let finished = true

    const busboy = new Busboy({
      ...busboyConfig,
      headers,
    })
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      run().catch(next)
      async function run () {
        let stream = null
        if (range) {
          const [{
            start,
            end,
          }] = rangeParser(size, range)
          filePath = await checkFile(filePath, start, size)
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
          filePath = returnAbsPath({ req, res, id, name, dir: '', tmpDir, override })
          filePath = await checkFile(filePath, 0, size)
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

  async function checkFile (filePath, start, size) {
    filePath = path.normalize(filePath)
    if (strictPath && filePath.indexOf(tmpDir) != 0) {
      throw new Error('The path did not meet expectations. Check your file path.')
    }
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
    return filePath
  }

}
