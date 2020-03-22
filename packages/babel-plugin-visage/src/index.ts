/* eslint-disable no-param-reassign */
import * as babel from '@babel/core';

function isSimpleStyleSheetObjectExpression(
  path: babel.NodePath<babel.types.ObjectExpression>,
): boolean {
  if (!path.isImmutable()) {
    if (path.isPure()) {
      // it can contain string literals so try to evaluate it
      const expressionResult = path.evaluate();

      if (expressionResult.confident) {
        // we know the result, check its immutablity
        const { value } = expressionResult;

        // value can be only object in that case freeze it
        if (typeof value === 'object') {
          return true;
        }

        return false;
      }
    }

    return false;
  }

  return true;
}

export default function hostVisageStylesPlugin({
  types,
  template,
}: typeof babel): babel.PluginObj {
  const freezeStyleSheet = template('Object.freeze(STYLE_SHEET)');

  return {
    name: 'visage',
    // eslint-disable-next-line global-require
    // inherits: require('@babel/plugin-syntax-jsx'),
    visitor: {
      // process only jsx styles attribute
      JSXAttribute(path) {
        const { node } = path;

        if (node.name.name !== 'styles') {
          return;
        }

        if (
          types.isJSXExpressionContainer(node.value) &&
          types.isObjectExpression(node.value.expression)
        ) {
          const expressionPath = path.get('value.expression') as babel.NodePath<
            babel.types.ObjectExpression
          >;

          if (isSimpleStyleSheetObjectExpression(expressionPath)) {
            // replace with freeze
            expressionPath.replaceWith(
              freezeStyleSheet({ STYLE_SHEET: expressionPath.node }) as any,
            );
            // @ts-ignore - hoist doesn't need a scope argument
            expressionPath.hoist();
          }
        }
      },
    },
  };
}
