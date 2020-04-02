import { ResponsiveDesignSystem, ColorPalette } from '@byteclaw/visage';
import {
  createDocsTheme,
  docsThemeColorPalette,
} from '@byteclaw/visage-themes';
import React, { useCallback, useMemo, useState, ReactNode } from 'react';
import store from 'store2';
import { ThemeTogglerContext, toggleColorPaletteMode } from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

const STORAGE_KEY_DARK_MODE = 'darkMode';

interface DesignSystemProps {
  children: ReactNode;
}

export function DesignSystem({ children }: DesignSystemProps) {
  const initIsDarkMode = store.get(STORAGE_KEY_DARK_MODE, false);
  const [isDark, setDarkTheme] = useState(initIsDarkMode);

  const [colors, setColorPalette] = useState<ColorPalette>(
    initIsDarkMode
      ? toggleColorPaletteMode(docsThemeColorPalette)
      : docsThemeColorPalette,
  );
  const theme = useMemo(() => {
    return createDocsTheme({
      colors,
      faces: visageDocsFaces,
    });
  }, [colors]);

  const togglePaletteMode = useCallback(() => {
    setDarkTheme(!isDark);
    setColorPalette(toggleColorPaletteMode(colors));
    store.set(STORAGE_KEY_DARK_MODE, !isDark);
  }, [colors, isDark]);

  return (
    <ResponsiveDesignSystem theme={theme}>
      <ThemeTogglerContext.Provider
        value={{
          colorPalette: colors,
          isDark,
          useDark: togglePaletteMode,
          setColorPalette,
        }}
      >
        {children}
      </ThemeTogglerContext.Provider>
    </ResponsiveDesignSystem>
  );
}
