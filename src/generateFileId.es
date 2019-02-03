import {Base64} from 'js-base64'
import uuid from 'uuid/v4'

export default function () {
  return Base64.encode(uuid())
}
