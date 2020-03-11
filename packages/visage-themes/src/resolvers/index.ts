import { StyleValueResolver } from '@byteclaw/visage-core';

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
    return themeKeyValue.replace(/([a-zA-Z0-9.\-_]+)/g, part => {
      return ctx.resolvers.color('color', part, ctx) as any;
    });
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
