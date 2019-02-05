'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getFilePath = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var id = _ref2.id,
        name = _ref2.name,
        dir = _ref2.dir,
        tmpDir = _ref2.tmpDir,
        req = _ref2.req,
        res = _ref2.res,
        override = _ref2.override;
    var ext;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!override) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', _path2.default.join(tmpDir, dir, name));

          case 4:
            if (!dir) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', _path2.default.join(tmpDir, id, dir, name));

          case 6:
            ext = _path2.default.extname(name);
            return _context.abrupt('return', _path2.default.join(tmpDir, id + ext));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getFilePath(_x) {
    return _ref.apply(this, arguments);
  };
}();

var checkFile = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(tmpDir, filePath, override, start, size) {
    var stat;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            stat = null;
            _context2.prev = 1;
            _context2.next = 4;
            return _thenFs2.default.stat(filePath);

          case 4:
            stat = _context2.sent;
            _context2.next = 9;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](1);

          case 9:
            if (!stat) {
              _context2.next = 17;
              break;
            }

            if (!(isNaN(size) && start == 0 || stat.size == size)) {
              _context2.next = 17;
              break;
            }

            if (!override) {
              _context2.next = 16;
              break;
            }

            _context2.next = 14;
            return _thenFs2.default.unlink(filePath);

          case 14:
            _context2.next = 17;
            break;

          case 16:
            throw new Error(filePath.replace(tmpDir, '') + ' already exists');

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 7]]);
  }));

  return function checkFile(_x2, _x3, _x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _thenFs = require('then-fs');

var _thenFs2 = _interopRequireDefault(_thenFs);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _busboy = require('busboy');

var _busboy2 = _interopRequireDefault(_busboy);

var _rangeParser3 = require('range-parser');

var _rangeParser4 = _interopRequireDefault(_rangeParser3);

var _jsBase = require('js-base64');

var _camelcaseKeys2 = require('camelcase-keys');

var _camelcaseKeys3 = _interopRequireDefault(_camelcaseKeys2);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _generateFileId = require('./generateFileId');

var _generateFileId2 = _interopRequireDefault(_generateFileId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTmpDir = _path2.default.join(_os2.default.tmpdir(), _package2.default.name);

module.exports = function () {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$tmpDir = _ref4.tmpDir,
      tmpDir = _ref4$tmpDir === undefined ? defaultTmpDir : _ref4$tmpDir,
      _ref4$returnAbsPath = _ref4.returnAbsPath,
      returnAbsPath = _ref4$returnAbsPath === undefined ? getFilePath : _ref4$returnAbsPath,
      _ref4$propertyName = _ref4.propertyName,
      propertyName = _ref4$propertyName === undefined ? 'files' : _ref4$propertyName,
      _ref4$override = _ref4.override,
      override = _ref4$override === undefined ? false : _ref4$override,
      _ref4$strictPath = _ref4.strictPath,
      strictPath = _ref4$strictPath === undefined ? true : _ref4$strictPath,
      _ref4$busboyConfig = _ref4.busboyConfig,
      busboyConfig = _ref4$busboyConfig === undefined ? {} : _ref4$busboyConfig;

  return function (req, res, next) {
    var headers = req.headers,
        method = req.method;

    if (method != 'POST') {
      res.writeHead(204);
      res.end();
      return;
    }

    var _camelcaseKeys = (0, _camelcaseKeys3.default)(headers),
        xFileId = _camelcaseKeys.xFileId,
        xFileSize = _camelcaseKeys.xFileSize,
        xFileName = _camelcaseKeys.xFileName,
        xFileDir = _camelcaseKeys.xFileDir,
        range = _camelcaseKeys.range;

    var files = [];
    var id = xFileId ? _jsBase.Base64.decode(xFileId) : (0, _generateFileId2.default)();
    var dir = xFileDir ? _jsBase.Base64.decode(xFileDir) : '';
    var size = xFileSize ? parseInt(xFileSize) : NaN;

    res.setHeader('X-File-Id', _jsBase.Base64.encode(id));
    res.setHeader('Accept-Ranges', 'bytes');

    var finished = true;

    var busboy = new _busboy2.default((0, _extends3.default)({}, busboyConfig, {
      headers: headers
    }));
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var run = function () {
        var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
          var name, filePath, stream, _rangeParser, _rangeParser2, _rangeParser2$, start, end;

          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  name = null, filePath = null, stream = null;

                  if (!range) {
                    _context3.next = 25;
                    break;
                  }

                  if (xFileName) {
                    _context3.next = 5;
                    break;
                  }

                  next(new Error('No X-File-Name header'));
                  return _context3.abrupt('return');

                case 5:
                  if (xFileSize) {
                    _context3.next = 8;
                    break;
                  }

                  next(new Error('No X-File-Size header'));
                  return _context3.abrupt('return');

                case 8:
                  name = _jsBase.Base64.decode(xFileName);
                  _context3.next = 11;
                  return returnAbsPath({ req: req, res: res, id: id, name: name, dir: dir, tmpDir: tmpDir, override: override });

                case 11:
                  filePath = _context3.sent;

                  filePath = _path2.default.normalize(filePath);

                  if (!(strictPath && filePath.indexOf(tmpDir) != 0)) {
                    _context3.next = 16;
                    break;
                  }

                  next(new Error('The path did not meet expectations. Check your file path.'));
                  return _context3.abrupt('return');

                case 16:
                  _rangeParser = (0, _rangeParser4.default)(size, range), _rangeParser2 = (0, _slicedToArray3.default)(_rangeParser, 1), _rangeParser2$ = _rangeParser2[0], start = _rangeParser2$.start, end = _rangeParser2$.end;
                  _context3.next = 19;
                  return checkFile(tmpDir, filePath, override, start, size);

                case 19:
                  _context3.next = 21;
                  return (0, _mkdirpPromise2.default)(_path2.default.dirname(filePath));

                case 21:
                  finished = end + 1 == size;
                  stream = _thenFs2.default.createWriteStream(filePath, {
                    flags: 'a',
                    encoding: 'binary',
                    start: start,
                    end: end
                  });
                  _context3.next = 34;
                  break;

                case 25:
                  name = filename;
                  _context3.next = 28;
                  return returnAbsPath({ req: req, res: res, id: id, name: name, tmpDir: tmpDir, override: override });

                case 28:
                  filePath = _context3.sent;
                  _context3.next = 31;
                  return checkFile(tmpDir, filePath, override, 0, size);

                case 31:
                  _context3.next = 33;
                  return (0, _mkdirpPromise2.default)(_path2.default.dirname(filePath));

                case 33:
                  stream = _thenFs2.default.createWriteStream(filePath, {
                    flags: 'w',
                    encoding: 'binary'
                  });

                case 34:
                  file.pipe(stream);
                  files.push({
                    id: id,
                    name: name,
                    path: filePath,
                    field: fieldname
                  });

                case 36:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function run() {
          return _ref5.apply(this, arguments);
        };
      }();

      run().catch(function (err) {
        res.setHeader('X-File-Error', _jsBase.Base64.encode(err.message));
        next(err);
      });
    });
    busboy.on('finish', function () {
      if (finished) {
        req[propertyName] = files;
        next();
      } else {
        res.writeHead(204);
        res.end();
      }
    });
    req.pipe(busboy);
  };
};