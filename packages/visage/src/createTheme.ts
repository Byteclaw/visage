import { ThemeCreator } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  ScaleValue,
  getScaleValue,
} from '@byteclaw/visage-utils';
import { CSSProperties } from 'react';

export interface ThemeSettings {
  colors: {
    primary: string | ScaleValue<string>;
    primaryText: string | ScaleValue<string>;
    [name: string]: string | ScaleValue<string>;
  };
  fontSizes: ScaleValue<number | string>;
  fontFamilies: {
    body: string;
    heading: string;
    [name: string]: string;
  };
  lineHeights: ScaleValue<number | string>;
  spacings: ScaleValue<number | string>;
}

/**
 * A map of css prop name to theme key name
 */
type StyleAliases = { [K in keyof CSSProperties]: keyof ThemeSettings };

export function createTheme(
  theme: ThemeSettings,
  aliases: StyleAliases = {},
): ThemeCreator {
  return function themeCreator(breakpoint: number) {
    return {
      breakpoint() {
        return breakpoint;
      },
      resolve(cssProp, cssPropValue, defaultValue) {
        // resolve style value
        const value = getResponsiveValue(
          breakpoint,
          defaultValue,
          cssPropValue,
        );

        if (value == null) {
          return value;
        }

        const alias = aliases[cssProp as keyof CSSProperties];

        if (alias == null) {
          return value;
        }

        // now look if given theme prop is scale or hash of scales
        if (alias === 'colors') {
          // parse color to scale value
          const [colorName, colorShade] = value.split('.');
          const color = theme[alias][colorName];

          if (color == null) {
            return value;
          }

          if (typeof color === 'string') {
            return color;
          }

          return getScaleValue(color, Number(colorShade));
        }

        if (alias === 'fontFamilies') {
          const fontFamily = theme[alias][value];

          return fontFamily || value;
        }

        return getScaleValue(theme[alias], value);
      },
    };
  };
}
