import { ResponsiveDesignSystem, ColorPalette } from '@byteclaw/visage';
import {
  createDocsTheme,
  docsThemeColorPalette,
} from '@byteclaw/visage-themes';
import React, {
  useCallback,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import store from 'store2';
import { ThemeTogglerContext, toggleColorPaletteMode } from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

const STORAGE_KEY_DARK_MODE = 'darkMode';

interface DesignSystemProps {
  children: ReactNode;
}

const initIsDarkMode = store.get(STORAGE_KEY_DARK_MODE, false);

export function DesignSystem({ children }: DesignSystemProps) {
  const [isDark, setDarkTheme] = useState(false);
  const [colors, setColorPalette] = useState<ColorPalette>(
    docsThemeColorPalette,
  );
  const theme = useMemo(() => {
    return createDocsTheme({
      colors,
      faces: visageDocsFaces,
    });
  }, [colors]);

  const togglePaletteMode = useCallback(
    (asDark?: boolean) => {
      const setDark = asDark == null ? !isDark : asDark;

      setDarkTheme(setDark);
      setColorPalette(toggleColorPaletteMode(colors));
      store.set(STORAGE_KEY_DARK_MODE, setDark);
    },
    [colors, isDark],
  );

  useEffect(() => {
    // set up the theme by local storage in new render pass because
    // React.hydrate used by gatsby does not pick up theme correctly (which is correct behaviour)
    // see https://reactjs.org/docs/react-dom.html#hydrate
    if (initIsDarkMode && !isDark) {
      togglePaletteMode();
    }
  }, []);

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
