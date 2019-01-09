import fetch from 'isomorphic-fetch-improve'
import FormData from 'form-data'
import { Base64 } from 'js-base64'

export default function (FileSlicer) {
  return (url, file, {
    chunkSize,
    headers,
    onProgress,
    ...others
  } = {}) => {
    if (!file) {
      throw new Error('no file')
    }
    const slicer = new FileSlicer(file, {
      chunkSize,
    })

    return postFile()

    function postFile (id = '') {
      if (slicer.hasNext()) {
        const {
          body,
          start,
          end,
          range,
        } = slicer.next()
        const formData = new FormData()
        formData.append('chunk', body)
        return fetch(url, {
          retryMaxCount: 2,
          method: 'POST',
          ...others,
          body: formData,
          headers: {
            ...headers,
            range,
            'x-file-id': id,
            'x-file-name': Base64.encode(slicer.fileName),
            'x-file-size': slicer.fileSize,
          }
        }).then(res => {
          onProgress && onProgress(slicer.loaded, slicer.total)
          const id = res.headers.get('x-file-id')
          if (id) {
            if (res.status < 400) {
              return postFile(id)
            }
            throw new Error(res.statusText)
          }
          return res
        })
      }
      return Promise.reject(new Error('file error'))
    }
  }

}
