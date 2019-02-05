import FileSlicer from './FileSlicer'
import initPostFile from '../initPostFile'
import generateFileId from '../generateFileId'

exports.FileSlicer = FileSlicer
exports.postFile = initPostFile(FileSlicer)
exports.generateFileId = generateFileId
