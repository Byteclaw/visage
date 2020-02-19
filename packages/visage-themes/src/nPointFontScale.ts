import { ColorPalette, FontPalette, Theme } from '@byteclaw/visage';
import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  getScaleValue,
  ScaleValue,
} from '@byteclaw/visage-utils';
import { boxShadowColor, gridSize } from './resolvers';

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
    'boxShadowColor' | 'gridSize' | 'scaleLineHeight' | 'scaleSize'
  >({
    resolvers: {
      boxShadowColor,
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
      boxShadow: {
        resolver: 'boxShadowColor',
      },
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
      m: { format: 'px', resolver: 'gridSize', outputProps: ['margin'] },
      margin: { format: 'px', resolver: 'gridSize' },
      my: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginTop', 'marginBottom'],
      },
      mx: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginLeft', 'marginRight'],
      },
      mb: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginBottom'],
      },
      marginBottom: { format: 'px', resolver: 'gridSize' },
      marginLeft: { format: 'px', resolver: 'gridSize' },
      marginRight: { format: 'px', resolver: 'gridSize' },
      marginTop: { format: 'px', resolver: 'gridSize' },
      ml: { format: 'px', resolver: 'gridSize', outputProps: ['marginLeft'] },
      mr: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['marginRight'],
      },
      mt: { format: 'px', resolver: 'gridSize', outputProps: ['marginTop'] },
      p: { format: 'px', resolver: 'gridSize', outputProps: ['padding'] },
      padding: { format: 'px', resolver: 'gridSize' },
      py: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingTop', 'paddingBottom'],
      },
      px: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingLeft', 'paddingRight'],
      },
      paddingBottom: { format: 'px', resolver: 'gridSize' },
      paddingLeft: { format: 'px', resolver: 'gridSize' },
      paddingRight: { format: 'px', resolver: 'gridSize' },
      paddingTop: { format: 'px', resolver: 'gridSize' },
      pb: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingBottom'],
      },
      pl: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingLeft'],
      },
      pr: {
        format: 'px',
        resolver: 'gridSize',
        outputProps: ['paddingRight'],
      },
      pt: { format: 'px', resolver: 'gridSize', outputProps: ['paddingTop'] },
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
    },
    theme: settings,
  });
}
