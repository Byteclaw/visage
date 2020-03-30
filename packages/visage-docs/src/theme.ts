import { ColorPalette } from '@byteclaw/visage';
import color from 'color';
import { createContext } from 'react';

export const ThemeTogglerContext = createContext<{
  colorPalette: ColorPalette;
  isDark: boolean;
  useDark(use: boolean): void;
  setColorPalette(colors: ColorPalette): void;
}>({} as any);

ThemeTogglerContext.displayName = 'ThemeToggler';

export function toggleColorPaletteMode(palette: ColorPalette): ColorPalette {
  return {
    ...palette,
    darkShades: palette.lightShades,
    darkShadesText: palette.lightShadesText,
    lightShades: palette.darkShades,
    lightShadesText: palette.darkShadesText,
    darkShadeOverlay: palette.lightShadeOverlay,
    lightShadeOverlay: palette.darkShadeOverlay,
    // if default colors are same, calculate these
    textInput: color(palette.darkShades)
      .lighten(0.3)
      .toString(),
    textInputBorder: color(palette.darkShades)
      .darken(0.3)
      .toString(),
  };
}
