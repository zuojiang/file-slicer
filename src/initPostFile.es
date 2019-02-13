import fetch from 'isomorphic-fetch-improve'
import FormData from 'form-data'
import { Base64 } from 'js-base64'

export default function (FileSlicer) {
  return (url, file, {
    chunkSize,
    headers = {},
    skipTest = false,
    resumable = false,
    fieldName = null,
    fileDir = null,
    fileId = null,
    onProgress = null,
    ...others
  } = {}) => {
    if (!file) {
      throw new Error('no file')
    }
    const slicer = new FileSlicer(file, {
      chunkSize,
    })
    headers = {
      ...headers,
      'x-file-name': Base64.encode(slicer.fileName),
      'x-file-size': slicer.fileSize,
      'x-file-dir': fileDir && Base64.encode(fileDir) || '',
    }
    return postFile(fileId)

    function postFile (fileId, tested = false) {
      if (slicer.fileSize == 0) {
        const formData = new FormData()
        formData.append(fieldName || 'file', file)
        return fetch(url, {
          retryMaxCount: 0,
          method: 'POST',
          ...others,
          body: formData,
          headers,
        })
      }
      if (slicer.hasNext()) {
        headers = {
          ...headers,
          range: slicer.range,
          'x-file-id': fileId || '',
        }
        if (skipTest || tested) {
          return postChunk()
        } else {
          return fetch(url, {
            retryDelay: 100,
            retryMaxCount: 300,
            method: 'HEAD',
            ...others,
            headers,
          }).then(res => callback(res, true))
        }
      }
      throw new Error('Unknown exception')
    }

    function postChunk () {
      const {
        body,
        range,
      } = slicer.next()
      headers = {
        ...headers,
        range,
      }
      const formData = new FormData()
      formData.append(fieldName || 'chunk', body)
      return fetch(url, {
        retryDelay: 500,
        retryMaxCount: 120,
        method: 'POST',
        ...others,
        body: formData,
        headers,
      }).then(res => callback(res, false))
    }

    function callback(res, tested) {
      const fileError = res.headers.get('x-file-error')
      const fileId = res.headers.get('x-file-id')
      if (fileError) {
        throw new Error(Base64.decode(fileError))
      } else if (fileId) {
        if (tested && resumable) {
          const fileEnd = parseInt(res.headers.get('x-file-end'))
          if (fileEnd > 0) {
            slicer.start = fileEnd + 1
          }
        }
        onProgress && onProgress(slicer.loaded, slicer.total, slicer.fileSize)
        if (slicer.hasNext()) {
          return postFile(fileId, tested)
        }
      } else if (res.status < 400) {
        throw new Error('The response did not meet expectations! Check your url.')
      } else {
        throw new Error(res.statusText)
      }
      return res
    }
  }

}
