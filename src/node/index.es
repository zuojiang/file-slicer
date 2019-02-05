import FileSlicer from './FileSlicer'
import initPostFile from '../initPostFile'
import middleware from '../middleware'
import generateFileId from '../generateFileId'

exports.FileSlicer = FileSlicer
exports.postFile = initPostFile(FileSlicer)
exports.middleware = middleware
exports.generateFileId = generateFileId
