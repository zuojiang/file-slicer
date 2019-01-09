'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseFileSlicer2 = require('../BaseFileSlicer');

var _BaseFileSlicer3 = _interopRequireDefault(_BaseFileSlicer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_BaseFileSlicer) {
  _inherits(_class, _BaseFileSlicer);

  function _class(file, options) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

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