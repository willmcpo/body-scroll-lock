'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var schema = [];

var create = function create(context) {
  return {
    ArrayTypeAnnotation(node) {
      context.report({
        fix(fixer) {
          var rawElementType = context.getSourceCode().getText(node.elementType);

          return fixer.replaceText(node, '$ReadOnlyArray<' + rawElementType + '>');
        },
        message: 'Use "$ReadOnlyArray" instead of array shorthand notation',
        node
      });
    },
    GenericTypeAnnotation(node) {
      if (node.id.name === 'Array') {
        context.report({
          fix(fixer) {
            return fixer.replaceText(node.id, '$ReadOnlyArray');
          },
          message: 'Use "$ReadOnlyArray" instead of "Array"',
          node
        });
      }
    }
  };
};

exports.default = {
  create,
  schema
};
module.exports = exports['default'];