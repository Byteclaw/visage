import { ResponsiveDesignSystem, ColorPalette } from '@byteclaw/visage';
import {
  createDocsTheme,
  docsThemeColorPalette,
} from '@byteclaw/visage-themes';
import React, { useCallback, useMemo, useState, ReactNode } from 'react';
import { ThemeTogglerContext, toggleColorPaletteMode } from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

interface DesignSystemProps {
  children: ReactNode;
}

export function DesignSystem({ children }: DesignSystemProps) {
  const [colors, setColorPalette] = useState<ColorPalette>(
    docsThemeColorPalette,
  );
  const [isDark, setDarkTheme] = useState(false);
  const theme = useMemo(() => {
    return createDocsTheme({
      colors,
      faces: visageDocsFaces,
    });
  }, [colors]);

  const togglePaletteMode = useCallback(() => {
    setDarkTheme(!isDark);
    setColorPalette(toggleColorPaletteMode(colors, !isDark));
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
