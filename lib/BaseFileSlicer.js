'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$start = _ref.start,
        start = _ref$start === undefined ? 0 : _ref$start,
        _ref$chunkSize = _ref.chunkSize,
        chunkSize = _ref$chunkSize === undefined ? 1024 * 1024 : _ref$chunkSize;

    (0, _classCallCheck3.default)(this, _class);
    this.start = 0;
    this.chunkSize = 1;
    this.fileSize = 0;
    this.fileName = '';

    this.hasNext = function () {
      return _this.start < _this.fileSize;
    };

    this.start = start;
    this.chunkSize = chunkSize;
  }

  (0, _createClass3.default)(_class, [{
    key: 'next',
    value: function next() {
      return null;
    }
  }, {
    key: 'total',
    get: function get() {
      return Math.ceil(this.fileSize / this.chunkSize);
    }
  }, {
    key: 'loaded',
    get: function get() {
      return Math.ceil(this.start / this.chunkSize);
    }
  }, {
    key: 'end',
    get: function get() {
      return Math.min(this.start + this.chunkSize, this.fileSize) - 1;
    }
  }, {
    key: 'range',
    get: function get() {
      return 'bytes=' + this.start + '-' + this.end;
    }
  }]);
  return _class;
}();

exports.default = _class;