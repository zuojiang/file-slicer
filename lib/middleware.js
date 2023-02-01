'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _thenFs = require('then-fs');

var _thenFs2 = _interopRequireDefault(_thenFs);

var _mkdirp = require('mkdirp');

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

function getFilePath(_ref) {
  var id = _ref.id,
      name = _ref.name,
      dir = _ref.dir,
      tmpDir = _ref.tmpDir,
      req = _ref.req,
      res = _ref.res,
      override = _ref.override;

  // console.log({id, name, dir, override});
  if (override) {
    return _path2.default.join(tmpDir, dir, name);
  } else if (dir) {
    return _path2.default.join(tmpDir, id, dir, name);
  }
  var ext = _path2.default.extname(name);
  return _path2.default.join(tmpDir, id + ext);
}

module.exports = function () {
  var checkFile = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(filePath, start, size) {
      var stat;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              filePath = _path2.default.normalize(filePath);

              if (!(strictPath && filePath.indexOf(tmpDir) != 0)) {
                _context2.next = 3;
                break;
              }

              throw new Error('The path did not meet expectations. Check your file path.');

            case 3:
              stat = null;
              _context2.prev = 4;
              _context2.next = 7;
              return _thenFs2.default.stat(filePath);

            case 7:
              stat = _context2.sent;
              _context2.next = 12;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2['catch'](4);

            case 12:
              if (!stat) {
                _context2.next = 20;
                break;
              }

              if (!(isNaN(size) && start == 0 || stat.size == size)) {
                _context2.next = 20;
                break;
              }

              if (!override) {
                _context2.next = 19;
                break;
              }

              _context2.next = 17;
              return _thenFs2.default.unlink(filePath);

            case 17:
              _context2.next = 20;
              break;

            case 19:
              throw new Error(filePath.replace(tmpDir, '') + ' already exists');

            case 20:
              return _context2.abrupt('return', filePath);

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[4, 10]]);
    }));

    return function checkFile(_x2, _x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  }();

  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$tmpDir = _ref2.tmpDir,
      tmpDir = _ref2$tmpDir === undefined ? defaultTmpDir : _ref2$tmpDir,
      _ref2$returnAbsPath = _ref2.returnAbsPath,
      returnAbsPath = _ref2$returnAbsPath === undefined ? getFilePath : _ref2$returnAbsPath,
      _ref2$propertyName = _ref2.propertyName,
      propertyName = _ref2$propertyName === undefined ? 'files' : _ref2$propertyName,
      _ref2$override = _ref2.override,
      override = _ref2$override === undefined ? false : _ref2$override,
      _ref2$strictPath = _ref2.strictPath,
      strictPath = _ref2$strictPath === undefined ? true : _ref2$strictPath,
      _ref2$busboyConfig = _ref2.busboyConfig,
      busboyConfig = _ref2$busboyConfig === undefined ? {} : _ref2$busboyConfig;

  return function (req, res, _next) {
    function next(err) {
      if (err) {
        res.setHeader('X-File-Error', _jsBase.Base64.encode(err.message));
        _next(err);
      } else {
        _next();
      }
    }

    res.setHeader('Accept-Ranges', 'bytes');

    var headers = req.headers,
        method = req.method;

    var _camelcaseKeys = (0, _camelcaseKeys3.default)(headers),
        xFileId = _camelcaseKeys.xFileId,
        xFileSize = _camelcaseKeys.xFileSize,
        xFileName = _camelcaseKeys.xFileName,
        xFileDir = _camelcaseKeys.xFileDir,
        range = _camelcaseKeys.range;

    var id = xFileId ? _jsBase.Base64.decode(xFileId) : (0, _generateFileId2.default)();
    res.setHeader('X-File-Id', _jsBase.Base64.encode(id));

    var name = null,
        filePath = null;

    if (range) {
      if (!xFileName) {
        next(new Error('No X-File-Name header'));
        return;
      }
      if (!xFileSize) {
        next(new Error('No X-File-Size header'));
        return;
      }
      name = _jsBase.Base64.decode(xFileName);
      var dir = xFileDir ? _jsBase.Base64.decode(xFileDir) : '';
      filePath = returnAbsPath({ req: req, res: res, id: id, name: name, dir: dir, tmpDir: tmpDir, override: override });
    }

    if (method != 'POST') {
      var promise = _promise2.default.resolve();
      if (method == 'HEAD' && filePath) {
        promise = promise.then(function () {
          return _thenFs2.default.stat(filePath).then(function (stat) {
            res.setHeader('X-File-End', stat.size);
          }, function (err) {});
        });
      }
      promise.then(function () {
        res.writeHead(204);
        res.end();
      });
      return;
    }

    var size = xFileSize ? parseInt(xFileSize) : NaN;

    var files = [];
    var finished = true;

    var busboy = new _busboy2.default((0, _extends3.default)({}, busboyConfig, {
      headers: headers
    }));
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var run = function () {
        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          var stream, _rangeParser, _rangeParser2, _rangeParser2$, start, end;

          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  stream = null;

                  if (!range) {
                    _context.next = 12;
                    break;
                  }

                  _rangeParser = (0, _rangeParser4.default)(size, range), _rangeParser2 = (0, _slicedToArray3.default)(_rangeParser, 1), _rangeParser2$ = _rangeParser2[0], start = _rangeParser2$.start, end = _rangeParser2$.end;
                  _context.next = 5;
                  return checkFile(filePath, start, size);

                case 5:
                  filePath = _context.sent;
                  _context.next = 8;
                  return (0, _mkdirp.mkdirp)(_path2.default.dirname(filePath));

                case 8:
                  finished = end + 1 == size;
                  stream = _thenFs2.default.createWriteStream(filePath, {
                    flags: 'a',
                    encoding: 'binary',
                    start: start,
                    end: end
                  });
                  _context.next = 20;
                  break;

                case 12:
                  name = filename;
                  filePath = returnAbsPath({ req: req, res: res, id: id, name: name, dir: '', tmpDir: tmpDir, override: override });
                  _context.next = 16;
                  return checkFile(filePath, 0, size);

                case 16:
                  filePath = _context.sent;
                  _context.next = 19;
                  return (0, _mkdirp.mkdirp)(_path2.default.dirname(filePath));

                case 19:
                  stream = _thenFs2.default.createWriteStream(filePath, {
                    flags: 'w',
                    encoding: 'binary'
                  });

                case 20:
                  file.pipe(stream);
                  files.push({
                    id: id,
                    name: name,
                    path: filePath,
                    field: fieldname
                  });

                case 22:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function run() {
          return _ref3.apply(this, arguments);
        };
      }();

      run().catch(next);
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