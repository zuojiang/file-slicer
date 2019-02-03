'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = function (FileSlicer) {
  return function (url, file) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var chunkSize = _ref.chunkSize,
        headers = _ref.headers,
        onProgress = _ref.onProgress,
        _ref$fieldName = _ref.fieldName,
        fieldName = _ref$fieldName === undefined ? null : _ref$fieldName,
        _ref$fileDir = _ref.fileDir,
        fileDir = _ref$fileDir === undefined ? null : _ref$fileDir,
        _ref$fileId = _ref.fileId,
        fileId = _ref$fileId === undefined ? null : _ref$fileId,
        others = (0, _objectWithoutProperties3.default)(_ref, ['chunkSize', 'headers', 'onProgress', 'fieldName', 'fileDir', 'fileId']);

    if (!file) {
      throw new Error('no file');
    }
    var slicer = new FileSlicer(file, {
      chunkSize: chunkSize
    });
    return postFile(fileId || '');

    function postFile(fileId) {
      if (slicer.fileSize == 0) {
        var formData = new _formData3.default();
        formData.append(fieldName || 'file', file);
        return (0, _isomorphicFetchImprove2.default)(url, (0, _extends3.default)({
          retryMaxCount: 0,
          method: 'POST'
        }, others, {
          body: formData,
          headers: headers
        }));
      }
      if (slicer.hasNext()) {
        var _slicer$next = slicer.next(),
            body = _slicer$next.body,
            start = _slicer$next.start,
            end = _slicer$next.end,
            range = _slicer$next.range;

        var _formData = new _formData3.default();
        _formData.append(fieldName || 'chunk', body);
        return (0, _isomorphicFetchImprove2.default)(url, (0, _extends3.default)({
          retryDelay: 500,
          retryMaxCount: 120,
          method: 'POST'
        }, others, {
          body: _formData,
          headers: (0, _extends3.default)({}, headers, {
            range: range,
            'x-file-id': fileId,
            'x-file-name': _jsBase.Base64.encode(slicer.fileName),
            'x-file-size': slicer.fileSize,
            'x-file-dir': fileDir && _jsBase.Base64.encode(fileDir) || ''
          })
        })).then(function (res) {
          var fileError = res.headers.get('x-file-error');
          var fileId = res.headers.get('x-file-id');
          if (fileError) {
            throw new Error(_jsBase.Base64.decode(fileError));
          } else if (fileId) {
            onProgress && onProgress(slicer.loaded, slicer.total, slicer.fileSize);
            if (slicer.hasNext()) {
              return postFile(fileId);
            }
          } else if (res.status < 400) {
            throw new Error('The response did not meet expectations! Check your url.');
          } else {
            throw new Error(res.statusText);
          }
          return res;
        });
      }
      throw new Error('Unknown exception');
    }
  };
};

var _isomorphicFetchImprove = require('isomorphic-fetch-improve');

var _isomorphicFetchImprove2 = _interopRequireDefault(_isomorphicFetchImprove);

var _formData2 = require('form-data');

var _formData3 = _interopRequireDefault(_formData2);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }