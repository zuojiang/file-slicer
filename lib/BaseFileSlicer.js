'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$start = _ref.start,
        start = _ref$start === undefined ? 0 : _ref$start,
        _ref$chunkSize = _ref.chunkSize,
        chunkSize = _ref$chunkSize === undefined ? 1024 * 1024 : _ref$chunkSize;

    _classCallCheck(this, _class);

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

  _createClass(_class, [{
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
  }]);

  return _class;
}();

exports.default = _class;