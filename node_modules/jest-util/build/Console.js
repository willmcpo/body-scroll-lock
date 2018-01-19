'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _util;











function _load_util() {return _util = require('util');}var _console;
function _load_console() {return _console = require('console');}var _clear_line;
function _load_clear_line() {return _clear_line = _interopRequireDefault(require('./clear_line'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                  * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                  *
                                                                                                                                                                                                  * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                  * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                  *
                                                                                                                                                                                                  * 
                                                                                                                                                                                                  */ /* global stream$Writable */class CustomConsole extends (_console || _load_console()).Console {
  constructor(
  stdout,
  stderr,
  formatBuffer)
  {
    super(stdout, stderr);
    this._formatBuffer = formatBuffer || ((type, message) => message);
  }

  _log(type, message) {
    (0, (_clear_line || _load_clear_line()).default)(this._stdout);
    super.log(this._formatBuffer(type, message));
  }

  log() {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
    this._log('log', (_util || _load_util()).format.apply(null, arguments));
  }

  info() {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
    this._log('info', (_util || _load_util()).format.apply(null, arguments));
  }

  warn() {for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}
    this._log('warn', (_util || _load_util()).format.apply(null, arguments));
  }

  error() {for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
    this._log('error', (_util || _load_util()).format.apply(null, arguments));
  }

  getBuffer() {
    return null;
  }}exports.default = CustomConsole;