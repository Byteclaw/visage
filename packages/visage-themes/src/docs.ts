import { ColorPalette, Theme } from '@byteclaw/visage';
import color from 'color';
import { createNPointFontScaleTheme } from './nPointFontScale';
import { generateColorScale } from './utils';

const darkAccent = color('#112d4e');
const darkShades = color('#1b262c');
const lightAccent = color('#dbe2ef');
const lightShades = color('#fff');
const primary = color('#1FA7EC');

export const docsThemeColorPalette: ColorPalette = {
  ...generateColorScale<'neutral' | 'neutralText'>('neutral', '#e3e8ee', 5, 5),
  darkAccent: darkAccent.toString(),
  darkAccentText: darkAccent.isDark() ? '#fff' : '#000',
  darkShades: darkShades.toString(),
  darkShadesText: darkShades.isDark() ? '#fff' : '#000',
  lightAccent: lightAccent.toString(),
  lightAccentText: lightAccent.isDark() ? '#fff' : '#000',
  lightShades: lightShades.toString(),
  lightShadesText: lightShades.isDark() ? '#fff' : '#000',
  primary: primary.toString(),
  primaryText: '#fff',
  ...generateColorScale<'success' | 'successText'>('success', '#27ae60', 5, 5),
  ...generateColorScale<'danger' | 'dangerText'>('danger', '#c0392b', 5, 5),
  ...generateColorScale<'info' | 'infoText'>('info', '#2980b9', 5, 5),
  ...generateColorScale<'warning' | 'warningText'>('warning', '#f1c40f', 5, 5),
  textInput: lightShades.lighten(0.3).toString(),
  textInputBorder: lightShades.darken(0.3).toString(),
};

export interface DocsThemeSettings {
  colors?: ColorPalette;
}

export function createDocsTheme({
  colors = docsThemeColorPalette,
}: DocsThemeSettings = {}): Theme {
  return createNPointFontScaleTheme({
    borderRadius: {
      controlBorderRadius: 6,
    },
    fontSize: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
    lineHeights: {
      values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56],
      offset: 2,
    },
    baseGridSize: 8,
    fontFamily: {
      body: 'Open Sans,sans-serif',
      heading: 'Nunito Sans,sans-serif',
    },
    colors,
  });
}
