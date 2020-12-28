import { ColorPalette } from '@byteclaw/visage';
import { createContext } from 'react';

export const ThemeTogglerContext = createContext<{
  colorPalette: ColorPalette;
  isDark: boolean;
  setMode(isDark: boolean): void;
  setColorPalette(colors: ColorPalette): void;
}>({} as any);

interface DocsColorPalette extends ColorPalette {
  darkShades: ColorPalette['shades'];
  darkShadesText: ColorPalette['shadesText'];
}

ThemeTogglerContext.displayName = 'ThemeToggler';

export function toggleColorPaletteMode(
  palette: DocsColorPalette,
): DocsColorPalette {
  return {
    ...palette,
    darkShades: palette.shades,
    darkShadesText: palette.shadesText,
    shades: palette.darkShades,
    shadesText: palette.darkShadesText,
  };
}
