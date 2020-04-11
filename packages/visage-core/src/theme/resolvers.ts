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

export const resolvers: ThemeResolverMap<'color' | 'themeKey'> = {
  color,
  themeKey: themeKeyResolver,
};
