import color from 'color';
import { createContext } from 'react';
import { ScaleThemeSettings, ratios, ColorPalette } from '@byteclaw/visage';

export const ThemeTogglerContext = createContext<{
  isDark: boolean;
  useDark(use: boolean): void;
  setColors(colors: [number, number, number][]): void;
}>({} as any);

ThemeTogglerContext.displayName = 'ThemeToggler';

export function createColors(colors: ColorPalette): ColorPalette {
  return {
    ...colors,
    bodyText: color(colors.lightShades).isDark() ? 'white' : 'black',
    lightAccentText: color(colors.lightAccent).isDark() ? 'white' : 'black',
    lightShadesText: color(colors.lightShades).isDark() ? 'white' : 'black',
    darkAccentText: color(colors.darkAccent).isDark() ? 'white' : 'black',
    darkShadesText: color(colors.darkShades).isDark() ? 'white' : 'black',
    primaryText: color(colors.primary).isDark() ? 'white' : 'black',
    dangerText: color(colors.danger).isDark() ? 'white' : 'black',
    infoText: color(colors.info).isDark() ? 'white' : 'black',
    warningText: color(colors.warning).isDark() ? 'white' : 'black',
    successText: color(colors.success).isDark() ? 'white' : 'black',
    textInput: color(colors.lightShades)
      .lighten(0.3)
      .string(),
    textInputBorder: color(colors.lightShades)
      .darken(0.3)
      .string(),
  };
}

export function createDarkColors(colors: ColorPalette): ColorPalette {
  return createColors({
    ...colors,
    lightAccent: colors.darkAccent,
    lightShades: colors.darkShades,
    darkAccent: colors.lightAccent,
    darkShades: colors.lightShades,
  });
}

export const defaultColors: [number, number, number][] = [
  // lightShades
  [242, 246, 231],
  // lightAccent
  [211, 191, 156],
  // primary
  [226, 111, 74],
  // darkAccent,
  [212, 62, 98],
  // darkShades
  [36, 24, 40],
];

export const defaultStateColors = {
  danger: 'red',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  neutral: '#e3e8ee',
};

export const themeSettings: ScaleThemeSettings = {
  fontSize: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: { values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56], offset: 2 },
  baselineGridSize: 8,
  fontScaleRatio: ratios.perfectFourth,
  colors: createColors({
    ...defaultStateColors,
    lightShades: color.rgb(defaultColors[0]).string(),
    lightAccent: color.rgb(defaultColors[1]).string(),
    primary: color.rgb(defaultColors[2]).string(),
    darkAccent: color.rgb(defaultColors[3]).string(),
    darkShades: color.rgb(defaultColors[4]).string(),
  }),
  fontFamily: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
};
