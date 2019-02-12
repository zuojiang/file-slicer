import BaseFileSlicer from '../BaseFileSlicer'

export default class extends BaseFileSlicer {
  constructor (file, options) {
    super(options)
    this.fileSize = file.size
    this.fileName = file.name

    this.next = () => {
      const {
        start,
        end,
        range,
      } = this
      const body = file.slice(start, this.start = end + 1, file.type)
      return {
        body,
        start,
        end,
        range,
      }
    }
  }
}
