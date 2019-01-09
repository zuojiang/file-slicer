import fs from 'fs'
import path from 'path'
import BaseFileSlicer from '../BaseFileSlicer'

export default class extends BaseFileSlicer {
  constructor (file, options) {
    super(options)
    const stat = fs.statSync(file)
    this.fileSize = stat.size
    this.fileName = path.basename(file)

    this.next = () => {
      const {
        start,
        end,
      } = this
      const body = fs.createReadStream(file, {
        start,
        end,
      })
      this.start = end + 1
      return {
        body,
        start,
        end,
        range: `bytes=${start}-${end}`,
      }
    }
  }
}
