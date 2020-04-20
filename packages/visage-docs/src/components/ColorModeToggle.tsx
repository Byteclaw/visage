import { IconButton } from '@byteclaw/visage';
import React, { useContext } from 'react';
import { Moon, Sun } from 'react-feather';
import { ThemeTogglerContext } from '../theme';

export function ColorModeToggle() {
  const { isDark, useDark } = useContext(ThemeTogglerContext);

  return (
    <IconButton
      icon={isDark ? Sun : Moon}
      label={isDark ? 'Activate light mode' : 'Activate dark mode'}
      onClick={() => useDark(!isDark)}
      styles={{ mr: 1 }}
      title={isDark ? 'Activate light mode' : 'Activate dark mode'}
    />
  );
}
