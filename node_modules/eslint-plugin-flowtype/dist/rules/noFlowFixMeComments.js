'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var schema = [{
  type: 'string'
}];

var message = '$FlowFixMe is treated as `any` and should be fixed.';

var isIdentifier = function isIdentifier(node, name) {
  return node && node.type === 'Identifier' && node.name.match(name);
};

var create = function create(context) {
  var allowedPattern = context.options[0] ? new RegExp(context.options[0]) : null;
  var extraMessage = allowedPattern ? ' Fix it or match `' + allowedPattern.toString() + '`.' : '';

  var passesExtraRegex = function passesExtraRegex(value) {
    if (!allowedPattern) {
      return false;
    }

    return value.match(allowedPattern);
  };

  var handleComment = function handleComment(comment) {
    var value = comment.value.trim();

    if (value.match(/\$FlowFixMe/) && !passesExtraRegex(value)) {
      context.report(comment, message + extraMessage);
    }
  };

  return {
    BlockComment: handleComment,
    GenericTypeAnnotation: function GenericTypeAnnotation(node) {
      if (isIdentifier(node.id, /\$FlowFixMe/)) {
        context.report({
          message,
          node: node.id
        });
      }
    },
    LineComment: handleComment
  };
};

exports.default = {
  create,
  schema
};
module.exports = exports['default'];