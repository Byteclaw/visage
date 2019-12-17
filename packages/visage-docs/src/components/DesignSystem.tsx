import { ResponsiveDesignSystem } from '@byteclaw/visage';
import React, { useState, ReactNode } from 'react';
import { darkTheme, ThemeTogglerContext, theme } from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

interface DesignSystemProps {
  children: ReactNode;
}

export function DesignSystem({ children }: DesignSystemProps) {
  const [isDark, setDarkTheme] = useState(false);

  return (
    <ResponsiveDesignSystem
      faces={visageDocsFaces}
      theme={isDark ? darkTheme : theme}
    >
      <ThemeTogglerContext.Provider
        value={{
          isDark,
          useDark: setDarkTheme,
        }}
      >
        {children}
      </ThemeTogglerContext.Provider>
    </ResponsiveDesignSystem>
  );
}
