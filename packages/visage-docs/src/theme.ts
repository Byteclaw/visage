import { ColorPalette } from '@byteclaw/visage';
import { NPointFontScaleThemeSettings } from '@byteclaw/visage-themes';
import color from 'color';
import { createContext } from 'react';
import { generateColorScale, findColor } from './utils';

export const ThemeTogglerContext = createContext<{
  colorPalette: ColorPalette;
  isDark: boolean;
  useDark(use: boolean): void;
  setColorPalette(colors: ColorPalette): void;
}>({} as any);

ThemeTogglerContext.displayName = 'ThemeToggler';

const darkAccent = color([212, 62, 98]);
const darkShades = color([36, 24, 40]);
const lightAccent = color([211, 191, 156]);
const lightShades = color([242, 246, 231]);
const primary = color([226, 111, 74]);
const danger = findColor('red', lightShades.toString());
const info = findColor('blue', lightShades.toString());
const success = findColor('green', lightShades.toString());
const warning = findColor('orange', lightShades.toString());

export const defaultColorTheme: ColorPalette = {
  ...generateColorScale<'neutral' | 'neutralText'>('neutral', '#e3e8ee', 5, 5),
  danger,
  dangerText: color(danger).isDark() ? '#fff' : '#000',
  darkAccent: darkAccent.toString(),
  darkAccentText: darkAccent.isDark() ? '#fff' : '#000',
  darkShades: darkShades.toString(),
  darkShadesText: darkShades.isDark() ? '#fff' : '#000',
  info,
  infoText: color(info).isDark() ? '#fff' : '#000',
  lightAccent: lightAccent.toString(),
  lightAccentText: lightAccent.isDark() ? '#fff' : '#000',
  lightShades: lightShades.toString(),
  lightShadesText: lightShades.isDark() ? '#fff' : '#000',
  primary: primary.toString(),
  primaryText: primary.isDark() ? '#fff' : '#000',
  success,
  successText: color(success).isDark() ? '#fff' : '#000',
  textInput: lightShades.lighten(0.3).toString(),
  textInputBorder: lightShades.darken(0.3).toString(),
  warning,
  warningText: color(warning).isDark() ? '#fff' : '#000',
};

export function toggleColorPaletteMode(palette: ColorPalette): ColorPalette {
  return {
    ...palette,
    darkShades: palette.lightShades,
    darkShadesText: palette.lightShadesText,
    lightShades: palette.darkShades,
    lightShadesText: palette.darkShadesText,
    // if default colors are same, calculate these
    textInput: color(palette.darkShades)
      .lighten(0.3)
      .toString(),
    textInputBorder: color(palette.darkShades)
      .darken(0.3)
      .toString(),
  };
}

export const themeSettings: NPointFontScaleThemeSettings = {
  borderRadius: {
    controlBorderRadius: 6,
  },
  fontSize: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: { values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56], offset: 2 },
  baseGridSize: 8,
  colors: defaultColorTheme,
  fontFamily: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
};
