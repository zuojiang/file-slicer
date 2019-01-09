'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (FileSlicer) {
  return function (url, file) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var chunkSize = _ref.chunkSize,
        headers = _ref.headers,
        onProgress = _ref.onProgress,
        others = _objectWithoutProperties(_ref, ['chunkSize', 'headers', 'onProgress']);

    if (!file) {
      throw new Error('no file');
    }
    var slicer = new FileSlicer(file, {
      chunkSize: chunkSize
    });

    return postFile();

    function postFile() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (slicer.hasNext()) {
        var _slicer$next = slicer.next(),
            body = _slicer$next.body,
            start = _slicer$next.start,
            end = _slicer$next.end,
            range = _slicer$next.range;

        var formData = new _formData2.default();
        formData.append('chunk', body);
        return (0, _isomorphicFetchImprove2.default)(url, _extends({
          retryMaxCount: 2,
          method: 'POST'
        }, others, {
          body: formData,
          headers: _extends({}, headers, {
            range: range,
            'x-file-id': id,
            'x-file-name': _jsBase.Base64.encode(slicer.fileName),
            'x-file-size': slicer.fileSize
          })
        })).then(function (res) {
          onProgress && onProgress(slicer.loaded, slicer.total);
          var id = res.headers.get('x-file-id');
          if (id) {
            if (res.status < 400) {
              return postFile(id);
            }
            throw new Error(res.statusText);
          }
          return res;
        });
      }
      return Promise.reject(new Error('file error'));
    }
  };
};

var _isomorphicFetchImprove = require('isomorphic-fetch-improve');

var _isomorphicFetchImprove2 = _interopRequireDefault(_isomorphicFetchImprove);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }