import {
  ResponsiveDesignSystem,
  createScaleTheme,
  ColorPalette,
} from '@byteclaw/visage';
import React, { useCallback, useMemo, useState, ReactNode } from 'react';
import {
  defaultColorTheme,
  ThemeTogglerContext,
  themeSettings,
  toggleColorPaletteMode,
} from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

interface DesignSystemProps {
  children: ReactNode;
}

export function DesignSystem({ children }: DesignSystemProps) {
  const [colors, setColorPalette] = useState<ColorPalette>(defaultColorTheme);
  const [isDark, setDarkTheme] = useState(false);
  const theme = useMemo(() => {
    return createScaleTheme({
      ...themeSettings,
      colors,
    });
  }, [colors]);

  const togglePaletteMode = useCallback(() => {
    setDarkTheme(!isDark);
    setColorPalette(toggleColorPaletteMode(colors));
  }, [colors, isDark]);

  return (
    <ResponsiveDesignSystem faces={visageDocsFaces} theme={theme}>
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
