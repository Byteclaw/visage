import { ThemeResolverMap } from './types';
import { RawStylerFunction, themeKeyResolver } from '../styleSheet';

/**
 * Default resolver for colors
 */
const color: RawStylerFunction<any> = function resolveColor(
  propName: string,
  value: any,
  ctx,
) {
  return ctx.resolve('colors', value, ctx);
};

export const resolvers: ThemeResolverMap<'color' | 'themeKey'> = {
  color,
  themeKey: themeKeyResolver,
};
