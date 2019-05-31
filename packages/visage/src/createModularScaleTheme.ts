import { ThemeCreator } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  ScaleValue,
  getScaleValue,
} from '@byteclaw/visage-utils';
import { CSSProperties } from 'react';

export interface ModularScaleThemeSettings {
  baseFontSize: number;
  lineHeightRatio: number;
  scaleFactor: number;
  colors: {
    primary: string | ScaleValue<string>;
    primaryText: string | ScaleValue<string>;
    [name: string]: string | ScaleValue<string>;
  };
  fontFamilies: {
    body: string;
    heading: string;
    [name: string]: string;
  };
}

/**
 * A map of css prop name to theme key name
 */
type ModularScaleThemeStyleAliases = {
  [K in keyof CSSProperties]: Exclude<
    keyof ModularScaleThemeSettings,
    'baseFontSize' | 'lineHeightRatio' | 'scaleFactor'
  >
};

const ratioProps: { [key: string]: boolean } = {
  fontSize: true,
};

const multiplicatorProps: { [key: string]: true } = {
  lineHeight: true,
  margin: true,
  marginBottom: true,
  marginLeft: true,
  marginRight: true,
  marginTop: true,
  padding: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingRight: true,
  paddingTop: true,
};

export function createModularScaleTheme(
  theme: ModularScaleThemeSettings,
  aliases: ModularScaleThemeStyleAliases = {},
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

        if (typeof value === 'number') {
          if (ratioProps[cssProp]) {
            const computedValue =
              value < 0
                ? theme.baseFontSize / theme.scaleFactor ** Math.abs(value)
                : theme.baseFontSize * theme.scaleFactor ** value;

            return `${Math.round(computedValue)}px`;
          }

          if (multiplicatorProps[cssProp] != null) {
            /* const computedValue =
              value < 0
                ? theme.base /
                  theme.ratio ** (Math.abs(value) + addedRatioProps[cssProp])
                : theme.base *
                  theme.ratio ** (value + addedRatioProps[cssProp]);
                  */
            const computedValue =
              value < 0
                ? Math.round(theme.baseFontSize * theme.lineHeightRatio) /
                  (Math.abs(value) + 1)
                : Math.round(theme.baseFontSize * theme.lineHeightRatio) *
                  (value + 1);

            return `${computedValue}px`;
          }
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

        return undefined;
      },
    };
  };
}
