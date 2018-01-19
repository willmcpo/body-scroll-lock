'use strict';Object.defineProperty(exports, "__esModule", { value: true });










var _jestMatcherUtils = require('jest-matcher-utils');
var _chalk = require('chalk');var _chalk2 = _interopRequireDefault(_chalk);
var _jestDiff = require('jest-diff');var _jestDiff2 = _interopRequireDefault(_jestDiff);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                       * Copyright (c) 2017-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                       *
                                                                                                                                                                                       * This source code is licensed under the MIT license found in the
                                                                                                                                                                                       * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                       *
                                                                                                                                                                                       * 
                                                                                                                                                                                       */




const assertOperatorsMap = {
  '!=': 'notEqual',
  '!==': 'notStrictEqual',
  '==': 'equal',
  '===': 'strictEqual' };


const humanReadableOperators = {
  deepEqual: 'to deeply equal',
  deepStrictEqual: 'to deeply and strictly equal',
  notDeepEqual: 'not to deeply equal',
  notDeepStrictEqual: 'not to deeply and strictly equal' };


const getOperatorName = (operator, stack) => {
  if (typeof operator === 'string') {
    return assertOperatorsMap[operator] || operator;
  }
  if (stack.match('.doesNotThrow')) {
    return 'doesNotThrow';
  }
  if (stack.match('.throws')) {
    return 'throws';
  }
  return '';
};

const operatorMessage = (operator, negator) =>
typeof operator === 'string' ?
operator.startsWith('!') || operator.startsWith('=') ?
`${negator ? 'not ' : ''}to be (operator: ${operator}):\n` :
`${humanReadableOperators[operator] || operator} to:\n` :
'';

const assertThrowingMatcherHint = operatorName => {
  return (
    _chalk2.default.dim('assert') +
    _chalk2.default.dim('.' + operatorName + '(') +
    _chalk2.default.red('function') +
    _chalk2.default.dim(')'));

};

const assertMatcherHint = (operator, operatorName) => {
  let message =
  _chalk2.default.dim('assert') +
  _chalk2.default.dim('.' + operatorName + '(') +
  _chalk2.default.red('received') +
  _chalk2.default.dim(', ') +
  _chalk2.default.green('expected') +
  _chalk2.default.dim(')');

  if (operator === '==') {
    message +=
    ' or ' +
    _chalk2.default.dim('assert') +
    _chalk2.default.dim('(') +
    _chalk2.default.red('received') +
    _chalk2.default.dim(') ');
  }

  return message;
};

function assertionErrorMessage(error, options) {const
  expected = error.expected,actual = error.actual,message = error.message,operator = error.operator,stack = error.stack;
  const diffString = (0, _jestDiff2.default)(expected, actual, options);
  const negator =
  typeof operator === 'string' && (
  operator.startsWith('!') || operator.startsWith('not'));
  const hasCustomMessage = !error.generatedMessage;
  const operatorName = getOperatorName(operator, stack);

  if (operatorName === 'doesNotThrow') {
    return (
      assertThrowingMatcherHint(operatorName) +
      '\n\n' +
      _chalk2.default.reset(`Expected the function not to throw an error.\n`) +
      _chalk2.default.reset(`Instead, it threw:\n`) +
      `  ${(0, _jestMatcherUtils.printReceived)(actual)}` +
      _chalk2.default.reset(hasCustomMessage ? '\n\nMessage:\n  ' + message : '') +
      stack.replace(/AssertionError(.*)/g, ''));

  }

  if (operatorName === 'throws') {
    return (
      assertThrowingMatcherHint(operatorName) +
      '\n\n' +
      _chalk2.default.reset(`Expected the function to throw an error.\n`) +
      _chalk2.default.reset(`But it didn't throw anything.`) +
      _chalk2.default.reset(hasCustomMessage ? '\n\nMessage:\n  ' + message : '') +
      stack.replace(/AssertionError(.*)/g, ''));

  }

  return (
    assertMatcherHint(operator, operatorName) +
    '\n\n' +
    _chalk2.default.reset(`Expected value ${operatorMessage(operator, negator)}`) +
    `  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
    _chalk2.default.reset(`Received:\n`) +
    `  ${(0, _jestMatcherUtils.printReceived)(actual)}` +
    _chalk2.default.reset(hasCustomMessage ? '\n\nMessage:\n  ' + message : '') + (
    diffString ? `\n\nDifference:\n\n${diffString}` : '') +
    stack.replace(/AssertionError(.*)/g, ''));

}exports.default =

assertionErrorMessage;