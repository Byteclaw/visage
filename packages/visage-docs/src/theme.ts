import color from 'color';
import { createContext } from 'react';
import { createScaleTheme, ratios, ColorPalette } from '@byteclaw/visage';

export const ThemeTogglerContext = createContext<{
  isDark: boolean;
  useDark(use: boolean): void;
}>({} as any);

ThemeTogglerContext.displayName = 'ThemeToggler';

function createColors(colors: ColorPalette): ColorPalette {
  return {
    ...colors,
    bodyText: color(colors.lightShades).isDark() ? 'white' : 'black',
    lightAccentText: color(colors.lightAccent).isDark() ? 'white' : 'black',
    lightShadesText: color(colors.lightShades).isDark() ? 'white' : 'black',
    darkAccentText: color(colors.darkAccent).isDark() ? 'white' : 'black',
    darkShadesText: color(colors.darkShades).isDark() ? 'white' : 'black',
    primaryText: color(colors.primary).isDark() ? 'white' : 'black',
  };
}

export const theme = createScaleTheme({
  fontSizes: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: { values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56], offset: 2 },
  baselineGridSize: 8,
  fontScaleRatio: ratios.perfectFourth,
  colors: createColors({
    primary: '#E26F4A',
    lightAccent: '#D3BF9C',
    lightShades: '#F2F6E7',
    darkAccent: '#D43E62',
    darkShades: '#241828',
  }),
  fontFamilies: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
});

export const darkTheme = createScaleTheme({
  fontSizes: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: { values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56], offset: 2 },
  baselineGridSize: 8,
  fontScaleRatio: ratios.perfectFourth,
  colors: createColors({
    primary: '#E26F4A',
    darkAccent: '#D3BF9C',
    darkShades: '#F2F6E7',
    lightAccent: '#D43E62',
    lightShades: '#241828',
  }),
  fontFamilies: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
});
