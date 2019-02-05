'use strict';

var _FileSlicer = require('./FileSlicer');

var _FileSlicer2 = _interopRequireDefault(_FileSlicer);

var _initPostFile = require('../initPostFile');

var _initPostFile2 = _interopRequireDefault(_initPostFile);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _generateFileId = require('../generateFileId');

var _generateFileId2 = _interopRequireDefault(_generateFileId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.FileSlicer = _FileSlicer2.default;
exports.postFile = (0, _initPostFile2.default)(_FileSlicer2.default);
exports.middleware = _middleware2.default;
exports.generateFileId = _generateFileId2.default;