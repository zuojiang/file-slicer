import FileSlicer from './FileSlicer'
import initPostFile from '../initPostFile'

exports.FileSlicer = FileSlicer
exports.postFile = initPostFile(FileSlicer)
