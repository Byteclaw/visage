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
const color: ThemeResolverFunction = function resolveColor(
  propName: string,
  value: any,
  { themeSettings },
) {
  // color supports scale values
  const [propertyName, shade] = parseScaleValuePath(value);
  const { colors } = themeSettings;

  if (colors == null || value == null) {
    return value;
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
};

const fontFamily: ThemeResolverFunction = function resolveFontFamily(
  propName: string,
  value: any,
  { themeSettings },
) {
  const { fontFamily: fonts } = themeSettings;

  if (value == null || fonts == null) {
    return value;
  }

  return fonts[value] || value;
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

      const nestedValue = themeKey(propertyName, value, {
        ...ctx,
        themeSettings: themeValue as ThemeSettings,
      });

      // null turns off the value
      if (nestedValue === null) {
        return null;
      }

      if (nestedValue != null) {
        return nestedValue;
      }

      return value;
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
