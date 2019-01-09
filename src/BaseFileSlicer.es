export default class {
  constructor ({
    start = 0,
    chunkSize = 1024 * 1024,
  } = {}) {
    this.start = start
    this.chunkSize = chunkSize
  }

  start = 0
  chunkSize = 1
  fileSize = 0
  fileName = ''

  get total () {
    return Math.ceil(this.fileSize/this.chunkSize)
  }

  get loaded () {
    return Math.ceil(this.start/this.chunkSize)
  }

  get end () {
    return Math.min(this.start + this.chunkSize, this.fileSize) - 1
  }

  hasNext = () => {
    return this.start < this.fileSize
  }

  next () {
    return null
  }
}
