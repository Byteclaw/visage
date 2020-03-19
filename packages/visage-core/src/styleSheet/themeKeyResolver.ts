import {
  isScaleValue,
  getScaleValue,
  parseScaleValuePath,
} from '@byteclaw/visage-utils';
import { StyleValueResolver } from './types';

export const themeKeyResolver: StyleValueResolver = (propName, value, ctx) => {
  if (value == null) {
    return value;
  }

  const { theme } = ctx;
  const themeValue = theme[propName as keyof typeof theme];

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

      const nestedValue = themeKeyResolver(propertyName, value, {
        ...ctx,
        // pass the theme value down because we are resolving nested value
        // for examle borderRadius.controlBorderRadus
        theme: themeValue,
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
