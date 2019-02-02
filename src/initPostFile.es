import fetch from 'isomorphic-fetch-improve'
import FormData from 'form-data'
import { Base64 } from 'js-base64'

export default function (FileSlicer) {
  return (url, file, {
    chunkSize,
    headers,
    onProgress,
    fieldName = null,
    fileDir = null,
    fileId = null,
    ...others
  } = {}) => {
    if (!file) {
      throw new Error('no file')
    }
    const slicer = new FileSlicer(file, {
      chunkSize,
    })
    return postFile(fileId || '')

    function postFile (fileId) {
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
        const {
          body,
          start,
          end,
          range,
        } = slicer.next()
        const formData = new FormData()
        formData.append(fieldName || 'chunk', body)
        return fetch(url, {
          retryMaxCount: 0,
          method: 'POST',
          ...others,
          body: formData,
          headers: {
            ...headers,
            range,
            'x-file-id': fileId,
            'x-file-name': Base64.encode(slicer.fileName),
            'x-file-size': slicer.fileSize,
            'x-file-dir': fileDir && Base64.encode(fileDir) || '',
          },
        }).then(res => {
          const fileError = res.headers.get('x-file-error')
          const fileId = res.headers.get('x-file-id')
          if (fileError) {
            throw new Error(Base64.decode(fileError))
          } else if (fileId) {
            onProgress && onProgress(slicer.loaded, slicer.total, slicer.fileSize)
            if (slicer.hasNext()) {
              return postFile(fileId)
            }
          } else if (res.status < 400) {
            throw new Error('The response did not meet expectations! Check your url.')
          } else {
            throw new Error(res.statusText)
          }
          return res
        })
      }
      throw new Error('Unknown exception')
    }
  }

}
