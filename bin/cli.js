#!/usr/bin/env node
'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _padLeft = require('pad-left');

var _padLeft2 = _interopRequireDefault(_padLeft);

var _cliColor = require('cli-color');

var _cliColor2 = _interopRequireDefault(_cliColor);

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
            // console.log(argv)
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
  'chunk-size': {
    desc: 'Set chunk size.',
    default: 1024 * 1024,
    type: 'number'
  },
  'oneline': {
    desc: 'Print in one line.',
    default: false,
    type: 'boolean'
  },
  'skip-error': {
    desc: 'To skip the file, when error occurs.',
    default: false,
    type: 'boolean'
  },
  'dry-run': {
    desc: "Don't actually upload anything.",
    default: false,
    type: 'boolean'
  }
}, function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(argv) {
    var _argv$_, action, files, file, dir, url, oneline, chunkSize, skipError, dryRun, startTime, list, uploadedSize, _loop, i, length, _ret, endTime, totalTime, totalSize;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // console.log(argv)
            _argv$_ = (0, _toArray3.default)(argv._), action = _argv$_[0], files = _argv$_.slice(1), file = argv.file, dir = argv.dir, url = argv.url, oneline = argv.oneline, chunkSize = argv.chunkSize, skipError = argv.skipError, dryRun = argv.dryRun;
            startTime = process.hrtime();

            files.unshift(file);
            list = getFileList(files, cwd);
            uploadedSize = 0;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(i, length) {
              var _list$i, file, rootDir, size, fileId, fileDir;

              return _regenerator2.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _list$i = list[i], file = _list$i.file, rootDir = _list$i.rootDir, size = _list$i.size;
                      fileId = void 0, fileDir = void 0;

                      if (rootDir) {
                        fileId = Base64.encode(_path2.default.basename(rootDir));
                        fileDir = _path2.default.dirname(file).replace(rootDir, '') || '.';
                      }

                      _context2.prev = 3;

                      if (!dryRun) {
                        _context2.next = 8;
                        break;
                      }

                      print(i, length, 0, 0, file, size);
                      _context2.next = 10;
                      break;

                    case 8:
                      _context2.next = 10;
                      return (0, _node.postFile)(url, file, {
                        chunkSize: chunkSize,
                        onProgress: function onProgress(loaded, total) {
                          print(i, length, loaded, total, file, size);
                        },
                        fileId: fileId,
                        fileDir: fileDir
                      });

                    case 10:

                      uploadedSize += size;
                      _context2.next = 18;
                      break;

                    case 13:
                      _context2.prev = 13;
                      _context2.t0 = _context2['catch'](3);

                      printError(i, length, file, _context2.t0);

                      if (skipError) {
                        _context2.next = 18;
                        break;
                      }

                      return _context2.abrupt('return', 'break');

                    case 18:

                      if (!oneline) {
                        _logUpdate2.default.done();
                      }

                    case 19:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _loop, undefined, [[3, 13]]);
            });
            i = 0, length = list.length;

          case 7:
            if (!(i < length)) {
              _context3.next = 15;
              break;
            }

            return _context3.delegateYield(_loop(i, length), 't0', 9);

          case 9:
            _ret = _context3.t0;

            if (!(_ret === 'break')) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt('break', 15);

          case 12:
            i++;
            _context3.next = 7;
            break;

          case 15:
            endTime = process.hrtime(startTime);
            totalTime = _cliColor2.default.greenBright((0, _prettyHrtime2.default)(endTime, { precise: true }));
            totalSize = _cliColor2.default.greenBright((0, _prettyBytes2.default)(uploadedSize));

            if (dryRun) {
              (0, _logUpdate2.default)('Total size: ' + totalSize + '. ' + _cliColor2.default.redBright('No upload anything!'));
            } else {
              (0, _logUpdate2.default)('Total time: ' + totalTime + '; Total size: ' + totalSize + '.');
            }
            _logUpdate2.default.done();

          case 20:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()).strict(true).locale('en').argv;

function getFileList(files, dir) {
  var rootDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var list = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;

      file = _path2.default.resolve(dir, file);
      try {
        var stat = _fs2.default.statSync(file);
        if (stat.isFile()) {
          list.push({
            file: file,
            rootDir: rootDir,
            size: stat.size
          });
        } else if (stat.isDirectory()) {
          list = list.concat(getFileList(_fs2.default.readdirSync(file), file, rootDir || file));
        }
      } catch (e) {
        console.warn(e.message);
        break;
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
  var count = (0, _padLeft2.default)(index + 1, length.toString().length, '0');
  var list = ['[' + count + '/' + length + ']', _cliColor2.default.greenBright(file), _cliColor2.default.blackBright('[' + (0, _prettyBytes2.default)(size) + ']')];
  if (loaded != total) {
    list.push(_cliColor2.default.redBright('[' + Math.floor(loaded / total * 100) + '%]'));
  }
  (0, _logUpdate2.default)(list.join(' '));
}

function printError(index, length, file, error) {
  var count = (0, _padLeft2.default)(index + 1, length.toString().length, '0');
  var list = ['[' + count + '/' + length + ']', _cliColor2.default.greenBright(file), _cliColor2.default.redBright('[' + (error.message || error) + ']')];
  (0, _logUpdate2.default)(list.join(' '));
  _logUpdate2.default.done();
}
