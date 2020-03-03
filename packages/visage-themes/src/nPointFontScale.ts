import { ColorPalette, FontPalette, Theme } from '@byteclaw/visage';
import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  getScaleValue,
  ScaleValue,
} from '@byteclaw/visage-utils';
import { boxShadow, gridSize } from './resolvers';
import { stylers } from './stylers';

export interface NPointFontScaleThemeSettings extends ThemeSettings {
  fontSize: ScaleValue<number | number[]>;
  lineHeights: ScaleValue<number | number[]>;
  baseGridSize: number;
  borderRadius:
    | number
    | string
    | {
        controlBorderRadius?: number | string;
        [name: string]: undefined | number | string;
      };
  colors: ColorPalette;
  fontFamily: FontPalette;
}

/**
 * Creates N-point font scale theme
 */
export function createNPointFontScaleTheme(
  settings: NPointFontScaleThemeSettings,
): Theme {
  return createTheme<
    any,
    'boxShadow' | 'gridSize' | 'scaleLineHeight' | 'scaleSize'
  >({
    resolvers: {
      boxShadow,
      gridSize,
      scaleSize(propName, value, _, breakpoint) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          if (Array.isArray(settings.fontSize.values[numericValue])) {
            return getResponsiveValue(
              breakpoint,
              getScaleValue(settings.fontSize, numericValue),
            );
          }

          return getScaleValue(settings.fontSize, numericValue);
        }

        return value;
      },
      scaleLineHeight(propName, value, _, breakpoint) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          if (Array.isArray(settings.lineHeights.values[numericValue])) {
            return getResponsiveValue(
              breakpoint,
              getScaleValue(settings.lineHeights, numericValue),
              numericValue,
            );
          }

          return getScaleValue(settings.lineHeights, numericValue);
        }

        return value;
      },
    },
    stylers: {
      fontSize: {
        format: 'px',
        resolver: 'scaleSize',
      },
      /**
       * Calculates fontSize and lineHeight for svg icons
       */
      iconSize: {
        format: 'px',
        resolver: 'scaleLineHeight',
        outputProps: ['fontSize', 'lineHeight'],
      },
      lineHeight: {
        format: 'px',
        resolver: 'scaleLineHeight',
      },
      /**
       * Calculates a height based similarly to lineHeight
       */
      linedHeight: {
        format: 'px',
        resolver: 'scaleLineHeight',
        outputProps: ['height'],
      },
      linedWidth: {
        format: 'px',
        resolver: 'scaleLineHeight',
        outputProps: ['width'],
      },
      plOffset: {
        format: 'px',
        resolver: 'scaleLineHeight',
        outputProps: ['paddingLeft'],
      },
      prOffset: {
        format: 'px',
        resolver: 'scaleLineHeight',
        outputProps: ['paddingRight'],
      },
      ...stylers,
    },
    theme: settings,
  });
}
