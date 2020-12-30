import parseColor from 'color';
import { ThemeResolverMap } from './types';
import { RawStylerFunction, themeKeyResolver } from '../styleSheet';
import * as parser from '../colorModParser';

interface ParserResult {
  (ctx: any, colorLib: typeof parseColor): string;
}

const unableToParserColorErrorMessage = 'Unable to parse color from string: ';

/**
 * Default resolver for colors
 */
const color: RawStylerFunction<any> = function resolveColor(
  propName: string,
  value: any,
  ctx,
) {
  const colors = new Set<string>();
  let valueToResolve = value;

  while (true) {
    // if we detect infinite cycle, we just return the value to resolve

    if (colors.has(valueToResolve)) {
      return valueToResolve;
    }

    colors.add(valueToResolve);

    try {
      const resolve = parser.parse(valueToResolve) as ParserResult;

      return resolve(ctx, parseColor);
    } catch (e) {
      // first try to resolve the color against the theme
      // if value is the same, then try to parse it again
      const resolvedColorFromTheme = ctx.resolve('colors', valueToResolve, ctx);

      if (valueToResolve === resolvedColorFromTheme) {
        // try to parse again
        continue;
      }

      if (e instanceof Error) {
        if (e.message.startsWith(unableToParserColorErrorMessage)) {
          valueToResolve = e.message.replace(
            unableToParserColorErrorMessage,
            '',
          );
        }
      }
    }
  }
};

/**
 * Default resolver for borderRadius and border*Radius
 */
export const borderRadius: RawStylerFunction<any> = function resolveBorderRadius(
  propName: string,
  value: any,
  ctx,
) {
  const valueForExactPropName = themeKeyResolver(propName, value, ctx);

  if (valueForExactPropName === value) {
    // there is probably no value, try to use borderRadius value
    return themeKeyResolver('borderRadius', value, ctx);
  }

  return valueForExactPropName;
};

export const resolvers: ThemeResolverMap<
  'color' | 'borderRadius' | 'themeKey'
> = {
  color,
  borderRadius,
  themeKey: themeKeyResolver,
};
