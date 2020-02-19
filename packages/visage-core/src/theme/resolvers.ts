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

    if (Array.isArray(colors)) {
      throw new Error('Theme property `colors` cannot contain an array');
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

const fontFamily: ThemeResolverFunction = function fontFamily(
  propName: string,
  value: any,
  { themeSettings },
) {
  if (value == null) {
    return value;
  }

  const themeValue = themeSettings[propName];

  if (
    typeof themeValue !== 'object' ||
    themeValue == null ||
    isScaleValue(themeValue) ||
    Array.isArray(themeValue)
  ) {
    throw new Error('Theme.fontFamily is not an object');
  }

  const font = themeValue[value];

  return typeof font === 'string' ? font : value;
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

      // return array theme values as is
      if (Array.isArray(themeValue)) {
        return themeValue;
      }

      const [propertyName, scaleIndex] = parseScaleValuePath(value);

      if (isScaleValue(themeValue)) {
        // there is a catch, basically we can support Scales that are not nested and the offset
        // can be set up directly as fontSize={-1} for example

        return getScaleValue(themeValue, scaleIndex) || value;
      }

      return (
        themeKey(propertyName, scaleIndex, {
          ...ctx,
          themeSettings: themeValue as ThemeSettings,
        }) || value
      );
    }
    default:
      return themeValue;
  }
};

export const resolvers: ThemeResolverMap<
  'color' | 'fontFamily' | 'themeKey'
> = {
  color,
  fontFamily,
  themeKey,
};
