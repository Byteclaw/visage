import { ColorPalette, FontPalette, Theme } from '@byteclaw/visage';
import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import { getResponsiveValue } from '@byteclaw/visage-utils';
import ModularScale, {
  modularScale as ModularScaleType,
  ratios as modularScaleFontRatios,
} from 'modular-scale';
import { boxShadowColor, gridSize } from './resolvers';
import { stylers } from './stylers';

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
      ...stylers,
    },
    theme: settings,
  });
}
