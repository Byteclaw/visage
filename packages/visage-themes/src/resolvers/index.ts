import { ThemeResolverFunction } from '@byteclaw/visage-core';

/**
 * Resolves colors in box shadow property
 */
export const boxShadowColor: ThemeResolverFunction = function boxShadowColor(
  propName,
  value: string,
  { resolve },
  breakpoint,
) {
  return value.replace(/([a-zA-Z0-9.\-_]+)/g, part => {
    return resolve(propName, 'color', part, breakpoint);
  });
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
