import { ColorPalette, Theme, VisageFaces } from '@byteclaw/visage';
import color from 'color';
import { createNPointFontScaleTheme } from './nPointFontScale';
import { generateColorScale } from './utils';

const darkShades = color('#1b262c');
const accent = color('#dbe2ef');
const shades = color('#fff');
const primary = color('#1FA7EC');

export const docsThemeColorPalette: ColorPalette = {
  ...generateColorScale<'neutral' | 'neutralText'>('neutral', '#e3e8ee', 5, 5),
  darkShades: darkShades.toString(),
  darkShadesText: darkShades.isDark() ? '#fff' : '#000',
  accent: accent.toString(),
  accentText: accent.isDark() ? '#fff' : '#000',
  shades: shades.toString(),
  shadesText: shades.isDark() ? '#fff' : '#000',
  primary: primary.toString(),
  primaryText: '#fff',
  ...generateColorScale<'success' | 'successText'>('success', '#27ae60', 5, 5),
  ...generateColorScale<'danger' | 'dangerText'>('danger', '#c0392b', 5, 5),
  ...generateColorScale<'info' | 'infoText'>('info', '#2980b9', 5, 5),
  ...generateColorScale<'warning' | 'warningText'>('warning', '#f1c40f', 5, 5),
};

export interface DocsThemeSettings {
  colors?: ColorPalette;
  faces?: VisageFaces;
  mixins?: { [key: string]: VisageStyleSheet };
}

export function createDocsTheme({
  colors = docsThemeColorPalette,
  faces = {},
  mixins = {},
}: DocsThemeSettings = {}): Theme {
  return createNPointFontScaleTheme({
    borderRadius: {
      controlBorderRadius: 6,
      keyboardBorderRadius: 3,
    },
    mixins,
    faces,
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
