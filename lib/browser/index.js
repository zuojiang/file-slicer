'use strict';

var _FileSlicer = require('./FileSlicer');

var _FileSlicer2 = _interopRequireDefault(_FileSlicer);

var _initPostFile = require('../initPostFile');

var _initPostFile2 = _interopRequireDefault(_initPostFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.FileSlicer = _FileSlicer2.default;
exports.postFile = (0, _initPostFile2.default)(_FileSlicer2.default);