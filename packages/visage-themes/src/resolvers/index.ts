import { StyleValueResolver } from '@byteclaw/visage-core';
import { parse } from '../boxShadowParser';

type BoxShadowParseResult = { color: string }[] | string;

/**
 * Resolves box shadow agains theme and then tries to resolve colors against theme
 */
export const boxShadow: StyleValueResolver = function resolveBoxShadow(
  propName,
  value,
  ctx,
) {
  // first try to resolvea against theme
  // and then apply colors
  const themeKeyValue = ctx.resolvers.themeKey(propName, value, ctx);

  if (!ctx.resolvers.color) {
    throw new Error('Color resolver is missing');
  }

  if (typeof themeKeyValue === 'string') {
    try {
      const result = parse(themeKeyValue) as BoxShadowParseResult;

      if (Array.isArray(result)) {
        // parser, try to map colors
        return result.reduce(
          (finalBoxShadow, { color }) =>
            finalBoxShadow.replace(
              color,
              ctx.resolvers.color('color', color, ctx) as any,
            ),
          themeKeyValue,
        );
      }
    } catch (e) {
      // do nothing, returns as is
    }
  }

  return themeKeyValue;
};

/**
 * Resolver responsible for calculating sizes based on base grid size
 * and multiplier
 */
export const gridSize: StyleValueResolver = function gridSize(
  propName,
  value,
  { theme },
) {
  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return (theme.baseGridSize as number) * numericValue;
  }

  return value;
};
