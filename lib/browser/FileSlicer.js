'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseFileSlicer2 = require('../BaseFileSlicer');

var _BaseFileSlicer3 = _interopRequireDefault(_BaseFileSlicer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_BaseFileSlicer) {
  (0, _inherits3.default)(_class, _BaseFileSlicer);

  function _class(file, options) {
    (0, _classCallCheck3.default)(this, _class);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, options));

    _this.fileSize = file.size;
    _this.fileName = file.name;

    _this.next = function () {
      var start = _this.start,
          end = _this.end;

      var body = file.slice(start, _this.start = end + 1, file.type);
      return {
        body: body,
        start: start,
        end: end,
        range: 'bytes=' + start + '-' + end
      };
    };
    return _this;
  }

  return _class;
}(_BaseFileSlicer3.default);

exports.default = _class;