import { ThemeCreator } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  ScaleValue,
  getScaleValue,
} from '@byteclaw/visage-utils';
import ModularScale, { ratios } from 'modular-scale';
import { CSSProperties } from 'react';

export { ratios };

export interface NPointThemeSettings {
  baseFontSize: number;
  baseLineHeightRatio: number;
  baselineGridSize: number;
  fontScaleRatio: number;
  colors: {
    bodyText: string | ScaleValue<string>;
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
type StyleAliases = {
  [K in keyof CSSProperties]: Exclude<
    keyof NPointThemeSettings,
    | 'baseFontSize'
    | 'baselineGridSize'
    | 'baseLineHeightRatio'
    | 'fontScaleRatio'
  >
};

enum PropCalculationType {
  modular,
  modularMultiplier,
  multiplier,
}

interface PropCalculationTypes {
  [key: string]: PropCalculationType;
}

const defaultPropCalculationTypes: PropCalculationTypes = {
  fontSize: PropCalculationType.modular,
  lineHeight: PropCalculationType.modularMultiplier,
  margin: PropCalculationType.multiplier,
  marginBottom: PropCalculationType.multiplier,
  marginLeft: PropCalculationType.multiplier,
  marginRight: PropCalculationType.multiplier,
  marginTop: PropCalculationType.multiplier,
  padding: PropCalculationType.multiplier,
  paddingBottom: PropCalculationType.multiplier,
  paddingLeft: PropCalculationType.multiplier,
  paddingRight: PropCalculationType.multiplier,
  paddingTop: PropCalculationType.multiplier,
};

export function createNPointTheme(
  theme: NPointThemeSettings,
  aliases: StyleAliases = {},
  propCalculationTypes: PropCalculationTypes = {},
): ThemeCreator {
  const calculationTypes = {
    ...defaultPropCalculationTypes,
    ...propCalculationTypes,
  };
  const baseLineHeight = theme.baseFontSize * theme.baseLineHeightRatio;
  const alignedBaseLineHeight =
    Math.round(baseLineHeight / theme.baselineGridSize) *
    theme.baselineGridSize;
  const modularScale = ModularScale({
    base: theme.baseFontSize,
    ratio: theme.fontScaleRatio,
  });
  return function themeCreator(breakpoint: number) {
    return {
      breakpoint() {
        return breakpoint;
      },
      resolve(cssProp: any, cssPropValue: any, defaultValue: any) {
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
          switch (calculationTypes[cssProp]) {
            case PropCalculationType.modular:
              return `${Math.round(modularScale(value))}px`;
            case PropCalculationType.modularMultiplier: {
              // compute the font size and then compute line height with respect to the font size
              // and baseline grid units, so it is always a multiple of baseline grid units
              const fontSize = modularScale(value);
              const lineHeightCoefficient = Math.ceil(
                fontSize / alignedBaseLineHeight,
              );
              const alignedLineHeight =
                lineHeightCoefficient * alignedBaseLineHeight;

              return `${alignedLineHeight}px`;
            }
            case PropCalculationType.multiplier: {
              return theme.baselineGridSize * value;
            }
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
      stylers() {
        return {
          /* 
          // @TODO we need more robust solution
          borderWidth(t, propValue, componentProps, styleProps) {
            const margin =
              styleProps.margin ||
              styleProps.marginTop ||
              styleProps.marginBottom;
            const borderWidth = t.resolve(
              'borderWidth',
              propValue,
              undefined,
              componentProps,
              styleProps,
            );

            if (margin == null) {
              return {
                borderWidth,
                marginTop: -borderWidth,
                marginBottom: -borderWidth,
              };
            }

            const marginSize = t.resolve(
              'margin',
              margin,
              undefined,
              componentProps,
              styleProps,
            );

            return {
              borderWidth,
              marginBottom: marginSize - borderWidth,
              marginTop: marginSize - borderWidth,
            };
          }, */
        };
      },
    };
  };
}
