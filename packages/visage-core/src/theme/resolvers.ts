import { isScaleValue, getScaleValue } from '@byteclaw/visage-utils';
import {
  ThemeResolverFunction,
  ThemeResolverMap,
  ThemeSettings,
} from './types';
import { parseScaleValuePath } from './utils';

/**
 * Default resolver for colors
 */
const color: ThemeResolverFunction = function color(
  propName: string,
  value: any,
  { themeSettings },
) {
  // color supports scale values
  const [propertyName, shade] = parseScaleValuePath(value);
  const { colors } = themeSettings;

  if (colors == null) {
    return value;
  }

  if (typeof colors === 'object') {
    if (isScaleValue(colors)) {
      return getScaleValue(colors, shade) || value;
    }

    const colorToUse = colors[propertyName];

    if (colorToUse == null) {
      return value;
    }

    return (
      (isScaleValue(colorToUse)
        ? getScaleValue(colorToUse, shade)
        : colorToUse) || value
    );
  }

  return colors;
};

/**
 * Resolves against theme's key
 */
const themeKey: ThemeResolverFunction = function themeKey(
  propName: string,
  value: any,
  { themeSettings, ...ctx },
): any {
  if (value == null) {
    return value;
  }

  const themeValue = themeSettings[propName];

  switch (typeof themeValue) {
    case 'undefined':
      return value;
    case 'object': {
      // theme value is object, it can be null, ScaleValue or nested object
      if (themeValue == null) {
        return themeValue;
      }

      const [propertyName, scaleIndex] = parseScaleValuePath(value);

      if (isScaleValue(themeValue)) {
        // there is a catch, basically we can support Scales that are not nested and the offset
        // can be set up directly as fontSize={-1} for example

        return getScaleValue(themeValue, scaleIndex) || value;
      }

      // nested object, resolve again
      return themeKey(propertyName, scaleIndex, {
        ...ctx,
        themeSettings: themeValue as ThemeSettings,
      });
    }
    default:
      return themeValue;
  }
};

export const resolvers: ThemeResolverMap<'color' | 'themeKey'> = {
  color,
  themeKey,
};
