import { ColorPalette, FontPalette, Theme } from '@byteclaw/visage';
import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import { getResponsiveValue } from '@byteclaw/visage-utils';
import ModularScale, {
  modularScale as ModularScaleType,
  ratios as modularScaleFontRatios,
} from 'modular-scale';
import { boxShadowColor, gridSize } from './resolvers';

export { modularScaleFontRatios };

export interface NPointModularScaleThemeSettings extends ThemeSettings {
  /**
   * Base font size, can be responsive
   */
  baseFontSize: number | number[];
  baseLineHeightRatio: number;
  baseGridSize: number;
  borderRadius?:
    | number
    | string
    | {
        controlBorderRadius?: number | string;
        [name: string]: undefined | number | string;
      };
  fontScaleRatio: number;
  colors: ColorPalette;
  fontFamily: FontPalette;
}

/**
 * Creates a theme based on Npoint grid system
 */
export function createNPointModularScaleTheme(
  settings: NPointModularScaleThemeSettings,
): Theme {
  const {
    baseFontSize,
    baseGridSize,
    baseLineHeightRatio,
    fontScaleRatio,
  } = settings;
  const modularScaleSettings: {
    alignedBaseLineHeight: number;
    baseLineHeight: number;
    modularScale: ModularScaleType;
  }[] = [];

  if (
    baseFontSize == null ||
    (Array.isArray(baseFontSize) && baseFontSize.length === 0)
  ) {
    throw new Error('Please set up baseFontSize');
  }

  // create responsive styles
  (typeof baseFontSize === 'number' ? [baseFontSize] : baseFontSize).forEach(
    fontSize => {
      const baseLineHeight = fontSize * baseLineHeightRatio;
      const alignedBaseLineHeight =
        Math.round(baseLineHeight / baseGridSize) * baseGridSize;
      const modularScale = ModularScale({
        base: fontSize,
        ratio: fontScaleRatio,
      });

      modularScaleSettings.push({
        alignedBaseLineHeight,
        baseLineHeight,
        modularScale,
      });
    },
  );

  return createTheme<
    any,
    'boxShadowColor' | 'gridSize' | 'modularLineHeight' | 'modularSize'
  >({
    resolvers: {
      boxShadowColor,
      gridSize,
      /**
       * Resolver responsible for calculating line height sizes based on
       * modular scale and base line height
       */
      modularLineHeight(propName, value, { resolve }, breakpoint) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          const { alignedBaseLineHeight } = getResponsiveValue(
            breakpoint,
            modularScaleSettings as any,
          );
          const modularSize = resolve(
            propName,
            'modularSize',
            value,
            breakpoint,
          );
          const lineHeightCoefficient = Math.ceil(
            modularSize / alignedBaseLineHeight,
          );
          const alignedLineHeight =
            lineHeightCoefficient * alignedBaseLineHeight;

          return alignedLineHeight;
        }

        return value;
      },
      /**
       * Resolver responsible for calculating sizes based on modular scale
       */
      modularSize(propName, value, _, breakpoint) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          const { modularScale } = getResponsiveValue(
            breakpoint,
            modularScaleSettings as any,
          );

          return modularScale(numericValue);
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
        resolver: 'modularSize',
      },
      /**
       * Calculates fontSize and lineHeight for svg icons
       */
      iconSize: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['fontSize', 'lineHeight'],
      },
      lineHeight: {
        format: 'px',
        resolver: 'modularLineHeight',
      },
      /**
       * Calculates a height based similarly to lineHeight
       */
      linedHeight: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['height'],
      },
      linedWidth: {
        format: 'px',
        resolver: 'modularLineHeight',
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
      mb: { format: 'px', resolver: 'gridSize', outputProps: ['marginBottom'] },
      marginBottom: { format: 'px', resolver: 'gridSize' },
      marginLeft: { format: 'px', resolver: 'gridSize' },
      marginRight: { format: 'px', resolver: 'gridSize' },
      marginTop: { format: 'px', resolver: 'gridSize' },
      ml: { format: 'px', resolver: 'gridSize', outputProps: ['marginLeft'] },
      mr: { format: 'px', resolver: 'gridSize', outputProps: ['marginRight'] },
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
      pl: { format: 'px', resolver: 'gridSize', outputProps: ['paddingLeft'] },
      pr: { format: 'px', resolver: 'gridSize', outputProps: ['paddingRight'] },
      pt: { format: 'px', resolver: 'gridSize', outputProps: ['paddingTop'] },
      plOffset: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['paddingLeft'],
      },
      prOffset: {
        format: 'px',
        resolver: 'modularLineHeight',
        outputProps: ['paddingRight'],
      },
    },
    theme: settings,
  });
}
