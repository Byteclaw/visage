import { StyleSheetThemeSettings, Theme } from '@byteclaw/visage-core';
import {
  getResponsiveValue,
  getScaleValue,
  ScaleValue,
} from '@byteclaw/visage-utils';
import { boxShadow, gridSize } from './resolvers';
import { stylers } from './stylers';
import { BorderRadiuses, ColorPalette, FontPalette } from '../types';
import { VisageFaces } from '../faces';
import { createTheme } from '../core';

export interface NPointFontScaleThemeSettings
  extends StyleSheetThemeSettings<VisageFaces> {
  fontSize: ScaleValue<string | number | (number | string)[]>;
  lineHeights: ScaleValue<string | number | (string | number)[]>;
  baseGridSize: number;
  borderRadius: BorderRadiuses;
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
    'boxShadow' | 'gridSize' | 'scaleLineHeight' | 'scaleSize',
    any,
    VisageFaces
  >({
    resolvers: {
      boxShadow,
      gridSize,
      scaleSize(propName, value, ctx) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          const val = getScaleValue(settings.fontSize, numericValue);

          return Array.isArray(val)
            ? getResponsiveValue(
                ctx.breakpoint,
                getScaleValue(settings.fontSize, numericValue),
              )
            : val;
        }

        return value;
      },
      scaleLineHeight(propName, value, ctx) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          const val = getScaleValue(settings.lineHeights, numericValue);

          return Array.isArray(val)
            ? getResponsiveValue(
                ctx.breakpoint,
                getScaleValue(settings.lineHeights, numericValue),
              )
            : val;
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
      ...stylers,
    },
    theme: settings,
  });
}
