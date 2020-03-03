import { ThemeResolverFunction, resolvers } from '@byteclaw/visage-core';

/**
 * Resolves box shadow agains theme and then tries to resolve colors against theme
 */
export const boxShadow: ThemeResolverFunction = function resolveBoxShadow(
  propName,
  value: string,
  ctx,
  breakpoint,
) {
  // first try to resolvea against theme
  // and then apply colors
  const themeKeyValue = resolvers.themeKey(propName, value, ctx, breakpoint);

  if (typeof themeKeyValue === 'string') {
    return themeKeyValue.replace(/([a-zA-Z0-9.\-_]+)/g, part => {
      return ctx.resolve(propName, 'color', part, breakpoint);
    });
  }

  return themeKeyValue;
};

/**
 * Resolver responsible for calculating sizes based on base grid size
 * and multiplier
 */
export const gridSize: ThemeResolverFunction = function gridSize(
  propName,
  value,
  { themeSettings },
) {
  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return (themeSettings.baseGridSize as number) * numericValue;
  }

  return value;
};
