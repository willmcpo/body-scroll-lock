'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _console;










function _load_console() {return _console = require('console');}var _util;
function _load_util() {return _util = require('util');}var _callsites;
function _load_callsites() {return _callsites = _interopRequireDefault(require('callsites'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                             * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                             *
                                                                                                                                                                                             * This source code is licensed under the MIT license found in the
                                                                                                                                                                                             * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                             *
                                                                                                                                                                                             * 
                                                                                                                                                                                             */class BufferedConsole extends (_console || _load_console()).Console {constructor() {const buffer = [];super({ write: message => BufferedConsole.write(buffer, 'log', message) });
    this._buffer = buffer;
  }

  static write(
  buffer,
  type,
  message,
  level)
  {
    const call = (0, (_callsites || _load_callsites()).default)()[level != null ? level : 2];
    const origin = call.getFileName() + ':' + call.getLineNumber();
    buffer.push({ message, origin, type });
    return buffer;
  }

  log() {
    BufferedConsole.write(this._buffer, 'log', (_util || _load_util()).format.apply(null, arguments));
  }

  info() {
    BufferedConsole.write(this._buffer, 'info', (_util || _load_util()).format.apply(null, arguments));
  }

  warn() {
    BufferedConsole.write(this._buffer, 'warn', (_util || _load_util()).format.apply(null, arguments));
  }

  error() {
    BufferedConsole.write(this._buffer, 'error', (_util || _load_util()).format.apply(null, arguments));
  }

  getBuffer() {
    return this._buffer;
  }}exports.default = BufferedConsole;