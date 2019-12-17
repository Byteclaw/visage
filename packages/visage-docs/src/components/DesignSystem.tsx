import { ResponsiveDesignSystem, createScaleTheme } from '@byteclaw/visage';
import color from 'color';
import React, { useMemo, useState, ReactNode } from 'react';
import {
  createColors,
  createDarkColors,
  defaultColors,
  ThemeTogglerContext,
  themeSettings,
} from '../theme';
import { visageDocsFaces } from '../visageDocsFaces';

interface DesignSystemProps {
  children: ReactNode;
}

export function DesignSystem({ children }: DesignSystemProps) {
  const [colors, setColors] = useState<[number, number, number][]>(
    defaultColors,
  );
  const [isDark, setDarkTheme] = useState(false);
  const theme = useMemo(() => {
    const palette = {
      lightShades: color.rgb(colors[0]).string(),
      lightAccent: color.rgb(colors[1]).string(),
      primary: color.rgb(colors[2]).string(),
      darkAccent: color.rgb(colors[3]).string(),
      darkShades: color.rgb(colors[4]).string(),
    };

    return createScaleTheme({
      ...themeSettings,
      colors: isDark ? createDarkColors(palette) : createColors(palette),
    });
  }, [colors, isDark]);

  return (
    <ResponsiveDesignSystem faces={visageDocsFaces} theme={theme}>
      <ThemeTogglerContext.Provider
        value={{
          isDark,
          useDark: setDarkTheme,
          setColors,
        }}
      >
        {children}
      </ThemeTogglerContext.Provider>
    </ResponsiveDesignSystem>
  );
}
