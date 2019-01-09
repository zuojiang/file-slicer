import FileSlicer from './FileSlicer'
import initPostFile from '../initPostFile'
import middleware from '../middleware'

exports.FileSlicer = FileSlicer
exports.postFile = initPostFile(FileSlicer)
exports.middleware = middleware
