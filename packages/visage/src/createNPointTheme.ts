import { createTheme, ThemeSettings } from '@byteclaw/visage-core';
import { getResponsiveValue, ScaleValue } from '@byteclaw/visage-utils';
import ModularScale, { ratios } from 'modular-scale';
import { ColorPalette } from './types';

export { ratios };

export interface NPointThemeSettings extends ThemeSettings {
  baseFontSize: number | ScaleValue<number>;
  baseLineHeightRatio: number;
  baselineGridSize: number;
  fontScaleRatio: number;
  colors: ColorPalette;
  fontFamily: {
    body: string;
    heading: string;
    [name: string]: string;
  };
}

export function createNPointTheme(settings: NPointThemeSettings) {
  const modularScaleSettings = (typeof settings.baseFontSize === 'number'
    ? [settings.baseFontSize]
    : settings.baseFontSize.values
  ).map(baseFontSize => {
    const modularScale = ModularScale({
      base: baseFontSize,
      ratio: settings.fontScaleRatio,
    });
    const baseLineHeight = baseFontSize * settings.baseLineHeightRatio;
    const alignedBaseLineHeight =
      Math.round(baseLineHeight / settings.baselineGridSize) *
      settings.baselineGridSize;

    return {
      modularScale,
      baseLineHeight,
      alignedBaseLineHeight,
    };
  });

  return createTheme<
    any,
    'boxShadowColor' | 'gridSize' | 'modularSize' | 'modularLineHeight'
  >({
    resolvers: {
      boxShadowColor(propName, value: string, { resolve }, breakpoint) {
        // split value by whitespace
        const parts: string[] = value.split(/\s+/);

        return parts
          .map(part => resolve(propName, 'color', part, breakpoint))
          .join(' ');
      },
      // this is pseudostyler used to compute sizes based on grid size (basically multipliers)
      gridSize(propName, value) {
        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
          return settings.baselineGridSize * numericValue;
        }
        return value;
      },
      modularSize(propName, value, _, breakpoint) {
        const numericValue = Number(value);
        const { modularScale } = getResponsiveValue(
          breakpoint,
          modularScaleSettings as any,
        );

        if (!Number.isNaN(numericValue)) {
          return modularScale(numericValue);
        }

        return value;
      },
      modularLineHeight(propName, value, { resolve }, breakpoint) {
        const numericValue = Number(value);
        const { alignedBaseLineHeight } = getResponsiveValue(
          breakpoint,
          modularScaleSettings as any,
        );

        if (!Number.isNaN(numericValue)) {
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
