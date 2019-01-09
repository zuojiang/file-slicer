'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _busboy = require('busboy');

var _busboy2 = _interopRequireDefault(_busboy);

var _rangeParser3 = require('range-parser');

var _rangeParser4 = _interopRequireDefault(_rangeParser3);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _jsBase = require('js-base64');

var _camelcaseKeys2 = require('camelcase-keys');

var _camelcaseKeys3 = _interopRequireDefault(_camelcaseKeys2);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTmpDir = _path2.default.join(_os2.default.tmpdir(), _package2.default.name);

module.exports = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tmpDir = _ref.tmpDir,
      tmpDir = _ref$tmpDir === undefined ? defaultTmpDir : _ref$tmpDir;

  (0, _mkdirp2.default)(tmpDir);
  return function (req, res, next) {
    var headers = req.headers;
    // console.log(headers);

    var _camelcaseKeys = (0, _camelcaseKeys3.default)(headers),
        xFileId = _camelcaseKeys.xFileId,
        xFileSize = _camelcaseKeys.xFileSize,
        xFileName = _camelcaseKeys.xFileName,
        range = _camelcaseKeys.range;

    var id = xFileId || (0, _v2.default)();
    var name = null,
        filePath = null;
    var finished = true;

    var busboy = new _busboy2.default({ headers: headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var stream = null;
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
        var ext = _path2.default.extname(name);
        filePath = _path2.default.join(tmpDir, id + ext);
        var size = parseInt(xFileSize);

        var _rangeParser = (0, _rangeParser4.default)(size, range),
            _rangeParser2 = _slicedToArray(_rangeParser, 1),
            _rangeParser2$ = _rangeParser2[0],
            start = _rangeParser2$.start,
            end = _rangeParser2$.end;

        finished = end + 1 == size;
        stream = _fs2.default.createWriteStream(filePath, {
          flags: 'a',
          encoding: 'binary',
          start: start,
          end: end
        });
      } else {
        name = filename;
        (0, _mkdirp2.default)(_path2.default.join(tmpDir, id));
        filePath = _path2.default.join(tmpDir, id, name);
        stream = _fs2.default.createWriteStream(filePath, {
          flags: 'w',
          encoding: 'binary'
        });
      }
      file.pipe(stream);
    });
    busboy.on('finish', function () {
      if (finished) {
        req.file = {
          name: name,
          path: filePath
        };
        next();
      } else {
        res.writeHead(204, {
          'X-File-Id': id,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'text/plain'
        });
        res.end();
      }
    });
    req.pipe(busboy);
  };
};