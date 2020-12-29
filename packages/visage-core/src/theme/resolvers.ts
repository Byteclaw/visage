import parseColor from 'color';
import { ThemeResolverMap } from './types';
import { RawStylerFunction, themeKeyResolver } from '../styleSheet';
import * as parser from '../colorModParser';

interface ParserResult {
  (ctx: any, colorLib: typeof parseColor): string;
}

/**
 * Default resolver for colors
 */
const color: RawStylerFunction<any> = function resolveColor(
  propName: string,
  value: any,
  ctx,
) {
  try {
    const resolve = parser.parse(value) as ParserResult;

    return resolve(ctx, parseColor);
  } catch (e) {
    return ctx.resolve('colors', value, ctx);
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
