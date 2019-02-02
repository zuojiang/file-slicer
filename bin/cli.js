#!/usr/bin/env node
'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var uploadDir = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(dir, _ref4) {
    var _this = this;

    var url = _ref4.url,
        oneline = _ref4.oneline,
        chunkSize = _ref4.chunkSize;

    var list, fileId, totalSize, _loop, i, length;

    return _regenerator2.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            list = getFiles(dir, [dir]);
            fileId = Base64.encode(_path2.default.basename(dir));
            totalSize = 0;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(i, length) {
              var file, res;
              return _regenerator2.default.wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      file = list[i];
                      _context3.next = 3;
                      return (0, _node.postFile)(url, file, {
                        chunkSize: chunkSize,
                        onProgress: function onProgress(loaded, total, size) {
                          if (loaded == total) {
                            totalSize += size;
                          }
                          print(i, length, loaded, total, file, size);
                        },
                        fileId: fileId,
                        fileDir: _path2.default.dirname(file).replace(dir, '') || '.'
                      });

                    case 3:
                      res = _context3.sent;

                      if (!oneline) {
                        _logUpdate2.default.done();
                      }
                      // console.log(await res.text(), res.status);

                    case 5:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _loop, _this);
            });
            i = 0, length = list.length;

          case 5:
            if (!(i < length)) {
              _context4.next = 10;
              break;
            }

            return _context4.delegateYield(_loop(i, length), 't0', 7);

          case 7:
            i++;
            _context4.next = 5;
            break;

          case 10:
            return _context4.abrupt('return', totalSize);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, this);
  }));

  return function uploadDir(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var uploadFiles = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(files, _ref6) {
    var _this2 = this;

    var url = _ref6.url,
        oneline = _ref6.oneline,
        chunkSize = _ref6.chunkSize;

    var list, totalSize, _loop2, i, length;

    return _regenerator2.default.wrap(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            list = getFiles(cwd, files);
            totalSize = 0;
            _loop2 = /*#__PURE__*/_regenerator2.default.mark(function _loop2(i, length) {
              var file, res;
              return _regenerator2.default.wrap(function _loop2$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      file = list[i];
                      _context5.next = 3;
                      return (0, _node.postFile)(url, file, {
                        chunkSize: chunkSize,
                        onProgress: function onProgress(loaded, total, size) {
                          if (loaded == total) {
                            totalSize += size;
                          }
                          print(i, length, loaded, total, file, size);
                        }
                      });

                    case 3:
                      res = _context5.sent;

                      if (!oneline) {
                        _logUpdate2.default.done();
                      }

                    case 5:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _loop2, _this2);
            });
            i = 0, length = list.length;

          case 4:
            if (!(i < length)) {
              _context6.next = 9;
              break;
            }

            return _context6.delegateYield(_loop2(i, length), 't0', 6);

          case 6:
            i++;
            _context6.next = 4;
            break;

          case 9:
            return _context6.abrupt('return', totalSize);

          case 10:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee4, this);
  }));

  return function uploadFiles(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

var _logUpdate = require('log-update');

var _logUpdate2 = _interopRequireDefault(_logUpdate);

var _prettyHrtime = require('pretty-hrtime');

var _prettyHrtime2 = _interopRequireDefault(_prettyHrtime);

var _prettyBytes = require('pretty-bytes');

var _prettyBytes2 = _interopRequireDefault(_prettyBytes);

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _tsscmp = require('tsscmp');

var _tsscmp2 = _interopRequireDefault(_tsscmp);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _node = require('../lib/node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

_yargs2.default.command('server [dir]', 'Startup a file server.', {
  'user': {
    alias: 'u',
    desc: 'Username for basic authentication.',
    type: 'string'
  },
  'password': {
    alias: 'p',
    desc: 'Password for basic authentication.',
    type: 'string'
  },
  'port': {
    alias: 'P',
    desc: 'HTTP port.',
    default: 3000,
    type: 'number'
  }
}, function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(argv) {
    var user, passowrd, port, dir, tmpDir, app;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // console.log(argv);
            user = argv.user, passowrd = argv.passowrd, port = argv.port, dir = argv.dir;
            tmpDir = _path2.default.resolve(dir || '.');
            _context.next = 4;
            return (0, _mkdirpPromise2.default)(tmpDir);

          case 4:
            app = (0, _connect2.default)();

            if (user) {
              app.use(function (req, res, next) {
                var credentials = (0, _basicAuth2.default)(req);
                if (credentials) {
                  if ((0, _tsscmp2.default)(credentials.name, user) && (0, _tsscmp2.default)(credentials.pass, password)) {
                    next();
                    return;
                  }
                }
                res.writeHead(500);
                res.end();
              });
            }
            app.use((0, _node.middleware)({
              tmpDir: tmpDir,
              override: true
            }));
            app.use(function (req, res) {
              res.end();
            });
            app.listen(port, function () {
              console.log('Listening on ' + port + '. Working on ' + tmpDir + '.');
            });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).command('upload url [file|dir]', 'Upload files.', {
  'oneline': {
    desc: 'Print in one line.',
    default: false,
    type: 'boolean'
  },
  'chunk-size': {
    desc: 'Set chunk size.',
    default: 1024 * 1024,
    type: 'number'
  }
}, function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(argv) {
    var _argv$_, action, files, file, dir, options, start, stat, size, end, totalTime, totalSize;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // console.log(argv);
            _argv$_ = (0, _toArray3.default)(argv._), action = _argv$_[0], files = _argv$_.slice(1), file = argv.file, dir = argv.dir, options = (0, _objectWithoutProperties3.default)(argv, ['_', 'file', 'dir']);
            _context2.prev = 1;
            start = process.hrtime();
            stat = _fs2.default.statSync(_path2.default.resolve(dir));
            size = 0;

            if (!(stat.isDirectory() && files.length == 0)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 8;
            return uploadDir(_path2.default.resolve(dir), options);

          case 8:
            size = _context2.sent;
            _context2.next = 15;
            break;

          case 11:
            files.unshift(file);
            _context2.next = 14;
            return uploadFiles(files, options);

          case 14:
            size = _context2.sent;

          case 15:
            end = process.hrtime(start);
            totalTime = (0, _prettyHrtime2.default)(end, { precise: true });
            totalSize = (0, _prettyBytes2.default)(size);

            _logUpdate2.default.done();
            console.log('Total time: ' + totalTime + '; Total size: ' + totalSize + '.');
            _context2.next = 26;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2['catch'](1);

            _logUpdate2.default.done();
            console.error(_context2.t0.message);
            // yargs.showHelp()

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 22]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()).strict(true).locale('en').argv;

function getFiles(dir, files) {
  var list = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _file = _step.value;

      _file = _path2.default.resolve(dir, _file);
      var stat = _fs2.default.statSync(_file);
      if (stat.isFile()) {
        list.push(_file);
      } else if (stat.isDirectory()) {
        list.push.apply(list, (0, _toConsumableArray3.default)(getFiles(_file, _fs2.default.readdirSync(_file))));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return list;
}

function print(index, length, loaded, total, file, size) {
  size = (0, _prettyBytes2.default)(size);
  if (loaded == total) {
    (0, _logUpdate2.default)('[' + (index + 1) + '/' + length + '] [' + size + '] ' + file);
  } else {
    (0, _logUpdate2.default)('[' + (index + 1) + '/' + length + '] [' + size + '] [' + Math.floor(loaded / total * 100) + '%] ' + file);
  }
}
